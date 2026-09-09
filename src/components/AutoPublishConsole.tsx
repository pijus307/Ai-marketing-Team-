/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Play, Pause, Terminal, CheckCircle2, AlertCircle, Globe, 
  Layers, Check, RefreshCw, Clock, Calendar, ShieldCheck, 
  RotateCcw, History, Bell, Server, FileText, ChevronRight, Sparkles, Sliders
} from 'lucide-react';
import { MarketingAnalysis } from '../types';

interface AutoPublishConsoleProps {
  analysis: MarketingAnalysis;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export default function AutoPublishConsole({ analysis }: AutoPublishConsoleProps) {
  const [plan, setPlan] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [scheduleType, setScheduleType] = useState<'now' | 'daily' | 'weekly' | 'monthly' | 'custom'>('now');
  const [customDate, setCustomDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'flow' | 'history' | 'schedules'>('flow');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-generate plan on mount if not exists
  useEffect(() => {
    generatePlan();
  }, [analysis.url]);

  // Regular Polling of the Execution Snapshot
  useEffect(() => {
    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, 1500);
    return () => clearInterval(interval);
  }, []);

  const fetchSnapshot = async () => {
    try {
      const res = await fetch('/api/execution/snapshot');
      if (res.ok) {
        const data = await res.json();
        setSnapshot(data);
        if (data.activePlan) {
          setPlan(data.activePlan);
        }
      }
    } catch (err) {
      console.error('Error fetching execution snapshot:', err);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/execution/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: analysis.url,
          industry: analysis.ceo.industry || '',
          companyDescription: analysis.ceo.positioning || '',
          customGoals: analysis.email.sequenceGoal || ''
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan);
        addNotification({
          id: `gen_${Date.now()}`,
          type: 'Approval Required',
          title: 'Execution Plan Generated',
          message: 'The marketing specialist swarm has compiled 13 tailored deployment actions. Awaiting executive approval.',
          severity: 'warning',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to generate execution plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndDeploy = async () => {
    if (!plan) return;
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/execution/plan/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          scheduleType,
          scheduleDate: scheduleType === 'custom' ? customDate : undefined
        })
      });

      if (res.ok) {
        addNotification({
          id: `app_${Date.now()}`,
          type: 'Task Started',
          title: 'Plan Approved',
          message: `Campaign scheduled for deployment mode: ${scheduleType.toUpperCase()}.`,
          severity: 'success',
          timestamp: new Date().toISOString()
        });
        await fetchSnapshot();
      }
    } catch (err) {
      console.error('Error approving plan:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleControlCommand = async (command: 'pause' | 'resume' | 'cancel') => {
    if (!plan) return;
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/execution/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          command
        })
      });

      if (res.ok) {
        addNotification({
          id: `ctrl_${Date.now()}`,
          type: command === 'pause' ? 'Task Started' : 'Execution Finished',
          title: `Campaign ${command.toUpperCase()}D`,
          message: `Successfully transmitted ${command} request to active runner.`,
          severity: command === 'resume' ? 'success' : 'warning',
          timestamp: new Date().toISOString()
        });
        await fetchSnapshot();
      }
    } catch (err) {
      console.error(`Error sending command ${command}:`, err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const addNotification = (notif: NotificationItem) => {
    setNotifications(prev => [notif, ...prev].slice(0, 5));
    // Clear after 6s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 6000);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-emerald-500 border-emerald-600 text-white';
      case 'warning': return 'bg-amber-500 border-amber-600 text-white';
      case 'error': return 'bg-rose-500 border-rose-600 text-white';
      default: return 'bg-indigo-600 border-indigo-700 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Toast Notification Stream Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-4 rounded-md border shadow-lg flex items-start gap-3 pointer-events-auto ${getSeverityStyles(n.severity)}`}
            >
              <Bell className="w-5 h-5 mt-0.5 flex-shrink-0 animate-bounce" />
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest block opacity-75">{n.type}</span>
                <strong className="text-xs block font-bold mt-0.5">{n.title}</strong>
                <p className="text-[11px] leading-relaxed mt-1 opacity-90">{n.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Board Welcome Banner */}
      <div className="bg-zinc-900 text-white rounded-md p-6 md:p-8 relative overflow-hidden shadow-md border border-zinc-850">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 border border-indigo-500 rounded text-xs font-mono font-black tracking-wider uppercase text-white shadow-sm">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              AI MARKETING EXECUTION ENGINE
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight font-sans">
              Autonomic Swarm Deployment Hub
            </h2>
            <p className="text-zinc-300 text-xs max-w-2xl leading-relaxed font-medium">
              Take generated multi-channel campaign recommendation live. The execution engine schedules, orchestrates, approves, and rolls back real marketing assets across CMS portals, social pipelines, Google and Meta ad layers, and lifecycle mail servers.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-zinc-950/80 px-4 py-3 border border-zinc-800 rounded">
            <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-left font-mono">
              <span className="text-[8px] text-zinc-500 block font-bold uppercase">ENGINE STATE</span>
              <span className="text-xs text-white uppercase font-black tracking-wide">
                {snapshot?.activePlan?.status || 'STANDBY'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Planned Actions & Category Matrix (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-md p-5 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Specialist Deployment Plan
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">Comprehensive layout of actions prepared by the agency.</p>
            </div>
            <button
              onClick={generatePlan}
              disabled={isGenerating}
              className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              RE-GENERATE PLAN
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                <p className="text-xs text-zinc-500 font-mono font-bold uppercase">Synthesizing live execution blueprints...</p>
              </div>
            ) : plan ? (
              <div className="space-y-4">
                {plan.status === 'pending' && (
                  <div className="p-4 bg-amber-50 border border-amber-150 rounded flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold text-amber-900">Governance Gateway: Consent Action Required</strong>
                      <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">
                        This campaign must be approved by the workspace owner. Setting a schedule and clicking "Approve & Deploy Swarm" will immediately initiate deployment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions categorized */}
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                  {plan.actions.map((act: any, aIdx: number) => {
                    let borderClass = 'border-zinc-200';
                    let statusBg = 'bg-zinc-100 text-zinc-500';
                    
                    if (act.status === 'running') {
                      borderClass = 'border-indigo-400 ring-2 ring-indigo-500/5';
                      statusBg = 'bg-indigo-50 text-indigo-600 animate-pulse font-bold';
                    } else if (act.status === 'completed') {
                      borderClass = 'border-emerald-200 bg-emerald-50/10';
                      statusBg = 'bg-emerald-50 text-emerald-700 font-bold';
                    } else if (act.status === 'failed') {
                      borderClass = 'border-rose-200 bg-rose-50/10';
                      statusBg = 'bg-rose-50 text-rose-700 font-bold';
                    } else if (act.status === 'rolled_back') {
                      borderClass = 'border-amber-200 bg-amber-50/15';
                      statusBg = 'bg-amber-100 text-amber-800 font-bold';
                    }

                    return (
                      <div
                        key={act.id}
                        className={`p-3.5 border rounded-md transition-all space-y-2.5 relative overflow-hidden ${borderClass}`}
                      >
                        {act.status === 'running' && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 overflow-hidden">
                            <div className="h-full bg-indigo-500 animate-[loading_1.5s_infinite_ease-in-out]" style={{ width: `${act.progress}%` }} />
                          </div>
                        )}

                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[8px] font-mono bg-zinc-100 text-zinc-600 border border-zinc-200 px-1.5 py-0.5 rounded font-black uppercase">
                                {act.category}
                              </span>
                              <span className="text-[9px] font-mono text-zinc-400">NODE_0{aIdx + 1}</span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mt-1.5 font-mono">
                              {act.name}
                            </h4>
                            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-0.5">
                              {act.description}
                            </p>
                          </div>
                          <span className={`shrink-0 text-[8px] font-mono px-2 py-0.5 rounded uppercase border tracking-wider ${statusBg}`}>
                            {act.status}
                          </span>
                        </div>

                        {/* Telemetry/AI routing details */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span>AGENT:</span>
                            <span className="text-zinc-700 font-bold uppercase bg-zinc-50 px-1 rounded border border-zinc-200">
                              {act.agentId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              {act.estimatedTimeSec}s
                            </span>
                            {act.status === 'running' && (
                              <span className="text-indigo-600 font-bold">Progress: {act.progress}%</span>
                            )}
                          </div>
                        </div>

                        {act.outputSummary && (
                          <div className="bg-zinc-50 border border-zinc-200 rounded p-2 text-[10px] font-mono text-zinc-600 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                            <span className="text-zinc-400 font-bold">OUTPUT:</span> {act.outputSummary}
                          </div>
                        )}

                        {act.error && (
                          <div className="bg-rose-50 border border-rose-100 rounded p-2 text-[10px] font-mono text-rose-700 leading-relaxed">
                            <span className="text-rose-500 font-bold">CRITICAL_ERROR:</span> {act.error}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500">No active execution plans formulated yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Hand: Interactive Controls, Scheduling, Live Telemetry & Terminal Logs (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Controls & Scheduling Card */}
          <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-black text-zinc-900 uppercase font-mono tracking-wider">
                Swarm Control Gate
              </h3>
              <p className="text-[10px] text-zinc-400">Configure schedule and transmit execution actions.</p>
            </div>

            {/* Scheduling Picker */}
            {plan && plan.status === 'pending' && (
              <div className="space-y-3 border border-zinc-150 p-3 rounded-md bg-zinc-50">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Execution Timing Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['now', 'daily', 'weekly', 'monthly', 'custom'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setScheduleType(type)}
                      className={`py-1.5 px-2.5 text-[10px] font-mono font-bold uppercase border rounded transition-all cursor-pointer ${
                        scheduleType === type 
                          ? 'bg-zinc-900 border-zinc-950 text-white shadow-sm' 
                          : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {type === 'now' ? 'Run Now' : type}
                    </button>
                  ))}
                </div>

                {scheduleType === 'custom' && (
                  <div className="pt-2">
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full bg-white text-zinc-900 text-xs rounded border border-zinc-200 px-3 py-2 focus:outline-none focus:border-zinc-900 font-mono font-bold"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Active Running State controls */}
            {plan && plan.status !== 'pending' && (
              <div className="bg-zinc-950 text-white border border-zinc-900 p-4 rounded-md space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[9px] font-mono text-zinc-500 block font-bold uppercase">SWARM DISPATCH METRICS</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${
                    plan.status === 'running' ? 'text-indigo-400 border-indigo-500/30' :
                    plan.status === 'paused' ? 'text-amber-400 border-amber-500/30' :
                    plan.status === 'completed' ? 'text-emerald-400 border-emerald-500/30' :
                    'text-rose-400 border-rose-500/30'
                  }`}>
                    {plan.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Overall Progress:</span>
                    <span className="font-bold text-white">{snapshot?.overallProgress || 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${snapshot?.overallProgress || 0}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-bold">EST_TIME_LEFT</span>
                    <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {formatTime(snapshot?.estimatedTimeRemainingSec || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-bold">DEPLOYED_GATEWAY</span>
                    <span className="font-bold text-indigo-400 block truncate mt-0.5">
                      {snapshot?.currentAction ? snapshot.currentAction.category : 'IDLE_QUEUES'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-2.5">
              {plan && plan.status === 'pending' && (
                <button
                  onClick={handleApproveAndDeploy}
                  disabled={isActionLoading || (scheduleType === 'custom' && !customDate)}
                  className="w-full bg-zinc-950 hover:bg-zinc-850 disabled:opacity-40 text-white font-mono font-bold py-3 px-4 rounded text-xs uppercase tracking-widest cursor-pointer shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Approve & Deploy Swarm
                </button>
              )}

              {plan && plan.status === 'running' && (
                <button
                  onClick={() => handleControlCommand('pause')}
                  disabled={isActionLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold py-3 px-4 rounded text-xs uppercase tracking-widest cursor-pointer shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <Pause className="w-4 h-4" />
                  Pause Swarm
                </button>
              )}

              {plan && plan.status === 'paused' && (
                <button
                  onClick={() => handleControlCommand('resume')}
                  disabled={isActionLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold py-3 px-4 rounded text-xs uppercase tracking-widest cursor-pointer shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Resume Swarm
                </button>
              )}

              {plan && (plan.status === 'running' || plan.status === 'paused') && (
                <button
                  onClick={() => handleControlCommand('cancel')}
                  disabled={isActionLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold py-3 px-4 rounded text-xs uppercase tracking-widest cursor-pointer shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Cancel Swarm
                </button>
              )}

              {plan && (plan.status === 'completed' || plan.status === 'failed' || plan.status === 'cancelled') && (
                <button
                  onClick={generatePlan}
                  disabled={isActionLoading}
                  className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-mono font-bold py-3 px-4 rounded text-xs uppercase tracking-widest cursor-pointer shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Re-deploy Clean Swarm
                </button>
              )}
            </div>
          </div>

          {/* Active Navigation Sub-Tabs */}
          <div className="border-b border-zinc-200 flex text-xs font-mono">
            <button
              onClick={() => setActiveTab('flow')}
              className={`pb-2 px-4 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'flow' ? 'border-zinc-900 text-zinc-950' : 'border-transparent text-zinc-400'}`}
            >
              Terminal Logs
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 px-4 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'history' ? 'border-zinc-900 text-zinc-950' : 'border-transparent text-zinc-400'}`}
            >
              <History className="w-3.5 h-3.5" />
              History & Rollbacks
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`pb-2 px-4 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'schedules' ? 'border-zinc-900 text-zinc-950' : 'border-transparent text-zinc-400'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedules
            </button>
          </div>

          {/* View Panels */}
          {activeTab === 'flow' && (
            <div className="bg-zinc-950 rounded-md border border-zinc-900 overflow-hidden shadow-lg flex flex-col h-[280px]">
              <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-950 shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10px] font-mono font-bold text-zinc-300 tracking-wider">SWARM_INTELLIGENCE_STREAM.LOG</span>
                </div>
                <span className="text-[8px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">LIVE</span>
              </div>

              <div className="flex-grow p-4 overflow-y-auto font-mono text-[10px] text-zinc-300 space-y-1.5 leading-relaxed selection:bg-indigo-900 selection:text-white">
                {(!snapshot?.history || snapshot.history.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center py-6">
                    <Terminal className="w-8 h-8 opacity-40 text-zinc-500 mb-2 animate-pulse" />
                    <p>Awaiting autonomic execution streams...</p>
                  </div>
                ) : (
                  snapshot.history.map((record: any, idx: number) => {
                    let logColor = 'text-zinc-300';
                    if (record.status === 'completed') {
                      logColor = 'text-emerald-400';
                    } else if (record.status === 'failed') {
                      logColor = 'text-rose-400';
                    } else if (record.status === 'rolled_back') {
                      logColor = 'text-amber-400 font-extrabold';
                    }

                    return (
                      <div key={record.id || idx} className="space-y-1 border-b border-zinc-900 pb-1.5">
                        <div className="flex justify-between text-[9px] text-zinc-500">
                          <span>{new Date(record.timestamp).toLocaleTimeString()} &bull; {record.category.toUpperCase()}</span>
                          <span className={`font-bold ${logColor}`}>{record.status.toUpperCase()}</span>
                        </div>
                        <div className="font-bold text-white">{record.name}</div>
                        <div className="text-[9px] text-zinc-400">PROVIDER: {record.provider} ({record.model})</div>
                        {record.rollbackSummary ? (
                          <div className="text-amber-300 text-[9px] italic mt-0.5 bg-amber-950/20 p-1 border border-amber-900/40 rounded">
                            ↳ Reverted: {record.rollbackSummary}
                          </div>
                        ) : (
                          <div className="text-zinc-400 line-clamp-2">{record.outputSummary}</div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white border border-zinc-200 rounded-md p-4 space-y-4 max-h-[280px] overflow-y-auto">
              <div>
                <h4 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-zinc-600" />
                  Historical Audit Trails & Rollbacks
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Inspect deployed states or trigger fail-safe reverts.</p>
              </div>

              {snapshot?.history && snapshot.history.length > 0 ? (
                <div className="space-y-2">
                  {snapshot.history.map((rec: any) => (
                    <div key={rec.id} className="p-2.5 bg-zinc-50 rounded border border-zinc-150 text-[11px] font-mono flex justify-between items-center gap-4">
                      <div>
                        <strong className="text-zinc-800 uppercase block font-bold">{rec.name}</strong>
                        <span className="text-zinc-500 block text-[9px] mt-0.5">DEPLOYED ON: {new Date(rec.timestamp).toLocaleTimeString()}</span>
                        {rec.rollbackSummary && (
                          <span className="text-amber-600 font-bold block text-[9px] mt-1 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                            ROLLED_BACK: {rec.rollbackSummary}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`text-[9px] block font-bold uppercase ${
                          rec.status === 'completed' ? 'text-emerald-600' :
                          rec.status === 'rolled_back' ? 'text-amber-500' : 'text-rose-600'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs font-mono">
                  No execution records available.
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="bg-white border border-zinc-200 rounded-md p-4 space-y-4 max-h-[280px] overflow-y-auto">
              <div>
                <h4 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                  Automated Recurring Calendars
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">View queued campaign schedules or continuous loops.</p>
              </div>

              {snapshot?.schedules && snapshot.schedules.length > 0 ? (
                <div className="space-y-2">
                  {snapshot.schedules.map((sched: any) => (
                    <div key={sched.id} className="p-2.5 bg-zinc-50 rounded border border-zinc-150 text-[11px] font-mono space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <strong className="text-zinc-800 uppercase block font-bold">SCHEDULER_{sched.id.substring(6, 12)}</strong>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          sched.status === 'active' ? 'text-indigo-600 bg-indigo-50 border-indigo-200' :
                          sched.status === 'triggered' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                          'text-zinc-500 bg-zinc-100 border-zinc-200'
                        }`}>
                          {sched.status}
                        </span>
                      </div>
                      <div className="text-zinc-500 text-[10px] space-y-0.5">
                        <div>RECURRING: <span className="font-bold text-zinc-700 uppercase">{sched.scheduleType}</span></div>
                        {sched.scheduleDate && <div>DATE: <span className="font-bold text-zinc-700">{new Date(sched.scheduleDate).toLocaleString()}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs font-mono">
                  No scheduling triggers set. Configure timing options above during approval.
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
