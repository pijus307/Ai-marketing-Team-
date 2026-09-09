/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, BookOpen, Link, Download, Sparkles, ShieldCheck, Layers, Hash } from 'lucide-react';
import { ContentReport } from '../types';

interface ContentStrategyViewProps {
  report: ContentReport;
  brandName?: string;
  url?: string;
}

export default function ContentStrategyView({ report, brandName, url }: ContentStrategyViewProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [isPrinting, setIsPrinting] = useState(false);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const handleDownloadPDF = () => {
    setIsPrinting(true);
    const originalTitle = document.title;
    const sanitizedBrand = brandName ? brandName.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Content_Strategy';
    const dateStr = new Date().toISOString().split('T')[0];
    document.title = `Content_Strategy_Report_${sanitizedBrand}_${dateStr}`;

    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setTimeout(() => {
        document.title = originalTitle;
      }, 500);
    }, 150);
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* Print-Only Dossier Header */}
      <div className="hidden print:block pb-6 mb-6 border-b border-white/15">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              AUTONOMOUS MARKETING OS &bull; EDITORIAL STRATEGY DOSSIER
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {brandName ? `${brandName} — ` : ''}Topical Authority & Content Strategy
            </h1>
            {url && (
              <p className="text-xs font-mono text-slate-300 mt-1">
                Domain Analyzed: <span className="text-emerald-300">{url}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-md border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              OFFICIAL REPORT
            </span>
            <p className="text-[10px] text-slate-400 font-mono mt-1.5">
              Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Lead Director: Elena Rostova
            </p>
          </div>
        </div>
      </div>

      {/* Workstation Header */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl gradient-border-mask">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-300 font-mono tracking-wider uppercase font-semibold mb-3">
              <FileText className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Topical Authority & Content Strategy
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Editorial Content Strategy
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 leading-relaxed">
              Prepared by <strong className="text-white font-semibold">Elena Rostova</strong> &bull; Inbound Content Director
            </p>
          </div>

          {/* Download Report as PDF Button */}
          <div className="no-print flex-shrink-0 flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              className="relative group flex items-center gap-2.5 px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold tracking-wide bg-gradient-to-r from-emerald-500/20 via-teal-600/20 to-cyan-500/20 hover:from-emerald-500/30 hover:via-teal-600/30 hover:to-cyan-500/30 border border-emerald-400/30 hover:border-emerald-400/60 text-white shadow-xl shadow-emerald-950/40 hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-95"
              title="Download editorial content blueprints as a high-fidelity PDF report"
            >
              <div className="p-1 rounded-lg bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 group-hover:bg-emerald-400/30 transition-colors">
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="font-sans font-bold">Download Report as PDF</span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-emerald-400/15 border border-emerald-400/30 text-emerald-300">
                PDF
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Pillar Alignment Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core pillar definition */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden page-break-inside-avoid">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] text-emerald-300 font-mono font-bold uppercase tracking-wider">
              TOPICAL AUTHORITY CORE
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-4 flex items-center gap-2.5 tracking-tight">
            <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{report.corePillar}</span>
          </h3>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              <strong className="text-slate-200 font-semibold block mb-1 font-mono uppercase text-[10px]">Target Search Intent:</strong>
              {report.targetAudienceIntent}
            </p>
          </div>
        </div>

        {/* Supporting Pillars checklist */}
        <div className="lg:col-span-2 glass-panel border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between page-break-inside-avoid">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Secondary Content Sub-pillars</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5 font-medium">
              Core topical categories required to establish search engine authority around the primary subject cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.contentPillars?.map((pillar, i) => (
              <div key={i} className="p-3.5 glass-card border border-white/10 rounded-xl flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                  #{i + 1}
                </span>
                <span className="text-xs font-bold text-slate-200 truncate">{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial Blog Outlines list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
            <Link className="w-5 h-5 text-emerald-400" />
            Pillar Article Blueprints
          </h3>
          <span className="no-print text-xs text-slate-400 font-mono">
            Click any blueprint to inspect H2 structure
          </span>
        </div>

        <div className="space-y-4">
          {report.blogArticles?.map((art, idx) => {
            const isExp = expandedIdx === idx;
            return (
              <div key={idx} className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-xl page-break-inside-avoid">
                {/* Header Row */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 bg-slate-900/30 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 flex flex-wrap gap-2 font-medium">
                        <span><strong className="text-slate-300 font-semibold">Primary CTA:</strong> {art.callToAction}</span>
                      </p>
                    </div>
                  </div>
                  <div className="no-print flex-shrink-0">
                    {isExp ? (
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                        <ChevronUp className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Outline content: expanded on screen if active, ALWAYS visible in print mode */}
                <div className={`${isExp ? 'block' : 'hidden print:block'} p-5 md:p-6 border-t border-white/10 bg-slate-950/40 space-y-5`}>
                  {/* Focus details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 glass-card border border-white/10 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                        FOCUS INBOUND KEYWORDS
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {art.keywords?.map((kw, kIdx) => (
                          <span key={kIdx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-200 font-mono font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 glass-card border border-white/10 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                        PRIMARY VALUE PROPOSITION TRIGGER
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed italic font-medium">
                        "{art.audienceNeed}"
                      </p>
                    </div>
                  </div>

                  {/* Headline Hook */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/20">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1.5">
                      RECOMMENDED VIRAL HEADLINE HOOK
                    </span>
                    <p className="text-sm font-bold text-white leading-snug">
                      "{art.headlineHook}"
                    </p>
                  </div>

                  {/* Blog Outline Section */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">
                      ARTICLE STRUCTURE (H2 OUTLINE BREAKDOWN)
                    </span>
                    <div className="space-y-2">
                      {art.detailedOutline?.map((heading, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-3 p-3 glass-card border border-white/10 rounded-xl text-xs text-slate-200 font-medium">
                          <span className="font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/20 text-[10px]">
                            H2.{hIdx + 1}
                          </span>
                          <span className="leading-snug">{heading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Print-Only Footer */}
      <div className="hidden print:flex items-center justify-between pt-6 mt-8 border-t border-white/15 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>AUTONOMOUS MARKETING OS &bull; SPECIALIST DESK: ELENA ROSTOVA (CONTENT STRATEGY)</span>
        </div>
        <div>
          <span>CONFIDENTIAL &bull; FOR STRATEGIC EVALUATION ONLY</span>
        </div>
      </div>
    </div>
  );
}
