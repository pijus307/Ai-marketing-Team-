/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScheduledCampaign {
  id: string;
  planId: string;
  url: string;
  scheduleType: 'now' | 'daily' | 'weekly' | 'monthly' | 'custom';
  scheduleDate?: string;
  createdAt: string;
  status: 'active' | 'triggered' | 'cancelled';
}

export class CampaignScheduler {
  private static instance: CampaignScheduler;
  private schedules: ScheduledCampaign[] = [];

  private constructor() {}

  public static getInstance(): CampaignScheduler {
    if (!CampaignScheduler.instance) {
      CampaignScheduler.instance = new CampaignScheduler();
    }
    return CampaignScheduler.instance;
  }

  /**
   * Schedules a campaign
   */
  public scheduleCampaign(
    planId: string, 
    url: string, 
    type: ScheduledCampaign['scheduleType'], 
    dateString?: string
  ): ScheduledCampaign {
    const schedule: ScheduledCampaign = {
      id: `sched_${Date.now()}`,
      planId,
      url,
      scheduleType: type,
      scheduleDate: dateString,
      createdAt: new Date().toISOString(),
      status: type === 'now' ? 'triggered' : 'active'
    };

    this.schedules.push(schedule);
    return schedule;
  }

  public getSchedules(): ScheduledCampaign[] {
    return this.schedules;
  }

  public cancelSchedule(id: string): void {
    const sched = this.schedules.find(s => s.id === id);
    if (sched) {
      sched.status = 'cancelled';
    }
  }

  public triggerSchedule(id: string): void {
    const sched = this.schedules.find(s => s.id === id);
    if (sched) {
      sched.status = 'triggered';
    }
  }
}
