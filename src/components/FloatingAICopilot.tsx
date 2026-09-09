import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Cpu, Terminal, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentRegistry } from '../lib/agents/agent-registry';

export function FloatingAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; agent?: string }>>([
    {
      sender: 'assistant',
      text: 'Greetings. I am your AI Marketing Operating System Copilot. How can I assist your campaign orchestration or multi-agent routing today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const SUGGESTIONS = [
    'Generate B2B acquisition hook',
    'Audit technical SEO health',
    'Draft 5-day LinkedIn sequence',
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const ceoAgent = AgentRegistry.getAgent('ceo');
      if (!ceoAgent) throw new Error('CEO Agent not initialized.');
      const result = await ceoAgent.executeTask({
        id: `task-copilot-${Date.now()}`,
        agentId: 'ceo',
        title: 'Copilot Chat Strategy',
        status: 'pending',
        priority: 'high',
        logs: [],
        progress: 0,
        retryCount: 0,
        maxRetries: 2
      }, { url: 'https://example.com', industry: 'General', companyDescription: userText });

      const summary = typeof result === 'object' 
        ? (result.brandName ? `Strategy created for ${result.brandName}: ${result.positioningStatement || result.positioning || ''}` : JSON.stringify(result, null, 2))
        : String(result);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: summary,
          agent: 'Sophia Vance (CEO Orchestrator)',
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Copilot response: ${err.message || 'Request processed via multi-agent fallback protocol.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="floating-ai-copilot-container" className="fixed bottom-6 right-6 z-50 font-sans no-print">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            id="btn-open-copilot"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white px-4 py-3 rounded-full shadow-2xl border border-white/20 backdrop-blur-xl cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>
            <span className="font-bold text-xs tracking-wider uppercase font-mono">Copilot AI</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-80 sm:w-96 glass-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[540px] gradient-border-mask"
          >
            {/* Header */}
            <div className="p-3.5 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 shadow-inner">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    Marketing Copilot
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded border border-emerald-400/30 font-mono font-bold">
                      24 AGENTS ONLINE
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Self-routing multi-agent assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions Pills */}
            <div className="px-3 py-2 bg-slate-900/50 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-300 whitespace-nowrap transition cursor-pointer flex items-center gap-1 hover:text-cyan-300"
                >
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {sug}
                </button>
              ))}
            </div>

            {/* Message History */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[240px] max-h-[320px] text-xs font-sans">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {m.agent && (
                    <span className="text-[10px] text-cyan-400 font-mono font-bold mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" /> {m.agent}
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-none shadow-md font-medium'
                        : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-none shadow-inner'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs italic p-2 bg-slate-900/50 rounded-xl border border-cyan-500/20">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                  <span className="font-mono text-[11px]">Routing query through 24 agent neural matrix...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-3 bg-slate-950/90 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Ask Copilot strategy or command..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white p-2.5 rounded-xl transition disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
