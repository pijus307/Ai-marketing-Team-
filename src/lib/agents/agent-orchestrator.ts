/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkflowEngine, ExecutionMode, WorkflowStatus } from './workflow-engine';
import { TaskManager, AgentTask } from './task-manager';
import { AgentRegistry } from './agent-registry';
import { MemoryManager } from './memory-manager';
import { EventBus } from './event-bus';

export class AgentOrchestrator {
  /**
   * Start a new marketing orchestration campaign sprint
   */
  public static async start(
    url: string,
    industry: string,
    companyDescription: string,
    customGoals: string,
    executionMode: ExecutionMode = 'sequential',
    optimizationMode: string = 'balanced'
  ): Promise<any> {
    const engine = WorkflowEngine.getInstance();
    return engine.startWorkflow(url, industry, companyDescription, customGoals, executionMode, optimizationMode);
  }

  /**
   * Pause the active orchestration
   */
  public static pause(): void {
    WorkflowEngine.getInstance().pauseWorkflow();
  }

  /**
   * Resume the paused orchestration
   */
  public static resume(): void {
    WorkflowEngine.getInstance().resumeWorkflow();
  }

  /**
   * Cancel the active orchestration
   */
  public static cancel(): void {
    WorkflowEngine.getInstance().cancelWorkflow();
  }

  /**
   * Retry failed specialist tasks
   */
  public static async retry(): Promise<any> {
    return WorkflowEngine.getInstance().retryFailedTasks();
  }

  /**
   * Retrieve full snapshot of the orchestrator state for dashboards
   */
  public static getStatusSnapshot() {
    const engine = WorkflowEngine.getInstance();
    const taskManager = TaskManager.getInstance();
    const agents = AgentRegistry.getAgents();

    // Map rich details for the workforce dashboard display
    const mappedAgents = agents.map(agent => {
      // Find current or last task executed by this agent
      const agentTasks = taskManager.getTasksForAgent(agent.id);
      const activeTask = agentTasks.find(t => t.status === 'running') || agentTasks.find(t => t.status === 'failed') || agentTasks[agentTasks.length - 1];

      return {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        category: agent.category,
        status: agent.status,
        progress: agent.progress,
        provider: agent.provider || 'Not initialized',
        model: agent.model || 'Not initialized',
        lastActivity: agent.lastActivity,
        currentTask: activeTask ? activeTask.title : 'Idle',
        logs: agent.logs
      };
    });

    return {
      workflowStatus: engine.status as WorkflowStatus,
      executionMode: engine.executionMode as ExecutionMode,
      tasks: taskManager.getTasks(),
      agents: mappedAgents,
      globalLogs: taskManager.getGlobalLogs()
    };
  }
}
