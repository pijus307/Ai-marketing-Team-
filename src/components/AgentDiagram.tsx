/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Sparkles, Search, FileText, Share2, DollarSign, Target, Mail, Cpu, TrendingUp, ArrowDown } from 'lucide-react';
import { RunStep } from '../types';

interface AgentDiagramProps {
  steps: RunStep[];
  currentStepIndex: number;
  isAnalyzing: boolean;
}

export default function AgentDiagram({ steps, currentStepIndex, isAnalyzing }: AgentDiagramProps) {
  // Find standard step progress
  const ceoStep = steps.find(s => s.agentId === 'ceo') || {
    agentId: 'ceo',
    agentName: 'Sophia Vance',
    status: 'pending' as const,
    message: 'Ready to establish positioning & key business growth objectives.'
  };

  // Construct Project Manager step (Aidan Cross)
  const isCeoActive = isAnalyzing && currentStepIndex === 0;
  const isCompletedAll = currentStepIndex >= steps.length;
  
  const pmStep = {
    agentId: 'pm',
    agentName: 'Aidan Cross',
    role: 'Project Manager Agent',
    status: !isAnalyzing 
      ? (isCompletedAll ? 'completed' as const : 'pending' as const)
      : (isCompletedAll ? 'completed' as const : 'running' as const),
    message: !isAnalyzing
      ? (isCompletedAll ? 'Campaign fully coordinated & active.' : 'Standing by to coordinate CEO strategy directives.')
      : (isCeoActive 
          ? 'Sophia Vance is formulating top-level goals. Pre-staging specialist boards...' 
          : `Orchestrating handoff. Actively routing directives to ${steps[currentStepIndex]?.agentName || 'next specialist'}...`)
  };

  // Construct Analytics/Business Analyst step (Oliver Vance)
  const analystStep = {
    agentId: 'analytics',
    agentName: 'Oliver Vance',
    role: 'Analytics Agent',
    status: !isAnalyzing
      ? (isCompletedAll ? 'completed' as const : 'pending' as const)
      : (isCompletedAll 
          ? 'completed' as const 
          : (currentStepIndex > 0 ? 'running' as const : 'pending' as const)),
    message: !isAnalyzing
      ? (isCompletedAll ? 'Calculated predictive revenue model: +18% growth.' : 'Awaiting marketing campaign metrics.')
      : (currentStepIndex === 0 
          ? 'Pending CEO strategy and unit economics inputs...'
          : `Processing predictive models based on active campaign outputs...`)
  };

  const getStepStatus = (id: string) => {
    if (id === 'ceo') return ceoStep.status;
    if (id === 'pm') return pmStep.status;
    if (id === 'analytics') return analystStep.status;
    const standardStep = steps.find(s => s.agentId === id);
    return standardStep ? standardStep.status : 'pending';
  };

  const getStepMessage = (id: string) => {
    if (id === 'ceo') return ceoStep.message;
    if (id === 'pm') return pmStep.message;
    if (id === 'analytics') return analystStep.message;
    const standardStep = steps.find(s => s.agentId === id);
    return standardStep ? standardStep.message : 'Standing by...';
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'ceo': return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'pm': return <Cpu className="w-5 h-5 text-zinc-700 animate-pulse" />;
      case 'seo': return <Search className="w-5 h-5 text-sky-600" />;
      case 'content': return <FileText className="w-5 h-5 text-emerald-600" />;
      case 'social': return <Share2 className="w-5 h-5 text-pink-600" />;
      case 'ads': return <DollarSign className="w-5 h-5 text-amber-600" />;
      case 'leadgen': return <Target className="w-5 h-5 text-purple-600" />;
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'analytics': return <TrendingUp className="w-5 h-5 text-violet-600" />;
      default: return <Sparkles className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getColorClass = (id: string) => {
    switch (id) {
      case 'ceo': return 'border-indigo-150 bg-indigo-50 text-indigo-700';
      case 'pm': return 'border-zinc-300 bg-zinc-100 text-zinc-800';
      case 'seo': return 'border-sky-150 bg-sky-50 text-sky-700';
      case 'content': return 'border-emerald-150 bg-emerald-50 text-emerald-700';
      case 'social': return 'border-pink-150 bg-pink-50 text-pink-700';
      case 'ads': return 'border-amber-150 bg-amber-50 text-amber-700';
      case 'leadgen': return 'border-purple-150 bg-purple-50 text-purple-700';
      case 'email': return 'border-blue-150 bg-blue-50 text-blue-700';
      case 'analytics': return 'border-violet-150 bg-violet-50 text-violet-700';
      default: return 'border-zinc-200 bg-zinc-50 text-zinc-600';
    }
  };

  const specialists = [
    { id: 'seo', name: 'Marcus Chen', role: 'SEO Agent' },
    { id: 'content', name: 'Elena Rostova', role: 'Content Agent' },
    { id: 'ads', name: 'Alex Mercer', role: 'Ads Agent' },
    { id: 'email', name: 'Daniel Kross', role: 'Email Agent' },
    { id: 'analytics', name: 'Oliver Vance', role: 'Analytics Agent' },
    { id: 'leadgen', name: 'Sarah Lin', role: 'Lead Agent' },
    { id: 'social', name: 'Chloe Jenkins', role: 'Social Agent' }
  ];

  const renderCard = (id: string, name: string, role: string, isPMOrCeo = false) => {
    const status = getStepStatus(id);
    const message = getStepMessage(id);
    
    const isActive = status === 'running';
    const isCompleted = status === 'completed';
    const isFailed = status === 'failed';

    return (
      <motion.div
        key={id}
        className={`flex flex-col relative z-10 border rounded-md p-4 transition-all duration-300 h-full ${
          isActive 
            ? 'border-zinc-800 bg-zinc-50 shadow-md ring-1 ring-zinc-800/20' 
            : isCompleted
            ? 'border-zinc-200 bg-white text-zinc-800'
            : isFailed
            ? 'border-rose-300 bg-rose-50 text-rose-800'
            : 'border-zinc-100 bg-zinc-50/50 text-zinc-400'
        }`}
        whileHover={{ y: -2 }}
      >
        {/* Status Indicator Bar */}
        <div className={`absolute top-0 inset-x-0 h-[3px] rounded-t-md ${
          isActive 
            ? 'bg-zinc-800 animate-pulse' 
            : isCompleted
            ? 'bg-zinc-800'
            : isFailed
            ? 'bg-rose-500'
            : 'bg-zinc-100'
        }`} />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <div className={`p-2 rounded border ${getColorClass(id)}`}>
            {getIcon(id)}
          </div>
          
          <span className="text-[9px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 font-bold uppercase">
            {status}
          </span>
        </div>

        {/* Info */}
        <div>
          <h4 className={`text-xs font-bold tracking-tight ${
            isActive ? 'text-zinc-950 font-black' : isCompleted || isFailed ? 'text-zinc-800' : 'text-zinc-400'
          }`}>
            {name}
          </h4>
          <p className="text-[10px] text-zinc-400 mt-0.5 font-bold font-mono">
            {role}
          </p>
        </div>

        {/* Message Log */}
        <div className="mt-2.5 flex-grow">
          <p className={`text-[10.5px] leading-relaxed line-clamp-3 font-medium ${
            isActive ? 'text-zinc-700 font-semibold' : isCompleted ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            {message}
          </p>
        </div>

        {/* Active Ping */}
        {isActive && (
          <div className="absolute bottom-2 right-2 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-850 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-950"></span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div id="agent-pipeline-diagram" className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-zinc-150 gap-4">
        <div>
          <h2 className="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-zinc-700 animate-pulse" />
            Active Agency Hierarchy
          </h2>
          <p className="text-zinc-500 text-xs mt-1 font-medium">
            {isAnalyzing 
              ? "Orchestrating multi-agent collaboration and strategy synthesis..." 
              : "Campaign architecture and delegation chart"}
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono font-bold text-[10px]">
          <span className="text-zinc-400">STATUS:</span>
          {isAnalyzing ? (
            <span className="px-3 py-1 bg-zinc-900 text-white border border-zinc-950 rounded text-[9px] flex items-center gap-1.5 uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              RUNNING STRATEGY
            </span>
          ) : (
            <span className="px-3 py-1 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded text-[9px] flex items-center gap-1.5 uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              AGENCY READY
            </span>
          )}
        </div>
      </div>

      {/* Corporate Tree Layout */}
      <div className="flex flex-col items-center w-full">
        
        {/* ROW 1: CEO Agent */}
        <div className="w-full max-w-xs md:max-w-sm">
          {renderCard('ceo', ceoStep.agentName, 'CEO & Fractional CMO', true)}
        </div>

        {/* CONNECTOR 1: CEO -> PM */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="w-[2px] h-8 bg-zinc-300 relative">
            {isAnalyzing && currentStepIndex === 0 && (
              <motion.div 
                className="absolute left-[-2px] w-[6px] h-[6px] rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.8)]"
                animate={{ y: [0, 32] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
          <ArrowDown className="w-4 h-4 text-zinc-400 mt-[-2px]" />
        </div>

        {/* ROW 2: Project Manager */}
        <div className="w-full max-w-xs md:max-w-sm">
          {renderCard('pm', pmStep.agentName, 'Project Manager Agent', true)}
        </div>

        {/* CONNECTOR 2: PM -> Splits to Specialists */}
        <div className="flex flex-col items-center justify-center my-2 w-full">
          <div className="w-[2px] h-8 bg-zinc-300 relative">
            {isAnalyzing && currentStepIndex > 0 && (
              <motion.div 
                className="absolute left-[-2px] w-[6px] h-[6px] rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                animate={{ y: [0, 32] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
          <ArrowDown className="w-4 h-4 text-zinc-400 mt-[-2px]" />
        </div>

        {/* ROW 3: Horizontal Distribution Bar */}
        <div className="hidden lg:block w-[92%] mx-auto h-[2px] bg-zinc-200 relative mb-8">
          <div className="absolute top-[-3px] left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-400" />
          {/* Ticks going down to each of the 7 columns */}
          <div className="absolute inset-x-0 top-0 flex justify-between px-[6%]">
            {specialists.map((spec) => {
              const status = getStepStatus(spec.id);
              return (
                <div 
                  key={spec.id} 
                  className={`w-[2px] h-5 transition-colors duration-300 ${
                    status === 'running' ? 'bg-amber-500' : status === 'completed' ? 'bg-zinc-800' : 'bg-zinc-200'
                  }`} 
                />
              );
            })}
          </div>
        </div>

        {/* ROW 4: 7 Specialist Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 w-full mt-2">
          {specialists.map((spec) => (
            <div key={spec.id} className="h-full">
              {renderCard(spec.id, spec.name, spec.role)}
            </div>
          ))}
        </div>

      </div>

      {/* Progress timeline overlay */}
      {isAnalyzing && (
        <div className="mt-8 p-4 bg-zinc-50 border border-zinc-200 rounded-md flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-zinc-800 animate-spin flex-shrink-0" />
          <p className="text-xs text-zinc-600 leading-relaxed font-medium">
            <strong className="font-bold text-zinc-900">Delegation Log:</strong> {steps[currentStepIndex]?.agentName || 'Project Manager'} is processing task queue. The agency is utilizing Google Gemini reasoning to formulate high-fidelity strategic maps.
          </p>
        </div>
      )}
    </div>
  );
}
