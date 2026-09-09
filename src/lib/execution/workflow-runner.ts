/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApprovalManager, ExecutionPlan, PlannedAction } from './approval-manager';
import { ActionRegistry } from './action-registry';
import { ExecutionHistory } from './execution-history';
import { RollbackManager } from './rollback-manager';
import { EventBus } from '../agents/event-bus';

export class WorkflowRunner {
  private static instance: WorkflowRunner;
  private approvalManager = ApprovalManager.getInstance();
  private history = ExecutionHistory.getInstance();
  private rollbackManager = RollbackManager.getInstance();
  private eventBus = EventBus.getInstance();

  private activeRunners: Map<string, { paused: boolean; cancelled: boolean }> = new Map();

  private constructor() {}

  public static getInstance(): WorkflowRunner {
    if (!WorkflowRunner.instance) {
      WorkflowRunner.instance = new WorkflowRunner();
    }
    return WorkflowRunner.instance;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Dispatches a notification to the EventBus
   */
  private notify(type: string, title: string, message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    this.eventBus.emit('execution:notification', {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      title,
      message,
      severity,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Run the campaign execution plan sequentially or in parallel
   */
  public async executePlan(planId: string): Promise<void> {
    const plan = this.approvalManager.getActivePlan();
    if (!plan || plan.id !== planId) {
      throw new Error(`Execution plan "${planId}" is not the active plan.`);
    }

    if (plan.status !== 'approved' && plan.status !== 'paused') {
      throw new Error(`Plan is in status "${plan.status}". Approval is required before execution.`);
    }

    // Initialize or retrieve controller
    if (!this.activeRunners.has(planId)) {
      this.activeRunners.set(planId, { paused: false, cancelled: false });
    }
    const control = this.activeRunners.get(planId)!;
    control.paused = false;
    control.cancelled = false;

    this.approvalManager.updatePlanStatus(planId, 'running');
    this.notify('Task Started', 'Campaign Execution Booting', `Deploying execution plan for ${plan.url}.`, 'info');

    try {
      // Execute all approved/pending actions in order
      for (const action of plan.actions) {
        // Block check for cancellation and pauses
        if (control.cancelled) {
          this.approvalManager.updatePlanStatus(planId, 'cancelled');
          this.notify('Execution Finished', 'Campaign Cancelled', 'Execution plan halted by user request.', 'warning');
          return;
        }

        while (control.paused) {
          this.approvalManager.updatePlanStatus(planId, 'paused');
          await this.sleep(1000);
          if (control.cancelled) {
            this.approvalManager.updatePlanStatus(planId, 'cancelled');
            this.notify('Execution Finished', 'Campaign Cancelled', 'Execution plan halted during pause.', 'warning');
            return;
          }
        }

        this.approvalManager.updatePlanStatus(planId, 'running');

        if (action.status === 'completed' || action.status === 'rolled_back') {
          continue; // Skip already executed
        }

        await this.runActionWithRetries(planId, action, control);
      }

      // Check final plan status
      const updatedPlan = this.approvalManager.getActivePlan();
      const hasFailed = updatedPlan?.actions.some(a => a.status === 'failed');

      if (hasFailed) {
        this.approvalManager.updatePlanStatus(planId, 'failed');
        this.notify('Task Failed', 'Campaign Completed with Errors', 'Some deployment actions failed and were not recoverable.', 'error');
        
        // Trigger automatic rollback for completed actions
        this.notify('Task Started', 'Auto-Rollback Triggered', 'Initiating safety rollback of successful assets to prevent partial state drift.', 'warning');
        const completedIds = plan.actions.filter(a => a.status === 'completed').map(a => a.id);
        const rollbackLogs = await this.rollbackManager.rollbackAll(completedIds);
        
        rollbackLogs.forEach(log => {
          this.history.addRecord({
            id: `rb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            actionId: 'rollback',
            name: 'Automatic Safety Rollback',
            category: 'System',
            status: 'rolled_back',
            agentId: 'system',
            provider: 'System',
            model: 'Local Rollback Engine',
            outputSummary: log
          });
        });
        
        this.notify('Execution Finished', 'Safety Rollback Completed', 'All completed tasks have been reverted successfully.', 'success');
      } else {
        this.approvalManager.updatePlanStatus(planId, 'completed');
        this.notify('Execution Finished', 'Campaign Live', `All marketing campaign assets published successfully to ${plan.url}!`, 'success');
      }

    } catch (err: any) {
      console.error('[WorkflowRunner] Failed to execute plan:', err);
      this.approvalManager.updatePlanStatus(planId, 'failed');
      this.notify('Task Failed', 'Orchestration Crash', err.message || 'Fatal execution runner failure.', 'error');
    } finally {
      this.activeRunners.delete(planId);
    }
  }

  /**
   * Internal runner for single action with retries
   */
  private async runActionWithRetries(planId: string, action: PlannedAction, control: { paused: boolean; cancelled: boolean }): Promise<void> {
    this.approvalManager.updateActionStatus(planId, action.id, 'running', 10);
    this.notify('Task Started', `Action Dispatched: ${action.name}`, `Specialist ${action.agentId.toUpperCase()} is executing "${action.name}".`, 'info');

    let attempt = 0;
    const maxRetries = 2; // Up to 2 retries
    let success = false;
    let lastError = '';

    while (attempt <= maxRetries && !success) {
      if (control.cancelled) {
        this.approvalManager.updateActionStatus(planId, action.id, 'failed', 0, { error: 'Cancelled by user.' });
        return;
      }

      attempt++;
      this.approvalManager.updateActionStatus(planId, action.id, 'running', 10 + (attempt * 25));

      try {
        // Execute the action via ActionRegistry using live Gemini/centralized provider configuration
        const result = await ActionRegistry.executeAction(
          action.actionId,
          { url: this.approvalManager.getActivePlan()?.url },
          action.agentId
        );

        this.approvalManager.updateActionStatus(planId, action.id, 'completed', 100, {
          outputSummary: result.output.substring(0, 180) + '...'
        });

        // Add history record
        this.history.addRecord({
          id: action.id,
          actionId: action.actionId,
          name: action.name,
          category: action.category,
          status: 'completed',
          agentId: action.agentId,
          provider: result.provider || 'Gemini',
          model: result.model || 'gemini-2.5-flash',
          outputSummary: result.output
        });

        this.notify('Task Completed', `Action Complete: ${action.name}`, `Task executed successfully by ${action.agentId.toUpperCase()}.`, 'success');
        success = true;
      } catch (err: any) {
        lastError = err.message || 'Unknown network execution error';
        console.warn(`[WorkflowRunner] Action ${action.name} attempt ${attempt} failed:`, lastError);
        
        if (attempt <= maxRetries) {
          this.notify('Task Failed', `Action Failed (Retry ${attempt}/${maxRetries})`, `Retrying "${action.name}" automatically in 2 seconds...`, 'warning');
          await this.sleep(2000);
        }
      }
    }

    if (!success) {
      this.approvalManager.updateActionStatus(planId, action.id, 'failed', 0, { error: lastError });
      
      this.history.addRecord({
        id: action.id,
        actionId: action.actionId,
        name: action.name,
        category: action.category,
        status: 'failed',
        agentId: action.agentId,
        provider: 'System',
        model: 'Fail-safe Node',
        outputSummary: `Failed after ${maxRetries + 1} attempts. Error: ${lastError}`,
        error: lastError
      });

      this.notify('Task Failed', `Action Critical Failure: ${action.name}`, `Failed completely after ${maxRetries + 1} attempts.`, 'error');
    }
  }

  /**
   * Request to pause the running campaign execution
   */
  public pause(planId: string): void {
    const runner = this.activeRunners.get(planId);
    if (runner) {
      runner.paused = true;
      this.approvalManager.updatePlanStatus(planId, 'paused');
      this.notify('Task Started', 'Campaign Execution Paused', 'Halting active deployment loop. Current task will complete.', 'warning');
    }
  }

  /**
   * Request to resume the paused campaign execution
   */
  public resume(planId: string): void {
    const runner = this.activeRunners.get(planId);
    if (runner) {
      runner.paused = false;
      this.approvalManager.updatePlanStatus(planId, 'running');
      this.notify('Task Started', 'Campaign Execution Resumed', 'Resuming deployment pipelines.', 'info');
      
      // Re-trigger loop
      this.executePlan(planId).catch(console.error);
    }
  }

  /**
   * Request to cancel the campaign execution entirely
   */
  public cancel(planId: string): void {
    const runner = this.activeRunners.get(planId);
    if (runner) {
      runner.cancelled = true;
      this.approvalManager.updatePlanStatus(planId, 'cancelled');
    }
  }
}
