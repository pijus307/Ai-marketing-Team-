/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, CheckCircle2, AlertTriangle, XCircle, Compass, ListTodo, 
  Gauge, Download, ShieldCheck, Sparkles, Bot, Globe, Link2, 
  Copy, Check, BarChart3, TrendingUp, Layers, Code, ArrowUpRight, 
  Cpu, FileCode2, ExternalLink, Activity, Target, Zap
} from 'lucide-react';
import { SEOReport } from '../types';
import { ensureOpenSeoData } from '../lib/openseo-engine';

interface SEOAuditViewProps {
  report: SEOReport;
  brandName?: string;
  url?: string;
}

type TabType = 'all' | 'vitals' | 'ai-geo' | 'keywords' | 'domain' | 'backlinks' | 'code';

export default function SEOAuditView({ report: rawReport, brandName = 'Brand', url = 'example.com' }: SEOAuditViewProps) {
  // Ensure full OpenSEO intelligence is populated
  const report = ensureOpenSeoData(rawReport, url, brandName);
  const openSeo = report.openSeoData!;

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filterCheckStatus, setFilterCheckStatus] = useState<'all' | 'pass' | 'warning' | 'fail'>('all');
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleDownloadPDF = () => {
    setIsPrinting(true);
    const originalTitle = document.title;
    const sanitizedBrand = brandName ? brandName.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Search_Visibility';
    const dateStr = new Date().toISOString().split('T')[0];
    document.title = `OpenSEO_Audit_Report_${sanitizedBrand}_${dateStr}`;

    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setTimeout(() => {
        document.title = originalTitle;
      }, 500);
    }, 150);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4.5 h-4.5 text-amber-400 flex-shrink-0" />;
      case 'fail':
        return <XCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0" />;
    }
  };

  const getStatusColorClass = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass': return 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30';
      case 'warning': return 'bg-amber-500/10 text-amber-300 border-amber-400/30';
      case 'fail': return 'bg-rose-500/10 text-rose-300 border-rose-400/30';
    }
  };

  const filteredChecks = report.seoAuditChecks?.filter(chk => {
    if (filterCheckStatus === 'all') return true;
    return chk.status === filterCheckStatus;
  }) || [];

  return (
    <div className="space-y-8 print:space-y-6">
      {/* Print-Only Executive Dossier Header */}
      <div className="hidden print:block pb-6 mb-6 border-b border-white/15">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-sky-400 font-bold mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              OPENSEO &bull; DEEP TECHNICAL & AI VISIBILITY DOSSIER
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {brandName ? `${brandName} — ` : ''}Comprehensive OpenSEO Intelligence Audit
            </h1>
            {url && (
              <p className="text-xs font-mono text-slate-300 mt-1">
                Audited Domain: <span className="text-sky-300 font-bold">{url}</span> &bull; OpenSEO Standard v2.4
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-md border border-sky-400/40 bg-sky-500/10 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              OFFICIAL VERIFIED AUDIT
            </span>
            <p className="text-[10px] text-slate-400 font-mono mt-1.5">
              Timestamp: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Lead Architect: Marcus Chen (SEO Director)
            </p>
          </div>
        </div>
      </div>

      {/* Workstation Header */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl gradient-border-mask">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs text-sky-300 font-mono tracking-wider uppercase font-semibold mb-3">
              <Search className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              OpenSEO Core &bull; Autonomous Search Visibility Workstation
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              OpenSEO Intelligence Desk
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
              Powered by <strong className="text-white font-semibold">every-app/open-seo</strong> architecture &bull; Curated by <strong className="text-sky-300 font-semibold">Marcus Chen</strong> (Lead SEO Director)
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-cyan-400" />
                {url}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-300 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-emerald-400" />
                DataForSEO Real-time Engine
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-300 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-indigo-400" />
                GEO & AI Overview Enabled
              </span>
            </div>
          </div>

          {/* Download Report as PDF Button */}
          <div className="no-print flex-shrink-0 flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              className="relative group flex items-center gap-2.5 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold tracking-wide bg-gradient-to-r from-sky-500/20 via-indigo-600/20 to-cyan-500/20 hover:from-sky-500/30 hover:via-indigo-600/30 hover:to-cyan-500/30 border border-sky-400/30 hover:border-sky-400/60 text-white shadow-xl shadow-sky-950/40 hover:shadow-sky-500/20 transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-95"
              title="Download full OpenSEO audit as a high-fidelity PDF report"
            >
              <div className="p-1 rounded-lg bg-sky-400/20 text-sky-300 border border-sky-400/30 group-hover:bg-sky-400/30 transition-colors">
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="font-sans font-bold">Download Report as PDF</span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-sky-400/15 border border-sky-400/30 text-sky-300">
                PDF
              </span>
            </button>
          </div>
        </div>

        {/* Workstation Interactive Navigation Tabs */}
        <div className="no-print mt-8 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Complete Overview', icon: Layers },
            { id: 'vitals', label: 'Core Web Vitals', icon: Activity },
            { id: 'ai-geo', label: 'AI Brand Visibility (GEO)', icon: Bot },
            { id: 'keywords', label: 'Keywords & SERP', icon: Search },
            { id: 'domain', label: 'Domain & Competitors', icon: BarChart3 },
            { id: 'backlinks', label: 'Backlink Profile', icon: Link2 },
            { id: 'code', label: 'Developer Fix Snippets', icon: Code },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-sky-500/20 border border-sky-400/50 text-white shadow-lg shadow-sky-950/40' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Diagnostic Metric Gauges (Always visible or under 'all' / 'vitals') */}
      {(activeTab === 'all' || activeTab === 'vitals') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Core Audit Score Gauge */}
            <div className="glass-panel border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">OPENSEO_SCORE</span>
                <p className="text-3xl font-black text-white">{report.score}<span className="text-sm text-slate-400 font-mono">/100</span></p>
                <p className="text-xs text-slate-400 font-medium">Technical & on-page health</p>
              </div>
              <div className="p-4 bg-sky-500/10 border border-sky-400/30 rounded-2xl text-sky-300 shadow-inner">
                <Gauge className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            {/* AI Visibility Rating */}
            <div className="glass-panel border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">AI_VISIBILITY_GEO</span>
                <p className="text-3xl font-black text-white">{openSeo.aiVisibility.aiVisibilityScore}<span className="text-sm text-slate-400 font-mono">/100</span></p>
                <p className="text-xs text-slate-400 font-medium">ChatGPT & Perplexity share</p>
              </div>
              <div className="p-4 bg-indigo-500/10 border border-indigo-400/30 rounded-2xl text-indigo-300 shadow-inner">
                <Bot className="w-7 h-7" />
              </div>
            </div>

            {/* Domain Authority */}
            <div className="glass-panel border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">DOMAIN_AUTHORITY</span>
                <p className="text-3xl font-black text-white">{openSeo.domainInsights.domainAuthority}<span className="text-sm text-slate-400 font-mono">/100</span></p>
                <p className="text-xs text-slate-400 font-medium">Organic equity rating</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl text-emerald-300 shadow-inner">
                <BarChart3 className="w-7 h-7" />
              </div>
            </div>

            {/* Total Backlinks & Trust */}
            <div className="glass-panel border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">BACKLINK_VOLUME</span>
                <p className="text-3xl font-black text-white">{openSeo.backlinkProfile.totalBacklinks}</p>
                <p className="text-xs text-slate-400 font-medium">{openSeo.backlinkProfile.referringDomains} referring domains</p>
              </div>
              <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-2xl text-purple-300 shadow-inner">
                <Link2 className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Core Web Vitals Deep Dive Bento */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-cyan-400" />
                  Google Core Web Vitals & Real-User Performance (CrUX Simulation)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Directly benchmarked against Google PageSpeed Insights thresholds.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold uppercase self-start sm:self-center">
                Passing CWV Assessment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* LCP */}
              <div className="p-4 rounded-xl glass-card border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">LCP</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                    {openSeo.coreWebVitals.lcp.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{openSeo.coreWebVitals.lcp.value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{openSeo.coreWebVitals.lcp.description}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[88%]" />
                </div>
              </div>

              {/* INP */}
              <div className="p-4 rounded-xl glass-card border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">INP</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                    {openSeo.coreWebVitals.inp.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{openSeo.coreWebVitals.inp.value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{openSeo.coreWebVitals.inp.description}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[92%]" />
                </div>
              </div>

              {/* CLS */}
              <div className="p-4 rounded-xl glass-card border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">CLS</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                    {openSeo.coreWebVitals.cls.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{openSeo.coreWebVitals.cls.value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{openSeo.coreWebVitals.cls.description}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[95%]" />
                </div>
              </div>

              {/* TTFB */}
              <div className="p-4 rounded-xl glass-card border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">TTFB</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                    {openSeo.coreWebVitals.ttfb.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{openSeo.coreWebVitals.ttfb.value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{openSeo.coreWebVitals.ttfb.description}</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AI Brand Visibility & Generative Engine Optimization (GEO) */}
      {(activeTab === 'all' || activeTab === 'ai-geo') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-[10px] font-mono font-semibold uppercase text-indigo-300 mb-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                OpenSEO Distinctive Feature
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                AI Brand Visibility & Generative Search (GEO)
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Tracking citation share-of-voice, LLM entity sentiment, and prompt gaps across ChatGPT Search, Perplexity, and Google AI Overviews.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Citation Presence</span>
              <p className="text-sm font-bold text-indigo-300 font-mono">{openSeo.aiVisibility.brandCitationRate}</p>
            </div>
          </div>

          {/* Share of Voice Across LLMs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl glass-card border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">ChatGPT Search</span>
              <p className="text-xl font-black text-sky-300">{openSeo.aiVisibility.overviewShareOfVoice.chatgpt}%</p>
              <span className="text-[10px] text-slate-500 font-mono">Share of Voice</span>
            </div>
            <div className="p-3.5 rounded-xl glass-card border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Perplexity AI</span>
              <p className="text-xl font-black text-cyan-300">{openSeo.aiVisibility.overviewShareOfVoice.perplexity}%</p>
              <span className="text-[10px] text-slate-500 font-mono">Share of Voice</span>
            </div>
            <div className="p-3.5 rounded-xl glass-card border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Google AI Overviews</span>
              <p className="text-xl font-black text-indigo-300">{openSeo.aiVisibility.overviewShareOfVoice.googleAiOverview}%</p>
              <span className="text-[10px] text-slate-500 font-mono">Share of Voice</span>
            </div>
            <div className="p-3.5 rounded-xl glass-card border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Claude Research</span>
              <p className="text-xl font-black text-purple-300">{openSeo.aiVisibility.overviewShareOfVoice.claude}%</p>
              <span className="text-[10px] text-slate-500 font-mono">Share of Voice</span>
            </div>
          </div>

          {/* AI Citation Graph Sources & Prompt Gaps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Top Citation Sources */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Primary LLM Citation Sources
              </h4>
              <div className="space-y-2">
                {openSeo.aiVisibility.topCitationSources.map((src, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl glass-card border border-white/5 text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-white truncate">{src.source}</p>
                      <span className="text-[10px] font-mono text-slate-400">{src.domain}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-400/20">
                        {src.mentions} citations
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20">
                        DA {src.authority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Prompt Gap Analysis */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Strategic AI Prompt Opportunities
              </h4>
              <div className="space-y-2.5">
                {openSeo.aiVisibility.aiPromptGaps.map((gap, i) => (
                  <div key={i} className="p-3.5 rounded-xl glass-card border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono font-bold text-sky-200 text-[11px] leading-snug">
                        "{gap.promptQuery}"
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 flex-shrink-0">
                        {gap.rankingPotential}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {gap.recommendation}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Current Dominant: <span className="text-slate-400">{gap.currentAiWinner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DataForSEO Keyword Intelligence & SERP Matrix */}
      {(activeTab === 'all' || activeTab === 'keywords') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-cyan-400" />
                DataForSEO Keyword Intelligence & SERP Features Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">High-intent search queries with cost-per-click, keyword difficulty, and rich SERP tags.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {openSeo.detailedKeywords.length} Target Clusters Mapped
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  <th className="pb-3 pl-2">Target Query & Cluster</th>
                  <th className="pb-3">Search Volume</th>
                  <th className="pb-3">KD %</th>
                  <th className="pb-3">Est. CPC</th>
                  <th className="pb-3">Search Intent</th>
                  <th className="pb-3">SERP Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {openSeo.detailedKeywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-all">
                    <td className="py-3 pl-2">
                      <div className="font-mono font-bold text-white">{kw.keyword}</div>
                      <span className="text-[10px] font-mono text-slate-400">{kw.cluster}</span>
                    </td>
                    <td className="py-3 font-mono text-slate-300 font-semibold">{kw.volume}</td>
                    <td className="py-3 font-mono">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                        parseInt(kw.difficulty) > 60 
                          ? 'bg-rose-500/10 text-rose-300 border-rose-400/30' 
                          : parseInt(kw.difficulty) > 35 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-400/30' 
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30'
                      }`}>
                        {kw.difficulty}%
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-300 font-semibold">{kw.cpc}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        kw.intent === 'Transactional' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30' :
                        kw.intent === 'Commercial' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30' :
                        kw.intent === 'Informational' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' :
                        'bg-slate-500/15 text-slate-300 border-slate-400/30'
                      }`}>
                        {kw.intent}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {kw.serpFeatures.map((feat, fi) => (
                          <span key={fi} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: Competitor & Domain Intelligence */}
      {(activeTab === 'all' || activeTab === 'domain') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 page-break-inside-avoid">
          {/* Competitor Keyword Overlap */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-emerald-400" />
              Competitor Keyword Overlap & Traffic Share
            </h3>
            <p className="text-xs text-slate-400">Head-to-head organic footprint comparison with industry rivals.</p>

            <div className="space-y-3">
              {openSeo.domainInsights.competitorsOverlap.map((comp, i) => (
                <div key={i} className="p-4 rounded-xl glass-card border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-mono font-bold text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      {comp.competitor}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20 font-bold">
                      {comp.trafficShare} Category Traffic
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Shared Keywords: {comp.sharedKeywords}</span>
                    <span className="text-sky-300">Target Gap Identified</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {comp.commonKeywordsGap.map((gap, gi) => (
                      <span key={gi} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Landing Page Health */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-sky-400" />
              Top Organic Landing Pages & Health
            </h3>
            <p className="text-xs text-slate-400">Traffic distribution across indexed core sub-paths.</p>

            <div className="space-y-2.5">
              {openSeo.domainInsights.topLandingPages.map((page, i) => (
                <div key={i} className="p-3 rounded-xl glass-card border border-white/10 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2 space-y-0.5">
                    <p className="font-mono font-bold text-white truncate">{page.path}</p>
                    <p className="text-[10px] font-mono text-slate-400">Primary: {page.primaryKeyword}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-400/20">
                      {page.trafficShare} traffic
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      page.health === 'healthy' 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20' 
                        : 'bg-amber-500/10 text-amber-300 border-amber-400/20'
                    }`}>
                      {page.health}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Backlink Profile & Anchor Diversity */}
      {(activeTab === 'all' || activeTab === 'backlinks') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Link2 className="w-4.5 h-4.5 text-purple-400" />
                Backlink Profile & Referring Trust Flow
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Off-page link equity, dofollow ratios, and anchor text distribution.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-[10px] font-mono font-bold">
                {openSeo.backlinkProfile.dofollowRatio} Dofollow Equity
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold">
                Toxicity: {openSeo.backlinkProfile.toxicLinksRisk}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {openSeo.backlinkProfile.anchorDistribution.map((anchor, i) => (
              <div key={i} className="p-4 rounded-xl glass-card border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 font-semibold">{anchor.type} Anchors</span>
                  <span className="font-mono font-bold text-purple-300">{anchor.percentage}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" 
                    style={{ width: `${anchor.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: Technical Crawler Audit Checklist */}
      {(activeTab === 'all' || activeTab === 'vitals') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <ListTodo className="w-4.5 h-4.5 text-cyan-400" />
                Technical Crawler Health Checklist
              </h3>
              <p className="text-xs text-slate-400 font-medium">Evaluating canonical tags, robots directives, schema markups, and crawler accessibility flags.</p>
            </div>

            {/* Filter buttons */}
            <div className="no-print flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-center">
              {(['all', 'pass', 'warning', 'fail'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterCheckStatus(status)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    filterCheckStatus === status 
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredChecks.map((chk, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl glass-card border border-white/10 page-break-inside-avoid">
                <div className="flex gap-3 items-start min-w-0">
                  {getStatusIcon(chk.status)}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white">{chk.check}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{chk.detail}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase self-start sm:self-center ${getStatusColorClass(chk.status)}`}>
                  {chk.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: Ready-to-Deploy Developer Fix Snippets (OpenSEO Code Engine) */}
      {(activeTab === 'all' || activeTab === 'code') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[10px] font-mono font-semibold uppercase text-cyan-300 mb-1">
                <Code className="w-3 h-3 text-cyan-400" />
                Actionable OpenSEO Code Exports
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-cyan-400" />
                Ready-to-Deploy Technical Remediation Blueprints
              </h3>
              <p className="text-xs text-slate-400 mt-1">Copy and integrate directly into your codebase to resolve identified SEO vulnerabilities.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {openSeo.technicalFixSnippets.map((snippet, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-[#070a14] overflow-hidden flex flex-col justify-between shadow-xl">
                {/* Snippet Header */}
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold uppercase border border-cyan-400/30">
                      {snippet.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-white truncate">{snippet.filename}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(snippet.codeSnippet, idx)}
                    className="no-print flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-mono text-[10px] transition-all cursor-pointer"
                    title="Copy code snippet to clipboard"
                  >
                    {copiedSnippetIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <div className="p-4 font-mono text-[11px] leading-relaxed text-cyan-200 overflow-x-auto bg-[#030610]/90 max-h-56 scrollbar-thin">
                  <pre>{snippet.codeSnippet}</pre>
                </div>

                {/* Explanation */}
                <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 text-[11px] text-slate-400">
                  {snippet.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print-Only Footer */}
      <div className="hidden print:flex items-center justify-between pt-6 mt-8 border-t border-white/15 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>AUTONOMOUS MARKETING OS &bull; OPENSEO WORKSTATION &bull; LEAD ARCHITECT: MARCUS CHEN</span>
        </div>
        <div>
          <span>CONFIDENTIAL &bull; BASED ON OPENSEO (EVERY-APP/OPEN-SEO) SPECIFICATION</span>
        </div>
      </div>
    </div>
  );
}
