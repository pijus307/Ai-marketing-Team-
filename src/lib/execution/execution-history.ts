/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExecutionHistoryRecord {
  id: string;
  actionId: string;
  name: string;
  category: string;
  status: 'completed' | 'failed' | 'rolled_back';
  timestamp: string;
  agentId: string;
  provider: string;
  model: string;
  outputSummary: string;
  error?: string;
  rollbackSummary?: string;
}

export class ExecutionHistory {
  private static instance: ExecutionHistory;
  private records: ExecutionHistoryRecord[] = [];

  private constructor() {}

  public static getInstance(): ExecutionHistory {
    if (!ExecutionHistory.instance) {
      ExecutionHistory.instance = new ExecutionHistory();
    }
    return ExecutionHistory.instance;
  }

  public addRecord(record: Omit<ExecutionHistoryRecord, 'timestamp'>): ExecutionHistoryRecord {
    const fullRecord: ExecutionHistoryRecord = {
      ...record,
      timestamp: new Date().toISOString()
    };
    this.records.unshift(fullRecord); // Newest first
    return fullRecord;
  }

  public getRecords(): ExecutionHistoryRecord[] {
    return this.records;
  }

  public clear(): void {
    this.records = [];
  }

  public updateRecordStatus(id: string, status: ExecutionHistoryRecord['status'], extra?: Partial<ExecutionHistoryRecord>): void {
    const record = this.records.find(r => r.id === id);
    if (record) {
      record.status = status;
      if (extra) {
        Object.assign(record, extra);
      }
    }
  }
}
