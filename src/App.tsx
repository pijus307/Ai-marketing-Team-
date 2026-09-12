/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, Search, FileText, Share2, DollarSign, Target, Mail, 
  MessageSquare, Globe, ArrowRight, RefreshCw, AlertCircle, Laptop, Landmark, ChevronRight, Layers, Zap, Network, Sliders, Code2, Terminal, Command, Cpu, CheckCircle2, Activity, Menu, X, Radio, Swords
} from 'lucide-react';

import { MarketingAnalysis, RunStep } from './types';
import AgentDiagram from './components/AgentDiagram';
import DashboardOverview from './components/DashboardOverview';
import SEOAuditView from './components/SEOAuditView';
import ContentStrategyView from './components/ContentStrategyView';
import SocialCalendarView from './components/SocialCalendarView';
import SocialBrandAuditView from './components/SocialBrandAuditView';
import AdCampaignsView from './components/AdCampaignsView';
import LeadGenView from './components/LeadGenView';
import EmailSequenceView from './components/EmailSequenceView';
import AgentPlayground from './components/AgentPlayground';
import WorkforceMatrixView from './components/WorkforceMatrixView';
import AutoPublishConsole from './components/AutoPublishConsole';
import CrawlDiscoveryFlow from './components/CrawlDiscoveryFlow';
import AIProvidersView from './components/AIProvidersView';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';
import { PromptStudioView } from './components/PromptStudioView';
import { FloatingAICopilot } from './components/FloatingAICopilot';
import { FuturisticBackground3D } from './components/FuturisticBackground3D';
import AgentReachView from './components/AgentReachView';
import OmniRouteView from './components/OmniRouteView';
import AdvancedAgentsSuiteView from './components/AdvancedAgentsSuiteView';
import DeterministicAgentsSuiteView from './components/DeterministicAgentsSuiteView';
import CompetitorResearchView from './components/CompetitorResearchView';

const DEFAULT_STEPS: RunStep[] = [
  { agentId: 'ceo', agentName: 'Sophia Vance', status: 'pending', message: 'Ready to establish positioning & key business growth objectives.' },
  { agentId: 'seo', agentName: 'Marcus Chen', status: 'pending', message: 'Pending CEO strategy to initiate keyword map & crawling vitals.' },
  { agentId: 'content', agentName: 'Elena Rostova', status: 'pending', message: 'Awaiting keywords to outline blog authority pillars.' },
  { agentId: 'social', agentName: 'Chloe Jenkins', status: 'pending', message: 'Standing by to draft caption narratives & 5-day schedule.' },
  { agentId: 'ads', agentName: 'Alex Mercer', status: 'pending', message: 'Awaiting keyword/platform data to allocate acquisition budgets.' },
  { agentId: 'leadgen', agentName: 'Sarah Lin', status: 'pending', message: 'Ready to engineer landing page hooks & lead magnets.' },
  { agentId: 'email', agentName: 'Daniel Kross', status: 'pending', message: 'Standing by to craft lifecycle Welcome & Nurture sequence.' }
];

const PRESET_IDEAS = [
  { url: 'https://linear.app', industry: 'SaaS / DevTools', desc: 'A beautiful, fast project management tool for high-performance software teams.', target: 'Attract enterprise product managers and scale inbound sign-ups.' },
  { url: 'https://www.starbucks.com', industry: 'E-commerce & Coffee Retail', desc: 'Premium coffee house offering customizable espresso beverages and a mobile loyalty app.', target: 'Increase loyalty app downloads and drive digital breakfast orders.' },
  { url: 'https://www.masterclass.com', industry: 'EdTech / Online Subscriptions', desc: 'Streaming platform where anyone can learn from the worlds best creators and experts.', target: 'Reduce trial churn and attract premium corporate subscription plans.' }
];

export default function App() {
  // Onboarding parameters
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [customGoals, setCustomGoals] = useState('');
  const [showWorkforceOnboard, setShowWorkforceOnboard] = useState(false);
  const [showAIProviders, setShowAIProviders] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState<'cheapest' | 'fastest' | 'highest-quality' | 'balanced'>('balanced');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // App orchestration state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MarketingAnalysis | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<RunStep[]>(DEFAULT_STEPS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Desk Navigation
  const [activeTab, setActiveTab] = useState<'ceo' | 'seo' | 'content' | 'social' | 'social-audit' | 'ads' | 'leadgen' | 'email' | 'chat' | 'workforce' | 'publish' | 'ai-providers' | 'workspace' | 'prompts' | 'discovery' | 'agentreach' | 'omniroute' | 'advanced-agents' | 'deterministic-agents' | 'competitor-research'>('ceo');

  // Load simulated step progress during generation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnalyzing && currentStepIndex < steps.length) {
      const duration = currentStepIndex === 0 ? 3000 : 4000;
      timer = setTimeout(() => {
        setSteps(prev => prev.map((step, idx) => {
          if (idx === currentStepIndex) {
            return { 
              ...step, 
              status: 'completed', 
              message: getCompletedLogMessage(step.agentId) 
            };
          }
          if (idx === currentStepIndex + 1) {
            return { 
              ...step, 
              status: 'running', 
              message: getRunningLogMessage(step.agentId) 
            };
          }
          return step;
        }));

        setCurrentStepIndex(prev => prev + 1);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isAnalyzing, currentStepIndex]);

  const getRunningLogMessage = (id: string) => {
    switch (id) {
      case 'seo': return 'Marcus Chen is crawling technical meta tags, speed scores, and mapping buyer intent keywords...';
      case 'content': return 'Elena Rostova is drafting topical pillar architectures and creating detailed article heading sets...';
      case 'social': return 'Chloe Jenkins is formatting narrative scroll-stoppers and scheduling post calendars...';
      case 'ads': return 'Alex Mercer is optimizing PPC targeting pools and splitting Google/Meta spends...';
      case 'leadgen': return 'Sarah Lin is sketching wireframe benefit cards and frictionless conversion hooks...';
      case 'email': return 'Daniel Kross is writing highly-human welcome letters and delay sequences...';
      default: return 'Synthesizing details...';
    }
  };

  const getCompletedLogMessage = (id: string) => {
    switch (id) {
      case 'ceo': return 'Sophia Vance: Positioning mapped. Unit metrics targets established. [OK]';
      case 'seo': return 'Marcus Chen: Site crawled. Core keywords mapped. [OK]';
      case 'content': return 'Elena Rostova: 3 Authority Cluster posts outlined. H2 outlines built. [OK]';
      case 'social': return 'Chloe Jenkins: 5-Day multi-channel social schedule compiled. [OK]';
      case 'ads': return 'Alex Mercer: Paid splits set. High-intent CTR copy drafted. [OK]';
      case 'leadgen': return 'Sarah Lin: Landing copy built. Friction-free opt-in established. [OK]';
      case 'email': return 'Daniel Kross: 3-Part welcome autoresponder fully drafted. [OK]';
      default: return 'Completed.';
    }
  };

  const applyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setUrl(preset.url);
    setIndustry(preset.industry);
    setCompanyDescription(preset.desc);
    setCustomGoals(preset.target);
  };

  const startOrchestration = async () => {
    if (!url) return;
    
    setErrorMsg(null);
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setAnalysisResult(null);
    
    setSteps(DEFAULT_STEPS.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'running' : 'pending',
      message: idx === 0 ? 'Sophia Vance is evaluating competitor sets and aligning brand SWOT metrics...' : s.message
    })));

    try {
      const response = await fetch('/api/marketing/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          industry,
          companyDescription,
          customGoals,
          optimizationMode
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Marketing orchestration failed.');
      }

      const campaignData = await response.json();
      setAnalysisResult(campaignData);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during agency orchestration.');
      setIsAnalyzing(false);
    }
  };

  const forceShowDashboard = () => {
    if (analysisResult) {
      setCurrentStepIndex(steps.length);
      setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCurrentStepIndex(0);
    setSteps(DEFAULT_STEPS);
    setUrl('');
    setIndustry('');
    setCompanyDescription('');
    setCustomGoals('');
    setActiveTab('ceo');
    setShowAIProviders(false);
  };

  const isComplete = Boolean(analysisResult && currentStepIndex >= steps.length);

  const renderActiveDesk = () => {
    if (!analysisResult) return null;

    switch (activeTab) {
      case 'discovery':
        return (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden gradient-border-mask">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300 font-mono tracking-wider uppercase font-semibold mb-3">
                  <Network className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  CRAWL & INGESTION NODE INTERFACE
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Autonomous Ingestion Pipeline
                </h1>
                <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
                  Real-time data extractions, website link graphs, ideal customer personas, and competitor intelligence formulated by Marcus & Sophia.
                </p>
              </div>
            </div>
            <CrawlDiscoveryFlow 
              url={url} 
              industry={industry} 
              analysisResult={analysisResult} 
              isAnalyzing={false} 
              currentStepIndex={steps.length} 
            />
          </div>
        );
      case 'ceo':
        return (
          <DashboardOverview 
            analysisResult={analysisResult} 
            onNavigateToPublish={() => setActiveTab('publish')} 
            onNavigateToTab={(tabId) => setActiveTab(tabId as any)}
          />
        );
      case 'seo':
        return <SEOAuditView report={analysisResult.seo} brandName={analysisResult.ceo?.brandName} url={analysisResult.url || url} />;
      case 'content':
        return <ContentStrategyView report={analysisResult.content} brandName={analysisResult.ceo?.brandName} url={analysisResult.url || url} />;
      case 'social':
        return <SocialCalendarView report={analysisResult.social} onNavigateToAudit={() => setActiveTab('social-audit')} />;
      case 'social-audit':
        return (
          <SocialBrandAuditView 
            onboardedUrl={url} 
            brandName={analysisResult.ceo?.brandName} 
            industry={industry || analysisResult.ceo?.industry} 
            onNavigateToTab={(tabId) => setActiveTab(tabId as any)} 
          />
        );
      case 'ads':
        return <AdCampaignsView report={analysisResult.ads} />;
      case 'leadgen':
        return <LeadGenView report={analysisResult.leadgen} />;
      case 'email':
        return <EmailSequenceView report={analysisResult.email} />;
      case 'chat':
        return <AgentPlayground analysisResult={analysisResult} onboardedUrl={url} onNavigateToPublish={() => setActiveTab('publish')} optimizationMode={optimizationMode} />;
      case 'workforce':
        return <WorkforceMatrixView onboardedUrl={url} onSelectAgentForChat={() => setActiveTab('chat')} />;
      case 'publish':
        return <AutoPublishConsole analysis={analysisResult} />;
      case 'agentreach':
        return (
          <AgentReachView 
            onboardedUrl={url} 
            brandName={analysisResult.ceo?.brandName} 
            industry={industry || analysisResult.ceo?.industry} 
            onInjectHookToAgent={(hook, agent) => {
              setActiveTab('chat');
            }}
          />
        );
      case 'omniroute':
        return <OmniRouteView />;
      case 'advanced-agents':
        return (
          <AdvancedAgentsSuiteView 
            analysisResult={analysisResult} 
            onboardedUrl={url} 
            onSelectAgentForChat={(agentId) => setActiveTab('chat')}
            optimizationMode={optimizationMode}
          />
        );
      case 'deterministic-agents':
        return (
          <DeterministicAgentsSuiteView
            onboardedUrl={url}
            brandName={analysisResult?.ceo?.brandName}
            industry={industry || analysisResult?.ceo?.industry}
            onNavigateToTab={(tabId) => setActiveTab(tabId as any)}
          />
        );
      case 'competitor-research':
        return (
          <CompetitorResearchView
            onboardedUrl={url || analysisResult?.url}
            brandName={analysisResult?.ceo?.brandName}
            industry={industry || analysisResult?.ceo?.industry}
            onNavigateToTab={(tabId) => setActiveTab(tabId as any)}
          />
        );
      case 'ai-providers':
        return <AIProvidersView />;
      case 'workspace':
        return <GoogleWorkspaceHub />;
      case 'prompts':
        return <PromptStudioView />;
      default:
        return (
          <DashboardOverview 
            analysisResult={analysisResult} 
            onNavigateToPublish={() => setActiveTab('publish')} 
            onNavigateToTab={(tabId) => setActiveTab(tabId as any)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-sans antialiased relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 3D Animated Volumetric Environment */}
      <FuturisticBackground3D />

      {/* Top Universal Navbar */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xl transition-all">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-gradient-to-br from-cyan-500/20 via-indigo-600/30 to-purple-600/20 border border-cyan-400/30 rounded-xl shadow-lg text-white group cursor-pointer">
            <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
              <span className="gradient-text-cyan-purple font-mono font-black text-base">MARKETING OS</span>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest font-bold">
                AUTONOMOUS v3.5
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              24-AGENT SQUAD PROTOCOL ACTIVE
            </p>
          </div>
        </div>

        {/* Center Quick Search & Command Bar Trigger */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-400 font-mono shadow-inner hover:border-cyan-500/30 transition cursor-pointer" onClick={() => setActiveTab('prompts')}>
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-200">⌘K</kbd> to launch Prompt Studio</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isComplete) {
                setActiveTab('ai-providers');
              } else {
                setShowAIProviders(!showAIProviders);
                setShowWorkforceOnboard(false);
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg border ${
              (isComplete && activeTab === 'ai-providers') || (!isComplete && showAIProviders)
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 border-cyan-300 text-white glow-cyan'
                : 'glass-panel hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Providers</span>
          </button>

          {isComplete && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs glass-panel px-3.5 py-1.5 rounded-xl font-medium text-slate-300 border border-white/10">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-bold truncate max-w-[180px]" title={url}>{url}</span>
              </div>
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white border border-white/15 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-cyan-400/40"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">NEW BRAND</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          {isComplete && (
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 glass-panel rounded-xl text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Container Frame */}
      <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col justify-center relative z-10">
        
        {/* State 1: Onboarding Entry Hero & Form */}
        {!isAnalyzing && !isComplete && !showWorkforceOnboard && !showAIProviders && (
          <div className="max-w-4xl mx-auto w-full space-y-8 py-4 md:py-8">
            
            {/* Cinematic Hero Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                ✦ AUTONOMOUS MULTI-AGENT MARKETING OPERATING SYSTEM
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight gradient-text-silver max-w-3xl mx-auto"
              >
                Architect & Scale Campaigns with <span className="gradient-text-cyan-purple">24 AI Agents</span>.
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium"
              >
                Input any brand domain. Specialized AI agents instantly crawl technical vitals, design brand strategy, map SEO pillars, draft editorial articles, write ad copy, and compose email sequences.
              </motion.p>
            </div>

            {/* Workforce Banner Link */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="glass-panel glass-panel-hover rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl border border-cyan-500/20 gradient-border-mask"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 flex-shrink-0 shadow-inner">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    Explore 24 Specialized AI Employees
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                    Inspect agent decision loops, tools, APIs, and inter-agent communication matrices.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWorkforceOnboard(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all whitespace-nowrap"
              >
                Workforce Blueprints
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Quick Preset Ideas Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-2xl p-4 shadow-xl border border-white/10"
            >
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-3 text-center font-bold">
                Or load an elite brand preset to evaluate squad execution
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESET_IDEAS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => applyPreset(preset)}
                    className="p-3.5 glass-card hover:bg-white/10 text-left rounded-xl border border-white/10 hover:border-cyan-400/40 transition-all flex items-start gap-3 group cursor-pointer shadow-md hover:-translate-y-0.5"
                  >
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-cyan-400 group-hover:border-cyan-400/50 group-hover:scale-105 transition-all">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate font-mono">{preset.url.replace('https://', '')}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{preset.industry}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Core Onboarding Form Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10 space-y-6 relative overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Domain Entry */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Website Domain URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono font-medium"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">The primary domain our agency agents will crawl and optimize.</p>
                </div>

                {/* Industry niche */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Niche / Market Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. SaaS DevTools, E-commerce Coffee"
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Helps Marcus and Chloe lock in exact keyword targeting.</p>
                </div>

                {/* Company description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block font-mono">
                    Product/Business Description & Value Props (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Briefly explain what you sell, your primary customers, and what makes you unique. If empty, Sophia Vance will infer it from domain context."
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 p-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none font-medium leading-relaxed"
                  />
                </div>

                {/* Goals targets */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block font-mono">
                    Target Campaign Goals & Metrics Focus (Optional)
                  </label>
                  <input
                    type="text"
                    value={customGoals}
                    onChange={(e) => setCustomGoals(e.target.value)}
                    placeholder="e.g. Attract enterprise software clients, double App Store downloads, lower CAC below $25"
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                  />
                </div>

                {/* Optimization Mode */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    AI Optimization & Routing Mode
                  </label>
                  <select
                    value={optimizationMode}
                    onChange={(e) => setOptimizationMode(e.target.value as any)}
                    className="w-full bg-slate-900/90 text-white text-xs rounded-xl border border-white/10 px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-semibold cursor-pointer"
                  >
                    <option value="balanced">Balanced (Optimal latency, quality, and routing)</option>
                    <option value="cheapest">Cheapest (Prioritizes Ollama/Gemini to minimize credits/costs)</option>
                    <option value="fastest">Fastest (Prioritizes low-latency Gemini/NVIDIA Nim pipelines)</option>
                    <option value="highest-quality">Highest Quality (Prioritizes Claude 3.5 / GPT-4o frontier models)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 font-medium">Universal AI Provider Manager dynamically routes agent workloads based on this strategy.</p>
                </div>
              </div>

              {/* Error state */}
              {errorMsg && (
                <div className="p-4 bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs rounded-xl flex items-start gap-3 shadow-lg">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold font-mono uppercase">Agency Assembly Interrupted</strong>
                    <p className="mt-0.5 font-medium">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="button"
                onClick={startOrchestration}
                disabled={!url}
                className="w-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-40 text-white font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-mono cursor-pointer shadow-2xl glow-cyan"
              >
                Assemble AI Growth Squad
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}

        {/* State 1.5: Workforce Blueprints */}
        {!isAnalyzing && !isComplete && showWorkforceOnboard && (
          <div className="max-w-7xl mx-auto w-full space-y-6 py-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                onClick={() => setShowWorkforceOnboard(false)}
                className="px-4 py-2 glass-panel hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg text-slate-200"
              >
                &larr; Back to Onboarding Form
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-400">Evergreen Agency Schema v3.5</span>
            </div>
            <WorkforceMatrixView onboardedUrl={url} />
          </div>
        )}

        {/* State 1.75: AI Providers Settings */}
        {!isAnalyzing && !isComplete && showAIProviders && (
          <div className="max-w-7xl mx-auto w-full space-y-6 py-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                onClick={() => setShowAIProviders(false)}
                className="px-4 py-2 glass-panel hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg text-slate-200"
              >
                &larr; Back to Onboarding Form
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-400">System Configuration &bull; AI Providers</span>
            </div>
            <AIProvidersView />
          </div>
        )}

        {/* State 2: Active Pipeline Screen */}
        {isAnalyzing && !isComplete && (
          <div className="max-w-6xl mx-auto w-full space-y-8 py-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-3 font-mono">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                Orchestrating Specialist Staff Council
              </h2>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto font-medium">
                Sophia, Marcus, Elena, Chloe, Alex, Sarah, and Daniel are running competitive lookups and constructing campaign desks.
              </p>
            </div>

            <CrawlDiscoveryFlow 
              url={url}
              industry={industry}
              analysisResult={analysisResult}
              isAnalyzing={true}
              currentStepIndex={currentStepIndex}
            />

            <AgentDiagram 
              steps={steps} 
              currentStepIndex={currentStepIndex} 
              isAnalyzing={true} 
            />

            {analysisResult && (
              <div className="flex justify-center">
                <button
                  onClick={forceShowDashboard}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 animate-bounce cursor-pointer shadow-2xl glow-cyan"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  ANALYSIS GENERATED - ACCESS DASHBOARD NOW
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 3: Completed Campaign Workspace Hub */}
        {isComplete && (
          <div className="space-y-6 w-full py-2">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Sidebar Desk Navigation */}
              <div className={`lg:block ${mobileSidebarOpen ? 'block' : 'hidden'} glass-panel border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl backdrop-blur-2xl no-print`}>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 font-mono flex items-center justify-between">
                    Agency Desks
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 px-2 font-medium">Navigate campaign modules.</p>
                </div>

                <div className="space-y-1">
                  {/* Sophia Vance CEO */}
                  <button
                    onClick={() => { setActiveTab('ceo'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'ceo'
                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-cyan-400/50 text-white shadow-lg glow-cyan'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Sophia (CEO & Strategy)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'ceo' ? 'rotate-90 text-cyan-400' : ''}`} />
                  </button>

                  {/* Crawl Discovery */}
                  <button
                    onClick={() => { setActiveTab('discovery'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'discovery'
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Network className="w-4 h-4 text-cyan-400" />
                      <span>Discovery Ingestion Graph</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'discovery' ? 'rotate-90 text-cyan-400' : ''}`} />
                  </button>

                  {/* Marcus Chen SEO */}
                  <button
                    onClick={() => { setActiveTab('seo'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'seo'
                        ? 'bg-sky-500/20 border-sky-400/40 text-sky-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-sky-400" />
                      <span>Marcus (SEO Architect)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'seo' ? 'rotate-90 text-sky-400' : ''}`} />
                  </button>

                  {/* Elena Rostova Content */}
                  <button
                    onClick={() => { setActiveTab('content'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'content'
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Elena (Content Director)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'content' ? 'rotate-90 text-emerald-400' : ''}`} />
                  </button>

                  {/* Chloe Jenkins Social */}
                  <button
                    onClick={() => { setActiveTab('social'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'social'
                        ? 'bg-pink-500/20 border-pink-400/40 text-pink-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Share2 className="w-4 h-4 text-pink-400" />
                      <span>Chloe (Social Loops)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'social' ? 'rotate-90 text-pink-400' : ''}`} />
                  </button>

                  {/* Social Brand Voice & Sentiment Audit */}
                  <button
                    onClick={() => { setActiveTab('social-audit'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'social-audit'
                        ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-600/30 border-cyan-400/50 text-cyan-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Social Voice & Audit</span>
                    </div>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-400/30 font-mono font-bold">
                      AUDIT
                    </span>
                  </button>

                  {/* Alex Mercer Ads */}
                  <button
                    onClick={() => { setActiveTab('ads'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'ads'
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span>Alex (Paid Media)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'ads' ? 'rotate-90 text-amber-400' : ''}`} />
                  </button>

                  {/* Sarah Lin Lead Gen */}
                  <button
                    onClick={() => { setActiveTab('leadgen'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'leadgen'
                        ? 'bg-purple-500/20 border-purple-400/40 text-purple-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span>Sarah (CRO & Funnel)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'leadgen' ? 'rotate-90 text-purple-400' : ''}`} />
                  </button>

                  {/* Daniel Kross Email */}
                  <button
                    onClick={() => { setActiveTab('email'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'email'
                        ? 'bg-blue-500/20 border-blue-400/40 text-blue-200 shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>Daniel (Lifecycle Mail)</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'email' ? 'rotate-90 text-blue-400' : ''}`} />
                  </button>

                  {/* Auto Publisher */}
                  <button
                    onClick={() => { setActiveTab('publish'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between border cursor-pointer mt-2 ${
                      activeTab === 'publish'
                        ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-400/60 text-white shadow-xl'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Execute & Auto-Publish</span>
                    </div>
                    <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                      AUTO
                    </span>
                  </button>

                  <div className="h-[1px] bg-white/10 my-3" />

                  {/* Chat Playground */}
                  <button
                    onClick={() => { setActiveTab('chat'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'chat'
                        ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-600/30 border-cyan-400/50 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span>Agency Chat Room</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-400/30 font-mono font-bold">
                      LIVE
                    </span>
                  </button>

                  {/* AI Workforce Matrix */}
                  <button
                    onClick={() => { setActiveTab('workforce'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'workforce'
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border-purple-400/50 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>AI Workforce Matrix</span>
                    </div>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-400/30 font-mono font-bold">
                      24 AGENTS
                    </span>
                  </button>

                  {/* Specialist Strategies (GEO, Video, Influencer, PLG, Local) */}
                  <button
                    onClick={() => { setActiveTab('advanced-agents'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'advanced-agents'
                        ? 'bg-gradient-to-r from-teal-500/30 to-rose-500/30 border-teal-400/50 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>Specialist Workbench</span>
                    </div>
                    <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full border border-teal-400/30 font-mono font-bold">
                      GEO & VIDEO
                    </span>
                  </button>

                  {/* Pure Deterministic / Non-LLM Algorithmic Suite */}
                  <button
                    onClick={() => { setActiveTab('deterministic-agents'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'deterministic-agents'
                        ? 'bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-purple-600/30 border-emerald-400/50 text-white shadow-lg glow-cyan'
                        : 'glass-card border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Non-LLM Math Agents</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-400/40 font-mono font-bold tracking-wider">
                      ZERO-LLM
                    </span>
                  </button>

                  {/* Competitor Research (Google Search Grounded) */}
                  <button
                    onClick={() => { setActiveTab('competitor-research'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'competitor-research'
                        ? 'bg-gradient-to-r from-cyan-500/30 via-indigo-600/30 to-purple-600/30 border-cyan-400 text-white shadow-xl glow-cyan'
                        : 'glass-card border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Swords className="w-4 h-4 text-cyan-400" />
                      <span>Competitor Research</span>
                    </div>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-400/40 font-mono font-bold tracking-wider">
                      SEARCH AI
                    </span>
                  </button>

                  {/* Agent-Reach Social & Web Research */}
                  <button
                    onClick={() => { setActiveTab('agentreach'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'agentreach'
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border-cyan-400/50 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Agent-Reach Research</span>
                    </div>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-400/30 font-mono font-bold">
                      ZERO-COST
                    </span>
                  </button>

                  {/* OmniRoute Universal AI Gateway */}
                  <button
                    onClick={() => { setActiveTab('omniroute'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'omniroute'
                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-400/50 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>OmniRoute AI Gateway</span>
                    </div>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full border border-indigo-400/30 font-mono font-bold">
                      100+ MODELS
                    </span>
                  </button>

                  {/* Google Workspace Hub */}
                  <button
                    onClick={() => { setActiveTab('workspace'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer mt-1.5 ${
                      activeTab === 'workspace'
                        ? 'bg-blue-600/30 border-blue-400/50 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>Google Workspace OS</span>
                    </div>
                  </button>

                  <div className="h-[1px] bg-white/10 my-3" />

                  <div className="px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Settings</span>
                  </div>

                  {/* AI Providers */}
                  <button
                    onClick={() => { setActiveTab('ai-providers'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'ai-providers'
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200 shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>AI Providers</span>
                    </div>
                  </button>

                  {/* Prompt Studio */}
                  <button
                    onClick={() => { setActiveTab('prompts'); setMobileSidebarOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      activeTab === 'prompts'
                        ? 'bg-purple-500/20 border-purple-400/40 text-purple-200 shadow-lg'
                        : 'glass-card border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span>Prompt Studio</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* Main Desk Content Viewport */}
              <div className="lg:col-span-3 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {renderActiveDesk()}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Persistent Floating Copilot */}
      <FloatingAICopilot />

    </div>
  );
}
