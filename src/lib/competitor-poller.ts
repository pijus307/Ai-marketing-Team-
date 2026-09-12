/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AlertSeverity = 'critical' | 'warning' | 'opportunity' | 'info';
export type MetricType = 'traffic' | 'search_ranking' | 'domain_authority' | 'ad_spend' | 'content_velocity';

export interface CompetitorMetricSnapshot {
  competitorName: string;
  website: string;
  monthlyVisits: number; // in thousands (K)
  domainAuthority: number;
  topKeywordRank: {
    keyword: string;
    rank: number;
  };
  monthlyAdSpend: number; // in USD
  contentVelocity: number; // articles per month
  timestamp: string;
}

export interface CompetitorAlert {
  id: string;
  competitorName: string;
  website: string;
  severity: AlertSeverity;
  metricType: MetricType;
  title: string;
  summary: string;
  detailedAnalysis: string;
  delta: {
    previousValue: string | number;
    currentValue: string | number;
    percentChange?: number;
    unit?: string;
  };
  recommendedAction: string;
  suggestedAgent: 'Sophia (CEO)' | 'Marcus (SEO)' | 'Elena (Content)' | 'Chloe (Social)' | 'Alex (PPC)' | 'Daniel (Email)';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  actionTaken?: boolean;
}

export interface SurveillanceSettings {
  autoPollingEnabled: boolean;
  pollIntervalSeconds: number; // 15, 30, 60, 300
  trafficThresholdPercent: number; // e.g. 10%
  rankThresholdPositions: number; // e.g. 2 positions
  daThresholdPoints: number; // e.g. 2 points
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

const DEFAULT_SETTINGS: SurveillanceSettings = {
  autoPollingEnabled: true,
  pollIntervalSeconds: 30,
  trafficThresholdPercent: 8,
  rankThresholdPositions: 2,
  daThresholdPoints: 2,
  soundEnabled: true,
  desktopNotifications: false
};

const STORAGE_ALERTS_KEY = 'ai_os_competitor_alerts_v1';
const STORAGE_SETTINGS_KEY = 'ai_os_competitor_surveillance_settings_v1';
const STORAGE_SNAPSHOTS_KEY = 'ai_os_competitor_snapshots_v1';

export class CompetitorSurveillanceEngine {
  private static instance: CompetitorSurveillanceEngine;
  private alerts: CompetitorAlert[] = [];
  private settings: SurveillanceSettings = DEFAULT_SETTINGS;
  private lastSnapshots: Record<string, CompetitorMetricSnapshot> = {};
  private listeners: Array<(alerts: CompetitorAlert[]) => void> = [];
  private timer: any = null;
  private isPollingActive = false;

  private constructor() {
    this.loadState();
    if (this.alerts.length === 0) {
      this.seedInitialAlerts();
    }
  }

  public static getInstance(): CompetitorSurveillanceEngine {
    if (!CompetitorSurveillanceEngine.instance) {
      CompetitorSurveillanceEngine.instance = new CompetitorSurveillanceEngine();
    }
    return CompetitorSurveillanceEngine.instance;
  }

  private loadState() {
    try {
      const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }

      const savedAlerts = localStorage.getItem(STORAGE_ALERTS_KEY);
      if (savedAlerts) {
        this.alerts = JSON.parse(savedAlerts);
      }

      const savedSnapshots = localStorage.getItem(STORAGE_SNAPSHOTS_KEY);
      if (savedSnapshots) {
        this.lastSnapshots = JSON.parse(savedSnapshots);
      }
    } catch (e) {
      console.warn('[Surveillance Engine] Error loading local storage state', e);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(this.alerts));
      localStorage.setItem(STORAGE_SNAPSHOTS_KEY, JSON.stringify(this.lastSnapshots));
    } catch (e) {
      console.warn('[Surveillance Engine] Error saving local storage state', e);
    }
  }

  private notify() {
    this.saveState();
    for (const listener of this.listeners) {
      listener([...this.alerts]);
    }
  }

  public subscribe(listener: (alerts: CompetitorAlert[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.alerts]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getAlerts(): CompetitorAlert[] {
    return [...this.alerts];
  }

  public getUnreadCount(): number {
    return this.alerts.filter(a => !a.isRead).length;
  }

  public getSettings(): SurveillanceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SurveillanceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveState();
    if (this.settings.autoPollingEnabled) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  }

  public markAsRead(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a);
    this.notify();
  }

  public markAllAsRead() {
    this.alerts = this.alerts.map(a => ({ ...a, isRead: true }));
    this.notify();
  }

  public toggleStarred(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, isStarred: !a.isStarred } : a);
    this.notify();
  }

  public markActionTaken(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, actionTaken: true, isRead: true } : a);
    this.notify();
  }

  public deleteAlert(alertId: string) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.notify();
  }

  public clearAllAlerts() {
    this.alerts = [];
    this.notify();
  }

  public startPolling() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (!this.settings.autoPollingEnabled) return;

    this.timer = setInterval(() => {
      this.pollCompetitorData();
    }, Math.max(10, this.settings.pollIntervalSeconds) * 1000);
  }

  public stopPolling() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Execute poll routine against active competitors or mock grounded changes
   */
  public async pollCompetitorData(customCompetitors?: Array<{ name: string; website: string; visitsK: number; da: number; topKeyword: string; rank: number }>): Promise<CompetitorAlert[]> {
    if (this.isPollingActive) return [];
    this.isPollingActive = true;

    const newGeneratedAlerts: CompetitorAlert[] = [];

    try {
      // If competitor profiles provided or default baseline exists
      const targetCompetitors = customCompetitors || [
        { name: 'Adyen', website: 'adyen.com', visitsK: 480, da: 82, topKeyword: 'global payment gateway api', rank: 3 },
        { name: 'Square (Block)', website: 'squareup.com', visitsK: 1250, da: 91, topKeyword: 'point of sale merchant processing', rank: 1 },
        { name: 'Paddle', website: 'paddle.com', visitsK: 310, da: 74, topKeyword: 'merchant of record saas billing', rank: 4 }
      ];

      for (const comp of targetCompetitors) {
        const last = this.lastSnapshots[comp.website];
        
        // Random fluctuation for live simulation or real telemetry
        const trafficShiftPercent = Number(((Math.random() * 24 - 10)).toFixed(1)); // -10% to +14%
        const rankShift = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const daShift = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;

        const currentVisits = Math.max(50, Math.round(comp.visitsK * (1 + trafficShiftPercent / 100)));
        const currentRank = Math.max(1, Math.min(20, comp.rank + rankShift));
        const currentDa = Math.max(20, comp.da + daShift);

        const currentSnapshot: CompetitorMetricSnapshot = {
          competitorName: comp.name,
          website: comp.website,
          monthlyVisits: currentVisits,
          domainAuthority: currentDa,
          topKeywordRank: {
            keyword: comp.topKeyword,
            rank: currentRank
          },
          monthlyAdSpend: Math.round(currentVisits * 0.42 * 1000),
          contentVelocity: Math.round(8 + Math.random() * 8),
          timestamp: new Date().toISOString()
        };

        if (last) {
          // Check Traffic Threshold
          const diffTrafficPercent = ((currentVisits - last.monthlyVisits) / last.monthlyVisits) * 100;
          if (Math.abs(diffTrafficPercent) >= this.settings.trafficThresholdPercent) {
            const isSpike = diffTrafficPercent > 0;
            const alert: CompetitorAlert = {
              id: `alert_traffic_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              competitorName: comp.name,
              website: comp.website,
              severity: isSpike ? (diffTrafficPercent > 18 ? 'critical' : 'warning') : 'opportunity',
              metricType: 'traffic',
              title: isSpike 
                ? `Traffic Surge: ${comp.name} gained +${diffTrafficPercent.toFixed(1)}% monthly visits`
                : `Traffic Drop: ${comp.name} lost ${Math.abs(diffTrafficPercent).toFixed(1)}% monthly visits`,
              summary: isSpike
                ? `${comp.name} spiked from ${last.monthlyVisits}K to ${currentVisits}K estimated monthly visits. Signal indicates new viral campaign or product release.`
                : `${comp.name} declined from ${last.monthlyVisits}K to ${currentVisits}K visits. Great window for target audience conquesting.`,
              detailedAnalysis: `Grounded web telemetry spotted a ${diffTrafficPercent > 0 ? 'surge' : 'slump'} in organic and referral traffic for ${comp.website}. Estimated monthly impact is ~${Math.abs(currentVisits - last.monthlyVisits)}K unique visitors.`,
              delta: {
                previousValue: `${last.monthlyVisits}K`,
                currentValue: `${currentVisits}K`,
                percentChange: Number(diffTrafficPercent.toFixed(1)),
                unit: 'Visits/mo'
              },
              recommendedAction: isSpike
                ? `Deploy counter-positioning comparison page and bid on '${comp.name} alternative' keywords.`
                : `Launch targeted retargeting campaign highlighting their recent service/pricing friction.`,
              suggestedAgent: isSpike ? 'Marcus (SEO)' : 'Alex (PPC)',
              timestamp: new Date().toISOString(),
              isRead: false,
              isStarred: false
            };
            newGeneratedAlerts.push(alert);
          }

          // Check Search Ranking Threshold
          const prevRank = last.topKeywordRank.rank;
          const currRank = currentRank;
          const rankDelta = prevRank - currRank; // positive means climbed up (e.g. 5 to 2 = +3)

          if (Math.abs(rankDelta) >= this.settings.rankThresholdPositions) {
            const climbed = rankDelta > 0;
            const alert: CompetitorAlert = {
              id: `alert_rank_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              competitorName: comp.name,
              website: comp.website,
              severity: climbed ? (currRank <= 3 ? 'critical' : 'warning') : 'opportunity',
              metricType: 'search_ranking',
              title: climbed
                ? `Keyword Climb: ${comp.name} jumped to #${currRank} for "${comp.topKeyword}"`
                : `Ranking Drop: ${comp.name} slipped from #${prevRank} to #${currRank} for "${comp.topKeyword}"`,
              summary: climbed
                ? `${comp.name} climbed ${rankDelta} positions on high-intent SERP "${comp.topKeyword}". Organic click share shifting in their favor.`
                : `${comp.name} fell to #${currRank} on "${comp.topKeyword}". Primary slot is vulnerable for hijacking.`,
              detailedAnalysis: `SERP tracking detected position update on Google desktop & mobile index. Keyword search volume is ~18,500 queries/mo with high commercial buyer intent.`,
              delta: {
                previousValue: `#${prevRank}`,
                currentValue: `#${currRank}`,
                percentChange: rankDelta * 10,
                unit: 'SERP Rank'
              },
              recommendedAction: climbed
                ? `Update core landing page schema, build 3 high-authority citations, and refresh meta tags.`
                : `Publish an updated deep-dive guide targeting "${comp.topKeyword}" to claim the #1 spot.`,
              suggestedAgent: 'Marcus (SEO)',
              timestamp: new Date().toISOString(),
              isRead: false,
              isStarred: false
            };
            newGeneratedAlerts.push(alert);
          }

          // Check Domain Authority (DA)
          if (Math.abs(currentDa - last.domainAuthority) >= this.settings.daThresholdPoints) {
            const daDelta = currentDa - last.domainAuthority;
            const alert: CompetitorAlert = {
              id: `alert_da_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              competitorName: comp.name,
              website: comp.website,
              severity: daDelta > 0 ? 'warning' : 'opportunity',
              metricType: 'domain_authority',
              title: daDelta > 0
                ? `Authority Spike: ${comp.name} DA increased to ${currentDa}`
                : `Authority Loss: ${comp.name} DA reduced to ${currentDa}`,
              summary: `${comp.name}'s backlink profile changed: Domain Authority shifted from ${last.domainAuthority} to ${currentDa}.`,
              detailedAnalysis: `Backlink index shows recent influx of tier-1 editorial publications referencing ${comp.website}.`,
              delta: {
                previousValue: last.domainAuthority,
                currentValue: currentDa,
                percentChange: daDelta * 5,
                unit: 'DA Score'
              },
              recommendedAction: `Inspect competitor's new referring domains and execute broken link recovery on overlapping industry blogs.`,
              suggestedAgent: 'Elena (Content)',
              timestamp: new Date().toISOString(),
              isRead: false,
              isStarred: false
            };
            newGeneratedAlerts.push(alert);
          }
        }

        // Store snapshot
        this.lastSnapshots[comp.website] = currentSnapshot;
      }

      if (newGeneratedAlerts.length > 0) {
        this.alerts = [...newGeneratedAlerts, ...this.alerts].slice(0, 50); // keep 50 max
        this.notify();
      }

    } catch (e) {
      console.error('[Surveillance Engine] Polling error:', e);
    } finally {
      this.isPollingActive = false;
    }

    return newGeneratedAlerts;
  }

  /**
   * Generates a realistic mock event for testing
   */
  public triggerSimulatedEvent(
    type: 'traffic_surge' | 'ranking_drop' | 'ranking_overtake' | 'ad_war',
    competitorName = 'Adyen',
    website = 'adyen.com'
  ) {
    let alert: CompetitorAlert;
    const now = new Date().toISOString();

    switch (type) {
      case 'traffic_surge':
        alert = {
          id: `sim_${Date.now()}`,
          competitorName,
          website,
          severity: 'critical',
          metricType: 'traffic',
          title: `Traffic Surge Alert: ${competitorName} traffic exploded +31.4%`,
          summary: `${competitorName} monthly visits surged to 630K/mo. Product Hunt #1 Product of the Day and viral LinkedIn launch detected.`,
          detailedAnalysis: `Aggressive traffic inflow observed primarily from social and direct channels. Brand query volume is up 4.2x over the past 48 hours.`,
          delta: {
            previousValue: '480K',
            currentValue: '630K',
            percentChange: 31.4,
            unit: 'Visits/mo'
          },
          recommendedAction: `Launch immediate counter-positioning thread on X/LinkedIn and increase Google Search bid on branded conquest keywords.`,
          suggestedAgent: 'Sophia (CEO)',
          timestamp: now,
          isRead: false,
          isStarred: true
        };
        break;

      case 'ranking_overtake':
        alert = {
          id: `sim_${Date.now()}`,
          competitorName,
          website,
          severity: 'critical',
          metricType: 'search_ranking',
          title: `Rank Overtake: ${competitorName} seized #1 on "payment orchestrator"`,
          summary: `${competitorName} moved from #4 to #1 on high-volume money keyword, bumping our position down to #3.`,
          detailedAnalysis: `Algorithm re-evaluation credited their interactive pricing comparison calculator. Organic CTR dropped by ~14% on our landing page.`,
          delta: {
            previousValue: '#4 Rank',
            currentValue: '#1 Rank',
            percentChange: 75,
            unit: 'SERP Rank'
          },
          recommendedAction: `Add interactive fee calculator widget to our landing page and optimize H1/H2 header semantic density.`,
          suggestedAgent: 'Marcus (SEO)',
          timestamp: now,
          isRead: false,
          isStarred: true
        };
        break;

      case 'ranking_drop':
        alert = {
          id: `sim_${Date.now()}`,
          competitorName,
          website,
          severity: 'opportunity',
          metricType: 'search_ranking',
          title: `Opportunity Window: ${competitorName} dropped from #2 to #8`,
          summary: `${competitorName} lost top 3 positioning for "saas subscription billing api" due to broken core web vitals update.`,
          detailedAnalysis: `Competitor site experienced LCP degradation (>4.2s) resulting in severe ranking loss across 12 high-intent queries.`,
          delta: {
            previousValue: '#2 Rank',
            currentValue: '#8 Rank',
            percentChange: -60,
            unit: 'SERP Rank'
          },
          recommendedAction: `Accelerate backlink outreach and boost paid search capture to lock in #1 organic real estate.`,
          suggestedAgent: 'Marcus (SEO)',
          timestamp: now,
          isRead: false,
          isStarred: false
        };
        break;

      case 'ad_war':
        alert = {
          id: `sim_${Date.now()}`,
          competitorName,
          website,
          severity: 'warning',
          metricType: 'ad_spend',
          title: `Ad Spend Surge: ${competitorName} increased Google Ad budget +45%`,
          summary: `${competitorName} launched 18 new Google Search creative variants targeting enterprise keywords with estimated $25,000/mo spend.`,
          detailedAnalysis: `Ad intelligence spotted heavy bidding on exact match phrases. Average CPC increased by $1.85 across our shared ad groups.`,
          delta: {
            previousValue: '$18,000',
            currentValue: '$26,200',
            percentChange: 45.5,
            unit: 'USD/mo'
          },
          recommendedAction: `Focus ad spend on high-intent long-tail keywords with higher conversion rates and lower competitor overlap.`,
          suggestedAgent: 'Alex (PPC)',
          timestamp: now,
          isRead: false,
          isStarred: false
        };
        break;
    }

    this.alerts = [alert, ...this.alerts];
    this.notify();
    return alert;
  }

  private seedInitialAlerts() {
    const now = new Date();
    const minAgo = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

    this.alerts = [
      {
        id: 'seed_1',
        competitorName: 'Adyen',
        website: 'adyen.com',
        severity: 'critical',
        metricType: 'traffic',
        title: 'Traffic Surge: Adyen gained +22.4% monthly visits',
        summary: 'Adyen jumped to 587K visits following their global enterprise checkout launch. High search surge in European markets.',
        detailedAnalysis: 'Referral traffic from tech blogs and direct visits peaked over the last 72 hours. Customer acquisition velocity accelerating.',
        delta: {
          previousValue: '480K',
          currentValue: '587K',
          percentChange: 22.4,
          unit: 'Visits/mo'
        },
        recommendedAction: 'Publish our Enterprise vs Adyen direct comparison page highlighting zero hidden markup fees.',
        suggestedAgent: 'Marcus (SEO)',
        timestamp: minAgo(12),
        isRead: false,
        isStarred: true
      },
      {
        id: 'seed_2',
        competitorName: 'Square (Block)',
        website: 'squareup.com',
        severity: 'warning',
        metricType: 'search_ranking',
        title: 'Ranking Climb: Square captured #1 for "pos software for developers"',
        summary: 'Square moved from #3 to #1 on high intent merchant developer keywords.',
        detailedAnalysis: 'New documentation portal refresh and API playground boosted their dwell time and organic rank.',
        delta: {
          previousValue: '#3 Rank',
          currentValue: '#1 Rank',
          percentChange: 66.7,
          unit: 'SERP Rank'
        },
        recommendedAction: 'Enhance our developer quickstart interactive sandboxes to outrank their docs page.',
        suggestedAgent: 'Elena (Content)',
        timestamp: minAgo(48),
        isRead: false,
        isStarred: false
      },
      {
        id: 'seed_3',
        competitorName: 'Paddle',
        website: 'paddle.com',
        severity: 'opportunity',
        metricType: 'traffic',
        title: 'Opportunity: Paddle organic traffic declined -14.8%',
        summary: 'Paddle experienced ranking drops on SaaS tax automation queries following their site redesign.',
        detailedAnalysis: 'Multiple 404 redirects and delayed crawler reindexing opened a significant content gap in billing compliance.',
        delta: {
          previousValue: '310K',
          currentValue: '264K',
          percentChange: -14.8,
          unit: 'Visits/mo'
        },
        recommendedAction: 'Launch paid search conquest campaign targeting "Paddle alternative tax compliance".',
        suggestedAgent: 'Alex (PPC)',
        timestamp: minAgo(135),
        isRead: true,
        isStarred: false
      }
    ];
    this.saveState();
  }
}
