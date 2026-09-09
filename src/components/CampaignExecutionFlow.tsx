/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Newspaper, Share2, Target, Search, Mail, Database, FileText,
  ChevronRight, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { MarketingAnalysis } from '../types';

interface CampaignExecutionFlowProps {
  analysisResult: MarketingAnalysis;
  isPublishing: boolean;
  publishComplete: boolean;
  activeStepIndex: number;
}

interface PipelineStepItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
  description: string;
  platform: string;
}

export default function CampaignExecutionFlow({ 
  analysisResult, 
  isPublishing, 
  publishComplete, 
  activeStepIndex 
}: CampaignExecutionFlowProps) {
  const [selectedStepId, setSelectedStepId] = useState<string>('campaign_ready');

  const pipelineSteps: PipelineStepItem[] = [
    { 
      id: 'campaign_ready', 
      label: 'Campaign Ready', 
      icon: <Sparkles className="w-4 h-4" />, 
      color: 'border-indigo-500 text-indigo-500 bg-indigo-50', 
      bgGlow: 'from-indigo-500/10 to-indigo-500/0',
      platform: 'Sophia Vance Core Engine',
      description: 'Staging absolute multi-channel structures, blog outlines, email sequences, and keywords.' 
    },
    { 
      id: 'approve', 
      label: 'Approve', 
      icon: <ShieldCheck className="w-4 h-4" />, 
      color: 'border-amber-500 text-amber-500 bg-amber-50', 
      bgGlow: 'from-amber-500/10 to-amber-500/0',
      platform: 'CEO & Stakeholder Consent Authority',
      description: 'Consent authorized. Generating live execution parameters and authorization tokens.' 
    },
    { 
      id: 'publish_blog', 
      label: 'Publish Blog', 
      icon: <Newspaper className="w-4 h-4" />, 
      color: 'border-emerald-500 text-emerald-500 bg-emerald-50', 
      bgGlow: 'from-emerald-500/10 to-emerald-500/0',
      platform: 'WordPress REST API',
      description: `Publishing authority pillar: "${analysisResult.content.blogArticles[0]?.title || 'Growth Authority Pillar'}"` 
    },
    { 
      id: 'publish_linkedin', 
      label: 'Publish LinkedIn', 
      icon: <Share2 className="w-4 h-4" />, 
      color: 'border-blue-500 text-blue-500 bg-blue-50', 
      bgGlow: 'from-blue-500/10 to-blue-500/0',
      platform: 'LinkedIn B2B Gateway',
      description: 'Posting executive thought-leadership summaries and scroll-stopping B2B captions.' 
    },
    { 
      id: 'create_meta_ads', 
      label: 'Create Meta Ads', 
      icon: <Target className="w-4 h-4" />, 
      color: 'border-rose-500 text-rose-500 bg-rose-50', 
      bgGlow: 'from-rose-500/10 to-rose-500/0',
      platform: 'Meta Graph API v19.0',
      description: `Deploying lead capture ads & targeting matrix for budget: ${analysisResult.ads.monthlyBudgetRecommendation}` 
    },
    { 
      id: 'create_google_ads', 
      label: 'Create Google Ads', 
      icon: <Search className="w-4 h-4" />, 
      color: 'border-sky-500 text-sky-500 bg-sky-50', 
      bgGlow: 'from-sky-500/10 to-sky-500/0',
      platform: 'Google Search Ads Scripts SDK',
      description: `Targeting exact keywords: ${analysisResult.seo.coreKeywords.slice(0, 3).map(k => k.keyword).join(', ')}` 
    },
    { 
      id: 'schedule_email', 
      label: 'Schedule Email', 
      icon: <Mail className="w-4 h-4" />, 
      color: 'border-purple-500 text-purple-500 bg-purple-50', 
      bgGlow: 'from-purple-500/10 to-purple-500/0',
      platform: 'Klaviyo Campaigns API',
      description: `Loading email campaign: "${analysisResult.email.campaignName}" to active nurture lists.` 
    },
    { 
      id: 'update_crm', 
      label: 'Update CRM', 
      icon: <Database className="w-4 h-4" />, 
      color: 'border-teal-500 text-teal-500 bg-teal-50', 
      bgGlow: 'from-teal-500/10 to-teal-500/0',
      platform: 'n8n Automation / HubSpot CRM',
      description: 'Binding lead score triggers, opt-in forms, and live Slack workspace alerts.' 
    },
    { 
      id: 'generate_report', 
      label: 'Generate Report', 
      icon: <FileText className="w-4 h-4" />, 
      color: 'border-zinc-800 text-zinc-800 bg-zinc-100', 
      bgGlow: 'from-zinc-900/10 to-zinc-900/0',
      platform: 'Core Analytics Engine',
      description: 'Compiling PDF/CSV executive audits & synchronizing live workspace parameters.' 
    }
  ];

  // Auto advance selected tab when publishing is active
  useEffect(() => {
    if (isPublishing && activeStepIndex >= 0) {
      const targetStep = pipelineSteps[Math.min(activeStepIndex, pipelineSteps.length - 1)];
      if (targetStep) {
        setSelectedStepId(targetStep.id);
      }
    } else if (publishComplete) {
      setSelectedStepId('generate_report');
    }
  }, [isPublishing, activeStepIndex, publishComplete]);

  const activeNode = pipelineSteps.find(s => s.id === selectedStepId) || pipelineSteps[0];
  const activeNodeIndex = pipelineSteps.findIndex(s => s.id === selectedStepId);

  return (
    <div id="campaign-execution-flow-node" className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm relative overflow-hidden">
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded shadow-sm">
              Unified Delivery Flow
            </span>
            <h3 className="text-sm font-black text-zinc-950 uppercase tracking-wide font-mono mt-2">
              Execution Control Pipeline
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
              Track the live flow of strategic campaign publishing. See how assets publish across production gateways.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isPublishing ? 'bg-amber-500 animate-pulse' : publishComplete ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
              {isPublishing ? 'TRANSMITTING' : publishComplete ? 'ALL SYSTEMS LIVE' : 'STAGED STANDBY'}
            </span>
          </div>
        </div>

        {/* Horizontal Pipeline Steps Container */}
        <div className="relative py-2">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-100 -translate-y-1/2" />
          
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 relative z-10">
            {pipelineSteps.map((step, idx) => {
              const isActive = selectedStepId === step.id;
              const stepIndex = pipelineSteps.findIndex(s => s.id === step.id);
              
              // Determine if completed based on overall index
              const isCompleted = publishComplete || (isPublishing && idx < activeStepIndex);
              const isCurrent = isPublishing && idx === activeStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-2.5 rounded-md border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between h-[82px] group ${
                    isActive 
                      ? 'border-zinc-900 bg-zinc-950 text-white shadow-md' 
                      : isCompleted
                      ? 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                      : 'border-zinc-150 bg-white hover:border-zinc-250 text-zinc-400'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className={`p-1 rounded border ${isActive ? 'bg-zinc-800 border-zinc-700 text-white' : step.color}`}>
                      {step.icon}
                    </div>
                    {isCompleted && !isActive && (
                      <span className="text-[8px] bg-emerald-500 text-white p-0.5 rounded-full leading-none font-bold">✓</span>
                    )}
                    {isCurrent && (
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 mt-2">
                    <span className="text-[8px] font-mono block text-zinc-400 font-bold">NODE_0{idx + 1}</span>
                    <span className="text-[10px] font-black tracking-tight uppercase font-mono block truncate">
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Panel Detail Box */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex-grow max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className={`p-1 rounded border bg-white ${activeNode.color}`}>
                {activeNode.icon}
              </span>
              <div>
                <h4 className="text-xs font-black uppercase font-mono text-zinc-900 tracking-wider">
                  {activeNode.label} Node
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono font-bold">
                  INTEGRATION: {activeNode.platform}
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              {activeNode.description}
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[8px] font-mono text-zinc-400 block font-bold">PIPELINE STATUS</span>
              <span className={`text-[10px] font-mono font-black uppercase ${
                publishComplete || (isPublishing && activeNodeIndex < activeStepIndex)
                  ? 'text-emerald-600'
                  : isPublishing && activeNodeIndex === activeStepIndex
                  ? 'text-amber-500'
                  : 'text-zinc-400'
              }`}>
                {publishComplete || (isPublishing && activeNodeIndex < activeStepIndex)
                  ? 'COMMITTED_SUCCESS'
                  : isPublishing && activeNodeIndex === activeStepIndex
                  ? 'PUSHING_ASSETS_LIVE'
                  : 'PENDING_QUEUE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
