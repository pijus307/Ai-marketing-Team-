/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  ShieldAlert,
  Zap,
  DollarSign,
  TrendingUp,
  BarChart3,
  Swords,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Copy,
  Download,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import {
  CompetitorResearchReport,
  CompetitorProfile,
  generateFallbackCompetitorReport
} from '../lib/competitor-research-engine';

interface CompetitorResearchViewProps {
  onboardedUrl?: string;
  brandName?: string;
  industry?: string;
  onNavigateToTab?: (tabId: string) => void;
}

export default function CompetitorResearchView({
  onboardedUrl = 'https://stripe.com',
  brandName,
  industry,
  onNavigateToTab
}: CompetitorResearchViewProps) {
  const [targetUrl, setTargetUrl] = useState(onboardedUrl || 'https://stripe.com');
  const [activeBrandName, setActiveBrandName] = useState(brandName || '');
  const [activeIndustry, setActiveIndustry] = useState(industry || '');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CompetitorResearchReport | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'matrix' | 'profiles' | 'benchmark' | 'playbook' | 'grounding'>('matrix');
  const [selectedCompetitorIdx, setSelectedCompetitorIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Quick preset sample domains
  const PRESET_DOMAINS = [
    { label: 'Stripe (Fintech/Payments)', url: 'https://stripe.com', brand: 'Stripe', ind: 'Fintech & Payment Infrastructure' },
    { label: 'Linear (Productivity/SaaS)', url: 'https://linear.app', brand: 'Linear', ind: 'B2B SaaS Issue Tracking' },
    { label: 'Shopify (E-Commerce)', url: 'https://shopify.com', brand: 'Shopify', ind: 'E-Commerce Platforms' },
    { label: 'Figma (Design/Collaboration)', url: 'https://figma.com', brand: 'Figma', ind: 'Collaborative Design Tools' }
  ];

  // Initial load
  useEffect(() => {
    runCompetitorAnalysis(targetUrl, activeBrandName, activeIndustry);
  }, []);

  // Update when parent props change
  useEffect(() => {
    if (onboardedUrl && onboardedUrl !== targetUrl) {
      setTargetUrl(onboardedUrl);
      if (brandName) setActiveBrandName(brandName);
      if (industry) setActiveIndustry(industry);
      runCompetitorAnalysis(onboardedUrl, brandName, industry);
    }
  }, [onboardedUrl, brandName, industry]);

  const runCompetitorAnalysis = async (urlToScan: string, brand?: string, ind?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/competitor/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlToScan,
          brandName: brand,
          industry: ind
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      } else {
        setReport(generateFallbackCompetitorReport(urlToScan, brand, ind));
      }
    } catch (err) {
      console.warn('[COMPETITOR VIEW] Failed to fetch live report, using client fallback:', err);
      setReport(generateFallbackCompetitorReport(urlToScan, brand, ind));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const text = `
# Competitor Research & Intelligence Report for ${report.brandName} (${report.targetUrl})
Industry: ${report.industry}
Grounded with Google Search: ${report.groundedWithGoogleSearch ? 'YES' : 'Offline Baseline'}

## Executive Summary
${report.executiveSummary}

## Top 3 Identified Competitors
${report.competitors.map((c, i) => `
### ${i + 1}. ${c.name} (${c.website})
- Market Share: ${c.marketShareEstimate} | Estimated Visits: ${c.estimatedMonthlyVisits} | Domain Authority: ${c.domainAuthority}/100
- Positioning: ${c.positioning}
- Pricing: ${c.pricingModel} (${c.pricingRange})
- Ad Channels: ${c.primaryAdChannels.join(', ')} (Est. Spend: ${c.estimatedMonthlyAdSpend})
- Strengths: ${c.strengths.join('; ')}
- Weaknesses: ${c.weaknesses.join('; ')}
- Exploitable Vulnerabilities: ${c.exploitableVulnerabilities.join('; ')}
- Counter-Attack Strategy: ${c.counterAttackStrategy}
`).join('\n')}

## Strategic Recommendations
${report.strategicRecommendations.map((r, i) => `
${i + 1}. **${r.title}** (${r.category} - Impact: ${r.impact}, Effort: ${r.effort})
${r.description}
Action Items:
${r.actionItems.map(a => `  - ${a}`).join('\n')}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-research-${report.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredMatrix = report?.comparisonMatrix.filter(row => {
    if (categoryFilter === 'all') return true;
    return row.category === categoryFilter;
  }) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Top Banner & Search Controller */}
      <div className="glass-panel border border-cyan-500/30 rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-slate-900/90 via-cyan-950/20 to-slate-950 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Google Search Grounded
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-purple-400" />
                  Top 3 Competitor Intelligence
                </span>
                {report?.groundedWithGoogleSearch && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Web Grounding
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Competitor Research & Intelligence
              </h1>
              <p className="text-sm text-slate-400 max-w-3xl">
                Scan live web signals via Google Search to uncover your top 3 competitors, compare critical metrics side-by-side, analyze ad spend channels, and exploit tactical market vulnerabilities.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                onClick={handleCopyReport}
                disabled={!report || loading}
                className="px-3.5 py-2 rounded-xl glass-card border border-white/10 hover:border-cyan-400/50 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all hover:bg-cyan-500/10 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? 'Copied Dossier!' : 'Copy Dossier'}</span>
              </button>
              <button
                onClick={handleDownloadJSON}
                disabled={!report || loading}
                className="px-3.5 py-2 rounded-xl glass-card border border-white/10 hover:border-purple-400/50 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all hover:bg-purple-500/10 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>JSON Export</span>
              </button>
            </div>
          </div>

          {/* Search URL Input Bar */}
          <div className="glass-panel border border-white/10 rounded-2xl p-3 bg-slate-950/60 shadow-inner flex flex-col md:flex-row gap-3 items-stretch">
            <div className="flex-1 relative">
              <Globe className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter target website URL (e.g. https://yourbrand.com)..."
                className="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>
            <div className="w-full md:w-56">
              <input
                type="text"
                value={activeIndustry}
                onChange={(e) => setActiveIndustry(e.target.value)}
                placeholder="Industry (e.g. B2B SaaS)"
                className="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => runCompetitorAnalysis(targetUrl, activeBrandName, activeIndustry)}
              disabled={loading || !targetUrl}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Grounding with Google Search...' : 'Run Competitor Scan'}</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
            </span>
            {PRESET_DOMAINS.map(p => (
              <button
                key={p.url}
                onClick={() => {
                  setTargetUrl(p.url);
                  setActiveBrandName(p.brand);
                  setActiveIndustry(p.ind);
                  runCompetitorAnalysis(p.url, p.brand, p.ind);
                }}
                className={`px-3 py-1 rounded-lg border font-mono transition-all cursor-pointer whitespace-nowrap ${
                  targetUrl === p.url
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 font-bold'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveViewTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewTab === 'matrix'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Side-by-Side Comparison Matrix</span>
          </button>
          <button
            onClick={() => setActiveViewTab('profiles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewTab === 'profiles'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Top 3 Competitor Dossiers</span>
          </button>
          <button
            onClick={() => setActiveViewTab('benchmark')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewTab === 'benchmark'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Radar & Dimension Scores</span>
          </button>
          <button
            onClick={() => setActiveViewTab('playbook')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewTab === 'playbook'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Counter-Attack Playbook</span>
          </button>
          <button
            onClick={() => setActiveViewTab('grounding')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeViewTab === 'grounding'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                : 'glass-card border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Google Search Grounding & Sources ({report?.citations.length || 0})</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="glass-panel border border-cyan-500/30 rounded-3xl p-12 text-center space-y-4 bg-slate-900/60 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">Synthesizing Google Search Grounding Data...</h3>
            <p className="text-sm text-slate-400">
              Querying live web sources for {targetUrl}, extracting competitor traffic rankings, pricing models, and ad spend allocation...
            </p>
          </div>
        </div>
      )}

      {report && !loading && (
        <>
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel border border-cyan-500/30 rounded-2xl p-5 bg-gradient-to-br from-cyan-500/10 to-slate-900/80 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Target Brand</span>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">{report.brandName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  DA {report.targetBrandMetrics.domainAuthority}/100
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{report.targetUrl}</p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Est. Visits:</span>
                <span className="text-white font-bold">{report.targetBrandMetrics.estimatedMonthlyVisits}</span>
              </div>
            </div>

            {report.competitors.map((comp, idx) => (
              <div
                key={comp.name}
                onClick={() => {
                  setSelectedCompetitorIdx(idx);
                  setActiveViewTab('profiles');
                }}
                className={`glass-panel border rounded-2xl p-5 transition-all cursor-pointer group ${
                  idx === 0
                    ? 'border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-slate-900/80 hover:border-purple-400'
                    : idx === 1
                    ? 'border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 to-slate-900/80 hover:border-indigo-400'
                    : 'border-pink-500/40 bg-gradient-to-br from-pink-500/10 to-slate-900/80 hover:border-pink-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Competitor #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">
                    {comp.marketShareEstimate} Share
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors mt-1">
                  {comp.name}
                </h3>
                <p className="text-xs text-slate-400 truncate">{comp.website}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono mt-2">
                  <span className="text-slate-500">DA {comp.domainAuthority}/100</span>
                  <span className="text-white font-bold">{comp.estimatedMonthlyVisits}</span>
                </div>
              </div>
            ))}
          </div>

          {/* TAB 1: SIDE-BY-SIDE COMPARISON MATRIX */}
          {activeViewTab === 'matrix' && (
            <div className="space-y-6">
              <div className="glass-panel border border-white/10 rounded-3xl p-6 lg:p-8 bg-slate-900/80 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      Side-by-Side Competitive Benchmark Matrix
                    </h3>
                    <p className="text-xs text-slate-400">
                      Comparing {report.brandName} directly against all 3 major rivals across traffic, authority, pricing, and ad footprints.
                    </p>
                  </div>

                  {/* Filter by Category */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-bold">
                      <Filter className="w-3.5 h-3.5" /> Filter:
                    </span>
                    {['all', 'SEO & Traffic', 'Monetization & Pricing', 'Brand & Authority', 'Content & Ads'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                          categoryFilter === cat
                            ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold'
                            : 'bg-slate-950 border border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat === 'all' ? 'All Metrics' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-5 font-bold">Evaluation Metric</th>
                        <th className="py-4 px-5 font-bold text-cyan-300 bg-cyan-950/30 border-x border-cyan-500/20">
                          {report.brandName} (Your Brand)
                        </th>
                        <th className="py-4 px-5 font-bold text-purple-300">
                          1. {report.competitors[0]?.name}
                        </th>
                        <th className="py-4 px-5 font-bold text-indigo-300">
                          2. {report.competitors[1]?.name}
                        </th>
                        <th className="py-4 px-5 font-bold text-pink-300">
                          3. {report.competitors[2]?.name}
                        </th>
                        <th className="py-4 px-5 font-bold text-emerald-400">Category Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {filteredMatrix.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-5 font-semibold text-slate-200">
                            <div>{row.metric}</div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">{row.category}</span>
                          </td>
                          <td className="py-4 px-5 font-mono text-white bg-cyan-950/20 border-x border-cyan-500/20 font-bold">
                            {row.yourBrand}
                          </td>
                          <td className="py-4 px-5 font-mono text-slate-300">
                            {row.competitor1}
                          </td>
                          <td className="py-4 px-5 font-mono text-slate-300">
                            {row.competitor2}
                          </td>
                          <td className="py-4 px-5 font-mono text-slate-300">
                            {row.competitor3}
                          </td>
                          <td className="py-4 px-5 font-mono font-bold">
                            <span className={`px-2 py-0.5 rounded-full border text-[11px] ${
                              row.advantage === 'Your Brand'
                                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                                : 'bg-slate-800 border-white/10 text-slate-300'
                            }`}>
                              {row.advantage}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPETITOR DOSSIERS & PROFILES */}
          {activeViewTab === 'profiles' && (
            <div className="space-y-6">
              {/* Selector Pills */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {report.competitors.map((comp, idx) => (
                  <button
                    key={comp.name}
                    onClick={() => setSelectedCompetitorIdx(idx)}
                    className={`px-5 py-3 rounded-2xl border text-left transition-all cursor-pointer flex-1 min-w-[240px] ${
                      selectedCompetitorIdx === idx
                        ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-slate-900 border-cyan-400 text-white shadow-xl glow-cyan'
                        : 'glass-card border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold">Competitor #{idx + 1}</span>
                      <span className="text-slate-400">{comp.marketShareEstimate} Share</span>
                    </div>
                    <div className="text-base font-black text-white mt-1">{comp.name}</div>
                    <div className="text-xs text-slate-400 truncate">{comp.website}</div>
                  </button>
                ))}
              </div>

              {/* Active Competitor Dossier */}
              {(() => {
                const comp = report.competitors[selectedCompetitorIdx] || report.competitors[0];
                return (
                  <div className="glass-panel border border-white/10 rounded-3xl p-6 lg:p-8 bg-slate-900/80 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs font-bold">
                            Competitor Dossier #{selectedCompetitorIdx + 1}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Est. Monthly Traffic: <strong className="text-white">{comp.estimatedMonthlyVisits}</strong>
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Domain Authority: <strong className="text-cyan-400">{comp.domainAuthority}/100</strong>
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
                          {comp.name}
                          <a
                            href={comp.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 p-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 max-w-2xl">{comp.positioning}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1 self-start md:self-auto min-w-[200px]">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Ad Spend & Channel</span>
                        <div className="text-base font-black text-emerald-400 font-mono">{comp.estimatedMonthlyAdSpend}</div>
                        <div className="text-[11px] text-slate-400">{comp.primaryAdChannels.join(', ')}</div>
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Pricing & Monetization */}
                      <div className="glass-card border border-white/10 rounded-2xl p-5 space-y-3 bg-slate-950/60">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                          <DollarSign className="w-4 h-4" /> Pricing & Monetization
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-sm font-bold text-white">{comp.pricingModel}</div>
                          <div className="text-xs font-mono text-cyan-300 font-bold">{comp.pricingRange}</div>
                        </div>
                      </div>

                      {/* SEO & Organic Reach */}
                      <div className="glass-card border border-white/10 rounded-2xl p-5 space-y-3 bg-slate-950/60">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                          <TrendingUp className="w-4 h-4" /> Top Organic Keywords
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {comp.topOrganicKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">Content Velocity: {comp.contentVelocity}</p>
                      </div>

                      {/* Primary Ad Channels */}
                      <div className="glass-card border border-white/10 rounded-2xl p-5 space-y-3 bg-slate-950/60">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                          <Layers className="w-4 h-4" /> Paid Media Strategy
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {comp.primaryAdChannels.map((ch, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* SWOT & Vulnerabilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths & Weaknesses */}
                      <div className="space-y-4">
                        <div className="glass-card border border-emerald-500/20 rounded-2xl p-5 bg-emerald-950/10 space-y-2">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Key Competitor Strengths
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {comp.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="glass-card border border-rose-500/20 rounded-2xl p-5 bg-rose-950/10 space-y-2">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Competitor Weaknesses & Flaws
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {comp.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-rose-400 font-bold">✕</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Counter-Attack Strategy */}
                      <div className="glass-card border border-amber-500/30 rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 to-slate-950 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-400" />
                            Counter-Attack Strategy & Exploitable Vulnerabilities
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                            High ROI
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {comp.counterAttackStrategy}
                        </p>

                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <span className="text-[11px] font-mono text-amber-400 uppercase font-bold block">
                            Tactical Vulnerabilities to Exploit:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {comp.exploitableVulnerabilities.map((v, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold">⚡</span>
                                <span>{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: RADAR & DIMENSION SCORES */}
          {activeViewTab === 'benchmark' && (
            <div className="glass-panel border border-white/10 rounded-3xl p-6 lg:p-8 bg-slate-900/80 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Multidimensional Benchmark Scores (0 - 100)
                </h3>
                <p className="text-xs text-slate-400">
                  Quantitative scoring across Organic Reach, Brand Authority, Content Depth, Pricing Competitiveness, Paid Aggressiveness, and Feature Completeness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: 'organicReach', label: 'Organic Reach & Traffic Volume' },
                  { key: 'brandAuthority', label: 'Brand & Domain Authority' },
                  { key: 'contentDepth', label: 'Content Depth & Topical Authority' },
                  { key: 'pricingCompetitiveness', label: 'Pricing Competitiveness' },
                  { key: 'paidAggressiveness', label: 'Paid Media Aggressiveness' },
                  { key: 'featureCompleteness', label: 'Feature & Automation Density' }
                ].map(metric => (
                  <div key={metric.key} className="glass-card border border-white/10 rounded-2xl p-5 bg-slate-950/60 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                      {metric.label}
                    </h4>

                    <div className="space-y-2.5">
                      {/* Your brand */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-300 font-bold">{report.brandName} (You)</span>
                          <span className="text-cyan-400 font-bold">
                            {(report.targetBrandMetrics.benchmarkScores as any)[metric.key]}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 transition-all rounded-full"
                            style={{ width: `${(report.targetBrandMetrics.benchmarkScores as any)[metric.key]}%` }}
                          />
                        </div>
                      </div>

                      {/* Competitor 1 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-purple-300">{report.competitors[0]?.name}</span>
                          <span className="text-purple-400 font-bold">
                            {(report.competitors[0]?.benchmarkScores as any)[metric.key]}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-400 transition-all rounded-full"
                            style={{ width: `${(report.competitors[0]?.benchmarkScores as any)[metric.key]}%` }}
                          />
                        </div>
                      </div>

                      {/* Competitor 2 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-indigo-300">{report.competitors[1]?.name}</span>
                          <span className="text-indigo-400 font-bold">
                            {(report.competitors[1]?.benchmarkScores as any)[metric.key]}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-400 transition-all rounded-full"
                            style={{ width: `${(report.competitors[1]?.benchmarkScores as any)[metric.key]}%` }}
                          />
                        </div>
                      </div>

                      {/* Competitor 3 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-pink-300">{report.competitors[2]?.name}</span>
                          <span className="text-pink-400 font-bold">
                            {(report.competitors[2]?.benchmarkScores as any)[metric.key]}/100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-400 transition-all rounded-full"
                            style={{ width: `${(report.competitors[2]?.benchmarkScores as any)[metric.key]}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COUNTER-ATTACK PLAYBOOK */}
          {activeViewTab === 'playbook' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.strategicRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="glass-panel border border-white/10 rounded-3xl p-6 bg-slate-900/80 space-y-4 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                          {rec.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className="text-amber-400 font-bold">Impact: {rec.impact}</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-slate-400">Effort: {rec.effort}</span>
                        </div>
                      </div>

                      <h4 className="text-base font-black text-white">{rec.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

                      <div className="space-y-1.5 pt-3 border-t border-white/5">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Action Roadmap:</span>
                        <ul className="space-y-1 text-xs text-slate-400">
                          {rec.actionItems.map((act, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE SEARCH GROUNDING CITATIONS */}
          {activeViewTab === 'grounding' && (
            <div className="glass-panel border border-white/10 rounded-3xl p-6 lg:p-8 bg-slate-900/80 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-400" />
                    Google Search Grounding Queries & Live Web Citations
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live telemetry demonstrating search queries dispatched by Gemini to verify market data, citations, and competitor pricing.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
                  {report.groundedWithGoogleSearch ? 'Live Search Active' : 'Offline Baseline Data'}
                </span>
              </div>

              {/* Search queries executed */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Search Queries Executed via Google Search Tool:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {report.searchQueriesExecuted.map((query, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-xl border border-white/5 font-mono text-xs text-emerald-300 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{query}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citations & Sources */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Grounding Web Citations ({report.citations.length}):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.citations.map((cite, i) => (
                    <a
                      key={i}
                      href={cite.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl glass-card border border-white/10 hover:border-cyan-400/50 transition-all group bg-slate-950/60 block space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Citation #{i + 1}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {cite.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">{cite.uri}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
