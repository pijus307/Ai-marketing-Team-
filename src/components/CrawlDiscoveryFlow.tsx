/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Terminal, Cpu, Users, Award, ShieldAlert, FileSearch, CheckCircle2, 
  ChevronRight, ArrowRight, Network, Search, ListTodo, Sparkles
} from 'lucide-react';
import { MarketingAnalysis } from '../types';

interface CrawlDiscoveryFlowProps {
  url: string;
  industry?: string;
  analysisResult: MarketingAnalysis | null;
  isAnalyzing: boolean;
  currentStepIndex: number;
}

interface StepItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
  description: string;
}

export default function CrawlDiscoveryFlow({ 
  url, 
  industry, 
  analysisResult, 
  isAnalyzing, 
  currentStepIndex 
}: CrawlDiscoveryFlowProps) {
  const [activeStepId, setActiveStepId] = useState<string>('url');
  const [tickerLogs, setTickerLogs] = useState<string[]>([]);
  const displayUrl = url || 'https://target-brand-domain.com';

  const pipelineSteps: StepItem[] = [
    { 
      id: 'url', 
      label: 'User URL', 
      icon: <Globe className="w-4 h-4" />, 
      color: 'border-indigo-500 text-indigo-500 bg-indigo-50', 
      bgGlow: 'from-indigo-500/10 to-indigo-500/0',
      description: 'Ingesting the target domain and staging the initial crawl payload.' 
    },
    { 
      id: 'firecrawl', 
      label: 'Firecrawl API', 
      icon: <Terminal className="w-4 h-4" />, 
      color: 'border-amber-500 text-amber-500 bg-amber-50', 
      bgGlow: 'from-amber-500/10 to-amber-500/0',
      description: 'Executing high-speed raw HTML scraping and Javascript asset rendering.' 
    },
    { 
      id: 'graph', 
      label: 'Website Graph', 
      icon: <Network className="w-4 h-4" />, 
      color: 'border-emerald-500 text-emerald-500 bg-emerald-50', 
      bgGlow: 'from-emerald-500/10 to-emerald-500/0',
      description: 'Mapping directory hierarchy, relative link structures, and content weights.' 
    },
    { 
      id: 'business', 
      label: 'Business Analysis', 
      icon: <Cpu className="w-4 h-4" />, 
      color: 'border-purple-500 text-purple-500 bg-purple-50', 
      bgGlow: 'from-purple-500/10 to-purple-500/0',
      description: 'Extracting product value propositions, pricing indices, and core messaging tags.' 
    },
    { 
      id: 'audience', 
      label: 'Target Audience', 
      icon: <Users className="w-4 h-4" />, 
      color: 'border-blue-500 text-blue-500 bg-blue-50', 
      bgGlow: 'from-blue-500/10 to-blue-500/0',
      description: 'Reconstructing ideal customer personas, segment pain-points, and intent vectors.' 
    },
    { 
      id: 'competitors', 
      label: 'Competitors', 
      icon: <Award className="w-4 h-4" />, 
      color: 'border-rose-500 text-rose-500 bg-rose-50', 
      bgGlow: 'from-rose-500/10 to-rose-500/0',
      description: 'Locating overlap index competitors and indexing key search market shares.' 
    },
    { 
      id: 'seo', 
      label: 'SEO Audit', 
      icon: <FileSearch className="w-4 h-4" />, 
      color: 'border-sky-500 text-sky-500 bg-sky-50', 
      bgGlow: 'from-sky-500/10 to-sky-500/0',
      description: 'Verifying core Web Vitals, speed index ratings, and technical SEO meta layouts.' 
    },
    { 
      id: 'plan', 
      label: 'Marketing Plan', 
      icon: <CheckCircle2 className="w-4 h-4" />, 
      color: 'border-zinc-800 text-zinc-800 bg-zinc-100', 
      bgGlow: 'from-zinc-900/10 to-zinc-900/0',
      description: 'Assembling programmatic content, ad split targets, and email drip pipelines.' 
    }
  ];

  // Auto-advance active tab during crawling simulation
  useEffect(() => {
    if (isAnalyzing) {
      // Map currentStepIndex (0-6) to the 8 onboarding pipeline steps
      const stepMapping = ['url', 'firecrawl', 'graph', 'business', 'audience', 'competitors', 'seo', 'plan'];
      // Rotate active step dynamically within the logical segment
      const targetStep = stepMapping[Math.min(currentStepIndex, stepMapping.length - 1)];
      setActiveStepId(targetStep);
    }
  }, [isAnalyzing, currentStepIndex]);

  // Generate simulated streaming crawler logs
  useEffect(() => {
    if (isAnalyzing) {
      const logs = [
        `[ProxyPool] Initializing connection to ${displayUrl}`,
        `[Firecrawl] Scraping domain sitemap index...`,
        `[Firecrawl] Success. Located 42 nested routes.`,
        `[Parser] Stripping script nodes & style vectors`,
        `[Website Graph] Compiling page weight matrices`,
        `[Business Analyst] Mapping positioning anchors`,
        `[SEO] Analyzing Google Speed Vitals parameters`,
        `[Data Lake] Packaging final context schema...`
      ];
      
      let index = 0;
      setTickerLogs([logs[0]]);
      const interval = setInterval(() => {
        index = (index + 1) % logs.length;
        setTickerLogs(prev => [logs[index], ...prev.slice(0, 5)]);
      }, 3500);

      return () => clearInterval(interval);
    } else {
      setTickerLogs([
        `[System] Analysis completed for ${displayUrl}`,
        `[Data Lake] Workspace state synced across 7 specialized departments`,
        `[Security] Authorization token active`
      ]);
    }
  }, [isAnalyzing, displayUrl]);

  const activeStep = pipelineSteps.find(s => s.id === activeStepId) || pipelineSteps[0];

  return (
    <div id="crawl-discovery-workspace" className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[9px] font-mono font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded shadow-sm">
            Onboarding Discovery Pipeline
          </span>
          <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wide font-mono mt-2">
            Automated Ingestion Sequence
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
            Track how our orchestrator crawls your website to extract deep semantic properties and feed our execution models.
          </p>
        </div>

        {/* The 8-Step Interactive Progress Pipeline Bar */}
        <div className="relative py-2">
          {/* Connector Line Background */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-100 -translate-y-1/2" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative z-10">
            {pipelineSteps.map((step, idx) => {
              const isActive = activeStepId === step.id;
              
              // Determine if step is "completed" based on the current state
              const stepIndex = pipelineSteps.findIndex(s => s.id === step.id);
              const activeIndex = pipelineSteps.findIndex(s => s.id === activeStepId);
              const isCompleted = stepIndex < activeIndex || (!isAnalyzing && analysisResult);

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`p-2.5 rounded-md border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between h-[82px] group ${
                    isActive 
                      ? 'border-zinc-900 bg-zinc-950 text-white shadow-md' 
                      : isCompleted
                      ? 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                      : 'border-zinc-150 bg-white hover:border-zinc-250 text-zinc-400'
                  }`}
                >
                  {/* Subtle hover gradient indicator */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className={`p-1 rounded border ${isActive ? 'bg-zinc-800 border-zinc-700 text-white' : step.color}`}>
                      {step.icon}
                    </div>
                    {isCompleted && !isActive && (
                      <span className="text-[8px] bg-emerald-500 text-white p-0.5 rounded-full leading-none font-bold">✓</span>
                    )}
                    {isActive && isAnalyzing && (
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 mt-2">
                    <span className="text-[8px] font-mono block text-zinc-400 font-bold">STAGE_0{idx + 1}</span>
                    <span className="text-[10px] font-black tracking-tight uppercase font-mono block truncate">
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Detail Console Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Node detail display card */}
          <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-md p-5 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-zinc-900 border border-zinc-950 text-white rounded">
                  {activeStep.icon}
                </span>
                <div>
                  <h4 className="text-xs font-black uppercase font-mono tracking-wider text-zinc-900">
                    {activeStep.label} Node
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold font-mono">
                    STATUS: {isAnalyzing && activeStepId === activeStep.id ? 'ACTIVE_RUNNING' : 'SYNCED_STABLE'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-600 font-medium leading-relaxed mb-4 max-w-xl">
                {activeStep.description}
              </p>

              {/* Dynamic Content injected from actual Analysis Payload */}
              <div className="bg-white border border-zinc-150 rounded p-3.5 space-y-2.5">
                {activeStepId === 'url' && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">TARGET_HOST</span>
                    <code className="text-[11px] font-mono text-indigo-700 bg-indigo-50/50 border border-indigo-100/60 px-2 py-0.5 rounded break-all">
                      {displayUrl}
                    </code>
                    <p className="text-[10px] text-zinc-500 mt-1 font-medium">
                      Host parameter locked in. Initial routing set via DNS and HTTPS handshakes.
                    </p>
                  </div>
                )}

                {activeStepId === 'firecrawl' && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">SCRAPING_RESULT</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-zinc-800">Crawl Depth:</span>
                      <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 border rounded font-mono font-bold text-zinc-600">Recursive Sitemap (v2)</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium leading-snug">
                      Raw markup extracted and normalized into structured markdown blocks to remove boilerplate header/footer clusters.
                    </p>
                  </div>
                )}

                {activeStepId === 'graph' && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">WEBSITE_GRAPH_MATRIX</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['/', '/pricing', '/features', '/about', '/blog'].map((p) => (
                        <span key={p} className="text-[9px] font-mono bg-emerald-50 border border-emerald-150 text-emerald-700 px-2 py-0.5 rounded font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      Structure mapped. Verified canonical alignments, redirect loops, and crawl budgets.
                    </p>
                  </div>
                )}

                {activeStepId === 'business' && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">EXTRACTED_BRAND_METRICS</span>
                    {analysisResult?.ceo ? (
                      <div className="space-y-1">
                        <div className="text-xs font-black text-zinc-800 uppercase font-mono">{analysisResult.ceo.brandName}</div>
                        <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                          {analysisResult.ceo.executiveSummary}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-medium italic">
                        {industry ? `Niche: ${industry}. Processing value proposition tags...` : 'Extracting brand identity and category tags...'}
                      </p>
                    )}
                  </div>
                )}

                {activeStepId === 'audience' && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">BUYER_PERSONA_PROFILE</span>
                    {analysisResult?.ceo ? (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-zinc-800">Ideal Customer Persona:</div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                          {analysisResult.ceo.targetAudience}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-medium italic">
                        Inferring customer pain-points and demographic segment tags...
                      </p>
                    )}
                  </div>
                )}

                {activeStepId === 'competitors' && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">COMPETITIVE_SET</span>
                    {analysisResult?.ceo?.majorCompetitors && analysisResult.ceo.majorCompetitors.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.ceo.majorCompetitors.map((comp) => (
                          <span key={comp} className="text-[10px] font-bold font-mono bg-rose-50 border border-rose-150 text-rose-700 px-2 py-0.5 rounded">
                            {comp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-medium italic">
                        Mapping competitor overlaps and paid target keyword clusters...
                      </p>
                    )}
                  </div>
                )}

                {activeStepId === 'seo' && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">TECHNICAL_SEO_VITALS</span>
                    {analysisResult?.seo ? (
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-zinc-50 p-1.5 border rounded">
                          <span className="text-zinc-400 font-mono font-bold block text-[8px]">HEALTH_SCORE</span>
                          <span className="font-bold text-zinc-800">{analysisResult.seo.score}/100</span>
                        </div>
                        <div className="bg-zinc-50 p-1.5 border rounded">
                          <span className="text-zinc-400 font-mono font-bold block text-[8px]">MOBILE_FRIENDLY</span>
                          <span className="font-bold text-zinc-800">{analysisResult.seo.mobileFriendliness}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-medium italic">
                        Crawling technical meta tags, speed scores, and page load indexes...
                      </p>
                    )}
                  </div>
                )}

                {activeStepId === 'plan' && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold block">UNIFIED_MARKETING_ORCHESTRATION</span>
                    <p className="text-[10.5px] text-zinc-600 font-medium leading-relaxed">
                      Unified strategy fully distributed to individual specialist departments. Blog draft outlines, social calendars, PPC ad splits, and drip funnels pre-staged for execution.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time ingestion console logs block */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-md p-4 text-white flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
                  Crawler Console Logs
                </span>
                <span className="text-[8px] bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  {isAnalyzing ? 'STREAMING' : 'IDLE'}
                </span>
              </div>

              {/* Streaming list of logs */}
              <div className="space-y-1.5 font-mono text-[10px] text-zinc-300 max-h-[120px] overflow-y-auto">
                {tickerLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 leading-normal">
                    <span className="text-zinc-600 select-none">&bull;</span>
                    <span className={idx === 0 && isAnalyzing ? 'text-indigo-400 font-bold' : ''}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-3 text-[9px] font-mono text-zinc-500 font-semibold uppercase tracking-wider flex justify-between items-center mt-3">
              <span>Host API: firecrawl-v2.tls</span>
              <span>Port: 443 SECURE</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
