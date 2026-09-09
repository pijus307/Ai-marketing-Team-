/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryEntry {
  id: string;
  agentId: string;
  key: string;
  value: any;
  timestamp: string;
}

export class MemoryManager {
  private static instance: MemoryManager;
  private memories: Map<string, any> = new Map();
  private history: MemoryEntry[] = [];

  private constructor() {}

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Store a key-value memory under a specific domain or agent
   */
  public set(agentId: string, key: string, value: any): void {
    const compositeKey = `${agentId}:${key}`;
    this.memories.set(compositeKey, value);

    // Also store in general memory or index
    this.memories.set(key, value);

    const entry: MemoryEntry = {
      id: Math.random().toString(36).substring(7),
      agentId,
      key,
      value,
      timestamp: new Date().toISOString()
    };
    this.history.push(entry);
  }

  /**
   * Retrieve memory by key or agent-prefixed key
   */
  public get<T = any>(key: string, agentId?: string): T | undefined {
    if (agentId) {
      const compositeKey = `${agentId}:${key}`;
      if (this.memories.has(compositeKey)) {
        return this.memories.get(compositeKey) as T;
      }
    }
    return this.memories.get(key) as T;
  }

  /**
   * Check if a memory exists
   */
  public has(key: string, agentId?: string): boolean {
    if (agentId) {
      const compositeKey = `${agentId}:${key}`;
      if (this.memories.has(compositeKey)) return true;
    }
    return this.memories.has(key);
  }

  /**
   * Get all entries in history
   */
  public getHistory(): MemoryEntry[] {
    return [...this.history];
  }

  /**
   * Clear all memories
   */
  public clear(): void {
    this.memories.clear();
    this.history = [];
  }
}
