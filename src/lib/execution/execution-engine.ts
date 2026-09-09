/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApprovalManager, ExecutionPlan, PlannedAction } from './approval-manager';
import { CampaignScheduler } from './scheduler';
import { WorkflowRunner } from './workflow-runner';
import { ExecutionHistory } from './execution-history';
import { ActionRegistry } from './action-registry';
import { EventBus } from '../agents/event-bus';

export class ExecutionEngine {
  private static instance: ExecutionEngine;
  private approvalManager = ApprovalManager.getInstance();
  private scheduler = CampaignScheduler.getInstance();
  private runner = WorkflowRunner.getInstance();
  private history = ExecutionHistory.getInstance();
  private eventBus = EventBus.getInstance();

  private constructor() {}

  public static getInstance(): ExecutionEngine {
    if (!ExecutionEngine.instance) {
      ExecutionEngine.instance = new ExecutionEngine();
    }
    return ExecutionEngine.instance;
  }

  /**
   * Generates a tailored execution plan based on client objectives
   */
  public generateExecutionPlan(url: string, industry: string, companyDescription: string, customGoals: string): ExecutionPlan {
    // Map of specific action category templates to populate
    const defaultActions: Omit<PlannedAction, 'id' | 'status' | 'progress'>[] = [
      // Website
      { actionId: 'web_update_metadata', category: 'Website', name: 'Update Site Meta Header Tags', description: 'Overwrites title, meta description tags in WordPress headers.', estimatedTimeSec: 5, agentId: 'seo' },
      { actionId: 'web_gen_faq', category: 'Website', name: 'Generate Dynamic FAQ Section', description: 'Mounts reactive FAQ accordion elements to address common objections.', estimatedTimeSec: 6, agentId: 'content' },
      { actionId: 'web_gen_schema', category: 'Website', name: 'Generate JSON-LD Schema Markup', description: 'Embeds rich schema entity markup for search snippets.', estimatedTimeSec: 4, agentId: 'seo' },
      
      // SEO
      { actionId: 'seo_tech_report', category: 'SEO', name: 'Generate Technical SEO Report', description: 'Analyzes indexability, robots.txt, and canonical pathways.', estimatedTimeSec: 10, agentId: 'seo' },
      { actionId: 'seo_opt_checklist', category: 'SEO', name: 'Create SEO Optimization Checklist', description: 'Creates checklist of priority elements for keyword rankings.', estimatedTimeSec: 6, agentId: 'seo' },
      
      // Content
      { actionId: 'content_write_blog', category: 'Content', name: 'Generate Blog Articles', description: 'Drafts high-quality pillar posts focused on industry keywords.', estimatedTimeSec: 15, agentId: 'content' },
      { actionId: 'content_social_posts', category: 'Content', name: 'Generate Social Media Posts', description: 'Creates a set of brand announcements, quotes, and visual prompts.', estimatedTimeSec: 9, agentId: 'content' },
      
      // Advertising
      { actionId: 'ads_google', category: 'Advertising', name: 'Create Google Ads Drafts', description: 'Drafts CTA-driven Google Search ad copy and keywords.', estimatedTimeSec: 7, agentId: 'ads' },
      { actionId: 'ads_meta', category: 'Advertising', name: 'Create Meta Ads Drafts', description: 'Prepares social media promotional copy with hook and text variants.', estimatedTimeSec: 8, agentId: 'ads' },
      
      // Email
      { actionId: 'email_welcome_flow', category: 'Email', name: 'Generate Welcome Autoresponder Sequence', description: 'Writes transactional introduction drip emails for new signups.', estimatedTimeSec: 12, agentId: 'email' },
      
      // Lead Gen
      { actionId: 'leadgen_magnet', category: 'Lead Generation', name: 'Generate Lead Magnet Assets', description: 'Structures an interactive PDF cheatsheet checklist draft.', estimatedTimeSec: 14, agentId: 'leadgen' },
      { actionId: 'leadgen_crm_contact', category: 'Lead Generation', name: 'Create CRM Contact Properties', description: 'Configures HubSpot integration pipeline maps.', estimatedTimeSec: 5, agentId: 'leadgen' },
      
      // Reporting
      { actionId: 'reporting_summary', category: 'Reporting', name: 'Generate Executive Summary Desk', description: 'Compiles overall marketing ROI framework and targets.', estimatedTimeSec: 5, agentId: 'ceo' }
    ];

    return this.approvalManager.createPlan(url, defaultActions);
  }

  /**
   * Approves a plan and sets up its scheduling trigger
   */
  public approvePlan(planId: string, scheduleType: 'now' | 'daily' | 'weekly' | 'monthly' | 'custom', scheduleDate?: string): ExecutionPlan | null {
    const plan = this.approvalManager.approvePlan(planId, scheduleType, scheduleDate);
    if (plan) {
      // Schedule campaign
      this.scheduler.scheduleCampaign(planId, plan.url, scheduleType, scheduleDate);
      
      // If run now, start immediately in the background
      if (scheduleType === 'now') {
        this.runner.executePlan(planId).catch(err => {
          console.error('[ExecutionEngine] Automated background workflow run crashed:', err);
        });
      }
    }
    return plan;
  }

  /**
   * Trigger run directly
   */
  public async executePlanImmediately(planId: string): Promise<void> {
    await this.runner.executePlan(planId);
  }

  /**
   * Toggle Pause
   */
  public pauseExecution(planId: string): void {
    this.runner.pause(planId);
  }

  /**
   * Toggle Resume
   */
  public resumeExecution(planId: string): void {
    this.runner.resume(planId);
  }

  /**
   * Trigger Cancellation
   */
  public cancelExecution(planId: string): void {
    this.runner.cancel(planId);
  }

  /**
   * Get dynamic telemetry metrics for the unified Dashboard
   */
  public getSnapshot() {
    const plan = this.approvalManager.getActivePlan();
    const historyLogs = this.history.getRecords();

    let currentAction: PlannedAction | null = null;
    let estimatedTimeRemainingSec = 0;
    let overallProgress = 0;

    if (plan) {
      const runningAct = plan.actions.find(a => a.status === 'running');
      const pendingActs = plan.actions.filter(a => a.status === 'pending' || a.status === 'approved');
      
      currentAction = runningAct || null;

      // Calculate remaining time
      estimatedTimeRemainingSec = pendingActs.reduce((acc, a) => acc + a.estimatedTimeSec, 0);
      if (runningAct) {
        estimatedTimeRemainingSec += Math.ceil(runningAct.estimatedTimeSec * ((100 - runningAct.progress) / 100));
      }

      // Calculate overall plan progress
      const completedCount = plan.actions.filter(a => a.status === 'completed').length;
      const runningProgress = runningAct ? runningAct.progress / plan.actions.length : 0;
      overallProgress = Math.round((completedCount / plan.actions.length) * 100 + runningProgress);
    }

    return {
      activePlan: plan,
      currentAction,
      estimatedTimeRemainingSec,
      overallProgress,
      history: historyLogs,
      schedules: this.scheduler.getSchedules()
    };
  }
}
