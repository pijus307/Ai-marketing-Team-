/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Target, Gift, ArrowRight, MousePointerClick, ShieldCheck, Heart } from 'lucide-react';
import { LeadGenReport } from '../types';

interface LeadGenViewProps {
  report: LeadGenReport;
}

export default function LeadGenView({ report }: LeadGenViewProps) {
  return (
    <div className="space-y-8">
      {/* Workstation Header */}
      <div className="bg-zinc-900 border border-zinc-950 rounded-md p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-xs text-zinc-100 font-mono tracking-wider uppercase font-semibold mb-4">
            <Target className="w-3.5 h-3.5" />
            CRO & Acquisition Engineering
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Acquisition Funnel & Lead Magnets
          </h1>
          <p className="text-zinc-300 text-sm md:text-base mt-2 leading-relaxed">
            Prepared by <strong className="text-white font-semibold">Sarah Lin</strong> &bull; Lead Conversion Engineer
          </p>
        </div>
      </div>

      {/* Lead Magnet Definition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Magnet Offer */}
        <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm relative overflow-hidden">
          <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-700 font-mono font-bold uppercase">
            Incentive Offer Blueprint
          </span>
          <div className="flex items-start gap-4 mt-4">
            <div className="p-3 bg-zinc-100 border border-zinc-200 rounded text-zinc-700 flex-shrink-0">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-950 leading-snug">{report.magnetTitle}</h3>
              <p className="text-xs text-zinc-500 font-mono font-bold mt-1 uppercase tracking-wider">{report.deliveryMethod}</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 font-medium mt-4 leading-relaxed">
            <strong className="text-zinc-800 font-bold">Core Idea:</strong> {report.leadMagnetIdea}
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">CORE RESOLVING VALUE PROPOSITION</span>
            <p className="text-xs text-zinc-700 mt-1 font-bold leading-relaxed">
              {report.valueProposition}
            </p>
          </div>
        </div>

        {/* Chronological Funnel Pipeline */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-950 mb-4">Lead Funnel Flowchart Steps</h3>
            <p className="text-xs text-zinc-500 mb-6 font-medium">Chronological touchpoints required to transition cold traffic to qualified opt-in leads.</p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-3 md:gap-4">
            {report.funnelSteps?.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col md:flex-row items-center gap-3">
                <div className="flex-grow p-3 bg-zinc-50 border border-zinc-200 rounded-md flex items-center gap-3 w-full animate-fadeIn">
                  <span className="w-6 h-6 rounded bg-zinc-900 text-white text-xs font-mono font-bold flex items-center justify-center border border-zinc-950 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-bold text-zinc-800">{step}</span>
                </div>
                {i < (report.funnelSteps?.length || 0) - 1 && (
                  <ArrowRight className="w-5 h-5 text-zinc-500 rotate-90 md:rotate-0 flex-shrink-0 py-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Landing Page Template Copy Section */}
      <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm">
        <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2 mb-6">
          <MousePointerClick className="w-4.5 h-4.5 text-zinc-700 animate-pulse" />
          Landing Page Headline & Copy Specification
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Wireframe Mock Header */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-md p-6 relative flex flex-col justify-between">
            {/* Window dot decoration */}
            <div className="flex items-center gap-1.5 absolute top-3 left-4">
              <span className="w-2 h-2 rounded-full bg-zinc-200" />
              <span className="w-2 h-2 rounded-full bg-zinc-200" />
              <span className="w-2 h-2 rounded-full bg-zinc-200" />
            </div>

            <div className="pt-6">
              <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider block mb-2">ABOVE-THE-FOLD WIREFRAME COPY</span>
              
              {/* headline */}
              <h4 className="text-lg md:text-xl font-black text-zinc-950 leading-tight mb-2">
                {report.landingPageCopy?.heroHeadline}
              </h4>
              
              {/* subheadline */}
              <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-medium">
                {report.landingPageCopy?.heroSubheadline}
              </p>

              {/* bullets list */}
              <div className="space-y-2.5">
                {report.landingPageCopy?.keyBenefits?.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-zinc-700 font-medium">
                    <ShieldCheck className="w-4.5 h-4.5 text-zinc-700 flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Lead Form CTA button */}
            <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="bg-zinc-50 border border-zinc-200 rounded-md px-4 py-2 text-xs text-zinc-400 flex-grow font-mono font-bold">
                enter your professional email...
              </div>
              <button className="bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 text-white font-bold text-xs py-2.5 px-5 rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-mono font-bold uppercase tracking-wider">
                {report.landingPageCopy?.formCta || 'Submit'}
              </button>
            </div>
          </div>

          {/* CRO Trust Strategy Side panel */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-md p-5 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block mb-3">TRUST & CONVERSION STRATEGY</span>
              <div className="space-y-4">
                {report.landingPageCopy?.trustSignals?.map((sig, sIdx) => (
                  <div key={sIdx} className="p-3 bg-white border border-zinc-200 rounded-md flex gap-2.5 items-start animate-fadeIn">
                    <Heart className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-zinc-600 leading-relaxed italic font-medium">
                      "{sig}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-zinc-400 font-medium leading-relaxed mt-4 pt-4 border-t border-zinc-200">
              *Place trust triggers directly below the lead CTA form and above-the-fold margins to secure high friction-free sign-ups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
