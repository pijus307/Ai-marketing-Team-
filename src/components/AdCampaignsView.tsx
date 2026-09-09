/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DollarSign, Percent, PiggyBank, Sparkles, Megaphone } from 'lucide-react';
import { AdReport } from '../types';

interface AdCampaignsViewProps {
  report: AdReport;
}

export default function AdCampaignsView({ report }: AdCampaignsViewProps) {
  return (
    <div className="space-y-8">
      {/* Workstation Header */}
      <div className="bg-zinc-900 border border-zinc-950 rounded-md p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-xs text-zinc-100 font-mono tracking-wider uppercase font-semibold mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            Paid Media & Demand Generation
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Acquisition Media & Paid Ad Campaigns
          </h1>
          <p className="text-zinc-300 text-sm md:text-base mt-2 leading-relaxed">
            Prepared by <strong className="text-white font-semibold">Alex Mercer</strong> &bull; Paid Media Optimizer & Ad Copywriter
          </p>
        </div>
      </div>

      {/* Metrics Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Budget */}
        <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">MONTHLY_SPEND_ESTIMATE</span>
            <p className="text-3xl font-black text-zinc-900">{report.monthlyBudgetRecommendation}</p>
            <p className="text-xs text-zinc-500 font-medium">Total recommended spend allocated across networks</p>
          </div>
          <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-full text-zinc-700">
            <PiggyBank className="w-8 h-8" />
          </div>
        </div>

        {/* ROAS ACOS target */}
        <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">TARGET_ACOS_EFFICIENCY</span>
            <p className="text-3xl font-black text-zinc-900">{report.targetACOSGoal}</p>
            <p className="text-xs text-zinc-500 font-medium">Target Advertising Cost of Sales efficiency target</p>
          </div>
          <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-full text-zinc-700">
            <Percent className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Campaigns Specs Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-zinc-700 animate-pulse" />
          Multi-Channel Campaign Briefs
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.campaigns?.map((camp, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm hover:border-zinc-450 transition-all">
              {/* Campaign Header */}
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-4 font-mono font-bold">
                <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-white text-[10px] uppercase">
                  {camp.platform}
                </span>
                <span className="text-xs text-zinc-500">
                  BUDGET SHARE: {camp.budgetShare}
                </span>
              </div>

              {/* Campaign Brief */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block">CAMPAIGN OBJECTIVE</span>
                  <p className="text-xs font-bold text-zinc-800 mt-1 leading-snug">{camp.objective}</p>
                </div>

                {/* Target Audience */}
                <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-md text-xs font-medium">
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block">TARGET DEMOGRAPHICS & CRITERIA</span>
                  <p className="text-zinc-600 mt-1 leading-relaxed">{camp.targetAudience}</p>
                </div>

                {/* Ad Creative Copy specs */}
                <div className="space-y-3 pt-3 border-t border-zinc-150">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">HIGH-CONVERTING AD COPY</span>
                  
                  {/* Headline */}
                  <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-md text-xs font-medium">
                    <span className="text-[9px] font-mono text-zinc-900 font-bold uppercase block">AD HEADLINE ({camp.platform.includes('Google') ? 'Search 30 chars limit' : 'Visual Hook'})</span>
                    <p className="text-zinc-950 font-black mt-1 leading-snug">
                      {camp.headline}
                    </p>
                  </div>

                  {/* Body copy / Description */}
                  <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-md text-xs font-medium">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block">PRIMARY TEXT COPY / DESCRIPTION</span>
                    <p className="text-zinc-600 mt-1 leading-relaxed">
                      {camp.primaryText}
                    </p>
                  </div>

                  {/* Optional Visual prompt if Meta or video */}
                  {camp.visualPrompt && (
                    <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-md text-xs font-medium border-l-4 border-zinc-900">
                      <span className="text-[9px] font-mono text-zinc-800 font-bold uppercase block flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                        AD CREATIVE DESIGN DIRECTIONS
                      </span>
                      <p className="text-zinc-600 mt-1 italic leading-relaxed">
                        "{camp.visualPrompt}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
