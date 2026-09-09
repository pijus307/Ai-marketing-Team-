/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Search, Shield, ChevronRight, Play, Terminal, Database, Cpu, 
  GitBranch, CheckCircle2, AlertCircle, Info, ExternalLink, ArrowRight, ArrowDownRight, Layers,
  Pause, RotateCcw, XCircle
} from 'lucide-react';
import { WORKFORCE_AGENTS, ORCHESTRATOR_BLUEPRINT, AgentBlueprint } from '../data/workforceData';

interface WorkforceMatrixViewProps {
  onboardedUrl?: string;
  onSelectAgentForChat?: (agentId: string) => void;
}

export default function WorkforceMatrixView({ onboardedUrl, onSelectAgentForChat }: WorkforceMatrixViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentBlueprint | null>(WORKFORCE_AGENTS[0]);
  
  // Real-time Workforce Orchestrator state variables
  const [executionMode, setExecutionMode] = useState<'sequential' | 'parallel'>('parallel');
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'paused' | 'cancelled' | 'completed'>('idle');
  const [agentsState, setAgentsState] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [globalLogs, setGlobalLogs] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [simDomain, setSimDomain] = useState(onboardedUrl || 'https://linear.app');

  // Simulation fallback terminal state (for offline or local checks)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLog, setSimLog] = useState<Array<{ sender: string; message: string; timestamp: string; level: 'info' | 'success' | 'warn' | 'api' }>>([]);
  const [simStep, setSimStep] = useState(0);

  const categories = [
    'All',
    'Executive & PM Suite',
    'SEO & Research',
    'Content & Creative',
    'Acquisition & Advertising',
    'Funnel & CRM Desk',
    'UX, Analytics & Audit'
  ];

  // Filtering logic
  const filteredAgents = WORKFORCE_AGENTS.filter(agent => {
    const matchesCategory = activeCategory === 'All' || agent.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.mission.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      agent.apis.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Effect to automatically poll the real-time agent workflow status
  useEffect(() => {
    let timer: any = null;
    if (workflowStatus === 'running' || isPolling) {
      const pollWorkflow = async () => {
        try {
          const res = await fetch('/api/agents/workflow/status');
          if (res.ok) {
            const data = await res.json();
            setWorkflowStatus(data.workflowStatus);
            setExecutionMode(data.executionMode);
            setTasks(data.tasks);
            setAgentsState(data.agents);
            setGlobalLogs(data.globalLogs);

            // Auto-scroll the real terminal to bottom
            const term = document.getElementById('simulation-terminal-screen');
            if (term) term.scrollTop = term.scrollHeight;

            if (data.workflowStatus !== 'running' && data.workflowStatus !== 'paused') {
              setIsPolling(false);
            }
          }
        } catch (err) {
          console.error('[POLLING WORKFLOW ERROR]', err);
        }
      };

      pollWorkflow();
      timer = setInterval(pollWorkflow, 1500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [workflowStatus, isPolling]);

  // Methods to interact with real multi-agent orchestrator backend APIs
  const startRealWorkflow = async () => {
    if (workflowStatus === 'running') return;
    try {
      setWorkflowStatus('running');
      setIsPolling(true);
      setGlobalLogs(['[System] Initializing 10-agent digital marketing workforce...']);

      const response = await fetch('/api/agents/workflow/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: simDomain,
          industry: 'Inferred via domain scan',
          companyDescription: 'Optimized automatically by executive suite',
          customGoals: 'Establish organic SEO authority, maximize qualified email leads, outline high-conversion funnel framework',
          executionMode,
          optimizationMode: 'balanced'
        })
      });

      if (!response.ok) {
        throw new Error('Backend failed to boot workforce pipeline.');
      }
    } catch (err: any) {
      setGlobalLogs(prev => [...prev, `[System Error] ${err.message}`]);
      setWorkflowStatus('idle');
      setIsPolling(false);
    }
  };

  const pauseRealWorkflow = async () => {
    try {
      await fetch('/api/agents/workflow/pause', { method: 'POST' });
      setWorkflowStatus('paused');
    } catch (err) {
      console.error(err);
    }
  };

  const resumeRealWorkflow = async () => {
    try {
      await fetch('/api/agents/workflow/resume', { method: 'POST' });
      setWorkflowStatus('running');
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRealWorkflow = async () => {
    try {
      await fetch('/api/agents/workflow/cancel', { method: 'POST' });
      setWorkflowStatus('cancelled');
      setIsPolling(false);
    } catch (err) {
      console.error(err);
    }
  };

  const retryRealWorkflow = async () => {
    try {
      setWorkflowStatus('running');
      setIsPolling(true);
      await fetch('/api/agents/workflow/retry', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  // Orchestrator Simulation steps (Fallback)
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLog([]);
    setSimStep(0);

    const logLines = [
      {
        sender: 'Orchestrator Core',
        message: `Initializing 24-agent workforce for brand domain: ${simDomain}`,
        level: 'info' as const
      },
      {
        sender: 'Aidan Cross (PM)',
        message: 'Aether Marketing OS database schema provisioned. Generating Task Dependency Tree with 24 specialist nodes.',
        level: 'success' as const
      },
      {
        sender: 'Sophia Vance (CEO)',
        message: `Analyzing positioning for ${simDomain}. Formulating SWOT. Allocating global CPA target values. Directive dispatched.`,
        level: 'success' as const
      },
      {
        sender: 'Oliver Vance (Analyst)',
        message: 'CEO guidelines parsed. Calculating COGS. Allocating budget boundaries: 45% Google Search, 35% Meta Ads, 20% CRM Funnel.',
        level: 'api' as const
      },
      {
        sender: 'Caleb Wright (Web Audit)',
        message: `Crawl node activated. Parsing URL tags and indexing page directories for ${simDomain}. Identified 14 indexable anchors.`,
        level: 'info' as const
      },
      {
        sender: 'Tariq Shah (Keywords)',
        message: 'Keyword research pool synchronized with Google Keyword Planner API. Extracting 25 high-search transactional clusters.',
        level: 'api' as const
      },
      {
        sender: 'Sonia Gupta (Competitors)',
        message: 'Scraping competitor ad accounts. Mapping bidding density. Forwarding keyword gaps to On-Page SEO.',
        level: 'info' as const
      },
      {
        sender: 'Marcus Chen (SEO Expert)',
        message: 'Synthesizing On-Page SEO templates. Creating optimized Title, H1, H2 mappings for core product landers.',
        level: 'success' as const
      },
      {
        sender: 'Julian Mercer (Branding)',
        message: 'Style sheet and voice metrics aligned. tone: \"Sophisticated, Clean, Data-Driven.\" Font stack and color codes locked in.',
        level: 'success' as const
      },
      {
        sender: 'Elena Rostova (UX Expert)',
        message: 'Constructing Above-the-fold wireframe grid. Friction indices checked. Handing section maps to Lead Gen.',
        level: 'info' as const
      },
      {
        sender: 'Elena Rostova (Strategist)',
        message: 'Content Pillars designated. 3 authoritative blog structures engineered. SEO tags embedded.',
        level: 'success' as const
      },
      {
        sender: 'Sarah Lin (Lead Gen)',
        message: 'Formulating high-conversion lead magnet: \"Ultimate Industry Growth Bible.\" Conversion funnel sequences established.',
        level: 'success' as const
      },
      {
        sender: 'Nadia Chen (Landing Writer)',
        message: 'Writing Direct-Response Copy for Lead Lander. Headline: \"The Fast Way to Scale Teams.\" A/B variants dispatched.',
        level: 'info' as const
      },
      {
        sender: 'Alex Mercer (Meta Ads)',
        message: 'Multivariate Meta Ad draft written. Copy variants: PAS & BAB frameworks. Dynamic creative assets generated.',
        level: 'success' as const
      },
      {
        sender: 'Daniel Kross (Email)',
        message: '3-Part welcome flow fully written. Delays set to 0 days, 2 days, and 5 days. Subject lines A/B testing configured.',
        level: 'success' as const
      },
      {
        sender: 'Victor Cole (CRM)',
        message: 'HubSpot automation triggers mapped. Lead Scoring Rule established: +15 points on checklist download.',
        level: 'api' as const
      },
      {
        sender: 'Sacha Lindt (CRO)',
        message: 'Hypotheses finalized. Ready to launch variant tests on lead magnets and signup CTA buttons.',
        level: 'success' as const
      },
      {
        sender: 'Mia Thorne (Analytics)',
        message: 'GA4 custom event tracking code generated. Facebook Pixel conversion code embedded on thank-you lander.',
        level: 'api' as const
      },
      {
        sender: 'Serena Frost (Reporting)',
        message: 'All specialist playbooks crawled and normalized. Compiling Master Dossier and client-facing growth proposal PDF.',
        level: 'success' as const
      },
      {
        sender: 'Orchestrator Core',
        message: 'Marketing OS Master Campaign compiled with 0 errors. Dashboard synchronized. System ready.',
        level: 'success' as const
      }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logLines.length) {
        const line = logLines[currentIdx];
        setSimLog(prev => [...prev, {
          sender: line.sender,
          message: line.message,
          timestamp: new Date().toLocaleTimeString(),
          level: line.level
        }]);
        setSimStep(currentIdx + 1);
        currentIdx++;
        
        // Auto scroll terminal
        const term = document.getElementById('simulation-terminal-screen');
        if (term) term.scrollTop = term.scrollHeight;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  return (
    <div id="ai-workforce-matrix" className="space-y-8 pb-12">
      {/* Overview Hero Panel */}
      <div className="bg-zinc-900 text-white rounded-md p-6 md:p-8 border border-zinc-950 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Layers className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-[9px] font-mono tracking-widest font-bold uppercase">
            Organizational Schema
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Specialized 24-Agent Workforce Matrix
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
            Welcome to Aether's complete AI marketing workforce. We have engineered 24 highly specialized digital agents that collaborate in real-time, executing tasks from web crawls to ad spend allocations and copy crafting, replacing an entire physical marketing agency.
          </p>
        </div>
      </div>

      {/* Roster & Deep Specs Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Roster List (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-md p-4 md:p-6 shadow-sm space-y-6">
          
          {/* Header & Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-zinc-900 tracking-tight font-mono uppercase">
                  Staff Roster ({filteredAgents.length})
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Browse agent desks or search for specific tools & APIs.</p>
              </div>
              
              {/* Search input */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools, APIs, roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-800 text-[11px] rounded px-3 py-2 pl-9 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Category tabs scroll */}
            <div className="flex flex-wrap gap-1.5 border-b border-zinc-150 pb-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded border transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-zinc-900 border-zinc-950 text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Agents List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgents.length === 0 ? (
              <div className="col-span-2 text-center py-12 border border-dashed border-zinc-200 rounded-md bg-zinc-50 space-y-2">
                <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-600 font-medium">No agents found matching "{searchQuery}"</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="text-[10px] text-indigo-600 hover:underline font-bold font-mono"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredAgents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`border rounded-md p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full group ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50/50 shadow-md ring-1 ring-zinc-900/10'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/20'
                    }`}
                  >
                    <div>
                      {/* Avatar, Category & ID Tag */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{agent.avatar}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${agent.color.bg} ${agent.color.text} border ${agent.color.border}`}>
                            {agent.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono font-bold text-zinc-400">
                          {agent.category}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <h4 className="text-xs font-extrabold text-zinc-800 group-hover:text-zinc-955 tracking-tight">
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5">
                        {agent.role}
                      </p>

                      {/* Brief Mission preview */}
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-medium mt-2 line-clamp-2">
                        {agent.mission}
                      </p>
                    </div>

                    {/* Bottom CTA Actions */}
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold font-mono text-indigo-600 group-hover:underline flex items-center gap-1">
                        View Blueprint
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      {onSelectAgentForChat && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAgentForChat(agent.id);
                          }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[9px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                        >
                          Chat Live
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Blueprint Spec (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {selectedAgent && (
              <motion.div
                key={selectedAgent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-zinc-950 rounded-md p-6 shadow-md space-y-6 relative overflow-hidden"
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between pb-4 border-b border-zinc-200">
                  <div className="space-y-1">
                    <span className={`px-2 py-0.5 text-[8px] font-mono font-bold rounded uppercase tracking-wider ${selectedAgent.color.bg} ${selectedAgent.color.text} border ${selectedAgent.color.border}`}>
                      {selectedAgent.category}
                    </span>
                    <h3 className="text-base font-black text-zinc-900 tracking-tight flex items-center gap-2">
                      <span className="text-xl">{selectedAgent.avatar}</span>
                      {selectedAgent.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono font-bold">
                      {selectedAgent.role}
                    </p>
                  </div>
                  {onSelectAgentForChat && (
                    <button
                      onClick={() => onSelectAgentForChat(selectedAgent.id)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      Consult Agent
                    </button>
                  )}
                </div>

                {/* Section 1: Mission Card */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Mission Statement</h4>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md">
                    <p className="text-xs text-zinc-700 italic leading-relaxed font-medium">
                      "{selectedAgent.mission || selectedAgent.description}"
                    </p>
                  </div>
                </div>

                {/* Section 2: Model & Memory Spec */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">AI Model Target</h4>
                    <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-md h-full flex flex-col justify-between">
                      <span className="text-xs font-black text-zinc-900 font-mono flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-zinc-600" />
                        {selectedAgent.modelRecommendation?.model || 'Gemini 2.5 Flash / Multi-Model'}
                      </span>
                      <p className="text-[10px] text-zinc-500 font-medium leading-normal mt-1.5">
                        {selectedAgent.modelRecommendation?.rationale || 'Optimal balance of speed, reasoning depth, and contextual understanding'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Memory Architecture</h4>
                    <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-md h-full flex flex-col justify-between">
                      <span className="text-xs font-black text-zinc-900 font-mono flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-zinc-600" />
                        {selectedAgent.memoryRequirements?.type || 'Vector DB & Session Context'}
                      </span>
                      <p className="text-[10px] text-zinc-500 font-medium leading-normal mt-1.5">
                        {selectedAgent.memoryRequirements?.description || 'Persistent long-term brand memory and active campaign context'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Responsibilities */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Responsibilities</h4>
                  <ul className="space-y-2">
                    {(selectedAgent.responsibilities || selectedAgent.capabilities || []).map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-zinc-800 mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section 4: Inputs / Outputs Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Incoming Variables
                    </h4>
                    <div className="p-2 bg-indigo-50/30 border border-indigo-100 rounded text-[10px] text-indigo-900 font-mono leading-relaxed h-24 overflow-y-auto">
                      {(selectedAgent.inputs || ['Brand URL', 'Industry Context', 'Target Goals']).join(", ")}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Outgoing Payload
                    </h4>
                    <div className="p-2 bg-emerald-50/30 border border-emerald-100 rounded text-[10px] text-emerald-900 font-mono leading-relaxed h-24 overflow-y-auto">
                      {(selectedAgent.outputs || ['Strategic Artifacts', 'Campaign Actions']).join(", ")}
                    </div>
                  </div>
                </div>

                {/* Section 5: Tools & APIs */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block mb-1.5">Custom Tools</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.tools.map((tool, idx) => (
                        <span key={idx} className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[9px] font-bold font-mono rounded text-zinc-700">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block mb-1.5">External APIs Connected</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedAgent.apis || ['Google Workspace API', 'Gemini AI API']).map((api, idx) => (
                        <span key={idx} className="bg-zinc-900 text-zinc-100 border border-zinc-950 px-2 py-0.5 text-[9px] font-bold font-mono rounded">
                          {api}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 6: Decision Making & Error Handling */}
                <div className="space-y-3 pt-3 border-t border-zinc-200">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Decision Logic</h4>
                    <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                      {(selectedAgent as any).decisionMaking || 'Autonomous agent event-driven routing based on campaign goals and user intent'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Error Failover Loop</h4>
                    <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                      {(selectedAgent as any).errorHandling || 'Automatic model retry with exponential backoff and fallback provider routing'}
                    </p>
                  </div>
                </div>

                {/* Section 7: Communication Context */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md space-y-2">
                  <h4 className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-zinc-600" />
                    Inter-Agent Communication Routing
                  </h4>
                  <div className="text-[10px] text-zinc-600 space-y-1">
                    <p className="font-medium"><strong className="font-bold text-zinc-800">Receives input from:</strong> {(selectedAgent as any).communication?.receivesFrom?.join(', ') || 'Sophia Vance (CEO Orchestrator)'}</p>
                    <p className="font-medium"><strong className="font-bold text-zinc-800">Transmits results to:</strong> {(selectedAgent as any).communication?.sendsTo?.join(', ') || 'Downstream Campaign Execution Engine'}</p>
                    <p className="mt-1.5 font-medium border-t border-zinc-200/50 pt-1.5 text-zinc-500 leading-relaxed italic">{(selectedAgent as any).communication?.flowDescription || 'Standard inter-agent event bus protocol'}</p>
                  </div>
                </div>

                {/* Section 8: Success Metrics */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Success Benchmarks</h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {((selectedAgent as any).successMetrics || ['>98% Quality Benchmark', '<1.5s Execution Latency']).map((met: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-emerald-50/40 border border-emerald-100/50 p-2 rounded text-xs text-emerald-800 font-bold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {met}
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Orchestrator Spec Panel */}
      <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-200 gap-4">
          <div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-mono tracking-widest font-bold uppercase">
              Control Center
            </span>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2 mt-1">
              <Cpu className="w-5 h-5 text-zinc-700" />
              Agent Orchestrator Core Blueprint
            </h3>
            <p className="text-zinc-500 text-xs mt-1 font-medium">
              The centralized brain managing concurrent agent scheduling, state variables pipeline routing, and error mitigation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-zinc-400">ENGINE: V3.5 CORE</span>
          </div>
        </div>

        {/* Master Specs grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Orchestrator Specs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Orchestrator Mission</h4>
              <p className="text-xs text-zinc-700 leading-relaxed font-semibold">
                "{ORCHESTRATOR_BLUEPRINT.mission}"
              </p>
            </div>

            {/* Loop Steps */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">The 6-Step Orchestration Core Loop</h4>
              <div className="relative border-l-2 border-zinc-200 pl-4 space-y-4 ml-2">
                {ORCHESTRATOR_BLUEPRINT.coreLoopSteps.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Ring indicator */}
                    <span className="absolute -left-[25px] top-0.5 bg-white border-2 border-zinc-900 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-zinc-900 shadow-sm">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-extrabold text-zinc-800 tracking-tight">{step.title}</h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{step.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="text-[9px] font-mono bg-zinc-50 border border-zinc-150 p-1 rounded font-bold text-indigo-700 truncate">
                        IN: {step.input}
                      </div>
                      <div className="text-[9px] font-mono bg-zinc-50 border border-zinc-150 p-1 rounded font-bold text-emerald-700 truncate">
                        OUT: {step.output}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Failovers & Persistence Specs + Simulated Running Console */}
          <div className="space-y-6 flex flex-col h-full">
            
            {/* Failover and Persistence info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-2">
                <h5 className="text-xs font-extrabold text-zinc-800 tracking-tight flex items-center gap-1.5 font-mono uppercase text-[10px]">
                  <AlertCircle className="w-4 h-4 text-zinc-600" />
                  Failover Protocol
                </h5>
                <ul className="space-y-1 text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {ORCHESTRATOR_BLUEPRINT.failoverMechanism.steps.map((s, idx) => (
                    <li key={idx} className="list-disc ml-3">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-2">
                <h5 className="text-xs font-extrabold text-zinc-800 tracking-tight flex items-center gap-1.5 font-mono uppercase text-[10px]">
                  <Database className="w-4 h-4 text-zinc-600" />
                  State Persistence
                </h5>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {ORCHESTRATOR_BLUEPRINT.persistenceStrategy.description}
                </p>
                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[8px] font-mono font-bold text-zinc-400">
                  <span>STATE ENGINE: ACID</span>
                  <span>SYNC: REDIS KV</span>
                </div>
              </div>
            </div>

            {/* Interactive Real-time Workforce Control Terminal */}
            <div className="bg-zinc-950 text-zinc-300 rounded-md border border-zinc-900 shadow-lg flex-grow flex flex-col overflow-hidden min-h-[350px]">
              
              {/* Terminal Header */}
              <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-850">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                    {workflowStatus !== 'idle' ? 'Real-Time Workforce Monitor' : 'Orchestrator Simulation Console'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {workflowStatus !== 'idle' && (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                      workflowStatus === 'running' ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' :
                      workflowStatus === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                      workflowStatus === 'cancelled' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {workflowStatus}
                    </span>
                  )}
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Input Command Bar with Mode Selector & Controller Buttons */}
              <div className="bg-zinc-900/40 p-3 border-b border-zinc-850 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-grow flex items-center gap-1 bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 select-none">URL:</span>
                    <input
                      type="text"
                      disabled={workflowStatus === 'running' || isSimulating}
                      value={simDomain}
                      onChange={(e) => setSimDomain(e.target.value)}
                      placeholder="https://linear.app"
                      className="w-full bg-transparent border-none text-[10px] font-mono focus:outline-none text-zinc-200 font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800 self-start sm:self-auto">
                    <button
                      onClick={() => setExecutionMode('sequential')}
                      disabled={workflowStatus === 'running'}
                      className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${
                        executionMode === 'sequential' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Sequential
                    </button>
                    <button
                      onClick={() => setExecutionMode('parallel')}
                      disabled={workflowStatus === 'running'}
                      className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${
                        executionMode === 'parallel' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Parallel
                    </button>
                  </div>
                </div>

                {/* Live Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {workflowStatus === 'idle' || workflowStatus === 'completed' || workflowStatus === 'cancelled' ? (
                    <button
                      onClick={startRealWorkflow}
                      disabled={isSimulating}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 shadow cursor-pointer select-none transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      Dispatch Swarm
                    </button>
                  ) : workflowStatus === 'running' ? (
                    <button
                      onClick={pauseRealWorkflow}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 shadow cursor-pointer select-none transition-all"
                    >
                      <Pause className="w-3 h-3" />
                      Pause Swarm
                    </button>
                  ) : (
                    <button
                      onClick={resumeRealWorkflow}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 shadow cursor-pointer select-none transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      Resume Swarm
                    </button>
                  )}

                  {workflowStatus === 'running' || workflowStatus === 'paused' ? (
                    <button
                      onClick={cancelRealWorkflow}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 shadow cursor-pointer select-none transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Swarm
                    </button>
                  ) : null}

                  {tasks.some(t => t.status === 'failed') && (
                    <button
                      onClick={retryRealWorkflow}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 shadow cursor-pointer select-none transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retry Failed Tasks
                    </button>
                  )}

                  {workflowStatus === 'idle' && (
                    <button
                      onClick={runSimulation}
                      disabled={isSimulating}
                      className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-100 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1.5 border border-zinc-700 shadow cursor-pointer select-none transition-all"
                    >
                      <Play className="w-3 h-3 fill-zinc-100" />
                      {isSimulating ? 'SIMULATING...' : 'Run Quick Simulation'}
                    </button>
                  )}
                </div>
              </div>

              {/* Terminal Logs View */}
              <div 
                id="simulation-terminal-screen" 
                className="p-4 flex-grow font-mono text-[10px] overflow-y-auto space-y-2 bg-zinc-950/95 scrollbar-thin max-h-[250px]"
              >
                {workflowStatus !== 'idle' ? (
                  /* Display real live logs */
                  globalLogs.map((logLine, idx) => {
                    const isSystem = logLine.startsWith('[System') || logLine.startsWith('[WORKFLOW');
                    return (
                      <div key={idx} className="flex items-start gap-2 border-b border-zinc-900/40 pb-1 font-mono">
                        <span className="text-zinc-500 select-none">[{new Date().toLocaleTimeString()}]</span>
                        <span className={`font-bold uppercase ${isSystem ? 'text-indigo-400' : 'text-emerald-400'}`}>
                          {isSystem ? 'SYSTEM' : 'AGENT'}:
                        </span>
                        <span className="text-zinc-200">{logLine}</span>
                      </div>
                    );
                  })
                ) : simLog.length === 0 ? (
                  <div className="text-zinc-600 italic h-full flex items-center justify-center text-center py-10 select-none">
                    <div>
                      <Cpu className="w-8 h-8 text-zinc-800 mx-auto mb-2 animate-pulse" />
                      <p>Pipeline ready. Click "Dispatch Swarm" to run the live 10-agent orchestrator</p>
                      <p className="text-[8px] mt-0.5 text-zinc-700">Or click "Run Quick Simulation" to run a local simulation preview</p>
                    </div>
                  </div>
                ) : (
                  simLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 border-b border-zinc-900/40 pb-1 font-mono">
                      <span className="text-zinc-500 select-none">[{log.timestamp}]</span>
                      <span className={`font-bold uppercase ${
                        log.level === 'success' ? 'text-emerald-400' :
                        log.level === 'warn' ? 'text-amber-400' :
                        log.level === 'api' ? 'text-indigo-400' : 'text-sky-400'
                      }`}>
                        {log.sender}:
                      </span>
                      <span className="text-zinc-200">{log.message}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Terminal Footer Progress bar */}
              <div className="bg-zinc-900 px-4 py-2 border-t border-zinc-850 flex items-center justify-between text-[8px] font-mono font-bold text-zinc-500 uppercase">
                {workflowStatus !== 'idle' ? (
                  <>
                    <span>TASKS COMPLETED: {tasks.filter(t => t.status === 'completed').length}/{tasks.length}</span>
                    <span>MODE: {executionMode}</span>
                  </>
                ) : (
                  <>
                    <span>COLLABORATIVE QUEUE: {simStep}/20 STEPS</span>
                    {isSimulating ? (
                      <span className="text-emerald-400 animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        EXECUTING DIRECTIVES
                      </span>
                    ) : (
                      <span>IDLE STATE</span>
                    )}
                  </>
                )}
              </div>

            </div>

            {/* Live Agents Grid */}
            {workflowStatus !== 'idle' && agentsState.length > 0 && (
              <div className="bg-zinc-950 p-4 rounded-md border border-zinc-900 space-y-3 mt-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5 text-zinc-300">
                  <Layers className="w-3.5 h-3.5" />
                  Active Specialist Grid
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agentsState.map((agent) => {
                    const isRunning = agent.status === 'running';
                    const isCompleted = agent.status === 'completed';
                    const isFailed = agent.status === 'failed';
                    return (
                      <div key={agent.id} className="bg-zinc-900/60 p-3 rounded border border-zinc-850 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-100">{agent.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                            isRunning ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' :
                            isCompleted ? 'bg-indigo-500/20 text-indigo-400' :
                            isFailed ? 'bg-rose-500/20 text-rose-400' :
                            'bg-zinc-800 text-zinc-500'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                            <span className="truncate max-w-[150px]">{agent.currentTask}</span>
                            <span>{agent.progress}%</span>
                          </div>
                          <div className="w-full bg-zinc-850 h-1.5 rounded overflow-hidden">
                            <div 
                              className={`h-full rounded transition-all duration-500 ${
                                isFailed ? 'bg-rose-500' :
                                isCompleted ? 'bg-indigo-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${agent.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 border-t border-zinc-850/50 pt-1">
                          <span>API: {agent.provider}</span>
                          <span>Model: {agent.model}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
