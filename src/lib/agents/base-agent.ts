/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentTask, TaskManager } from './task-manager';
import { EventBus } from './event-bus';
import { MemoryManager } from './memory-manager';
import { AIProviderManager } from '../ai/provider-manager';
import { Message } from '../ai/provider-types';

export abstract class BaseAgent {
  public abstract id: string;
  public abstract name: string;
  public abstract role: string;
  public abstract category: string;

  public status: 'idle' | 'running' | 'completed' | 'failed' | 'paused' = 'idle';
  public progress: number = 0;
  public logs: string[] = [];
  public lastActivity: string = 'Initialized';
  
  // Custom preferred provider/model. If undefined, falls back to AIProviderManager defaults or optimization mode
  public provider?: string;
  public model?: string;

  protected taskManager = TaskManager.getInstance();
  protected eventBus = EventBus.getInstance();
  protected memoryManager = MemoryManager.getInstance();

  constructor() {}

  /**
   * Safe execution wrapper with retries, logging, state management, and Event Bus signals
   */
  public async executeTask(task: AgentTask, context: any, optimizationMode?: string): Promise<any> {
    this.status = 'running';
    this.progress = 10;
    this.lastActivity = `Starting task: ${task.title}`;
    this.taskManager.updateTaskStatus(task.id, 'running', { 
      progress: 10,
      provider: this.provider,
      model: this.model
    });
    
    this.log(`Started execution of: "${task.title}"`);
    await this.eventBus.emit(`agent:${this.id}:started`, { taskId: task.id });

    let success = false;
    let finalOutput: any = null;

    while (task.retryCount <= task.maxRetries && !success) {
      try {
        if (task.retryCount > 0) {
          this.log(`Retry attempt ${task.retryCount} of ${task.maxRetries} starting...`);
          this.taskManager.log(task.id, `Retrying execution (attempt ${task.retryCount}/${task.maxRetries})...`);
        }

        // Concrete class specific logic execution
        finalOutput = await this.runLogic(task, context, optimizationMode);
        success = true;
      } catch (err: any) {
        task.retryCount++;
        const errMsg = err.message || 'Unknown execution error';
        this.log(`Error: ${errMsg}`, 'error');
        this.taskManager.log(task.id, `Error occurred: ${errMsg}`);

        if (task.retryCount > task.maxRetries) {
          this.status = 'failed';
          this.progress = 0;
          this.lastActivity = `Task failed: ${errMsg}`;
          this.taskManager.updateTaskStatus(task.id, 'failed', { 
            error: errMsg, 
            progress: 0,
            retryCount: task.retryCount - 1
          });
          await this.eventBus.emit(`agent:${this.id}:failed`, { taskId: task.id, error: errMsg });
          throw err;
        }
      }
    }

    this.status = 'completed';
    this.progress = 100;
    this.lastActivity = 'Task finished successfully';
    this.taskManager.updateTaskStatus(task.id, 'completed', { 
      progress: 100, 
      output: finalOutput,
      retryCount: task.retryCount
    });

    // Save deliverable to short-term memory
    this.memoryManager.set(this.id, 'deliverable', finalOutput);

    // Emit event that this specialist has completed its work
    await this.eventBus.emit(`agent:${this.id}:completed`, { taskId: task.id, output: finalOutput });
    return finalOutput;
  }

  /**
   * Internal logic implementation for child agents
   */
  protected abstract runLogic(task: AgentTask, context: any, optimizationMode?: string): Promise<any>;

  /**
   * Run inference through the central AI Provider Manager
   */
  protected async callAI(
    messages: Message[], 
    schema?: any, 
    optimizationMode?: string
  ): Promise<string> {
    const response = await AIProviderManager.chat(messages, {
      agentId: this.id, // Let manager resolve the preferred starting provider/model!
      responseMimeType: schema ? 'application/json' : undefined,
      responseSchema: schema,
      temperature: 0.2,
      optimizationMode: optimizationMode as any || 'balanced'
    });

    if (!response.success || !response.text) {
      throw new Error(response.error || `Inference failed on provider ${response.provider}`);
    }

    // Capture model stats
    this.provider = response.provider;
    this.model = response.model;

    return response.text;
  }

  protected log(message: string, level: 'info' | 'error' = 'info'): void {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = level === 'error' ? '❌ ' : '⚡ ';
    const formatted = `[${timestamp}] ${prefix}[${this.name}]: ${message}`;
    this.logs.push(formatted);
    console.log(formatted);
  }
}
