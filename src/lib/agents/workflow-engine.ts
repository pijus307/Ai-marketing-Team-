/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskManager, AgentTask } from './task-manager';
import { EventBus } from './event-bus';
import { MemoryManager } from './memory-manager';
import { AgentRegistry } from './agent-registry';

export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'cancelled' | 'completed';
export type ExecutionMode = 'sequential' | 'parallel';

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  
  public status: WorkflowStatus = 'idle';
  public executionMode: ExecutionMode = 'sequential';
  private context: any = {};
  private currentRunnerPromise: Promise<any> | null = null;
  private optimizationMode: string = 'balanced';

  private taskManager = TaskManager.getInstance();
  private eventBus = EventBus.getInstance();
  private memoryManager = MemoryManager.getInstance();

  private constructor() {
    this.registerEventHandlers();
  }

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  /**
   * Listen to the Event Bus to log and trigger transition behaviors
   */
  private registerEventHandlers(): void {
    this.eventBus.on('task:started', (data) => {
      console.log(`[WORKFLOW EVENT] Task started:`, data);
    });

    this.eventBus.on('task:completed', (data) => {
      console.log(`[WORKFLOW EVENT] Task completed:`, data);
    });
  }

  /**
   * Helper to sleep inside async functions, useful for pausing or simulation
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Safe gate that blocks execution if the engine is currently paused
   */
  private async checkPauseAndCancelGate(): Promise<void> {
    if ((this.status as any) === 'cancelled') {
      throw new Error('Workflow was cancelled by user.');
    }

    while (this.status === 'paused') {
      await this.sleep(1000);
      if ((this.status as any) === 'cancelled') {
        throw new Error('Workflow was cancelled during pause.');
      }
    }
  }

  /**
   * Start the multi-agent marketing campaign generation workflow
   */
  public async startWorkflow(
    url: string,
    industry: string,
    companyDescription: string,
    customGoals: string,
    executionMode: ExecutionMode = 'sequential',
    optimizationMode: string = 'balanced'
  ): Promise<any> {
    if (this.status === 'running') {
      throw new Error('An active marketing orchestration workflow is already running.');
    }

    this.status = 'running';
    this.executionMode = executionMode;
    this.optimizationMode = optimizationMode;
    this.context = { url, industry, companyDescription, customGoals };

    // Reset Managers
    this.taskManager.clear();
    this.memoryManager.clear();
    AgentRegistry.initialize();

    // 1. Pre-populate all 16 Tasks in the task queue
    const tasksToCreate = [
      { id: 't_ceo_init', title: 'CEO Brand Positioning & SWOT Analysis Strategy', agentId: 'ceo', status: 'pending' as const, priority: 'high' as const, maxRetries: 2 },
      { id: 't_pm', title: 'PM Sprint Dependency and Milestone Mapping', agentId: 'pm', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_webintel', title: 'Crawl Domain Offerings and Services', agentId: 'webintel', status: 'pending' as const, priority: 'medium' as const, maxRetries: 3 },
      { id: 't_seo', title: 'Technical Audit & Search Volume Research', agentId: 'seo', status: 'pending' as const, priority: 'high' as const, maxRetries: 3 },
      { id: 't_geo', title: 'GEO & AI Search Citation Optimization (Perplexity/SearchGPT)', agentId: 'geo', status: 'pending' as const, priority: 'high' as const, maxRetries: 2 },
      { id: 't_competitor', title: 'Competitive Intelligence & Gap Mapping', agentId: 'competitor', status: 'pending' as const, priority: 'low' as const, maxRetries: 2 },
      { id: 't_content', title: 'Authority Content Pillars & Social Promos Drafting', agentId: 'content', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_video', title: 'Short-Form Viral Storyboards & Retention Scripting', agentId: 'video', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_ads', title: 'Paid Channels Budget Split & CTR Ad Copywriting', agentId: 'ads', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_influencer', title: 'Creator Sponsorship Matrix & Press Release Syndication', agentId: 'influencer', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_leadgen', title: 'Lead Magnets and Landing Conversion Flow Formulation', agentId: 'leadgen', status: 'pending' as const, priority: 'high' as const, maxRetries: 2 },
      { id: 't_plg', title: 'Product-Led Growth Virality Loops & Community Blueprint', agentId: 'plg', status: 'pending' as const, priority: 'high' as const, maxRetries: 2 },
      { id: 't_local', title: 'Google Business Profile & App Store Optimization', agentId: 'local', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_email', title: 'Nurture Welcome Sequencer CRM Integrations', agentId: 'email', status: 'pending' as const, priority: 'medium' as const, maxRetries: 2 },
      { id: 't_analytics', title: 'ROI Projections & GA4 Event Tracking Setup', agentId: 'analytics', status: 'pending' as const, priority: 'low' as const, maxRetries: 2 },
      { id: 't_ceo_final', title: 'CEO Master Sign-off Review & Campaign Synthesis', agentId: 'ceo', status: 'pending' as const, priority: 'high' as const, maxRetries: 2 }
    ];

    for (const t of tasksToCreate) {
      this.taskManager.addTask(t);
    }

    this.currentRunnerPromise = this.runWorkflowProcessor();
    return this.currentRunnerPromise;
  }

  /**
   * Orchestrates the tasks either in strict sequential or parallel dependency blocks
   */
  private async runWorkflowProcessor(): Promise<any> {
    try {
      this.taskManager.log('system', `Booting agency workflow engine in [${this.executionMode.toUpperCase()}] execution mode.`);

      if (this.executionMode === 'sequential') {
        // Linear pipeline
        await this.executeTaskAndBlock('t_ceo_init');
        await this.executeTaskAndBlock('t_pm');
        await this.executeTaskAndBlock('t_webintel');
        await this.executeTaskAndBlock('t_seo');
        await this.executeTaskAndBlock('t_geo');
        await this.executeTaskAndBlock('t_competitor');
        await this.executeTaskAndBlock('t_content');
        await this.executeTaskAndBlock('t_video');
        await this.executeTaskAndBlock('t_ads');
        await this.executeTaskAndBlock('t_influencer');
        await this.executeTaskAndBlock('t_leadgen');
        await this.executeTaskAndBlock('t_plg');
        await this.executeTaskAndBlock('t_local');
        await this.executeTaskAndBlock('t_email');
        await this.executeTaskAndBlock('t_analytics');
        
        // CEO Final Report compilation
        const finalReport = await this.executeTaskAndBlock('t_ceo_final', { isFinalReview: true });
        this.status = 'completed';
        this.taskManager.log('system', 'Workflow successfully processed. Campaign live.');
        return finalReport;
      } else {
        // Intelligent Parallel Dependency-Aware Pipeline matching user diagram
        // BLOCK 1: CEO Initial Strategy must run first to anchor core guidelines
        await this.executeTaskAndBlock('t_ceo_init');

        // BLOCK 2: PM Sprint Layout
        await this.executeTaskAndBlock('t_pm');

        // BLOCK 3: Mid-level specialists run fully in PARALLEL
        this.taskManager.log('system', 'Launching Specialist Swarm (SEO, GEO, Content, Video, Ads, Influencer, Leadgen, PLG, Local, Email) in parallel...');
        await Promise.all([
          this.executeTaskAndBlock('t_webintel'),
          this.executeTaskAndBlock('t_seo'),
          this.executeTaskAndBlock('t_geo'),
          this.executeTaskAndBlock('t_competitor'),
          this.executeTaskAndBlock('t_content'),
          this.executeTaskAndBlock('t_video'),
          this.executeTaskAndBlock('t_ads'),
          this.executeTaskAndBlock('t_influencer'),
          this.executeTaskAndBlock('t_leadgen'),
          this.executeTaskAndBlock('t_plg'),
          this.executeTaskAndBlock('t_local'),
          this.executeTaskAndBlock('t_email')
        ]);

        // BLOCK 4: Analytics Agent runs to compile event tracking & ROI projections based on all gathered data
        this.taskManager.log('system', 'Running Analytics Agent to project ROI, budget splits, and GA4 tracking based on compiled specialist insights...');
        await this.executeTaskAndBlock('t_analytics');

        // BLOCK 5: CEO Final Review to unify outputs and compile master campaign dossier
        const finalReport = await this.executeTaskAndBlock('t_ceo_final', { isFinalReview: true });
        this.status = 'completed';
        this.taskManager.log('system', 'Parallel Workflow successfully processed. Master Campaign compiled.');
        return finalReport;
      }
    } catch (err: any) {
      this.status = this.status === 'cancelled' ? 'cancelled' : 'completed'; // fail-safe recovery
      console.error('[WORKFLOW RUNNER FAILED]', err);
      throw err;
    }
  }

  /**
   * Safe synchronous blocker executing a single task on an agent, checking pause/cancel bounds
   */
  private async executeTaskAndBlock(taskId: string, customCtx?: any): Promise<any> {
    await this.checkPauseAndCancelGate();

    const task = this.taskManager.getTask(taskId);
    if (!task) return;

    const agent = AgentRegistry.getAgent(task.agentId);
    if (!agent) {
      throw new Error(`Critical failure: No registered agent found matching ID "${task.agentId}"`);
    }

    const mergedCtx = { ...this.context, ...customCtx };
    
    // Execute and block until done
    return agent.executeTask(task, mergedCtx, this.optimizationMode);
  }

  /**
   * Pause execution of the running workflow
   */
  public pauseWorkflow(): void {
    if (this.status !== 'running') return;
    this.status = 'paused';
    this.taskManager.log('system', 'Workflow paused. Active tasks will halt execution gates.');
  }

  /**
   * Resume paused workflow
   */
  public resumeWorkflow(): void {
    if (this.status !== 'paused') return;
    this.status = 'running';
    this.taskManager.log('system', 'Workflow resumed. Specialist tasks starting back up.');
  }

  /**
   * Cancel workflow execution
   */
  public cancelWorkflow(): void {
    this.status = 'cancelled';
    this.taskManager.log('system', 'Workflow cancellation signal received. Halting all worker nodes.');
  }

  /**
   * Retry failed tasks in the queue
   */
  public async retryFailedTasks(): Promise<any> {
    if (this.status === 'running') {
      throw new Error('Cannot run retry processor while workflow is currently running.');
    }

    const failedTasks = this.taskManager.getTasks().filter(t => t.status === 'failed');
    if (failedTasks.length === 0) {
      this.taskManager.log('system', 'No failed tasks found to retry.');
      return;
    }

    this.status = 'running';
    this.taskManager.log('system', `Retrying ${failedTasks.length} failed specialist tasks...`);

    // Reset failed tasks back to pending and clear their retry counts
    failedTasks.forEach(t => {
      t.status = 'pending';
      t.retryCount = 0;
      t.error = undefined;
    });

    this.currentRunnerPromise = this.runWorkflowProcessor();
    return this.currentRunnerPromise;
  }
}
