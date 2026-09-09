/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Share2, Calendar, Clipboard, Check, Sparkles, Radio, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { SocialReport } from '../types';

interface SocialCalendarViewProps {
  report: SocialReport;
  onNavigateToAudit?: () => void;
}

export default function SocialCalendarView({ report, onNavigateToAudit }: SocialCalendarViewProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getChannelColorClass = (channel: string) => {
    if (channel.includes('LinkedIn')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (channel.includes('Twitter') || channel.includes('X')) return 'bg-zinc-900 text-white border-zinc-950';
    if (channel.includes('Meta') || channel.includes('Instagram')) return 'bg-pink-50 text-pink-700 border-pink-200';
    if (channel.includes('TikTok')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="space-y-8">
      {/* Workstation Header */}
      <div className="bg-zinc-900 border border-zinc-950 rounded-md p-6 md:p-8 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-xs text-zinc-100 font-mono tracking-wider uppercase font-semibold mb-4">
            <Share2 className="w-3.5 h-3.5" />
            Viral Marketing & Organic Loop Desk
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            5-Day Social Media Posting Plan
          </h1>
          <p className="text-zinc-300 text-sm md:text-base mt-2 leading-relaxed">
            Prepared by <strong className="text-white font-semibold">Chloe Jenkins</strong> &bull; Social Growth Director
          </p>
        </div>

        {onNavigateToAudit && (
          <button
            onClick={onNavigateToAudit}
            className="relative z-10 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 border border-cyan-300/40 cursor-pointer whitespace-nowrap"
          >
            <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>Open Social Voice & Brand Audit</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        )}
      </div>

      {/* Campaign Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core Strategy */}
        <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm md:col-span-2">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">CORE VIRALITY DIRECTIVE</span>
          <p className="text-sm font-semibold text-zinc-800 mt-1.5 leading-relaxed font-medium">{report.strategy}</p>
        </div>

        {/* Posting Frequency */}
        <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">SCHEDULED FREQUENCY</span>
          <p className="text-base font-bold text-zinc-900 mt-1">{report.postingFrequency}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {report.recommendedChannels?.map((ch, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded border bg-zinc-50 border-zinc-200 font-mono font-bold text-zinc-600">
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Day Posts Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-zinc-700 animate-pulse" />
          Execution Calendar Outlines
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.posts?.map((post, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-md shadow-sm relative flex flex-col justify-between">
              <div className="p-5 space-y-4">
                {/* Post Header Meta */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] font-mono font-bold uppercase">
                    {post.day}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${getChannelColorClass(post.channel)}`}>
                    {post.channel}
                  </span>
                </div>

                {/* Theme Title */}
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block">POST CORE NARRATIVE</span>
                  <h4 className="text-xs font-bold text-zinc-900 mt-0.5">{post.theme}</h4>
                </div>

                {/* Caption Body */}
                <div className="relative group">
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block mb-1.5">CAPTION TEXT COPY</span>
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-700 font-medium whitespace-pre-wrap leading-relaxed h-36 overflow-y-auto">
                    {post.caption}
                  </div>
                  <button
                    onClick={() => handleCopy(post.caption, i)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer"
                  >
                    {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* AI Visual creation prompt */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md border-l-4 border-zinc-900">
                  <span className="text-[9px] font-mono text-zinc-800 font-bold uppercase block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                    AI TEXT-TO-IMAGE CREATOR PROMPT
                  </span>
                  <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed font-medium italic">
                    "{post.imagePrompt}"
                  </p>
                </div>
              </div>

              {/* Hashtags Footer */}
              <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50/50 flex flex-wrap gap-1.5 rounded-b-md">
                {post.hashtags?.map((hash, hIdx) => (
                  <span key={hIdx} className="text-[10px] text-zinc-500 font-bold font-mono">
                    #{hash.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
