/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, AlertCircle, MessageSquare, Shield, Search, FileText, Share2, 
  DollarSign, Target, Mail, Terminal, Users, Zap, Check, Play, ArrowRight 
} from 'lucide-react';
import { AgentProfile, ChatMessage, MarketingAnalysis } from '../types';

interface AgentPlaygroundProps {
  analysisResult: MarketingAnalysis | null;
  onboardedUrl: string;
  onNavigateToPublish?: () => void;
  optimizationMode?: string;
}

const PLAYGROUND_AGENTS: AgentProfile[] = [
  {
    id: 'ceo',
    name: 'Sophia Vance',
    role: 'CEO & Fractional CMO',
    avatar: '👩‍💼',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100',
    description: 'Fractional CMO who specializes in brand positioning, competitor sets, and sustainable market unit economics.',
    systemPrompt: 'You are Sophia Vance, CEO and Fractional CMO. Speak with strategic vision, authority, and economic precision.'
  },
  {
    id: 'seo',
    name: 'Marcus Chen',
    role: 'SEO Specialist',
    avatar: '👨‍💻',
    color: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-100',
    description: 'Lead SEO architect focused on keyword mapping, search intent matching, and mobile core vitals.',
    systemPrompt: 'You are Marcus Chen, Lead SEO Specialist. Speak with technical depth, using search-intent data terms.'
  },
  {
    id: 'content',
    name: 'Elena Rostova',
    role: 'Content Director',
    avatar: '👩‍🎨',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
    description: 'Copy and organic inbound specialist who crafts narrative structures, blog clusters, and introductory hook concepts.',
    systemPrompt: 'You are Elena Rostova, Inbound Content Director. Speak with high storytelling eloquence, focusing on readability and copy conversion hooks.'
  },
  {
    id: 'social',
    name: 'Chloe Jenkins',
    role: 'Social Media Manager',
    avatar: '👩‍🎤',
    color: 'bg-pink-50 text-pink-700 border-pink-200 ring-pink-100',
    description: 'Organic viral loops director who knows platform algorithms, scroll-stopping hooks, and read-friendly caption layouts.',
    systemPrompt: 'You are Chloe Jenkins, Social Growth Director. Speak with high energy, trend-focused vocab, and layout caption designs.'
  },
  {
    id: 'ads',
    name: 'Alex Mercer',
    role: 'Paid Media Optimizer',
    avatar: '👨‍💼',
    color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
    description: 'Lead acquisition specialist. Optimizes CTR, ROAS targets, budget distribution splits, and search copy bidding.',
    systemPrompt: 'You are Alex Mercer, Paid Media Specialist. Speak with focus on ROI, conversion stats, bidding splits, and click copy.'
  },
  {
    id: 'leadgen',
    name: 'Sarah Lin',
    role: ' CRO Funnel Engineer',
    avatar: '👩‍🔬',
    color: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-100',
    description: 'CRO architect focused on friction-free landing page wireframes, lead magnet triggers, and user-behavior conversion paths.',
    systemPrompt: 'You are Sarah Lin, CRO & Funnel Engineer. Speak with behavioral conversion logic, focus on above-the-fold design, and trust trigger placements.'
  },
  {
    id: 'email',
    name: 'Daniel Kross',
    role: 'Retention Marketer',
    avatar: '👨‍🎨',
    color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
    description: 'Lifecycle marketer who turns opt-ins into loyal clients via mobile-friendly autoresponders and story-driven nurture sequences.',
    systemPrompt: 'You are Daniel Kross, Lead Lifecycle Retention Marketer. Speak warm, personable, and friendly, focusing on click nurture metrics.'
  },
  {
    id: 'geo',
    name: 'Dr. Aris Thorne',
    role: 'GEO & AI Search Director',
    avatar: '🔬',
    color: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-100',
    description: 'Reverse-engineers Perplexity, ChatGPT Search, Gemini Live, and Claude citation algorithms for maximum brand presence in AI answers.',
    systemPrompt: 'You are Dr. Aris Thorne, GEO AI Search Citation Director. Speak with scientific authority, explaining knowledge graphs, entity schemas, and LLM citations.'
  },
  {
    id: 'video',
    name: 'Jordan Brooks',
    role: 'Viral Video & Storyboard Director',
    avatar: '🎬',
    color: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100',
    description: 'Short-form video maestro directing frame-by-frame visual and voiceover scripts for TikTok, YouTube Shorts, and Instagram Reels.',
    systemPrompt: 'You are Jordan Brooks, Short-Form Video & Viral Storyboard Director. Speak with high viral-energy, hook mechanics (0-3s), and visual storyboard pacing.'
  },
  {
    id: 'influencer',
    name: 'Vivienne Sterling',
    role: 'Influencer & Brand PR Architect',
    avatar: '💎',
    color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 ring-fuchsia-100',
    description: 'Creator partnerships strategist and press release writer who negotiates high-ROI sponsorships and syndicated media features.',
    systemPrompt: 'You are Vivienne Sterling, Influencer & Brand PR Architect. Speak with executive PR finesse, creator discovery formulas, and high-response outreach pitches.'
  },
  {
    id: 'plg',
    name: 'Zoe Zhang',
    role: 'PLG & Community Architect',
    avatar: '🚀',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
    description: 'Product-led growth specialist engineering virality K-factors, friction audits, referral engines, and Discord community rituals.',
    systemPrompt: 'You are Zoe Zhang, PLG & Community Virality Architect. Speak with product psychology, viral coefficients (K-Factor), and user activation loops.'
  },
  {
    id: 'local',
    name: 'Kai Nakamura',
    role: 'Local GEO & ASO Specialist',
    avatar: '📍',
    color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
    description: 'Local search and app store optimizer dominating Google Business map packs, local geo-grids, and App Store keyword density.',
    systemPrompt: 'You are Kai Nakamura, Local GEO & ASO Director. Speak with geospatial precision, Google Business Profile rankings, and App Store search algorithm dynamics.'
  },
  {
    id: 'analytics',
    name: 'Mia Thorne',
    role: 'Data & Analytics Specialist',
    avatar: '📊',
    color: 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-100',
    description: 'Predictive ROI and telemetry architect modeling CAC/LTV cohorts and Google Analytics 4 event tracking scripts.',
    systemPrompt: 'You are Mia Thorne, Analytics & Predictive ROI Specialist. Speak with quantitative rigor, mathematical modeling, and multi-touch attribution.'
  }
];

export default function AgentPlayground({ analysisResult, onboardedUrl, onNavigateToPublish, optimizationMode }: AgentPlaygroundProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile>(PLAYGROUND_AGENTS[0]);
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({
    ceo: [],
    seo: [],
    content: [],
    social: [],
    ads: [],
    leadgen: [],
    email: [],
    geo: [],
    video: [],
    influencer: [],
    plg: [],
    local: [],
    analytics: []
  });
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Boardroom Group Briefing states
  const [playgroundMode, setPlaygroundMode] = useState<'single' | 'boardroom'>('single');
  const [boardroomMessages, setBoardroomMessages] = useState<Array<{
    id: string;
    sender: string;
    avatar: string;
    role: string;
    content: string;
    color: string;
    timestamp: string;
  }>>([]);
  const [boardroomState, setBoardroomState] = useState<'idle' | 'running' | 'paused_approval' | 'executed'>('idle');
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isLoading, boardroomMessages]);

  const startBoardroomBriefing = async () => {
    if (boardroomState === 'running') return;
    setBoardroomState('running');
    setBoardroomMessages([]);
    addTerminalLog('[BOARDROOM] Initiating agency-wide collaborative alignment sync...');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const script = [
      {
        sender: 'Sophia Vance',
        avatar: '👩‍💼',
        role: 'CEO & Fractional CMO',
        content: 'The SEO score dropped by 8%. We need to address the core leakage points and align our multi-channel execution immediately.',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100'
      },
      {
        sender: 'Marcus Chen',
        avatar: '👨‍💻',
        role: 'SEO Specialist',
        content: 'I found 24 technical issues during my crawl, including canonical mismatches, missing schema markers, and unindexed target sections. I have compiled precise meta keyword injectors.',
        color: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-100'
      },
      {
        sender: 'Elena Rostova',
        avatar: '👩‍🎨',
        role: 'Content Director',
        content: 'I created 12 blog articles targeting high-intent priority keywords to establish deep topical authority clusters and anchor these technical fixes.',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100'
      },
      {
        sender: 'Alex Mercer',
        avatar: '👨‍💼',
        role: 'Paid Media Optimizer',
        content: 'I launched 3 campaigns across Google Search and Meta Ads with customized head copies, precise audience parameters, and strict bid limits to boost CTR.',
        color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100'
      },
      {
        sender: 'Oliver Vance',
        avatar: '📊',
        role: 'ROI Modeler & Analytics',
        content: 'Our core performance metrics indicate high synergy across these channels. Revenue is predicted to increase 18% within the next quarter once these assets are fully live.',
        color: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-100'
      }
    ];

    for (const line of script) {
      addTerminalLog(`[BOARDROOM] ${line.sender} is presenting strategy...`);
      await sleep(1500);
      setBoardroomMessages(prev => [
        ...prev,
        {
          id: `board-${Date.now()}-${line.sender}`,
          ...line,
          timestamp: new Date().toISOString()
        }
      ]);
    }

    setBoardroomState('paused_approval');
    addTerminalLog('[BOARDROOM] All specialist strategies prepared. Awaiting client executive authorization...');
  };

  const approveAllBoardroom = async () => {
    addTerminalLog('[BOARDROOM] Client input detected: "Approve all."');
    setBoardroomMessages(prev => [
      ...prev,
      {
        id: `board-user-${Date.now()}`,
        sender: 'Client',
        avatar: '👤',
        role: 'Executive Sponsor',
        content: 'Approve all.',
        color: 'bg-zinc-900 text-white border-zinc-950',
        timestamp: new Date().toISOString()
      }
    ]);

    setBoardroomState('running');
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1200);

    addTerminalLog('[BOARDROOM] Sophia Vance (CMO) executing automated launch sequence...');
    setBoardroomMessages(prev => [
      ...prev,
      {
        id: `board-cmo-exec-${Date.now()}`,
        sender: 'Sophia Vance',
        avatar: '👩‍💼',
        role: 'CEO & Fractional CMO',
        content: 'Executing. All channels synchronized. Standby for automated multi-channel publication.',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100',
        timestamp: new Date().toISOString()
      }
    ]);

    await sleep(1500);
    setBoardroomState('executed');
    addTerminalLog('[BOARDROOM] Strategic briefing complete. Redirecting to Publish Hub...');
  };

  // Load baseline greetings
  useEffect(() => {
    if (selectedAgent && conversations[selectedAgent.id].length === 0) {
      let promptGreeting = '';
      if (analysisResult) {
        promptGreeting = `Greetings! I am ${selectedAgent.name}, your specialized ${selectedAgent.role}. I've fully ingested Sophia's CMO blueprint for ${analysisResult.ceo.brandName || onboardedUrl}. How can I assist you with refining our strategies today?`;
      } else {
        promptGreeting = `Greetings! I am ${selectedAgent.name}, your ${selectedAgent.role}. I am ready to advise you on any aspect of digital growth and strategy formulation.`;
      }

      setConversations(prev => ({
        ...prev,
        [selectedAgent.id]: [
          {
            id: `msg-welcome-${selectedAgent.id}`,
            role: 'assistant',
            content: promptGreeting,
            agentId: selectedAgent.id,
            timestamp: new Date().toISOString()
          }
        ]
      }));

      // Add a clean terminal boot log
      addTerminalLog(`[${selectedAgent.name}] Consulting session initialized. Waiting for prompt...`);
    }
  }, [selectedAgent, analysisResult]);

  const addTerminalLog = (msg: string) => {
    setTerminalLogs(prev => {
      const logs = [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`];
      return logs.slice(-50); // Keep last 50 logs
    });
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userMsgText = inputVal;
    setInputVal('');
    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      agentId: selectedAgent.id,
      timestamp: new Date().toISOString()
    };

    // Update convo list immediately with user message
    setConversations(prev => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), userMessage]
    }));

    setIsLoading(true);
    addTerminalLog(`[SYSTEM] Relaying query to ${selectedAgent.name}...`);

    try {
      const companyContext = analysisResult ? {
        companyName: analysisResult.ceo.brandName,
        url: onboardedUrl || 'Not provided',
        industry: analysisResult.ceo.industry,
        targetAudience: analysisResult.ceo.targetAudience,
        positioning: analysisResult.ceo.positioning
      } : {
        companyName: 'General Client',
        url: onboardedUrl || 'Not provided',
        industry: 'Inferred',
        targetAudience: 'Target market',
        positioning: 'Generic positioning'
      };

      const response = await fetch('/api/marketing/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          message: userMsgText,
          chatHistory: conversations[selectedAgent.id] || [],
          companyContext,
          optimizationMode
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to generate agent response');
      }

      const resData = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        role: 'assistant',
        content: resData.content,
        agentId: selectedAgent.id,
        timestamp: resData.timestamp
      };

      setConversations(prev => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), assistantMessage]
      }));

      addTerminalLog(`[${selectedAgent.name}] Output generated successfully.`);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Could not communicate with the specialist agent.');
      addTerminalLog(`[SYSTEM ERROR] Failed to fetch assistant response: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'ceo': return <Shield className="w-4 h-4" />;
      case 'seo': return <Search className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'social': return <Share2 className="w-4 h-4" />;
      case 'ads': return <DollarSign className="w-4 h-4" />;
      case 'leadgen': return <Target className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
      {/* Agents Selection List Side rail */}
      <div className="bg-white border border-zinc-200 rounded-md p-4 flex flex-col justify-between h-full shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2 font-mono">Agency Workspaces</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5 px-2 font-medium">Coordinate via corporate briefings or direct consulting.</p>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {/* Boardroom Sync Selector */}
            <button
              onClick={() => setPlaygroundMode('boardroom')}
              className={`w-full text-left p-3 rounded-md border transition-all flex items-start gap-3 relative overflow-hidden group cursor-pointer ${
                playgroundMode === 'boardroom'
                  ? 'bg-zinc-900 border-zinc-950 text-white shadow-md'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-950 hover:bg-indigo-500/15'
              }`}
            >
              <div className={`p-2 rounded border flex items-center justify-center ${playgroundMode === 'boardroom' ? 'bg-zinc-800 border-zinc-700 text-indigo-400' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                <Users className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-black tracking-wide uppercase font-mono">Boardroom Team Sync</h4>
                  <span className="text-[8px] bg-amber-500 text-amber-950 px-1.5 py-0.5 rounded font-black font-mono tracking-widest">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug font-medium">Run full collaborative strategy briefings with all agents.</p>
              </div>
            </button>

            <div className="flex items-center gap-2 py-2">
              <div className="h-[1px] bg-zinc-200 flex-grow" />
              <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono tracking-widest flex-shrink-0">Specialists</span>
              <div className="h-[1px] bg-zinc-200 flex-grow" />
            </div>

            {PLAYGROUND_AGENTS.map((agent) => {
              const isSel = selectedAgent.id === agent.id && playgroundMode === 'single';
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    setPlaygroundMode('single');
                    setSelectedAgent(agent);
                  }}
                  className={`w-full text-left p-3 rounded-md border transition-all flex items-start gap-3 relative overflow-hidden group cursor-pointer ${
                    isSel 
                      ? 'bg-zinc-100 border-zinc-300 text-zinc-950 shadow-sm' 
                      : 'bg-white border-zinc-200/60 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-800'
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{agent.avatar}</span>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${isSel ? 'text-zinc-900' : 'text-zinc-700 group-hover:text-zinc-900'}`}>
                        {agent.name}
                      </h4>
                      <span className={`p-1 rounded border text-[10px] flex items-center justify-center ${agent.color}`}>
                        {getAgentIcon(agent.id)}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase font-mono mt-0.5">{agent.role}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1 leading-snug font-medium">{agent.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Agent Console Log anchor */}
        <div className="pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-400 px-2 font-mono font-bold">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] tracking-wider">AGENCY_COMM_TUNNEL</span>
          </div>
        </div>
      </div>

      {/* active Conversation Panel */}
      <div className="lg:col-span-3 flex flex-col bg-white border border-zinc-200 rounded-md overflow-hidden h-full shadow-sm relative">
        {playgroundMode === 'single' ? (
          <>
            {/* Selected Agent Header banner */}
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedAgent.avatar}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-950">{selectedAgent.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${selectedAgent.color}`}>
                      {selectedAgent.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{selectedAgent.description}</p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SECURE PORT ENCRYPTED
              </div>
            </div>

            {/* Active Messages area */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-zinc-50/30">
              <AnimatePresence initial={false}>
                {((conversations[selectedAgent.id] || [])).map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Avatar icon */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-zinc-900 border-zinc-950 text-white' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}>
                      {msg.role === 'user' ? '👤' : selectedAgent.avatar}
                    </div>

                    {/* Message Capsule */}
                    <div className={`p-4 rounded-md leading-relaxed text-sm ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 text-white rounded-tr-none shadow-sm'
                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
                    }`}>
                      <p className="whitespace-pre-wrap font-medium text-[13px] leading-relaxed">
                        {msg.content}
                      </p>
                      
                      {/* Timestamp footer */}
                      <span className="text-[9px] block text-right mt-2 font-mono font-bold text-zinc-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 mr-auto items-center animate-pulse">
                  <div className="w-8 h-8 rounded-full border bg-zinc-50 border-zinc-200 flex items-center justify-center text-sm">
                    {selectedAgent.avatar}
                  </div>
                  <div className="bg-white border border-zinc-200 p-4 rounded-md rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md flex items-start gap-2.5 max-w-xl mx-auto shadow-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
                  <div>
                    <strong className="font-bold block">Agent Connection Failure</strong>
                    <p className="mt-0.5 font-medium">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Text Form block */}
            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-50 border-t border-zinc-200 flex gap-2.5">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isLoading}
                placeholder={`Ask ${selectedAgent.name} to expand their strategy, rewrite a section, or run a diagnostic...`}
                className="flex-grow bg-white text-zinc-900 placeholder-zinc-400 text-xs rounded-md border border-zinc-200 px-4 py-3 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/10 transition-all disabled:opacity-50 font-medium"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white px-4 py-2 rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-mono font-bold text-xs uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">CONSULT</span>
              </button>
            </form>
          </>
        ) : (
          /* BOARDROOM BRIEFING PANEL */
          <>
            <div className="p-4 bg-zinc-900 border-b border-zinc-950 flex items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3">
                <span className="text-2xl flex gap-1 bg-zinc-800/80 p-2.5 rounded-md">👩‍💼 👨‍💻 👩‍🎨 👨‍💼</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase font-mono tracking-wide text-zinc-50">SOPHIA'S EXECUTIVE BOARDROOM</h3>
                    <span className="bg-amber-500 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded font-mono tracking-wider animate-pulse">
                      ALIGNMENT
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Automated strategic sync with all specialty roles.</p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                COORDINATED LINK
              </div>
            </div>

            {/* Boardroom Messages area */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-zinc-900/95 text-zinc-100">
              {boardroomMessages.length === 0 && boardroomState === 'idle' ? (
                <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-6 my-12">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-lg text-3xl">
                    🏢
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black tracking-wider uppercase font-mono text-zinc-100">Initiate Corporate Briefing Sync</h4>
                    <p className="text-xs text-zinc-400 leading-normal font-medium">
                      Trigger an autonomous group-briefing session where all corporate specialties align their KPIs, execute strategy checklists, and await client authorization.
                    </p>
                  </div>
                  <button
                    onClick={startBoardroomBriefing}
                    className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-amber-950 font-black font-mono rounded text-xs uppercase tracking-widest flex items-center gap-2.5 shadow-md hover:scale-[1.01] transition-all cursor-pointer border border-amber-400"
                  >
                    <Play className="w-4 h-4 text-amber-950 fill-amber-950" />
                    Begin alignment briefing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {boardroomMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-3 max-w-3xl ${msg.sender === 'Client' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm flex-shrink-0 bg-zinc-800 border-zinc-700`}>
                          {msg.avatar}
                        </div>

                        {/* Content Capsule */}
                        <div className={`p-4 rounded-md border ${
                          msg.sender === 'Client'
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-tr-none'
                            : 'bg-zinc-950 border-zinc-800/80 text-zinc-100 rounded-tl-none'
                        }`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[11px] font-black tracking-wide text-zinc-200">{msg.sender}</span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                              {msg.role}
                            </span>
                          </div>
                          
                          <p className="text-[13px] leading-relaxed text-zinc-300 font-medium">
                            {msg.content}
                          </p>
                          
                          <span className="text-[9px] block text-right mt-2 font-mono font-bold text-zinc-600">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {boardroomState === 'running' && (
                    <div className="flex gap-3 mr-auto items-center animate-pulse py-2">
                      <div className="w-9 h-9 rounded-full border bg-zinc-800 border-zinc-700 flex items-center justify-center text-sm">
                        💬
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-md rounded-tl-none flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[10px] font-mono text-zinc-500 ml-2 font-bold uppercase">Presenter speaking...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Interactive Alignment Controls Area */}
            {boardroomState !== 'idle' && (
              <div className="p-5 bg-zinc-950 border-t border-zinc-800">
                {boardroomState === 'running' && (
                  <div className="flex items-center justify-center gap-3 py-3 text-xs font-mono font-bold text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>SYNCHRONIZING SPECIALISTS STRATEGY CHECKLISTS...</span>
                  </div>
                )}

                {boardroomState === 'paused_approval' && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black tracking-widest uppercase font-mono text-amber-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        Executive Authorization Loop
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-medium max-w-lg">
                        All specialist campaigns are pre-staged. Authorize Sophia Vance (CMO) to execute programmatic channels publication?
                      </p>
                    </div>

                    <button
                      onClick={approveAllBoardroom}
                      className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black font-mono rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Approve all
                    </button>
                  </div>
                )}

                {boardroomState === 'executed' && (
                  <div className="bg-zinc-900 border border-emerald-800/50 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black tracking-widest uppercase font-mono text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        Campaign Launch Complete
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-medium max-w-lg">
                        CEO Sophia Vance has successfully triggered the automated campaign execution loops. Redirecting to the live publish hub.
                      </p>
                    </div>

                    {onNavigateToPublish && (
                      <button
                        onClick={onNavigateToPublish}
                        className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black font-mono rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-amber-400"
                      >
                        Launch Publisher Hub
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Diagnostic logs overlay console */}
        <div className="bg-zinc-100 p-2 border-t border-zinc-200 flex items-center justify-between text-[9px] font-mono text-zinc-400 px-4 font-bold">
          <div className="flex items-center gap-2 truncate">
            <span className="text-emerald-500 animate-pulse font-bold">●</span>
            <span className="truncate">LOG: {terminalLogs[terminalLogs.length - 1] || 'Session ready for prompt inputs.'}</span>
          </div>
          <span className="flex-shrink-0 ml-4">AGENT_LATENCY: 1.2s</span>
        </div>
      </div>
    </div>
  );
}
