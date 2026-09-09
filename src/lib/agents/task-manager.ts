/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgentTask {
  id: string;
  title: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  logs: string[];
  maxRetries: number;
  retryCount: number;
  progress: number; // percentage 0 - 100
  startTime?: number;
  endTime?: number;
  executionTime?: number; // millisecond duration
  provider?: string;
  model?: string;
  output?: any;
  error?: string;
}

export class TaskManager {
  private static instance: TaskManager;
  private tasks: Map<string, AgentTask> = new Map();
  private globalLogs: string[] = [];

  private constructor() {}

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  /**
   * Register or add a task to the queue
   */
  public addTask(task: Omit<AgentTask, 'logs' | 'retryCount' | 'progress'>): AgentTask {
    const fullTask: AgentTask = {
      ...task,
      logs: [`[Task Created] "${task.title}" assigned to agent ${task.agentId}`],
      retryCount: 0,
      progress: 0
    };
    this.tasks.set(fullTask.id, fullTask);
    this.log(fullTask.id, `Task initialized with priority: ${task.priority.toUpperCase()}`);
    return fullTask;
  }

  /**
   * Get a task by ID
   */
  public getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Retrieve all tasks
   */
  public getTasks(): AgentTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks filtered by Agent ID
   */
  public getTasksForAgent(agentId: string): AgentTask[] {
    return this.getTasks().filter(t => t.agentId === agentId);
  }

  /**
   * Update task status and trigger appropriate logs
   */
  public updateTaskStatus(
    taskId: string, 
    status: AgentTask['status'], 
    extra?: Partial<Omit<AgentTask, 'id' | 'logs'>>
  ): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = status;
    if (status === 'running' && !task.startTime) {
      task.startTime = Date.now();
    }
    if ((status === 'completed' || status === 'failed') && task.startTime) {
      task.endTime = Date.now();
      task.executionTime = task.endTime - task.startTime;
    }

    if (extra) {
      Object.assign(task, extra);
    }

    this.log(taskId, `Status transition -> ${status.toUpperCase()} (Progress: ${task.progress}%)`);
  }

  /**
   * Add a log line to a specific task and the global console stream
   */
  public log(taskId: string, message: string): void {
    const task = this.tasks.get(taskId);
    const timestamp = new Date().toLocaleTimeString();
    const formattedMsg = `[${timestamp}] ${message}`;

    if (task) {
      task.logs.push(formattedMsg);
    }
    this.globalLogs.push(`[Task: ${taskId}] ${formattedMsg}`);
    console.log(`[TASK-LOG][${taskId}] ${message}`);
  }

  /**
   * Get global system logs
   */
  public getGlobalLogs(): string[] {
    return [...this.globalLogs];
  }

  /**
   * Reset all tasks
   */
  public clear(): void {
    this.tasks.clear();
    this.globalLogs = [];
  }
}
