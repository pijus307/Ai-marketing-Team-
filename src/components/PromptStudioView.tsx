import React, { useState } from 'react';
import { Sparkles, Terminal, Code2, Layers, CheckCircle, Copy, Share2, Play, Sliders } from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  variables: string[];
  version: string;
  score: number;
}

const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    id: 'p1',
    name: 'SEO Keyword Clustering & Search Intent',
    category: 'SEO',
    prompt: 'You are an elite SEO Architect. Given the target niche {{niche}} and primary URL {{url}}, build a 3-tier keyword cluster with transactional, commercial, and informational intent.',
    variables: ['niche', 'url'],
    version: 'v2.1',
    score: 98,
  },
  {
    id: 'p2',
    name: 'High-Converting SaaS Landing Page Copy',
    category: 'CRO',
    prompt: 'Act as a CRO Copywriter. Write a 5-section landing page copy for {{product_name}} addressing pain points of {{target_audience}}.',
    variables: ['product_name', 'target_audience'],
    version: 'v1.4',
    score: 95,
  },
  {
    id: 'p3',
    name: 'Lifecycle Email Nurture Sequence',
    category: 'Email',
    prompt: 'You are a Lifecycle Email Strategist. Generate a 4-part welcome onboarding email sequence for users who signed up for {{service_name}}.',
    variables: ['service_name'],
    version: 'v3.0',
    score: 99,
  },
];

export function PromptStudioView() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(DEFAULT_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate>(DEFAULT_PROMPTS[0]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVarChange = (varName: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [varName]: value }));
  };

  const compiledPrompt = () => {
    let text = selectedPrompt.prompt;
    selectedPrompt.variables.forEach((v) => {
      const val = variableValues[v] || `{{${v}}}`;
      text = text.replace(new RegExp(`{{${v}}}`, 'g'), val);
    });
    return text;
  };

  const handleTestPrompt = () => {
    setIsTesting(true);
    setOutput(null);

    setTimeout(() => {
      const finalPrompt = compiledPrompt();
      setOutput(
        `[PROMPT STUDIO AI EXECUTION RESULT]\n\nProcessed with Model Router (Gemini 2.5 Flash / Claude 3.5 Sonnet Hybrid):\n\n` +
          `--- EXECUTED PROMPT ---\n${finalPrompt}\n\n` +
          `--- GENERATED RESPONSE ---\n` +
          `1. Strategic Overview: High relevancy & low latency intent mapping verified.\n` +
          `2. Keyword Cluster: Primary keywords mapped into 3 main silos with >85 search volume difficulty scores.\n` +
          `3. Action Plan: Production-ready editorial draft pre-queued for Google Workspace export.`
      );
      setIsTesting(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="prompt-studio-view" className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-400/30">
              Prompt Studio & Engineering
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Prompt Versioning & Playground</h2>
          <p className="text-slate-400 text-sm mt-1">
            Create, test, version, and optimize system prompts across AI models with variable injection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-purple-400 bg-purple-950 px-3 py-1 rounded-lg border border-purple-800">
            PROMPT QUALITY SCORE: {selectedPrompt.score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prompt Library */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Prompt Library</span>
          </h3>

          <div className="space-y-2">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPrompt(p);
                  setVariableValues({});
                  setOutput(null);
                }}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedPrompt.id === p.id
                    ? 'bg-purple-950/60 border-purple-600 text-purple-100'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-200">{p.name}</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {p.version}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{p.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Editor & Variable Sandbox */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Prompt Sandbox: {selectedPrompt.name}</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Variables Inputs */}
          {selectedPrompt.variables.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Dynamic Variables Injection</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPrompt.variables.map((v) => (
                  <div key={v} className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">
                      {`{{${v}}}`}
                    </label>
                    <input
                      type="text"
                      placeholder={`Value for ${v}...`}
                      value={variableValues[v] || ''}
                      onChange={(e) => handleVarChange(v, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt Preview */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Compiled Prompt Preview</label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {compiledPrompt()}
            </div>
          </div>

          <button
            onClick={handleTestPrompt}
            disabled={isTesting}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Simulating AI Model Execution...' : 'Run Prompt in AI Brain'}</span>
          </button>

          {/* Output Window */}
          {output && (
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Model Router Execution Output</span>
              </h4>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
