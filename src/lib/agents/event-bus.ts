/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCallback = (data: any) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   */
  public on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return an unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Publish an event to all subscribers asynchronously
   */
  public async emit(event: string, data: any): Promise<void> {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;

    const promises: Promise<void>[] = [];
    for (const callback of callbacks) {
      try {
        const result = callback(data);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (err) {
        console.error(`[EventBus] Error in listener for event "${event}":`, err);
      }
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }
  }

  /**
   * Clear all listeners (useful for testing or resetting engine)
   */
  public clear(): void {
    this.listeners.clear();
  }
}
