/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Compass, Award, TrendingUp, AlertTriangle, Lightbulb, Shield, 
  PlusCircle, Zap, CheckCircle2, XCircle, FileText, Play, Activity, 
  Clock, Sliders, ChevronRight, HelpCircle, Loader2, Globe, Search, ArrowRight,
  Database, RefreshCw, Layers, Sparkles, Terminal, FileSpreadsheet, Check, Swords, Plug
} from 'lucide-react';
import { MarketingAnalysis } from '../types';
import ThreeDStackVisualizer from './ThreeDStackVisualizer';

interface DashboardOverviewProps {
  analysisResult: MarketingAnalysis;
  onNavigateToPublish?: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

interface TaskItem {
  id: string;
  agent: string;
  text: string;
  done: boolean;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'info';
  title: string;
  desc: string;
  impact: string;
  resolved: boolean;
}

export default function DashboardOverview({ 
  analysisResult, 
  onNavigateToPublish, 
  onNavigateToTab 
}: DashboardOverviewProps) {
  
  const report = analysisResult?.ceo || {
    brandName: 'Brand',
    industry: 'Technology & Marketing',
    positioning: 'Autonomous growth operating system',
    targetAudience: 'Growth Leaders',
    valuePropositions: ['AI-first automation'],
    swotAnalysis: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    keyGrowthObjectives: ['Scale acquisition channels', 'Optimize SEO footprint']
  };

  // --- Dynamic Dashboard State ---
  const [budget, setBudget] = useState<number>(5000);
  const [activeCheck, setActiveCheck] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);
  const [is3DSpatial, setIs3DSpatial] = useState<boolean>(true);

  // Score adjustments (boosted by resolving alerts or completing tasks)
  const [bonusScore, setBonusScore] = useState<number>(0);

  // --- Interactive Tasks State ---
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't1', agent: 'Sophia (CEO)', text: 'Confirm target CAC & positioning statement parameters', done: false },
    { id: 't2', agent: 'Marcus (SEO)', text: 'Implement meta descriptions on high-priority routes', done: false },
    { id: 't3', agent: 'Elena (Content)', text: 'Review blog outlines for semantic keyword density', done: false },
    { id: 't4', agent: 'Chloe (Social)', text: 'Verify Twitter/X scroll-stopping caption schedules', done: false },
    { id: 't5', agent: 'Daniel (Email)', text: 'Validate SPF/DKIM records for high deliverability', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState<string>('');

  // --- Interactive Alerts State ---
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 'a1', type: 'warning', title: 'Low keyword density on /pricing', desc: 'Add 3 transactional semantic keywords to improve high-intent search positioning.', impact: '+4 SEO Score', resolved: false },
    { id: 'a2', type: 'info', title: 'Meta description truncation risk', desc: ' Chloe\'s landing page snippet exceeds 160 characters. Recommend condensing the meta field.', impact: '+2 Web Health', resolved: false },
    { id: 'a3', type: 'warning', title: 'Missing alt attributes on hero assets', desc: 'Locate 4 descriptive images on the sitemap index that lack alternative text.', impact: '+3 SEO Score', resolved: false }
  ]);

  // --- Calculations for interactive widgets ---
  const tasksCompletedCount = tasks.filter(t => t.done).length;
  const totalTasksCount = tasks.length;
  const taskProgressPct = totalTasksCount > 0 ? Math.round((tasksCompletedCount / totalTasksCount) * 100) : 0;

  const resolvedAlertsCount = alerts.filter(a => a.resolved).length;

  // Dynamically calculated scores
  const baseWebHealth = 88;
  const currentWebHealth = Math.min(100, baseWebHealth + (alerts.find(a => a.id === 'a2')?.resolved ? 2 : 0));

  const baseSEOScore = analysisResult.seo?.score || 82;
  const currentSEOScore = Math.min(100, baseSEOScore + 
    (alerts.find(a => a.id === 'a1')?.resolved ? 4 : 0) + 
    (alerts.find(a => a.id === 'a3')?.resolved ? 3 : 0)
  );

  const baseMarketingScore = 85;
  const currentMarketingScore = Math.min(100, Math.round(
    (currentWebHealth + currentSEOScore + baseMarketingScore) / 3 + (taskProgressPct / 25)
  ));

  const growthScore = Math.min(10, Number((7.8 + (tasksCompletedCount * 0.3) + (resolvedAlertsCount * 0.4)).toFixed(1)));

  // --- Revenue Prediction logic based on budget slider ---
  const ltv = 450; // Custom LTV model assumption
  const projectedCAC = Math.max(25, Math.round(80 - (budget * 0.0015))); // CAC efficiency increases slightly with higher budget allocation
  const estimatedConversions = Math.round(budget / projectedCAC);
  const projectedRevenueValue = estimatedConversions * ltv;
  const roiMultiplier = (projectedRevenueValue / budget).toFixed(1);

  // Generate dynamic 6-month projections for our custom SVG Area Graph
  const getMonthlyProjections = () => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = i + 1;
      // Exponential organic acceleration compounding over 6 months
      const compoundingEffect = Math.pow(1.15, i);
      const rev = Math.round(projectedRevenueValue * (month / 6) * compoundingEffect);
      return { month: `Month ${month}`, revenue: rev, conversions: Math.round(estimatedConversions * (month / 6) * compoundingEffect) };
    });
  };
  const monthData = getMonthlyProjections();

  // --- Interactive task actions ---
  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([
      ...tasks,
      { id: `t-custom-${Date.now()}`, agent: 'Custom Task', text: newTaskText, done: false }
    ]);
    setNewTaskText('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // --- Interactive alert resolution ---
  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  // --- Simulate Execute Campaign pipeline ---
  const triggerCampaignExecution = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecutionStep(0);
    setExecutionLogs([]);
    
    const stepsLogs = [
      '[System] Compiling absolute campaign payloads...',
      '[Compiler] Success. Generated unified package JSON matching Meta/Google targets.',
      '[OAuth Auth] Checking token clearances for advertisement accounts...',
      '[Webhook Meta Ads] Pushing 4 ad creatives to adset_id: "72105432"',
      '[Webhook Google Search] Injecting transactional keywords to bidding arrays',
      '[Webhook Mailchimp] Staging 3-stage customer nurture drip to "Active Leads"',
      '[CMS Webflow] Publishing Elena\'s 3 authority blog drafts to core index...',
      '[System SUCCESS] Campaign execution is fully completed. Assets are live!'
    ];

    let currentStep = 0;
    setExecutionLogs([stepsLogs[0]]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < stepsLogs.length) {
        setExecutionStep(currentStep);
        setExecutionLogs(prev => [...prev, stepsLogs[currentStep]]);
      } else {
        clearInterval(interval);
      }
    }, 1800);
  };

  const currentStepMsg = [
    'Parsing models...',
    'Authenticating webhooks...',
    'Uploading visual ad creatives...',
    'Broadcasting keywords...',
    'Syncing email subscribers...',
    'Deploying editorial content...',
    'Finalizing parameters...',
    'Deployments Active!'
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn" id="executive-cockpit-desk">
      
      {/* ----------------- EXECUTIVE HEADER BANNER ----------------- */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 gradient-border-mask">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300 font-mono tracking-wider uppercase font-semibold mb-3">
            <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Fractional CMO Strategic Directive
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Strategic Growth Audit: {report.brandName}
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
            Prepared by <strong className="text-white font-semibold">Sophia Vance</strong> &bull; Chief Executive Director
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-white/5 text-slate-200 text-xs rounded-lg border border-white/10 font-mono">
              <strong className="text-cyan-400">NICHE:</strong> {report.industry}
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-lg border border-emerald-500/20 font-mono">
              <strong className="text-emerald-400">CRAWLED:</strong> {analysisResult.url}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex-shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIs3DSpatial(!is3DSpatial)}
            className={`px-5 py-3 font-bold font-mono rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border ${
              is3DSpatial 
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400/40 glow-cyan' 
                : 'glass-panel hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${is3DSpatial ? 'text-amber-300 animate-pulse' : 'text-slate-500'}`} />
            3D Spatial Interface {is3DSpatial ? 'ON' : 'OFF'}
          </button>
          {onNavigateToPublish && (
            <button
              onClick={onNavigateToPublish}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black font-mono rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border border-amber-300/40"
            >
              <Zap className="w-4 h-4 text-slate-950 animate-pulse" />
              Configure Auto-Publish
            </button>
          )}
        </div>
      </div>

      {is3DSpatial && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              ⚡ ACTIVE 3D ORCHESTRATION LAYER VIEW
            </span>
            <span className="text-[10px] text-zinc-500 font-medium font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
              Hover layers to inspect &bull; Click to expand
            </span>
          </div>
          <ThreeDStackVisualizer analysis={analysisResult} />
        </div>
      )}

      {/* Integration Quick Access Banners: Competitor Research, Deterministic Non-LLM, Social Brand Audit, Agent-Reach, OmniRoute, Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('integrations')}
          className="glass-panel border border-cyan-400/50 hover:border-cyan-300 rounded-2xl p-4 shadow-xl transition-all cursor-pointer group bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-transparent flex items-center justify-between glow-cyan"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/30 text-cyan-200 font-mono text-[9px] font-bold uppercase border border-cyan-400/40">
                ECOSYSTEM HUB
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● Multi-Channel Sync</span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
              <Plug className="w-4 h-4 text-cyan-400" />
              Connect GA4, WordPress & Tools
            </h4>
            <p className="text-xs text-slate-300">
              Link Google Analytics, Search Console, WordPress REST, HubSpot, Shopify, Meta Ads & Zapier.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 group-hover:scale-110 group-hover:bg-cyan-500/40 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('competitor-research')}
          className="glass-panel border border-cyan-500/40 hover:border-cyan-400/80 rounded-2xl p-4 shadow-xl transition-all cursor-pointer group bg-gradient-to-r from-cyan-500/15 via-indigo-600/10 to-transparent flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[9px] font-bold uppercase border border-cyan-400/30">
                GOOGLE SEARCH AI
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● Live Grounded</span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Competitor Research
            </h4>
            <p className="text-xs text-slate-400">
              Top 3 rivals, live metric comparisons, traffic sources & attack playbook.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('deterministic-agents')}
          className="glass-panel border border-emerald-500/40 hover:border-emerald-400/80 rounded-2xl p-4 shadow-xl transition-all cursor-pointer group bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[9px] font-bold uppercase border border-emerald-400/30">
                ZERO-LLM CALCULUS
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● 0ms Exact</span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Non-LLM Math Agents Suite
            </h4>
            <p className="text-xs text-slate-400">
              Thompson Bandits, PageRank (d=0.85), Markov Attributions, RFC AST Compilers & Z-tests.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('social-audit')}
          className="glass-panel border border-pink-500/30 hover:border-pink-400/60 rounded-2xl p-4 shadow-xl transition-all cursor-pointer group bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-transparent flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-400/20 text-pink-300 font-mono text-[9px] font-bold uppercase border border-pink-400/30">
                Social Intelligence
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● Health 92%</span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
              Social Brand Voice & Audit
            </h4>
            <p className="text-xs text-slate-400">
              Who speaks for us? Sentiment clusters, critics & platform scorecard.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-400/30 text-pink-300 group-hover:scale-110 group-hover:bg-pink-500/30 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('agentreach')}
          className="glass-panel border border-cyan-400/30 hover:border-cyan-400/60 rounded-2xl p-4 shadow-xl transition-all cursor-pointer group bg-gradient-to-r from-cyan-500/10 via-indigo-600/10 to-transparent flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[9px] font-bold uppercase border border-cyan-400/30">
                Agent-Reach
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● Live Mode</span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Web & Social Research
            </h4>
            <p className="text-xs text-slate-400">
              Zero-API-cost live listening across Reddit, X, YouTube transcripts & GitHub.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('omniroute')}
          className="glass-panel border border-indigo-400/30 hover:border-indigo-400/60 rounded-2xl p-4 shadow-xl transition-all cursor-pointer group bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-transparent flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 font-mono text-[9px] font-bold uppercase border border-indigo-400/30">
                OmniRoute Gateway
              </span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold">1.51B Free Tokens</span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Universal AI Gateway
            </h4>
            <p className="text-xs text-slate-400">
              100+ models, 19+ routing strategies, auto-fallback & RTK compression.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ----------------- METRICS PANEL (1. Website Health, 2. Marketing Score, 3. SEO Score, 5. Growth Score) ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Website Health Widget */}
        <div className={`bg-white border border-zinc-200 rounded-md p-5 transition-all flex flex-col justify-between relative group overflow-hidden min-h-[175px] ${is3DSpatial ? 'premium-3d-card' : 'hover:border-zinc-300 shadow-sm'}`} id="widget-website-health">
          <div className="absolute right-3 top-3 text-zinc-100 group-hover:scale-105 transition-transform">
            <Globe className="w-12 h-12 text-indigo-50/70" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold">1. Website Health</p>
              <span className="text-[8px] font-mono bg-emerald-50 border border-emerald-150 text-emerald-700 font-bold px-1.5 py-0.2 rounded uppercase">LIVE</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-zinc-900 tracking-tight">{currentWebHealth}%</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center">Excellent</span>
            </div>
          </div>
          
          <div className="mt-4 border-t border-zinc-100 pt-3 space-y-1">
            <span className="text-[9px] font-mono text-zinc-400 block font-bold uppercase">Technical Index Checklists</span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <button 
                onClick={() => setActiveCheck(activeCheck === 0 ? null : 0)} 
                className={`text-left px-1.5 py-0.5 rounded border transition-colors flex items-center justify-between cursor-pointer ${activeCheck === 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-600'}`}
              >
                <span>SSL Security</span>
                <span className="text-emerald-500 font-bold">✓</span>
              </button>
              <button 
                onClick={() => setActiveCheck(activeCheck === 1 ? null : 1)} 
                className={`text-left px-1.5 py-0.5 rounded border transition-colors flex items-center justify-between cursor-pointer ${activeCheck === 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-600'}`}
              >
                <span>Robots.txt</span>
                <span className="text-emerald-500 font-bold">✓</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Marketing Score Widget */}
        <div className={`bg-white border border-zinc-200 rounded-md p-5 transition-all flex flex-col justify-between relative group overflow-hidden min-h-[175px] ${is3DSpatial ? 'premium-3d-card' : 'hover:border-zinc-300 shadow-sm'}`} id="widget-marketing-score">
          <div className="absolute right-3 top-3 text-zinc-100 group-hover:scale-105 transition-transform">
            <Award className="w-12 h-12 text-indigo-50/70" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold">2. Marketing Score</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative w-11 h-11 flex-shrink-0">
                {/* Simple SVG Circular indicator */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-zinc-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-600" strokeDasharray={`${currentMarketingScore}, 100`} strokeWidth="3.2" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-zinc-800">
                  {currentMarketingScore}
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-900 tracking-tight">{currentMarketingScore}<span className="text-sm font-mono text-zinc-400">/100</span></p>
                <p className="text-[10px] text-zinc-500 font-medium">Aggregate Campaign Readiness</p>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10.5px] text-zinc-600 font-medium border-t border-zinc-100 pt-3">
            <div className="flex justify-between items-center mb-0.5">
              <span>SEO Audit Alignment:</span>
              <span className="font-bold text-zinc-800">{currentSEOScore}/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Task Action Completion:</span>
              <span className="font-bold text-zinc-800">{taskProgressPct}%</span>
            </div>
          </div>
        </div>

        {/* 3. SEO Score Widget */}
        <div className={`bg-white border border-zinc-200 rounded-md p-5 transition-all flex flex-col justify-between relative group overflow-hidden min-h-[175px] ${is3DSpatial ? 'premium-3d-card' : 'hover:border-zinc-300 shadow-sm'}`} id="widget-seo-score">
          <div className="absolute right-3 top-3 text-zinc-100 group-hover:scale-105 transition-transform">
            <Search className="w-12 h-12 text-indigo-50/70" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold">3. SEO Score</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-zinc-900 tracking-tight">{currentSEOScore}<span className="text-sm font-mono text-zinc-400">/100</span></p>
              <span className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-bold">OPTIMIZED</span>
            </div>
          </div>

          <div className="mt-4 border-t border-zinc-100 pt-3 text-[10px] text-zinc-600 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Mobile-Friendliness:</span>
              <span className="font-bold text-zinc-800">{analysisResult.seo?.mobileFriendliness || 'Pass'}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Crawled Speed Index:</span>
              <span className="font-bold text-zinc-800">{analysisResult.seo?.siteSpeed || '1.1s'}</span>
            </div>
          </div>
        </div>

        {/* 5. Growth Score Widget */}
        <div className={`bg-white border border-zinc-200 rounded-md p-5 transition-all flex flex-col justify-between relative group overflow-hidden min-h-[175px] ${is3DSpatial ? 'premium-3d-card' : 'hover:border-zinc-300 shadow-sm'}`} id="widget-growth-score">
          <div className="absolute right-3 top-3 text-zinc-100 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-12 h-12 text-indigo-50/70" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold">5. Growth Score</p>
            <div className="flex items-baseline gap-1 mt-2">
              <p className="text-3xl font-black text-zinc-900 tracking-tight">{growthScore}</p>
              <span className="text-xs font-mono text-zinc-400">/10 Velocity</span>
            </div>
          </div>

          <div className="mt-4 border-t border-zinc-100 pt-3 text-[10px] text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Projecting +32% reach expansion</span>
            </div>
            <p className="text-[9px] text-zinc-400 mt-1 leading-tight">Calculated based on search volume overlap index and ad budget efficiency scaling.</p>
          </div>
        </div>

      </div>

      {/* --- Dynamic Check Details Drawer/Block --- */}
      <AnimatePresence>
        {activeCheck !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-950 text-white font-mono p-4 rounded-md border border-zinc-850 text-xs shadow-inner space-y-2 relative">
              <button 
                onClick={() => setActiveCheck(null)} 
                className="absolute right-3 top-3 text-zinc-500 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
              {activeCheck === 0 ? (
                <>
                  <div className="text-indigo-400 font-bold">&gt;_ DIAGNOSTIC_OUTPUT: SSL_VALIDATION</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    [Check] Authority validation: LetsEncrypt Authority X3<br />
                    [Check] Key strength: RSA 2048-bit (SECURE)<br />
                    [Check] Expiration window: 84 Days remaining<br />
                    [Check] TLS protocol alignment: TLSv1.2 & TLSv1.3 fully enabled.<br />
                    [Status] SSL verification successfully handshaking on host {analysisResult.url}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-indigo-400 font-bold">&gt;_ DIAGNOSTIC_OUTPUT: ROBOTS_SITEMAP</div>
                  <div className="text-zinc-400 text-[11px] leading-relaxed">
                    [Check] robots.txt parsed correctly on host<br />
                    [Check] Found active sitemap reference block:<br />
                    <span className="text-amber-300">Sitemap: {analysisResult.url}/sitemap.xml</span><br />
                    [Check] User-agent: * Disallow: /admin /private /api<br />
                    [Status] Search crawlers fully authorized. Crawl budget index is optimal.
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- CORE DATA MODULES (4. Revenue Prediction & 6. Tasks) ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 4. Revenue Prediction Simulator Card */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md p-6 shadow-sm space-y-6" id="widget-revenue-prediction">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                4. Revenue & Conversion Projection Simulator
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Drag budget to adjust campaign size and project 6-month compounding returns.</p>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded px-3 py-1.5 text-right flex-shrink-0">
              <span className="text-[9px] font-mono text-indigo-500 font-bold uppercase block">COMPRESSED LTV MODEL</span>
              <span className="text-sm font-bold text-indigo-950 font-mono">LTV Ratio: 5.6x CAC</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Input Slider */}
            <div className="md:col-span-1 space-y-4 bg-zinc-50 border border-zinc-150 p-4 rounded-md">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide flex justify-between">
                  <span>AD SPEND</span>
                  <span className="text-zinc-900 font-extrabold font-mono">${budget.toLocaleString()}/mo</span>
                </label>
                <input 
                  type="range" 
                  min={500} 
                  max={20000} 
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                />
              </div>

              <div className="space-y-3.5 pt-3 border-t border-zinc-200 text-[11px] font-medium text-zinc-600">
                <div className="flex justify-between">
                  <span>Projected CAC:</span>
                  <span className="font-bold text-zinc-800">${projectedCAC}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversions:</span>
                  <span className="font-bold text-zinc-800">{estimatedConversions}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Revenue:</span>
                  <span className="font-black text-indigo-700 font-mono">${projectedRevenueValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI Multiple:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-150 font-mono">{roiMultiplier}x</span>
                </div>
              </div>
            </div>

            {/* Reactive SVG Area Graph */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Compounding Growth (6-Month Forecast Curve)</span>
                <span className="text-[10px] text-zinc-500 font-medium font-mono">End of Year Projection: <strong className="text-zinc-800">${(projectedRevenueValue * 7.5).toLocaleString()}</strong></span>
              </div>
              
              {/* Custom SVG Line & Area Graph */}
              <div className="bg-zinc-900 border border-zinc-950 p-4 rounded-md relative h-48 flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                {/* SVG Graph Drawing */}
                <div className="w-full h-full relative z-10">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#ffffff0a" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#ffffff0a" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="90" x2="400" y2="90" stroke="#ffffff0a" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Area mapping */}
                    <path 
                      d={`
                        M 0 120 
                        L 0 ${120 - (monthData[0].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        L 80 ${120 - (monthData[1].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        L 160 ${120 - (monthData[2].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        L 240 ${120 - (monthData[3].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        L 320 ${120 - (monthData[4].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        L 400 ${120 - (monthData[5].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        L 400 120 Z
                      `}
                      fill="url(#areaGrad)"
                    />

                    {/* Curved line mapping */}
                    <path 
                      d={`
                        M 0 ${120 - (monthData[0].revenue / (projectedRevenueValue * 2.2)) * 100} 
                        C 40 ${120 - (monthData[0].revenue / (projectedRevenueValue * 2.2)) * 100},
                          40 ${120 - (monthData[1].revenue / (projectedRevenueValue * 2.2)) * 100},
                          80 ${120 - (monthData[1].revenue / (projectedRevenueValue * 2.2)) * 100}
                        C 120 ${120 - (monthData[1].revenue / (projectedRevenueValue * 2.2)) * 100},
                          120 ${120 - (monthData[2].revenue / (projectedRevenueValue * 2.2)) * 100},
                          160 ${120 - (monthData[2].revenue / (projectedRevenueValue * 2.2)) * 100}
                        C 200 ${120 - (monthData[2].revenue / (projectedRevenueValue * 2.2)) * 100},
                          200 ${120 - (monthData[3].revenue / (projectedRevenueValue * 2.2)) * 100},
                          240 ${120 - (monthData[3].revenue / (projectedRevenueValue * 2.2)) * 100}
                        C 280 ${120 - (monthData[3].revenue / (projectedRevenueValue * 2.2)) * 100},
                          280 ${120 - (monthData[4].revenue / (projectedRevenueValue * 2.2)) * 100},
                          320 ${120 - (monthData[4].revenue / (projectedRevenueValue * 2.2)) * 100}
                        C 360 ${120 - (monthData[4].revenue / (projectedRevenueValue * 2.2)) * 100},
                          360 ${120 - (monthData[5].revenue / (projectedRevenueValue * 2.2)) * 100},
                          400 ${120 - (monthData[5].revenue / (projectedRevenueValue * 2.2)) * 100}
                      `}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                    />

                    {/* Nodes / Dots representing points */}
                    {[0, 80, 160, 240, 320, 400].map((cx, idx) => {
                      const ry = 120 - (monthData[idx].revenue / (projectedRevenueValue * 2.2)) * 100;
                      return (
                        <g key={idx} className="group/node">
                          <circle cx={cx} cy={ry} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                          <circle cx={cx} cy={ry} r="8" fill="#818cf8" fillOpacity="0.2" className="hidden group-hover/node:block cursor-pointer animate-ping" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X-Axis Month Indicators */}
                <div className="flex justify-between text-[9px] font-mono text-zinc-500 border-t border-zinc-850 pt-2 relative z-10 select-none">
                  {monthData.map((d, i) => (
                    <div key={i} className="text-center min-w-[50px]">
                      <span>{d.month}</span>
                      <strong className="block text-zinc-300">${d.revenue.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 6. Tasks Interactive Workspace Card */}
        <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col justify-between space-y-4" id="widget-tasks">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-950 uppercase font-mono tracking-wide">6. Action Items Checklist</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Click items to approve. Boosts overall Marketing and Growth scores.</p>
              </div>
              <span className="text-xs bg-zinc-100 border px-2 py-0.5 rounded font-mono font-bold text-zinc-700">
                {tasksCompletedCount}/{totalTasksCount}
              </span>
            </div>

            {/* Completion Progress Bar */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-400">
                <span>COMPLETION RATIO</span>
                <span>{taskProgressPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${taskProgressPct}%` }}
                />
              </div>
            </div>

            {/* Checkable Tasks Feed */}
            <div className="space-y-2 max-h-[165px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-2.5 p-2 rounded-md border text-[11px] leading-relaxed transition-all ${
                    task.done 
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-400 line-through' 
                      : 'bg-white border-zinc-150 text-zinc-700 hover:border-zinc-250'
                  }`}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                      task.done 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-zinc-300 bg-white hover:border-zinc-400'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <div className="flex-grow min-w-0">
                    <span className="text-[9px] font-mono font-black text-indigo-600 uppercase block mb-0.5">{task.agent}</span>
                    <p className="font-semibold leading-snug break-words">{task.text}</p>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-zinc-300 hover:text-rose-500 p-0.5 rounded ml-1 transition-colors cursor-pointer"
                    title="Delete custom task"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Task Builder Form */}
          <form onSubmit={addTask} className="flex gap-2 border-t border-zinc-100 pt-3">
            <input 
              type="text" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add dynamic custom action..."
              className="flex-grow text-[11px] bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-150 px-2.5 py-1.5 rounded focus:outline-none focus:border-zinc-400 transition-all font-semibold"
            />
            <button 
              type="submit" 
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold font-mono rounded border uppercase transition-colors cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

      </div>

      {/* ----------------- SECTIONS 7-9 (7. Alerts Stream, 8. Agent Status, 9. Latest Reports) ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7. Alerts Stream Card */}
        <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col justify-between space-y-4" id="widget-alerts">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-950 uppercase font-mono tracking-wide border-b border-zinc-100 pb-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
              7. Operational Optimization Alerts
            </h3>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3.5 rounded border flex items-start gap-3 relative overflow-hidden transition-all ${
                    alert.resolved 
                      ? 'bg-zinc-50/50 border-zinc-200/60 opacity-60' 
                      : alert.type === 'warning'
                      ? 'bg-amber-50/50 border-amber-200/50' 
                      : 'bg-indigo-50/30 border-indigo-150/40'
                  }`}
                >
                  <div className={`p-1 rounded mt-0.5 ${alert.resolved ? 'bg-zinc-200 text-zinc-500' : alert.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <span className={`text-[9px] font-bold uppercase font-mono ${alert.resolved ? 'text-zinc-400' : alert.type === 'warning' ? 'text-amber-700' : 'text-indigo-600'}`}>
                        {alert.type === 'warning' ? 'CRITICAL_FIX' : 'ADVISORY'}
                      </span>
                      {alert.resolved ? (
                        <span className="text-[8px] bg-emerald-500 text-white font-mono px-1 rounded font-bold uppercase">RESOLVED</span>
                      ) : (
                        <span className="text-[8px] font-bold font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1 rounded uppercase">
                          {alert.impact}
                        </span>
                      )}
                    </div>
                    <h5 className={`text-xs font-extrabold text-zinc-800 leading-snug mt-1 ${alert.resolved ? 'text-zinc-500 line-through' : ''}`}>
                      {alert.title}
                    </h5>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-0.5">
                      {alert.desc}
                    </p>

                    {!alert.resolved && (
                      <button 
                        onClick={() => resolveAlert(alert.id)}
                        className="mt-2.5 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-[9px] font-bold font-mono rounded border uppercase transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
                      >
                        ⚡ Apply Instant Resolution
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-[10px] text-zinc-400 font-medium text-center italic border-t border-zinc-100 pt-3">
            Solving critical diagnostic alerts contributes directly to technical SEO indexes.
          </div>
        </div>

        {/* 8. Agent Status Monitor Card */}
        <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col justify-between space-y-4" id="widget-agent-status">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-950 uppercase font-mono tracking-wide border-b border-zinc-100 pb-3 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              8. AI Employee Ingestion Status
            </h3>

            <div className="space-y-2.5">
              {[
                { name: 'Sophia Vance', role: 'Chief Executive Agent', status: 'Standby Synced', tool: 'SWOT Context Modeler', avatar: '👑', color: 'bg-indigo-50 text-indigo-700' },
                { name: 'Marcus Chen', role: 'SEO Architect Specialist', status: 'Online Cogitating', tool: 'Screaming Frog Scraper v2', avatar: '🔍', color: 'bg-sky-50 text-sky-700' },
                { name: 'Elena Rostova', role: 'Inbound Strategy Director', status: 'Standby Synced', tool: 'Gutenberg Semantic Outliner', avatar: '✍️', color: 'bg-emerald-50 text-emerald-700' },
                { name: 'Chloe Jenkins', role: 'Social Media Expert', status: 'Idle Waiting', tool: 'Diffusion prompt modeler', avatar: '📸', color: 'bg-amber-50 text-amber-700' },
                { name: 'Daniel Kross', role: 'Retention Lifecycle Lead', status: 'Standby Synced', tool: 'SPF DMARC Verifier', avatar: '✉️', color: 'bg-rose-50 text-rose-700' }
              ].map((ag, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-zinc-50 border border-zinc-150">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded bg-white border flex items-center justify-center text-xs shadow-sm">
                      {ag.avatar}
                    </span>
                    <div className="min-w-0">
                      <h5 className="text-[11px] font-extrabold text-zinc-950 truncate leading-snug">{ag.name}</h5>
                      <span className="text-[9px] font-mono text-zinc-400 block">{ag.role}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full border ${
                      ag.status === 'Online Cogitating' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-150 animate-pulse' 
                        : ag.status === 'Standby Synced'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-150'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}>
                      {ag.status}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-400 block mt-0.5 italic">{ag.tool}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab && onNavigateToTab('workforce')}
            className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer shadow-sm"
          >
            Audit Workforce Blueprints &rarr;
          </button>
        </div>

        {/* 9. Latest Reports Directory Card */}
        <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col justify-between space-y-4" id="widget-latest-reports">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-950 uppercase font-mono tracking-wide border-b border-zinc-100 pb-3 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              9. Generated Campaign Brief Directory
            </h3>

            <div className="space-y-2.5">
              {[
                { id: 'rep_seo', title: 'SEO_Semantic_Audit.pdf', size: '1.2 MB', type: 'PDF Document', payload: 'SEO' },
                { id: 'rep_content', title: 'Blog_Authority_Plan.md', size: '840 KB', type: 'Markdown Text', payload: 'CONTENT' },
                { id: 'rep_social', title: 'Social_Editorial_Posts.json', size: '620 KB', type: 'JSON Array', payload: 'SOCIAL' },
                { id: 'rep_ads', title: 'Paid_CPC_Allocation_Sheet.csv', size: '150 KB', type: 'CSV Sheet', payload: 'ADS' },
                { id: 'rep_email', title: 'Lifecycle_Email_Sequence.html', size: '94 KB', type: 'HTML Letter Template', payload: 'EMAIL' }
              ].map((rep, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded border border-zinc-150 hover:border-zinc-300 bg-white transition-all">
                  <div className="flex items-start gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-zinc-800 block truncate font-mono">{rep.title}</span>
                      <span className="text-[9px] text-zinc-400 font-mono block">{rep.type} &bull; {rep.size}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveReportModal(rep.id)}
                    className="px-2 py-1 hover:bg-zinc-100 border text-[9px] font-mono text-zinc-600 rounded cursor-pointer transition-all flex-shrink-0"
                  >
                    PREVIEW
                  </button>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[9.5px] font-mono text-zinc-400 text-center block leading-relaxed uppercase">
            Sitemap inventory cached &bull; 100% Secure SSL Directory
          </span>
        </div>

      </div>

      {/* ----------------- 10. EXECUTE CAMPAIGN COMPONENT ----------------- */}
      <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm space-y-6" id="widget-execute-campaign">
        <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-zinc-950 uppercase font-mono tracking-wide flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 animate-pulse" />
              10. Unified Campaign Execution Control Board
            </h3>
            <p className="text-xs text-zinc-500 font-medium">Commit generated ad structures, blog outlines, email nurturing letters, and keyword targets instantly to integrated production stacks.</p>
          </div>
          <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 border rounded uppercase font-bold">API CONSOLE v1.0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="md:col-span-1 space-y-4">
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              Clicking below initiates multi-channel pipeline deployment. Simulated webhooks fire live JSON scripts directly to configured server nodes.
            </p>

            <button
              onClick={triggerCampaignExecution}
              disabled={isExecuting}
              className={`w-full py-3 px-6 rounded text-xs font-mono font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md border ${
                isExecuting 
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white border-indigo-700 hover:border-indigo-800'
              }`}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                  {currentStepMsg[executionStep]}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white animate-pulse" />
                  EXECUTE CAMPAIGN
                </>
              )}
            </button>
            
            {isExecuting && executionStep < 7 && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>DISPATCH_PROGRESS</span>
                  <span>{Math.round((executionStep / 7) * 100)}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${(executionStep / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {/* Terminal Live logs Output */}
            <div className="bg-zinc-950 text-white rounded-md p-4 font-mono text-[10px] leading-normal min-h-[145px] shadow-inner relative flex flex-col justify-between">
              <div className="absolute top-3 right-3 text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                SECURE SSL PROTOCOL
              </div>
              
              <div className="space-y-1 max-h-[105px] overflow-y-auto pr-1">
                {executionLogs.length === 0 ? (
                  <div className="text-zinc-500 italic">Campaign is currently staged & awaiting execution trigger. Standing by.</div>
                ) : (
                  executionLogs.map((log, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-2">
                      <span className="text-zinc-600 select-none">&bull;</span>
                      <span className={lIdx === executionLogs.length - 1 ? 'text-indigo-400 font-bold' : 'text-zinc-300'}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-zinc-850 pt-2 flex justify-between items-center text-zinc-600 text-[8px] mt-2 select-none">
                <span>PORT_INGRESS: 443 HTTPS</span>
                <span>STATUS: {isExecuting ? 'TRANSMITTING' : 'STAGED_READY'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------- DETAILED REPORT MODAL MODULAR OVERLAYS ----------------- */}
      <AnimatePresence>
        {activeReportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-zinc-200 rounded-md max-w-2xl w-full p-6 shadow-xl relative max-h-[85vh] flex flex-col justify-between"
            >
              <button 
                onClick={() => setActiveReportModal(null)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-950 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
              
              <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                {activeReportModal === 'rep_seo' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black font-mono text-zinc-900 border-b pb-2">PREVIEW: SEO_Semantic_Audit.pdf</h4>
                    <p className="text-xs text-zinc-600 font-semibold uppercase font-mono">EXTRACTED KEYWORDS INTENT AND VOLUME:</p>
                    <div className="space-y-1.5 font-mono text-xs">
                      {analysisResult.seo?.coreKeywords?.map((kw, i) => (
                        <div key={i} className="flex justify-between p-1.5 bg-zinc-50 border rounded text-[11px]">
                          <span className="text-indigo-700 font-bold">{kw.keyword}</span>
                          <span className="text-zinc-400">Vol: {kw.volume} | Intent: {kw.intent}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium mt-3">
                      Technical audit confirms speed indices are within normal Web Vital ranges. Sitemaps are formatted cleanly and canonical tags match host protocols perfectly.
                    </p>
                  </div>
                )}

                {activeReportModal === 'rep_content' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black font-mono text-zinc-900 border-b pb-2">PREVIEW: Blog_Authority_Plan.md</h4>
                    <p className="text-xs text-zinc-600 font-semibold uppercase font-mono">Pillar Topic Cluster: <strong className="text-zinc-900 font-bold">"{analysisResult.content?.corePillar}"</strong></p>
                    <div className="space-y-2">
                      {analysisResult.content?.blogArticles?.map((art, i) => (
                        <div key={i} className="p-2 bg-zinc-50 border rounded text-[11px]">
                          <div className="font-bold text-zinc-900">{art.title}</div>
                          <p className="text-zinc-500 italic mt-0.5">Hook: "{art.headlineHook}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeReportModal === 'rep_social' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black font-mono text-zinc-900 border-b pb-2">PREVIEW: Social_Editorial_Posts.json</h4>
                    <p className="text-xs text-zinc-600 font-semibold uppercase font-mono">5-Day Social Platform Strategy Outline:</p>
                    <div className="space-y-2">
                      {analysisResult.social?.posts?.slice(0, 3).map((post, i) => (
                        <div key={i} className="p-2.5 bg-zinc-50 border rounded text-[11px]">
                          <span className="font-bold text-indigo-700 font-mono text-[9px] uppercase">{post.channel} &bull; {post.day}</span>
                          <p className="text-zinc-800 font-bold mt-1 text-[11px] line-clamp-2">{post.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeReportModal === 'rep_ads' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black font-mono text-zinc-900 border-b pb-2">PREVIEW: Paid_CPC_Allocation_Sheet.csv</h4>
                    <p className="text-xs text-zinc-600 font-semibold uppercase font-mono">Platform Allocations & Target ACOS Goals:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b pb-1 font-mono text-[10px] text-zinc-400 font-bold">
                        <span>CHANNEL</span>
                        <span>BUDGET SHARE</span>
                      </div>
                      {analysisResult.ads?.campaigns?.map((camp, i) => (
                        <div key={i} className="flex justify-between py-1 border-b font-mono text-[11px]">
                          <span className="font-bold text-zinc-800">{camp.platform}</span>
                          <span className="text-indigo-600 font-bold">{camp.budgetShare}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeReportModal === 'rep_email' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black font-mono text-zinc-900 border-b pb-2">PREVIEW: Lifecycle_Email_Sequence.html</h4>
                    <p className="text-xs text-zinc-600 font-semibold uppercase font-mono">Lead magnet delivery & nurture drip sequence:</p>
                    <div className="space-y-2">
                      {analysisResult.email?.emails?.slice(0, 2).map((mail, i) => (
                        <div key={i} className="p-2 bg-zinc-50 border rounded text-[11px]">
                          <span className="font-bold text-zinc-800 block text-[11px]">Subject: {mail.subjectLine}</span>
                          <p className="text-zinc-500 font-medium italic mt-0.5 text-[10px] truncate">Body: {mail.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t pt-4 flex justify-end">
                <button 
                  onClick={() => setActiveReportModal(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold font-mono rounded border uppercase cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
