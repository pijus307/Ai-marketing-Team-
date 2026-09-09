/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AgentReachView: Multi-Platform Zero-API-Cost Social & Web Intelligence Workstation
 * Powered by Panniantong/Agent-Reach Architecture
 */

import React, { useState } from 'react';
import { 
  Globe, Search, MessageSquare, Twitter, Youtube, Github, 
  Sparkles, RefreshCw, Copy, Check, TrendingUp, Filter, 
  ExternalLink, Zap, Shield, Share2, Layers, BookOpen, 
  CheckCircle2, ArrowRight, Activity, Flame, ChevronRight
} from 'lucide-react';
import { generateAgentReachIntelligence } from '../lib/agentreach-engine';
import { AgentReachResults } from '../types';

interface AgentReachViewProps {
  onboardedUrl?: string;
  brandName?: string;
  industry?: string;
  onInjectHookToAgent?: (hookText: string, agentName: string) => void;
}

type PlatformTab = 'all' | 'reddit' | 'twitter' | 'youtube' | 'github' | 'hooks';

export default function AgentReachView({
  onboardedUrl = 'example.com',
  brandName = 'Brand',
  industry = 'Growth Marketing & SaaS',
  onInjectHookToAgent
}: AgentReachViewProps) {
  const [searchQuery, setSearchQuery] = useState(brandName || 'Growth Marketing');
  const [activePlatform, setActivePlatform] = useState<PlatformTab>('all');
  const [isCrawling, setIsCrawling] = useState(false);
  const [results, setResults] = useState<AgentReachResults>(() => 
    generateAgentReachIntelligence(searchQuery, onboardedUrl, brandName, industry)
  );
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [injectedHook, setInjectedHook] = useState<string | null>(null);

  const handleRunCrawl = () => {
    setIsCrawling(true);
    setTimeout(() => {
      const freshResults = generateAgentReachIntelligence(searchQuery, onboardedUrl, brandName, industry);
      setResults(freshResults);
      setIsCrawling(false);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInject = (hook: string, agent: string) => {
    if (onInjectHookToAgent) {
      onInjectHookToAgent(hook, agent);
    }
    setInjectedHook(hook);
    setTimeout(() => setInjectedHook(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl gradient-border-mask">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300 font-mono tracking-wider uppercase font-semibold mb-3">
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Panniantong/Agent-Reach &bull; Zero-API-Cost Internet Discovery
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Agent-Reach Social & Web Research
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
              Equips the autonomous agent squad with zero-cost live reading and crawling capabilities across <strong className="text-white">Reddit</strong>, <strong className="text-white">X (Twitter)</strong>, <strong className="text-white">YouTube Transcripts</strong>, and <strong className="text-white">GitHub</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Zero API Fees Required
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-cyan-300 flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-cyan-400" />
                Live Sentiment & Pain Point Mining
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-purple-300 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-purple-400" />
                Direct Squad Hook Injection
              </span>
            </div>
          </div>

          {/* Real-time stats card */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-center p-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Signals</span>
              <p className="text-2xl font-black text-cyan-300 font-mono mt-0.5">{results.totalDataPoints}</p>
            </div>
            <div className="text-center p-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Net Sentiment</span>
              <p className="text-2xl font-black text-emerald-300 font-mono mt-0.5">{results.overallSentiment.positive}%</p>
            </div>
          </div>
        </div>

        {/* Search & Crawl Input Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunCrawl()}
              placeholder="Enter brand, product niche, competitor name, or problem space..."
              className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium transition"
            />
          </div>
          <button
            onClick={handleRunCrawl}
            disabled={isCrawling || !searchQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/40 disabled:opacity-50 cursor-pointer"
          >
            {isCrawling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Crawling Feeds...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Execute Agent-Reach Crawl</span>
              </>
            )}
          </button>
        </div>

        {/* Platform Filter Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Intelligence', icon: Layers, count: results.totalDataPoints },
            { id: 'reddit', label: 'Reddit Discussions', icon: MessageSquare, count: results.reddit.length },
            { id: 'twitter', label: 'Twitter / X Viral Hooks', icon: Twitter, count: results.twitter.length },
            { id: 'youtube', label: 'YouTube Transcripts', icon: Youtube, count: results.youtube.length },
            { id: 'github', label: 'GitHub Ecosystem', icon: Github, count: results.github.length },
            { id: 'hooks', label: 'Squad Hooks', icon: Sparkles, count: results.actionableHooks.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activePlatform === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePlatform(tab.id as PlatformTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/20 border border-cyan-400/50 text-white shadow-lg shadow-cyan-950/40' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300 font-bold">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification Banner on Hook Injection */}
      {injectedHook && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Successfully injected viral hook into Agency Specialist Desk!</span>
          </div>
          <span className="font-bold uppercase text-[10px] bg-emerald-400/20 px-2 py-0.5 rounded">
            Agent Synced
          </span>
        </div>
      )}

      {/* SECTION 1: Actionable Squad Hooks (Elena, Chloe, Alex, Sarah) */}
      {(activePlatform === 'all' || activePlatform === 'hooks') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-[10px] font-mono font-semibold uppercase text-purple-300 mb-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Direct Agency Feedback Loop
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                High-Conversion Viral Hooks for Autonomous Squad
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Synthesized directly from live audience discussions to maximize conversion resonance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {results.actionableHooks.map((hookItem, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-card border border-white/10 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                      {hookItem.platform}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-400/30 font-bold">
                      Assign: {hookItem.recommendedAgent}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    "{hookItem.hook}"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300 font-semibold">Target Persona:</strong> {hookItem.targetPersona}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleCopy(hookItem.hook, `hook-${idx}`)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedIndex === `hook-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === `hook-${idx}` ? 'Copied' : 'Copy Hook'}</span>
                  </button>
                  <button
                    onClick={() => handleInject(hookItem.hook, hookItem.recommendedAgent)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>Inject into Agent</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Reddit Community Pain Points & Discussions */}
      {(activePlatform === 'all' || activePlatform === 'reddit') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-orange-400" />
              Reddit Community Discussions & Unfiltered Friction Points
            </h3>
            <span className="text-xs font-mono text-slate-400">Zero-API Read Mode</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.reddit.map((post, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-card border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-500/15 border border-orange-400/30 text-orange-300 font-mono text-[10px] font-bold">
                    {post.subreddit}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-300 font-bold">▲ {post.upvotes}</span>
                    <span>💬 {post.commentsCount}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{post.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed italic bg-black/30 p-2.5 rounded-lg border border-white/5">
                  "{post.snippet}"
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Identified Pain Points:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.keyPainPoints.map((pain, pi) => (
                      <span key={pi} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-400/20 text-rose-300 text-[10px] font-mono">
                        &bull; {pain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Twitter / X Viral Post Mechanics & Formulas */}
      {(activePlatform === 'all' || activePlatform === 'twitter') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Twitter className="w-4.5 h-4.5 text-sky-400" />
              Twitter / X Viral Post Formulas & Resonance Patterns
            </h3>
            <span className="text-xs font-mono text-sky-300 font-bold">High-Engagement Frameworks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.twitter.map((tweet, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-card border border-white/10 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{tweet.author}</p>
                      <span className="text-[10px] font-mono text-slate-400">{tweet.handle}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                      Viral Score: {tweet.viralScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                    {tweet.text}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {tweet.hashtags.map((tag, ti) => (
                      <span key={ti} className="text-[10px] font-mono text-sky-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Underlying Formula:</span>
                  <p className="text-[10px] font-mono text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-400/20">
                    {tweet.hookFormula}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>❤️ {tweet.likes.toLocaleString()}</span>
                    <span>🔁 {tweet.retweets.toLocaleString()}</span>
                    <span>👁️ {tweet.impressions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: YouTube Transcripts & Long-Form Video Intelligence */}
      {(activePlatform === 'all' || activePlatform === 'youtube') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Youtube className="w-4.5 h-4.5 text-rose-500" />
              YouTube Video Transcript Analysis & Authority Chapters
            </h3>
            <span className="text-xs font-mono text-slate-400">Audio-to-Text Deep Extraction</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.youtube.map((video, idx) => (
              <div key={idx} className="p-5 rounded-xl glass-card border border-white/10 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">{video.title}</h4>
                    <p className="text-xs font-mono text-slate-400 mt-1">{video.channel} &bull; {video.views} views ({video.duration})</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {video.transcriptSummary}
                </p>

                <div className="space-y-1.5 bg-black/40 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Key Video Chapters:</span>
                  <div className="space-y-1">
                    {video.keyTimestamps.map((ts, ti) => (
                      <div key={ti} className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-rose-400 font-bold text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">{ts.time}</span>
                        <span className="text-slate-300 text-[11px]">{ts.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-xs">
                  <strong className="text-emerald-300 font-mono font-bold block text-[10px] uppercase">Core Tactical Takeaway:</strong>
                  <p className="text-slate-200 mt-0.5 text-[11px]">{video.topTakeaway}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: GitHub Technical Ecosystem & Star Velocity */}
      {(activePlatform === 'all' || activePlatform === 'github') && (
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Github className="w-4.5 h-4.5 text-slate-300" />
              GitHub Technical Ecosystem & Repository Intelligence
            </h3>
            <span className="text-xs font-mono text-slate-400">Code & Issue Mining</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.github.map((repo, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-300 text-xs">{repo.name}</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-amber-300 font-bold">★ {repo.stars}</span>
                    <span>⑂ {repo.forks}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {repo.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {repo.techStack.map((tech, ti) => (
                    <span key={ti} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold mb-1">Top Community Requests:</span>
                  <div className="space-y-1 text-[10px] font-mono text-slate-400">
                    {repo.topIssues.map((issue, ii) => (
                      <p key={ii}>&bull; {issue}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
