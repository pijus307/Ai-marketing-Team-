/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Check, 
  CheckCheck, 
  X, 
  Sliders, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Zap,
  Globe,
  Star,
  Search,
  Filter,
  Trash2,
  Copy,
  Layers,
  Activity,
  ArrowRight,
  Volume2,
  VolumeX,
  Clock,
  Send,
  Eye,
  Radar
} from 'lucide-react';
import { 
  CompetitorSurveillanceEngine, 
  CompetitorAlert, 
  AlertSeverity,
  MetricType,
  SurveillanceSettings
} from '../lib/competitor-poller';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCompetitor?: () => void;
  onNavigateToAgent?: (agentRole: string) => void;
}

export default function NotificationCenterModal({
  isOpen,
  onClose,
  onNavigateToCompetitor,
  onNavigateToAgent
}: NotificationCenterModalProps) {
  const engine = CompetitorSurveillanceEngine.getInstance();
  const [alerts, setAlerts] = useState<CompetitorAlert[]>([]);
  const [settings, setSettings] = useState<SurveillanceSettings>(engine.getSettings());
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings' | 'simulator'>('alerts');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [metricFilter, setMetricFilter] = useState<'all' | MetricType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newAlerts) => {
      setAlerts(newAlerts);
    });
    setSettings(engine.getSettings());
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handlePollNow = async () => {
    setIsPolling(true);
    await engine.pollCompetitorData();
    setTimeout(() => {
      setIsPolling(false);
    }, 600);
  };

  const handleSaveSettings = (updated: Partial<SurveillanceSettings>) => {
    const newConfig = { ...settings, ...updated };
    setSettings(newConfig);
    engine.updateSettings(newConfig);
  };

  const handleCopyAlert = (alert: CompetitorAlert) => {
    const text = `[COMPETITOR ALERT: ${alert.severity.toUpperCase()}]\n${alert.title}\n\nSummary: ${alert.summary}\nMetric Delta: ${alert.delta.previousValue} -> ${alert.delta.currentValue} (${alert.delta.percentChange}%)\nRecommended Counter-Action: ${alert.recommendedAction}\nAssigned Specialist: ${alert.suggestedAgent}`;
    navigator.clipboard.writeText(text);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDispatchAgent = (alert: CompetitorAlert) => {
    engine.markActionTaken(alert.id);
    setDispatchedId(alert.id);
    setTimeout(() => {
      setDispatchedId(null);
    }, 2500);

    if (onNavigateToAgent) {
      if (alert.suggestedAgent.includes('SEO')) onNavigateToAgent('seo');
      else if (alert.suggestedAgent.includes('Content')) onNavigateToAgent('content');
      else if (alert.suggestedAgent.includes('Social')) onNavigateToAgent('social');
      else if (alert.suggestedAgent.includes('PPC')) onNavigateToAgent('ads');
      else if (alert.suggestedAgent.includes('Email')) onNavigateToAgent('email');
      else onNavigateToAgent('ceo');
    }
  };

  // Filtered alerts
  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (metricFilter !== 'all' && a.metricType !== metricFilter) return false;
    if (onlyStarred && !a.isStarred) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.competitorName.toLowerCase().includes(q) ||
        a.website.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          badgeText: 'CRITICAL THREAT',
          icon: <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          badgeText: 'WARNING SHIFT',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'opportunity':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          badgeText: 'OPPORTUNITY GAP',
          icon: <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
        };
      default:
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          badgeText: 'TELEMETRY UPDATE',
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-5xl h-[90vh] max-h-[850px] glass-panel bg-slate-950/95 border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white relative z-10"
      >
        {/* Modal Top Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-indigo-600/30 border border-cyan-400/40 text-cyan-300 glow-cyan">
              <Radar className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-sans">
                  Competitor Intelligence & Notification Center
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] shadow-sm">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Surveillance Engine &bull; Auto-polling every {settings.pollIntervalSeconds}s
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePollNow}
              disabled={isPolling}
              className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Poll Telemetry</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={() => engine.markAllAsRead()}
                className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-slate-300 hover:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Surveillance Alerts ({alerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Thresholds & Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Market Simulator</span>
            </button>
          </div>

          {activeTab === 'alerts' && alerts.length > 0 && (
            <button
              onClick={() => engine.clearAllAlerts()}
              className="text-[11px] font-mono text-rose-400/80 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Clear Log
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
          
          {/* TAB 1: ALERTS STREAM */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              
              {/* Filter Controls Bar */}
              <div className="glass-panel border border-white/10 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search competitor, keyword, or alert..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-panel bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Severity Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Severity:</span>
                  {(['all', 'critical', 'warning', 'opportunity'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                        severityFilter === sev
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'glass-panel hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}

                  {/* Starred Toggle */}
                  <button
                    onClick={() => setOnlyStarred(!onlyStarred)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      onlyStarred
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'glass-panel hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${onlyStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    Starred
                  </button>
                </div>
              </div>

              {/* Alerts List */}
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center glass-panel border border-white/10 rounded-3xl space-y-3">
                  <ShieldAlert className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
                  <h3 className="text-base font-bold text-white">No Matching Competitor Alerts</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    The radar is actively monitoring your competitors for traffic surges, ranking shifts, and ad budget increases.
                  </p>
                  <button
                    onClick={handlePollNow}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono font-bold text-xs shadow-md glow-cyan cursor-pointer"
                  >
                    Poll Telemetry Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => {
                    const badge = getSeverityBadge(alert.severity);
                    return (
                      <div
                        key={alert.id}
                        className={`glass-panel border rounded-2xl p-4 md:p-5 transition-all space-y-3 relative group ${
                          alert.severity === 'critical'
                            ? 'border-rose-500/40 bg-rose-950/[0.08] hover:border-rose-400'
                            : alert.severity === 'warning'
                            ? 'border-amber-500/40 bg-amber-950/[0.08] hover:border-amber-400'
                            : alert.severity === 'opportunity'
                            ? 'border-emerald-500/40 bg-emerald-950/[0.08] hover:border-emerald-400'
                            : 'border-white/10 bg-slate-900/40 hover:border-cyan-400/40'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-black flex items-center gap-1.5 ${badge.bg}`}>
                              {badge.icon}
                              {badge.badgeText}
                            </span>
                            <span className="text-xs font-bold text-white font-mono">
                              {alert.competitorName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ({alert.website})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(alert.timestamp).toLocaleDateString()}
                            </span>

                            <button
                              onClick={() => engine.toggleStarred(alert.id)}
                              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                              title={alert.isStarred ? 'Unstar alert' : 'Star alert'}
                            >
                              <Star className={`w-3.5 h-3.5 ${alert.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>

                            <button
                              onClick={() => engine.deleteAlert(alert.id)}
                              className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete alert"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Delta Diff */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                          <div className="lg:col-span-8 space-y-2">
                            <h3 className="text-sm md:text-base font-bold text-white leading-snug">
                              {alert.title}
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {alert.summary}
                            </p>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-mono bg-black/30 p-2.5 rounded-xl border border-white/5">
                              <strong className="text-cyan-400">GROUNDED INSIGHT:</strong> {alert.detailedAnalysis}
                            </p>
                          </div>

                          {/* Delta Visualizer Box */}
                          <div className="lg:col-span-4 glass-panel bg-slate-900/90 border border-white/10 rounded-xl p-3.5 space-y-2">
                            <span className="text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                              METRIC DIFFERENTIAL
                            </span>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Previous:</span>
                              <span className="font-mono text-slate-300">{alert.delta.previousValue}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-white">Detected:</span>
                              <span className="font-mono text-cyan-300">{alert.delta.currentValue}</span>
                            </div>
                            {alert.delta.percentChange !== undefined && (
                              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-xs font-mono font-black">
                                <span className="text-slate-400">Shift Delta:</span>
                                <span className={`flex items-center gap-1 ${
                                  alert.delta.percentChange > 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                  {alert.delta.percentChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  {alert.delta.percentChange > 0 ? `+${alert.delta.percentChange}%` : `${alert.delta.percentChange}%`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* AI Counter-Strategy & Action Dispatch */}
                        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01] -mx-4 -mb-4 p-4 rounded-b-2xl">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Recommended Counter-Measure
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Assigned to: <strong className="text-cyan-300">{alert.suggestedAgent}</strong>
                              </span>
                            </div>
                            <p className="text-xs text-slate-200 font-medium">
                              {alert.recommendedAction}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleCopyAlert(alert)}
                              className="px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Copy action plan"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedId === alert.id ? 'Copied!' : 'Copy'}</span>
                            </button>

                            <button
                              onClick={() => handleDispatchAgent(alert)}
                              disabled={alert.actionTaken || dispatchedId === alert.id}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                                alert.actionTaken || dispatchedId === alert.id
                                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white glow-cyan'
                              }`}
                            >
                              {alert.actionTaken || dispatchedId === alert.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Task Dispatched</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Dispatch to Agent</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SETTINGS & THRESHOLDS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6 py-2">
              <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    Surveillance Polling & Alert Thresholds
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure how frequently the AI agent checks competitor movements and what percentage change triggers high-priority alerts.
                  </p>
                </div>

                {/* Auto Polling Switch */}
                <div className="flex items-center justify-between p-4 glass-panel bg-slate-900/60 rounded-2xl border border-white/5">
                  <div className="space-y-0.5">
                    <strong className="text-sm text-white font-bold block">Autonomous Background Surveillance</strong>
                    <span className="text-xs text-slate-400">Continuously monitor competitor visits, keyword rankings & ad activity.</span>
                  </div>
                  <button
                    onClick={() => handleSaveSettings({ autoPollingEnabled: !settings.autoPollingEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.autoPollingEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoPollingEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Polling Interval */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-bold">Surveillance Frequency (Seconds)</span>
                    <span className="text-cyan-400 font-bold">{settings.pollIntervalSeconds}s ({settings.pollIntervalSeconds <= 15 ? 'Aggressive' : settings.pollIntervalSeconds <= 60 ? 'Optimal' : 'Periodic'})</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 60, 300].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => handleSaveSettings({ pollIntervalSeconds: sec })}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                          settings.pollIntervalSeconds === sec
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'glass-panel hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sec === 300 ? '5 Min' : `${sec}s`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Traffic Shift Threshold */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-bold">Traffic Surge/Drop Alert Threshold</span>
                    <span className="text-emerald-400 font-bold">&plusmn;{settings.trafficThresholdPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    step="1"
                    value={settings.trafficThresholdPercent}
                    onChange={(e) => handleSaveSettings({ trafficThresholdPercent: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Trigger alert whenever a competitor's estimated monthly visits fluctuate by &plusmn;{settings.trafficThresholdPercent}% or more.
                  </span>
                </div>

                {/* SERP Rank Shift Threshold */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300 font-bold">Search Ranking Movement Threshold</span>
                    <span className="text-amber-400 font-bold">{settings.rankThresholdPositions} Positions</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={settings.rankThresholdPositions}
                    onChange={(e) => handleSaveSettings({ rankThresholdPositions: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Alert when a competitor climbs or drops by {settings.rankThresholdPositions} or more SERP positions on high-intent keywords.
                  </span>
                </div>

                {/* Audio Notification */}
                <div className="flex items-center justify-between p-4 glass-panel bg-slate-900/60 rounded-2xl border border-white/5 pt-2">
                  <div className="space-y-0.5">
                    <strong className="text-sm text-white font-bold flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      Audio Tone Alert
                    </strong>
                    <span className="text-xs text-slate-400">Play subtle audio alert on critical competitor threat detection.</span>
                  </div>
                  <button
                    onClick={() => handleSaveSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MARKET SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="max-w-3xl mx-auto space-y-6 py-2">
              <div className="glass-panel border border-cyan-500/30 rounded-3xl p-6 space-y-5 bg-gradient-to-b from-cyan-500/10 to-transparent">
                <div className="border-b border-white/10 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold uppercase mb-2">
                    <Zap className="w-3.5 h-3.5" />
                    Market Scenario Simulator
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Simulate Live Competitive Market Dynamics
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Instantly trigger real-world scenario telemetry events to test the surveillance engine's delta calculation, threat level classification, and automated agent dispatch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Scenario 1: Traffic Surge */}
                  <div className="glass-panel bg-slate-900/80 border border-rose-500/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase border border-rose-500/30">
                        CRITICAL SURGE
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">Competitor Viral Traffic Surge</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Simulate Adyen launching a viral campaign with +31.4% monthly visits inflow.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        engine.triggerSimulatedEvent('traffic_surge', 'Adyen', 'adyen.com');
                        setActiveTab('alerts');
                      }}
                      className="w-full py-2 bg-rose-500 hover:bg-rose-400 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      Trigger Surge Event
                    </button>
                  </div>

                  {/* Scenario 2: Keyword Overtake */}
                  <div className="glass-panel bg-slate-900/80 border border-rose-500/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase border border-rose-500/30">
                        SERP OVERTAKE
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">Competitor Claims #1 Rank</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Simulate Square taking the #1 spot on high-intent query "payment orchestrator".
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        engine.triggerSimulatedEvent('ranking_overtake', 'Square (Block)', 'squareup.com');
                        setActiveTab('alerts');
                      }}
                      className="w-full py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Trigger Overtake Event
                    </button>
                  </div>

                  {/* Scenario 3: Ranking Drop Opportunity */}
                  <div className="glass-panel bg-slate-900/80 border border-emerald-500/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase border border-emerald-500/30">
                        OPPORTUNITY GAP
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">Competitor SERP Slip (#2 &rarr; #8)</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Simulate Paddle dropping positions due to core web vitals degradation.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        engine.triggerSimulatedEvent('ranking_drop', 'Paddle', 'paddle.com');
                        setActiveTab('alerts');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      Trigger Slump Event
                    </button>
                  </div>

                  {/* Scenario 4: Ad Spend War */}
                  <div className="glass-panel bg-slate-900/80 border border-amber-500/40 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase border border-amber-500/30">
                        PPC ESCALATION
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">Competitor Ad Budget Bump (+45%)</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Simulate competitor flooding Google Search ads with increased bids.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        engine.triggerSimulatedEvent('ad_war', 'Adyen', 'adyen.com');
                        setActiveTab('alerts');
                      }}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Trigger Ad Surge Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Grounded telemetry cross-referenced with Google Search Index</span>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToCompetitor && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToCompetitor();
                }}
                className="text-cyan-300 hover:text-cyan-200 font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Competitor Research View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
