/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquareQuote, 
  Globe, 
  Radio, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Heart, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Filter, 
  AlertTriangle, 
  Flame, 
  Award, 
  CheckCircle2, 
  Send, 
  SlidersHorizontal,
  Zap,
  TrendingDown,
  UserCheck,
  UserX,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SocialBrandAuditReport, 
  BrandVoiceSpeaker, 
  BrandMentionItem 
} from '../types';
import { generateSocialBrandAudit, generateSocialAuditMarkdownDossier } from '../lib/social-brand-audit-engine';

interface SocialBrandAuditViewProps {
  onboardedUrl?: string;
  brandName?: string;
  industry?: string;
  initialReport?: SocialBrandAuditReport;
  onNavigateToTab?: (tabId: string) => void;
}

export default function SocialBrandAuditView({
  onboardedUrl = 'example.com',
  brandName = 'Our Brand',
  industry = 'Technology & SaaS',
  initialReport,
  onNavigateToTab
}: SocialBrandAuditViewProps) {
  // State
  const [timeframe, setTimeframe] = useState<'7 Days' | '30 Days' | '90 Days'>('30 Days');
  const [activeSubTab, setActiveSubTab] = useState<'executive' | 'who-speaks' | 'what-they-say' | 'platforms' | 'mentions' | 'reports'>('executive');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<SocialBrandAuditReport>(() => {
    return initialReport || generateSocialBrandAudit(brandName, onboardedUrl, industry, timeframe);
  });

  // Mentions search & filter
  const [mentionFilterSentiment, setMentionFilterSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [mentionFilterPlatform, setMentionFilterPlatform] = useState<string>('all');
  const [mentionSearch, setMentionSearch] = useState('');

  // Speaker filter
  const [speakerFilter, setSpeakerFilter] = useState<'all' | 'advocates' | 'critics' | 'macro' | 'micro'>('all');

  // AI Reply Modal / Generation State
  const [generatingReplyId, setGeneratingReplyId] = useState<string | null>(null);
  const [customReplyTone, setCustomReplyTone] = useState<string>('Supportive & Energetic');
  const [mentionReplies, setMentionReplies] = useState<Record<string, string>>({});
  const [sentReplies, setSentReplies] = useState<Record<string, boolean>>({});

  // Trigger real-time audit refresh
  const handleRefreshAudit = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/social/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          url: onboardedUrl,
          industry,
          timeframe
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audit) {
          setReportData(data.audit);
        }
      } else {
        // Fallback local calculation
        setReportData(generateSocialBrandAudit(brandName, onboardedUrl, industry, timeframe));
      }
    } catch {
      setReportData(generateSocialBrandAudit(brandName, onboardedUrl, industry, timeframe));
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Switch timeframe handler
  const handleTimeframeChange = (newTimeframe: '7 Days' | '30 Days' | '90 Days') => {
    setTimeframe(newTimeframe);
    setReportData(generateSocialBrandAudit(brandName, onboardedUrl, industry, newTimeframe));
  };

  // Generate 1-Click AI Response
  const handleGenerateAIReply = async (mention: BrandMentionItem) => {
    setGeneratingReplyId(mention.id);
    try {
      const res = await fetch('/api/social/reply-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentionContent: mention.content,
          authorHandle: mention.authorHandle,
          platform: mention.platform,
          sentiment: mention.sentiment,
          brandName: reportData.brandName,
          tone: customReplyTone
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMentionReplies(prev => ({ ...prev, [mention.id]: data.reply }));
        }
      } else {
        setMentionReplies(prev => ({ ...prev, [mention.id]: mention.aiSuggestedReply }));
      }
    } catch {
      setMentionReplies(prev => ({ ...prev, [mention.id]: mention.aiSuggestedReply }));
    } finally {
      setGeneratingReplyId(null);
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered mentions
  const filteredMentions = useMemo(() => {
    return reportData.liveMentionsFeed.filter(m => {
      const matchesSentiment = mentionFilterSentiment === 'all' || m.sentiment === mentionFilterSentiment;
      const matchesPlatform = mentionFilterPlatform === 'all' || m.platform.toLowerCase().includes(mentionFilterPlatform.toLowerCase());
      const matchesSearch = !mentionSearch || 
        m.content.toLowerCase().includes(mentionSearch.toLowerCase()) || 
        m.author.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        m.authorHandle.toLowerCase().includes(mentionSearch.toLowerCase());
      return matchesSentiment && matchesPlatform && matchesSearch;
    });
  }, [reportData.liveMentionsFeed, mentionFilterSentiment, mentionFilterPlatform, mentionSearch]);

  // Filtered speakers
  const filteredSpeakers = useMemo(() => {
    const all = [...reportData.whoSpeaksForUs.advocateList, ...reportData.whoSpeaksForUs.criticsAndDetractorsList];
    if (speakerFilter === 'advocates') return reportData.whoSpeaksForUs.advocateList;
    if (speakerFilter === 'critics') return reportData.whoSpeaksForUs.criticsAndDetractorsList;
    if (speakerFilter === 'macro') return all.filter(s => s.influenceTier.includes('Macro') || s.influenceTier.includes('Luminary'));
    if (speakerFilter === 'micro') return all.filter(s => s.influenceTier.includes('Micro') || s.influenceTier.includes('Nano'));
    return all;
  }, [reportData.whoSpeaksForUs, speakerFilter]);

  // Markdown dossier export string
  const markdownDossier = useMemo(() => {
    return generateSocialAuditMarkdownDossier(reportData);
  }, [reportData]);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownDossier], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${reportData.brandName.toLowerCase().replace(/\s+/g, '_')}_social_brand_audit_report.md`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Command Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/20 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Share2 className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              Social Voice & Brand Audit Intelligence Suite
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{reportData.brandName} Social Intelligence Hub</span>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                LIVE AUDIT
              </span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real-time intelligence discovering <strong className="text-white">who speaks for your brand</strong>, <strong className="text-white">what narratives dominate public perception</strong>, sentiment breakdown, multi-platform health audits, and executive reports.
            </p>
          </div>

          {/* Timeframe & Live Scan Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-white/10 p-1 rounded-xl flex items-center gap-1 shadow-inner">
              {(['7 Days', '30 Days', '90 Days'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeChange(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    timeframe === tf
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefreshAudit}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 border border-cyan-300/40 cursor-pointer disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Scanning Platforms...' : 'Run Fresh AI Scan'}
            </button>
          </div>
        </div>

        {/* Live Brand Health Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Brand Health Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-cyan-400 font-mono">{reportData.brandHealthScore}</span>
              <span className="text-xs text-slate-400 font-mono">/100</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold ml-auto">EXCELLENT</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Net Sentiment Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">+{reportData.netBrandSentimentScore}</span>
              <span className="text-xs text-slate-400 font-mono">NPS Eq</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Analyzed Mentions</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">{reportData.totalMentionsAnalyzed.toLocaleString()}</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold ml-auto">Across 6 Platforms</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Audience Reach</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-purple-300 font-mono">{reportData.totalEstimatedReach}</span>
              <Globe className="w-3.5 h-3.5 text-purple-400 ml-auto" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Brand Safety Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{reportData.riskAndCrisisAudit.brandSafetyScore}%</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'executive', label: 'Executive Audit & SOV', icon: BarChart3, badge: 'OVERVIEW' },
          { id: 'who-speaks', label: 'Who Speaks For Us', icon: Users, badge: `${reportData.whoSpeaksForUs.topAdvocatesCount} Champions` },
          { id: 'what-they-say', label: 'What They Speak', icon: MessageSquareQuote, badge: 'Narratives' },
          { id: 'platforms', label: 'Platform Audits', icon: Globe, badge: '6 Audited' },
          { id: 'mentions', label: 'Live Mentions & 1-Click Reply', icon: Radio, badge: 'Stream' },
          { id: 'reports', label: 'Audit Dossier & Exports', icon: FileText, badge: 'Export' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2.5 whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 border-cyan-400/50 text-cyan-200 shadow-lg glow-cyan'
                  : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/10 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Viewports */}
      <AnimatePresence mode="wait">
        {/* ==================================================================== */}
        {/* TAB 1: EXECUTIVE AUDIT & SOV OVERVIEW */}
        {/* ==================================================================== */}
        {activeSubTab === 'executive' && (
          <motion.div
            key="executive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Executive Synthesis Card */}
            <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                Executive Sentiment & Narrative Synthesis
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Overall Brand Perception Status</h2>
              <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                {reportData.overallSentiment.executiveSummary}
              </p>

              {/* Sentiment Distribution Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5" /> Positive ({reportData.overallSentiment.positive}%)
                  </span>
                  <span className="text-amber-300 font-bold">
                    Neutral ({reportData.overallSentiment.neutral}%)
                  </span>
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <ThumbsDown className="w-3.5 h-3.5" /> Negative ({reportData.overallSentiment.negative}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${reportData.overallSentiment.positive}%` }} className="bg-gradient-to-r from-emerald-500 to-teal-400" />
                  <div style={{ width: `${reportData.overallSentiment.neutral}%` }} className="bg-amber-400" />
                  <div style={{ width: `${reportData.overallSentiment.negative}%` }} className="bg-rose-500" />
                </div>
              </div>
            </div>

            {/* Share of Voice (SOV) Benchmarking & Risk Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Share of Voice Card */}
              <div className="lg:col-span-2 bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">COMPETITIVE SOV BENCHMARK</span>
                    <h3 className="text-base font-bold text-white mt-0.5">Share of Voice & Market Mention Dominance</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    Category: {industry}
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {reportData.shareOfVoice.map((sov, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`font-bold flex items-center gap-2 ${sov.isTargetBrand ? 'text-cyan-300' : 'text-slate-300'}`}>
                          {sov.isTargetBrand && <Award className="w-4 h-4 text-cyan-400" />}
                          {sov.brand}
                          {sov.isTargetBrand && (
                            <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/30">
                              OUR BRAND
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[11px]">Sentiment: {sov.sentimentScore}/100</span>
                          <span className="font-bold text-white text-sm">{sov.sharePercentage}%</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${sov.sharePercentage}%`,
                            backgroundColor: sov.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-200/90 leading-relaxed flex items-center gap-2.5 mt-4">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Market Lead Insight:</strong> {reportData.brandName} holds <strong>42% Share of Voice</strong>, outpacing nearest competitor by +15% due to viral momentum in developer and growth agency communities.
                  </span>
                </div>
              </div>

              {/* Brand Safety & Risk Early Warning */}
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">CRISIS & RISK EARLY WARNING</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      {reportData.riskAndCrisisAudit.riskLevel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">Brand Safety Telemetry</h3>
                  
                  <div className="mt-4 space-y-3">
                    {reportData.riskAndCrisisAudit.activeRiskAlerts.map((alert, i) => (
                      <div key={i} className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{alert.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{alert.riskFactor}</p>
                        <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-500/20 mt-1">
                          <strong>Mitigation:</strong> {alert.mitigationStrategy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveSubTab('mentions')}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Monitor Real-Time Mentions Feed
                </button>
              </div>
            </div>

            {/* 30-Day Tactical Social Growth Roadmap */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">TACTICAL EXECUTION BLUEPRINT</span>
                  <h3 className="text-base font-bold text-white mt-0.5">30-Day Social Presence & Authority Roadmap</h3>
                </div>
                <button
                  onClick={() => onNavigateToTab?.('social')}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <span>Open Social Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {reportData.actionPlan30Days.map((plan, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">WEEK {idx + 1}</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-400/30 font-mono">
                          PHASE {idx + 1}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5">{plan.focus}</h4>

                      <div className="space-y-1.5 mt-3">
                        {plan.tasks.map((task, ti) => (
                          <div key={ti} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-1">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        Target KPI: {plan.kpiTarget}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        Owner: {plan.assignedAgent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: WHO SPEAKS FOR US (ADVOCATES & INFLUENCERS) */}
        {/* ==================================================================== */}
        {activeSubTab === 'who-speaks' && (
          <motion.div
            key="who-speaks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter Bar & Header */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">STAKEHOLDER & CREATOR AUDIT</span>
                <h2 className="text-xl font-bold text-white">Who Speaks For {reportData.brandName}?</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Mapping {reportData.whoSpeaksForUs.totalIdentifiedSpeakers} active public voices, superfan advocates, industry luminaries, and critics across social channels.
                </p>
              </div>

              {/* Speaker Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Voices' },
                  { id: 'advocates', label: 'Superfan Advocates' },
                  { id: 'critics', label: 'Critics / Risk' },
                  { id: 'macro', label: 'Macro Creators (200k+)' },
                  { id: 'micro', label: 'Micro / Niche' }
                ].map(flt => (
                  <button
                    key={flt.id}
                    onClick={() => setSpeakerFilter(flt.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      speakerFilter === flt.id
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speaker Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpeakers.map((speaker) => {
                const isAdvocate = speaker.sentimentScore >= 70;
                return (
                  <div
                    key={speaker.id}
                    className={`bg-slate-950/80 border rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden transition-all hover:border-cyan-400/40 ${
                      isAdvocate ? 'border-emerald-500/20' : 'border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{speaker.name}</h3>
                            {speaker.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {speaker.handle} &bull; <span className="text-cyan-300 font-semibold">{speaker.platform}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isAdvocate 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                            : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                        }`}>
                          {speaker.roleType}
                        </span>
                        <div className="text-[11px] font-mono text-slate-300 mt-1 font-bold">
                          {speaker.followerCount} Followers
                        </div>
                      </div>
                    </div>

                    {/* Sentiment & Affinity Bars */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Brand Sentiment</span>
                          <span className={isAdvocate ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {speaker.sentimentScore}/100
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isAdvocate ? 'bg-emerald-400' : 'bg-rose-400'}`}
                            style={{ width: `${speaker.sentimentScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Affinity / Influence</span>
                          <span className="text-purple-300 font-bold">{speaker.affinityScore}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-full"
                            style={{ width: `${speaker.affinityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recent Quote */}
                    <div className="bg-slate-900/90 border border-white/5 rounded-xl p-3.5 relative">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">
                        Recent Public Mention / Post
                      </span>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "{speaker.recentQuoteOrPost}"
                      </p>
                    </div>

                    {/* Spoken Themes */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">
                        Dominant Themes Spoken
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {speaker.keyThemesSpoken.map((theme, ti) => (
                          <span key={ti} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actionable Engagement Recommendation */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-cyan-300">
                        <strong>Protocol:</strong> {speaker.recommendedEngagementAction}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audience Personas Synthesis */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                AUDIENCE ARCHETYPES & WHO LISTENS
              </span>
              <h3 className="text-base font-bold text-white">Target Community Personas Breakdown</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {reportData.whoSpeaksForUs.audiencePersonas.map((persona, pi) => (
                  <div key={pi} className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{persona.personaName}</h4>
                      <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/20">
                        {persona.percentageShare}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {persona.coreMotivation}
                    </p>
                    <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 space-y-1">
                      <div><strong className="text-slate-300">Voice Style:</strong> {persona.voiceStyle}</div>
                      <div><strong className="text-slate-300">Primary Channel:</strong> {persona.primaryPlatform}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: WHAT THEY SPEAK (NARRATIVE CLUSTERS & SENTIMENT) */}
        {/* ==================================================================== */}
        {activeSubTab === 'what-they-say' && (
          <motion.div
            key="what-they-say"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">NARRATIVE INTELLIGENCE</span>
                <h2 className="text-xl font-bold text-white">What People Say About {reportData.brandName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Topic clustering, core praise themes, customer friction telemetry, and trending conversational hashtags.
                </p>
              </div>

              {/* Hashtag Cloud Badges */}
              <div className="flex flex-wrap gap-1.5">
                {reportData.whatTheySay.trendingHashtags.map((ht, hi) => (
                  <span key={hi} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {ht.tag} ({ht.mentions})
                  </span>
                ))}
              </div>
            </div>

            {/* Narrative Topic Clusters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.whatTheySay.narrativeClusters.map((cluster, ci) => (
                <div key={ci} className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">{cluster.volume}</span>
                      <h3 className="text-base font-bold text-white mt-0.5">{cluster.topic}</h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {cluster.velocityTrend}
                    </span>
                  </div>

                  {/* Sentiment Bar for this cluster */}
                  <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-300 font-bold">Dominant Tone: {cluster.dominantTone}</span>
                      <span className="text-emerald-400 font-bold">{cluster.sentimentBreakdown.positive}% Positive</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: `${cluster.sentimentBreakdown.positive}%` }} className="bg-emerald-400" />
                      <div style={{ width: `${cluster.sentimentBreakdown.neutral}%` }} className="bg-amber-400" />
                      <div style={{ width: `${cluster.sentimentBreakdown.negative}%` }} className="bg-rose-400" />
                    </div>
                  </div>

                  {/* Sample Quotes */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Sample Voice Quotes</span>
                    {cluster.topUserQuotes.map((quote, qi) => (
                      <div key={qi} className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                        {quote}
                      </div>
                    ))}
                  </div>

                  {/* Praise Points vs Friction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> Core Praise
                      </span>
                      {cluster.praisePoints.map((pp, ppi) => (
                        <div key={ppi} className="text-[11px] text-slate-300 leading-snug">• {pp}</div>
                      ))}
                    </div>

                    <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-rose-400 uppercase block flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3" /> User Friction
                      </span>
                      {cluster.frictionOrComplaintPoints.map((fp, fpi) => (
                        <div key={fpi} className="text-[11px] text-slate-300 leading-snug">• {fp}</div>
                      ))}
                    </div>
                  </div>

                  {/* Action Recommendation */}
                  <div className="pt-2 border-t border-white/10 text-xs font-mono text-cyan-300">
                    <strong>Tactical Action:</strong> {cluster.actionRecommendation}
                  </div>
                </div>
              ))}
            </div>

            {/* Praise vs Complaints Detailed Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Praise Drivers */}
              <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Top Praise Drivers (What Works)</h3>
                </div>
                <div className="space-y-3">
                  {reportData.whatTheySay.topPraiseReasons.map((praise, pri) => (
                    <div key={pri} className="bg-slate-900/80 border border-white/5 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-emerald-300">{praise.title}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{praise.count}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{praise.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Friction & Remedies */}
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Reported Friction & Strategic Remedies</h3>
                </div>
                <div className="space-y-3">
                  {reportData.whatTheySay.topComplaintReasons.map((complaint, cri) => (
                    <div key={cri} className="bg-slate-900/80 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-rose-300">{complaint.title}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{complaint.count}</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-500/20">
                        <strong>Remedy:</strong> {complaint.remedy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: PLATFORM-BY-PLATFORM AUDIT */}
        {/* ==================================================================== */}
        {activeSubTab === 'platforms' && (
          <motion.div
            key="platforms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">CROSS-PLATFORM AUDITING</span>
                <h2 className="text-xl font-bold text-white">Social Channel Health & Presence Audit</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Independent performance grades, engagement rates, brand voice consistency scores, and platform optimization plans.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>6 Channels Audited & Synchronized</span>
              </div>
            </div>

            {/* Platform Audit Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportData.platformAudits.map((platformAudit, pai) => (
                <div
                  key={pai}
                  className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-3">
                    {/* Platform Title & Grade */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{platformAudit.platform}</h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          {platformAudit.audienceDemographics}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-cyan-400 font-mono">{platformAudit.grade}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Health: {platformAudit.healthScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-xl border border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Monthly Reach</span>
                        <span className="text-white font-bold">{platformAudit.monthlyReach}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Engagement Rate</span>
                        <span className="text-emerald-400 font-bold">{platformAudit.engagementRate}</span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-slate-400 uppercase block">Posting Cadence</span>
                        <span className="text-slate-300 font-medium text-[11px]">{platformAudit.postingFrequency}</span>
                      </div>
                    </div>

                    {/* Top Content Format */}
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Winning Format</span>
                      <p className="text-xs text-cyan-200 font-medium mt-0.5">{platformAudit.topPerformingContentFormat}</p>
                    </div>

                    {/* Strengths & Gaps */}
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">Strengths</span>
                        {platformAudit.strengths.map((st, sti) => (
                          <div key={sti} className="text-[11px] text-slate-300 flex items-start gap-1">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-amber-400 uppercase block">Critical Gaps</span>
                        {platformAudit.criticalGaps.map((gp, gpi) => (
                          <div key={gpi} className="text-[11px] text-slate-300 flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span>{gp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Optimization Roadmap */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5">
                    <span className="text-[9px] font-mono font-bold text-purple-400 uppercase block">Action Roadmap</span>
                    {platformAudit.optimizationRoadmap.map((act, ai) => (
                      <div key={ai} className="text-[10px] font-mono text-slate-300 bg-white/5 p-1.5 rounded">
                        • {act}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: LIVE MENTIONS & 1-CLICK AI REPLY */}
        {/* ==================================================================== */}
        {activeSubTab === 'mentions' && (
          <motion.div
            key="mentions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter and Search Bar */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">LIVE LISTENING STREAM</span>
                  <h2 className="text-xl font-bold text-white">Brand Mentions & 1-Click AI Response Engine</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulate and monitor real-time social conversations and generate on-brand response copy instantly.
                  </p>
                </div>

                {/* Tone Selector for AI Reply */}
                <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-xl text-xs font-mono">
                  <span className="text-slate-400 pl-2">Reply Tone:</span>
                  <select
                    value={customReplyTone}
                    onChange={(e) => setCustomReplyTone(e.target.value)}
                    className="bg-slate-950 border border-white/10 text-cyan-300 font-bold px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="Supportive & Energetic">Supportive & Energetic 🚀</option>
                    <option value="Executive & Professional">Executive & Professional 👔</option>
                    <option value="Warm & Grateful">Warm & Grateful 🙏</option>
                    <option value="Technical & Helpful">Technical & Helpful 💡</option>
                    <option value="De-escalating & Empathetic">De-escalating & Empathetic 🛡️</option>
                  </select>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search keywords, author handles, or topics..."
                    value={mentionSearch}
                    onChange={(e) => setMentionSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-mono">
                    {(['all', 'positive', 'neutral', 'negative'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setMentionFilterSentiment(s)}
                        className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all ${
                          mentionFilterSentiment === s
                            ? 'bg-cyan-500 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mentions Feed List */}
            <div className="space-y-4">
              {filteredMentions.map((mention) => {
                const currentReply = mentionReplies[mention.id] || mention.aiSuggestedReply;
                const isSent = sentReplies[mention.id];

                return (
                  <div
                    key={mention.id}
                    className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-cyan-500/30 transition-all"
                  >
                    {/* Mention Author & Meta */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={mention.authorAvatar}
                          alt={mention.author}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{mention.author}</h4>
                            <span className="text-xs text-slate-400 font-mono">{mention.authorHandle}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                            <span className="text-cyan-300 font-bold">{mention.platform}</span>
                            <span>&bull;</span>
                            <span>{mention.timestamp}</span>
                            <span>&bull;</span>
                            <span>{mention.authorFollowers} followers</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                          mention.sentiment === 'positive'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                            : mention.sentiment === 'negative'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        }`}>
                          {mention.sentiment}
                        </span>
                      </div>
                    </div>

                    {/* Mention Content */}
                    <div className="text-sm text-slate-100 bg-slate-900/60 p-4 rounded-xl border border-white/5 leading-relaxed">
                      "{mention.content}"
                    </div>

                    {/* Engagement & Topics */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> {mention.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Share2 className="w-3.5 h-3.5 text-cyan-400" /> {mention.engagement.shares}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <MessageCircle className="w-3.5 h-3.5 text-purple-400" /> {mention.engagement.comments}
                        </span>
                        <span className="text-slate-400">Est. Reach: {mention.reachEstimated}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {mention.keyTopics.map((tp, tpi) => (
                          <span key={tpi} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                            #{tp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggested Response Box */}
                    <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI-Generated Response Suggestion ({customReplyTone})</span>
                        </div>
                        <button
                          onClick={() => handleGenerateAIReply(mention)}
                          disabled={generatingReplyId === mention.id}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${generatingReplyId === mention.id ? 'animate-spin' : ''}`} />
                          Regenerate Reply
                        </button>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-3 rounded-lg border border-white/5">
                        {currentReply}
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(currentReply, `reply-${mention.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 transition-all flex items-center gap-1.5"
                        >
                          {copiedId === `reply-${mention.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Reply</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setSentReplies(prev => ({ ...prev, [mention.id]: true }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            isSent
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                          }`}
                        >
                          {isSent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Marked Addressed</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>1-Click Dispatch Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: AUDIT DOSSIER & EXPORTS */}
        {/* ==================================================================== */}
        {activeSubTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header & Export Actions */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">EXECUTIVE DOSSIER & AUDIT EXPORTS</span>
                <h2 className="text-xl font-bold text-white">Comprehensive Social Intelligence Report</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ready-to-present executive audit dossier ready for export, PDF generation, Google Docs synchronization, and stakeholder presentations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCopy(markdownDossier, 'dossier')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 transition-all flex items-center gap-2"
                >
                  {copiedId === 'dossier' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied Dossier</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .MD Report</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono font-bold text-slate-300 transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print / PDF</span>
                </button>

                <button
                  onClick={() => onNavigateToTab?.('workspace')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-xs font-mono font-bold transition-all flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Export to Google Workspace</span>
                </button>
              </div>
            </div>

            {/* Formatted Dossier Preview Box */}
            <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 font-sans">
              <div className="border-b border-white/10 pb-4">
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">AUTONOMOUS MARKETING OS &bull; SOCIAL AUDIT REPORT</div>
                <h1 className="text-2xl font-black text-white mt-1">{reportData.brandName} Social Media Brand Audit</h1>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 mt-2">
                  <span>URL: <strong className="text-slate-200">{reportData.url}</strong></span>
                  <span>Timeframe: <strong className="text-slate-200">{reportData.timeframeAudited}</strong></span>
                  <span>Health Score: <strong className="text-cyan-400">{reportData.brandHealthScore}/100</strong></span>
                  <span>Net Sentiment: <strong className="text-emerald-400">+{reportData.netBrandSentimentScore}</strong></span>
                </div>
              </div>

              {/* Dossier Section 1 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-cyan-300">
                  1. Executive Summary & Sentiment Telemetry
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reportData.overallSentiment.executiveSummary}
                </p>
                <div className="grid grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs font-mono mt-2">
                  <div>Positive: <strong className="text-emerald-400">{reportData.overallSentiment.positive}%</strong></div>
                  <div>Neutral: <strong className="text-amber-300">{reportData.overallSentiment.neutral}%</strong></div>
                  <div>Negative: <strong className="text-rose-400">{reportData.overallSentiment.negative}%</strong></div>
                </div>
              </div>

              {/* Dossier Section 2 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-cyan-300">
                  2. Competitive Share of Voice (SOV)
                </h3>
                <div className="space-y-2">
                  {reportData.shareOfVoice.map((sov, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-mono bg-slate-900/40 p-2 rounded border border-white/5">
                      <span className="text-slate-200 font-bold">{sov.brand} {sov.isTargetBrand && '🏆 [OUR BRAND]'}</span>
                      <span className="text-cyan-300">{sov.sharePercentage}% SOV &bull; Sentiment: {sov.sentimentScore}/100</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dossier Section 3 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-cyan-300">
                  3. Who Speaks For Us (Top Brand Champions)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportData.whoSpeaksForUs.advocateList.map((adv, ai) => (
                    <div key={ai} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{adv.name} ({adv.handle})</span>
                        <span className="text-emerald-400 font-mono text-[10px]">{adv.roleType}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">Platform: {adv.platform} &bull; Followers: {adv.followerCount}</div>
                      <p className="text-slate-300 italic text-[11px]">"{adv.recentQuoteOrPost}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dossier Section 4 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-cyan-300">
                  4. What They Say (Dominant Narrative Themes)
                </h3>
                <div className="space-y-2">
                  {reportData.whatTheySay.narrativeClusters.map((nc, nci) => (
                    <div key={nci} className="bg-slate-900/40 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between text-white font-bold">
                        <span>{nc.topic}</span>
                        <span className="text-cyan-400 font-mono">{nc.volume}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] font-mono">
                        Tone: {nc.dominantTone} &bull; Velocity: {nc.velocityTrend}
                      </div>
                      <div className="text-cyan-300 text-[11px] font-mono pt-1">
                        <strong>Recommendation:</strong> {nc.actionRecommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dossier Section 5 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-cyan-300">
                  5. Platform Health Grades Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {reportData.platformAudits.map((pa, pai) => (
                    <div key={pai} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>{pa.platform}</span>
                        <span className="text-cyan-400 font-mono">{pa.grade}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] font-mono">Reach: {pa.monthlyReach}</div>
                      <div className="text-emerald-400 text-[10px] font-mono">Eng: {pa.engagementRate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dossier Section 6 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-cyan-300">
                  6. 30-Day Tactical Growth Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportData.actionPlan30Days.map((ap, api) => (
                    <div key={api} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="font-bold text-white">{ap.week}</div>
                      <div className="text-slate-300 text-[11px]">{ap.focus}</div>
                      <div className="text-emerald-400 font-mono text-[10px] font-bold">Target KPI: {ap.kpiTarget}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
