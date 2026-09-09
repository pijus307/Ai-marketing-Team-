/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Network, 
  GitFork, 
  FileCode2, 
  Percent, 
  Gauge, 
  Play, 
  Sliders, 
  TrendingUp, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Radio, 
  BarChart2, 
  Workflow, 
  Zap, 
  Code, 
  ExternalLink,
  Info,
  Terminal,
  Activity
} from 'lucide-react';
import { 
  runBanditBidOptimization,
  runPageRankGraphAnalysis,
  runMarkovAttributionAnalysis,
  runSchemaCompilerAnalysis,
  runStatisticalHypothesisTest,
  runPerformanceBudgetAnalysis,
  BanditOptimizerResult,
  PageRankGraphResult,
  MarkovAttributionResult,
  SchemaCompilerResult,
  StatisticalTestResult,
  PerformanceBudgetResult
} from '../lib/deterministic-agents-engine';

interface DeterministicAgentsSuiteViewProps {
  onboardedUrl?: string;
  brandName?: string;
  industry?: string;
  onNavigateToTab?: (tabId: string) => void;
}

export default function DeterministicAgentsSuiteView({
  onboardedUrl = 'https://example.com',
  brandName = 'Your Brand',
  industry = 'Technology & SaaS',
  onNavigateToTab
}: DeterministicAgentsSuiteViewProps) {
  // Navigation between deterministic agents
  const [activeAgentId, setActiveAgentId] = useState<
    'bandit' | 'pagerank' | 'attribution' | 'schema' | 'abtest' | 'perfbudget'
  >('bandit');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Agent 1: Bandit State
  // --------------------------------------------------------------------------
  const [banditBudget, setBanditBudget] = useState(2500);
  const [banditTargetCpa, setBanditTargetCpa] = useState(45);
  const [banditRiskTolerance, setBanditRiskTolerance] = useState(0.65);
  const [banditResult, setBanditResult] = useState<BanditOptimizerResult>(() =>
    runBanditBidOptimization(2500, 45, 0.65)
  );
  const [isSimulatingBandit, setIsSimulatingBandit] = useState(false);

  const handleRunBanditSim = () => {
    setIsSimulatingBandit(true);
    setTimeout(() => {
      setBanditResult(runBanditBidOptimization(banditBudget, banditTargetCpa, banditRiskTolerance));
      setIsSimulatingBandit(false);
    }, 400);
  };

  // --------------------------------------------------------------------------
  // Agent 2: PageRank State
  // --------------------------------------------------------------------------
  const [dampingFactor, setDampingFactor] = useState(0.85);
  const [pageRankResult, setPageRankResult] = useState<PageRankGraphResult>(() =>
    runPageRankGraphAnalysis(onboardedUrl, 0.85)
  );

  const handleRecalculatePageRank = (newDamping: number) => {
    setDampingFactor(newDamping);
    setPageRankResult(runPageRankGraphAnalysis(onboardedUrl, newDamping));
  };

  // --------------------------------------------------------------------------
  // Agent 3: Markov Attribution State
  // --------------------------------------------------------------------------
  const [attributionModel, setAttributionModel] = useState<
    'markovChain' | 'shapleyValue' | 'firstTouch' | 'lastTouch' | 'linear' | 'timeDecay' | 'uShaped'
  >('markovChain');
  const [markovResult, setMarkovResult] = useState<MarkovAttributionResult>(() =>
    runMarkovAttributionAnalysis()
  );

  // --------------------------------------------------------------------------
  // Agent 4: Schema AST Compiler State
  // --------------------------------------------------------------------------
  const [schemaResult, setSchemaResult] = useState<SchemaCompilerResult>(() =>
    runSchemaCompilerAnalysis(onboardedUrl, brandName)
  );
  const [activeSchemaTab, setActiveSchemaTab] = useState<'jsonld' | 'robots' | 'hreflang' | 'security'>('jsonld');

  // --------------------------------------------------------------------------
  // Agent 5: Statistical Testing State
  // --------------------------------------------------------------------------
  const [testVisitorsA, setTestVisitorsA] = useState(14500);
  const [testConvA, setTestConvA] = useState(580);
  const [testVisitorsB, setTestVisitorsB] = useState(14620);
  const [testConvB, setTestConvB] = useState(722);
  const [abTestResult, setAbTestResult] = useState<StatisticalTestResult>(() =>
    runStatisticalHypothesisTest(14500, 580, 29000, 14620, 722, 36100)
  );

  const handleRecalculateABTest = () => {
    setAbTestResult(
      runStatisticalHypothesisTest(
        testVisitorsA,
        testConvA,
        testConvA * 50,
        testVisitorsB,
        testConvB,
        testConvB * 50
      )
    );
  };

  // --------------------------------------------------------------------------
  // Agent 6: Performance Budget State
  // --------------------------------------------------------------------------
  const [perfBudgetResult, setPerfBudgetResult] = useState<PerformanceBudgetResult>(() =>
    runPerformanceBudgetAnalysis()
  );

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download code helper
  const handleDownloadFile = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const agentList = [
    {
      id: 'bandit',
      title: 'Thompson Sampling & Bayesian Bid Optimizer',
      shortName: 'Bayesian Bid Bandit',
      category: 'Pure Statistical Optimization',
      icon: Calculator,
      tag: 'No-LLM / Multi-Armed Bandit',
      desc: 'Bayesian Beta-Bernoulli Thompson Sampling, Kelly Criterion fraction & Markowitz mean-variance budget allocation.'
    },
    {
      id: 'pagerank',
      title: 'Power Iteration PageRank & Graph Silo Engine',
      shortName: 'PageRank Topology Agent',
      category: 'Graph Theory & Eigenvectors',
      icon: Network,
      tag: 'No-LLM / Eigenvector Power Iteration',
      desc: 'Damping factor eigenvalue convergence, orphan node isolation detection, and BFS click-depth calculation.'
    },
    {
      id: 'attribution',
      title: 'Markov Chain & Shapley Multi-Touch Attribution',
      shortName: 'Markov Attribution Engine',
      category: 'Game Theory & Stochastic Modeling',
      icon: GitFork,
      tag: 'No-LLM / Markov Removal Effect',
      desc: 'First-order transition matrix modeling, removal effect multipliers, and game-theoretic Shapley value distribution.'
    },
    {
      id: 'schema',
      title: 'AST Schema Compiler & RFC Protocol Validator',
      shortName: 'Schema AST Compiler',
      category: 'Compiler & Grammar Verification',
      icon: FileCode2,
      tag: 'No-LLM / Syntax AST & RFC 9309',
      desc: 'Schema.org graph validator, RFC 9309 robots.txt parser, bi-directional hreflang graph linter & CSP headers analyzer.'
    },
    {
      id: 'abtest',
      title: 'Bayesian & Frequentist A/B Hypothesis Tester',
      shortName: 'Statistical Power Engine',
      category: 'Empirical Statistical Inference',
      icon: Percent,
      tag: 'No-LLM / Z-Score & Beta Posteriors',
      desc: 'Two-proportion Z-tests, Chi-square independence, exact p-values, Bayesian P2BC, and MDE sample size solvers.'
    },
    {
      id: 'perfbudget',
      title: 'Deterministic Core Web Vitals & Budget Profiler',
      shortName: 'Performance Budget Agent',
      category: 'Network & DOM Byte Profiling',
      icon: Gauge,
      tag: 'No-LLM / Critical Render Path',
      desc: 'Byte-weight budget quotas, Critical Render Path RTT decomposition, CSS specificity vectors, and Nginx cache configs.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 border border-emerald-500/20 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Deterministic & Algorithmic Agents (Zero LLM / Pure Math & Graphs)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Non-LLM Autonomous Agents Suite</span>
              <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
                100% MATHEMATICAL & RULE-BASED
              </span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Autonomous execution agents operating entirely on <strong className="text-white">stochastic math, eigenvalue graph theory, Markov chains, RFC grammar parsers, and statistical inference</strong> — with 0% reliance on conversational LLMs like Claude, ChatGPT, or Gemini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-slate-950/80 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-bold">Latency:</span> &lt; 2ms (Zero API Cost)
            </div>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('advanced-agents')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 transition-all flex items-center gap-2"
              >
                <span>View LLM Specialists</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>
        </div>

        {/* Global Agent Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Agent Engine</span>
            <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">Deterministic</span>
          </div>
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">LLM Token Usage</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 block">0 Tokens (Zero API Cost)</span>
          </div>
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Math Foundation</span>
            <span className="text-sm font-black text-teal-300 font-mono mt-0.5 block">Markov, Beta, BFS</span>
          </div>
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Confidence P-Value</span>
            <span className="text-sm font-black text-cyan-300 font-mono mt-0.5 block">p = {abTestResult.pValue}</span>
          </div>
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">PageRank Damping</span>
            <span className="text-sm font-black text-purple-300 font-mono mt-0.5 block">d = {dampingFactor}</span>
          </div>
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Active Non-LLM Agents</span>
            <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">6 Engines Online</span>
          </div>
        </div>
      </div>

      {/* Specialist Agent Selection Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {agentList.map(agent => {
          const Icon = agent.icon;
          const isActive = activeAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setActiveAgentId(agent.id as any)}
              className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-500/20 to-teal-900/40 border-emerald-400/60 text-white shadow-lg glow-emerald'
                  : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">
                    MATH
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{agent.shortName}</h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {agent.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Agent Workspace */}
      <AnimatePresence mode="wait">
        {/* ================================================================== */}
        {/* 1. BANDIT & BAYESIAN BID OPTIMIZER */}
        {/* ================================================================== */}
        {activeAgentId === 'bandit' && (
          <motion.div
            key="bandit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header / Config Bar */}
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">AGENT 01 &bull; STOCHASTIC CALCULUS</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-400/30">
                      Zero-LLM Thompson Sampling
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">Multi-Armed Bandit & Bayesian Bid Allocation</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Solves multi-channel explore/exploit dilemma using Beta prior distributions, Markowitz mean-variance portfolio balancing, and Kelly criterion capital fractions.
                  </p>
                </div>

                <button
                  onClick={handleRunBanditSim}
                  disabled={isSimulatingBandit}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs font-mono flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isSimulatingBandit ? 'animate-spin' : ''}`} />
                  {isSimulatingBandit ? 'Sampling 1,000 Draws...' : 'Run Monte Carlo Optimization'}
                </button>
              </div>

              {/* Interactive Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Daily Total Spend:</span>
                    <span className="text-emerald-400 font-bold">${banditBudget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={banditBudget}
                    onChange={e => setBanditBudget(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Target Maximum CPA:</span>
                    <span className="text-cyan-400 font-bold">${banditTargetCpa}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={banditTargetCpa}
                    onChange={e => setBanditTargetCpa(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Exploit vs Explore Risk:</span>
                    <span className="text-purple-300 font-bold">{Math.round(banditRiskTolerance * 100)}% (Exploit)</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.95"
                    step="0.05"
                    value={banditRiskTolerance}
                    onChange={e => setBanditRiskTolerance(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Arm Allocation Table & Mathematical Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Arms Table */}
              <div className="lg:col-span-2 bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Thompson Sampling Weight Distribution</h3>
                  <span className="text-xs font-mono text-emerald-400">
                    Projected ROAS: <strong>{banditResult.projectedRoas}x</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {banditResult.arms.map(arm => (
                    <div key={arm.id} className="bg-slate-900/80 border border-white/5 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{arm.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">{arm.channel}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            ${arm.allocatedBudget.toLocaleString()} / day
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {Math.round(arm.thompsonWeight * 100)}% weight
                          </span>
                        </div>
                      </div>

                      {/* Weight progress bar */}
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${arm.thompsonWeight * 100}%` }}
                        />
                      </div>

                      {/* Arm Math Badges */}
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block">CTR / CVR</span>
                          <span className="text-slate-300 font-bold">{arm.currentCtr.toFixed(1)}% / {arm.currentCvr.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Actual CPA</span>
                          <span className="text-cyan-300 font-bold">${arm.cpa.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Historical ROAS</span>
                          <span className="text-purple-300 font-bold">{arm.roas.toFixed(2)}x</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Optimal Bid</span>
                          <span className="text-emerald-400 font-bold">${arm.recommendedBid.toFixed(2)} CPC</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dayparting Schedule & Calculus Stats */}
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Mathematical Solvers Telemetry</h3>
                  <div className="mt-4 space-y-3">
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Kelly Criterion Capital Fraction</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">{banditResult.kellyFraction}</span>
                      <p className="text-[11px] text-slate-300">Max theoretical portfolio growth without ruin.</p>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Markowitz Sharpe Ratio</span>
                      <span className="text-lg font-black text-cyan-300 font-mono">{banditResult.markovitzSharpeRatio}</span>
                      <p className="text-[11px] text-slate-300">Risk-adjusted return per unit of variance.</p>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Projected Conversions</span>
                      <span className="text-lg font-black text-purple-300 font-mono">
                        {banditResult.projectedConversions} conversions / day
                      </span>
                      <p className="text-[11px] text-slate-300">Estimated revenue: ${banditResult.projectedRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
                  <div className="text-white font-bold mb-1">Execution Engine:</div>
                  Beta Conjugate Priors &bull; Box-Muller Normal Approx &bull; 1,000 Monte Carlo Iterations
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================== */}
        {/* 2. PAGERANK & GRAPH TOPOLOGY AGENT */}
        {/* ================================================================== */}
        {activeAgentId === 'pagerank' && (
          <motion.div
            key="pagerank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">AGENT 02 &bull; GRAPH THEORY</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold border border-cyan-400/30">
                      Power Iteration Eigenvector Solver
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">PageRank Power Iteration & Link Topology</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Solves Markov random walks with Damping Factor <em>d</em>, calculates HITS Hubs & Authorities, finds orphan pages, and eliminates dead-end link equity traps.
                  </p>
                </div>

                {/* Damping Factor Control */}
                <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-white/10">
                  <span className="text-xs font-mono text-slate-400">Damping (d):</span>
                  {[0.70, 0.85, 0.90].map(d => (
                    <button
                      key={d}
                      onClick={() => handleRecalculatePageRank(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        dampingFactor === d
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topology Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Graph Nodes</span>
                  <span className="text-lg font-black text-white font-mono">{pageRankResult.totalNodes} URLs</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Convergence Iterations</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{pageRankResult.iterationsToConvergence} Steps</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Avg Click Depth</span>
                  <span className="text-lg font-black text-cyan-300 font-mono">{pageRankResult.averageClickDepth} Clicks</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Silo Integrity</span>
                  <span className="text-lg font-black text-purple-300 font-mono">{pageRankResult.siloIntegrityScore}%</span>
                </div>
              </div>
            </div>

            {/* URL Node Graph Table */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Computed PageRank & Authority Node Vector</h3>
                <span className="text-xs font-mono text-slate-400">Sorted by Link Equity Density</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="p-3">Node URL</th>
                      <th className="p-3">Silo</th>
                      <th className="p-3">In/Out Links</th>
                      <th className="p-3">Click Depth</th>
                      <th className="p-3">PageRank Score</th>
                      <th className="p-3">HITS Authority</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {pageRankResult.nodes.map((node, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white truncate max-w-xs">{node.title}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-xs">{node.url}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10 text-[10px]">
                            {node.topicSilo}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-emerald-400 font-bold">{node.inLinks} in</span> &bull;{' '}
                          <span className="text-slate-400">{node.outLinks} out</span>
                        </td>
                        <td className="p-3 text-slate-300">{node.clickDepth} hops</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-400 w-8">{node.pageRank}</span>
                            <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400" style={{ width: `${node.pageRank}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-purple-300">{node.authorityScore}%</td>
                        <td className="p-3 text-right">
                          {node.isEquitySink ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                              Dead-End Sink
                            </span>
                          ) : node.isOrphan ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30">
                              Orphan Node
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                              Healthy Node
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actionable Link Injection Vector */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Deterministic Internal Link Injection Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pageRankResult.recommendedLinkInjections.map((rec, ri) => (
                  <div key={ri} className="bg-slate-900/80 border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                      <span>INJECTION #{ri + 1}</span>
                      <span className="text-emerald-400 font-bold">+{rec.expectedEquityBoost}% Equity</span>
                    </div>
                    <div className="text-xs font-bold text-white">Anchor: "{rec.anchorText}"</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      From: {rec.sourceUrl.replace(/^https?:\/\/[^/]+/, '')}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300 truncate">
                      To: {rec.targetUrl.replace(/^https?:\/\/[^/]+/, '')}
                    </div>
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-white/5">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================== */}
        {/* 3. MARKOV MULTI-TOUCH ATTRIBUTION */}
        {/* ================================================================== */}
        {activeAgentId === 'attribution' && (
          <motion.div
            key="attribution"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-purple-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">AGENT 03 &bull; STOCHASTIC ATTRIBUTION</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold border border-purple-400/30">
                      Markov Removal Effect & Shapley Math
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">First-Order Markov Chain Multi-Touch Attribution</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculates conversion state transition probability matrices, removal effect coefficients, and game-theoretic Shapley value distributions.
                  </p>
                </div>

                {/* Attribution Model Switcher */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-white/10">
                  {[
                    { id: 'markovChain', label: 'Markov Removal' },
                    { id: 'shapleyValue', label: 'Shapley Value' },
                    { id: 'firstTouch', label: 'First Touch' },
                    { id: 'lastTouch', label: 'Last Touch' },
                    { id: 'uShaped', label: 'U-Shaped' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setAttributionModel(m.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        attributionModel === m.id
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Removal Effects Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {Object.entries(markovResult.removalEffects).map(([channel, effect]) => (
                  <div key={channel} className="bg-slate-900/80 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase truncate block">{channel}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-purple-300 font-mono">{(Number(effect) * 100).toFixed(1)}%</span>
                      <span className="text-[9px] text-slate-500">Removal Effect</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attribution Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Model Weights Chart */}
              <div className="lg:col-span-2 bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Channel Credit Share: {attributionModel.toUpperCase()}</h3>
                  <span className="text-xs font-mono text-purple-400">Total: 100% Attributed</span>
                </div>

                <div className="space-y-3">
                  {Object.entries(markovResult.attributionWeights[attributionModel]).map(([channel, weight]) => (
                    <div key={channel} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">{channel}</span>
                        <span className="text-purple-300 font-black">{Number(weight).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${Number(weight)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Dollar Budget Shift */}
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white">Algorithmic Reallocation</h3>
                <div className="space-y-3">
                  {markovResult.recommendedBudgetReallocation.map((rec, rri) => (
                    <div key={rri} className="bg-slate-900/80 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{rec.channel}</h4>
                        <span className={`text-xs font-mono font-bold ${
                          rec.deltaAdjustment > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {rec.deltaAdjustment > 0 ? `+${rec.deltaAdjustment}%` : `${rec.deltaAdjustment}%`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{rec.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================================== */}
        {/* 4. SCHEMA AST COMPILER & RFC VALIDATOR */}
        {/* ================================================================== */}
        {activeAgentId === 'schema' && (
          <motion.div
            key="schema"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">AGENT 04 &bull; COMPILER & RFC PROTOCOLS</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-400/30">
                      RFC 9309 & Schema.org AST Parser
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">Deterministic Schema AST Compiler & Validator</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Strict Schema.org graph compilation, RFC 9309 robots.txt grammar parser, bidirectional hreflang sitemap generator, and CSP security header checks.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(schemaResult.compiledJsonLd, 'jsonld_copy')}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-white flex items-center gap-1.5"
                  >
                    {copiedId === 'jsonld_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'jsonld_copy' ? 'Copied!' : 'Copy JSON-LD'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadFile(schemaResult.compiledRobotsTxt, 'robots.txt')}
                    className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Configs</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                {[
                  { id: 'jsonld', label: 'Schema.org JSON-LD Graph' },
                  { id: 'robots', label: 'RFC 9309 Robots.txt' },
                  { id: 'hreflang', label: 'Hreflang Multi-Lang XML' },
                  { id: 'security', label: 'Security Headers & CSP' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setActiveSchemaTab(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      activeSchemaTab === st.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Output Viewer */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {activeSchemaTab === 'jsonld' && 'schema.jsonld (AST Verified)'}
                  {activeSchemaTab === 'robots' && 'robots.txt (RFC 9309 Compliant)'}
                  {activeSchemaTab === 'hreflang' && 'sitemap-hreflang.xml'}
                  {activeSchemaTab === 'security' && 'HTTP Response Security Headers'}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Compliance Score: {schemaResult.complianceScore}%
                </span>
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto border border-white/5 max-h-96">
                <code>
                  {activeSchemaTab === 'jsonld' && schemaResult.compiledJsonLd}
                  {activeSchemaTab === 'robots' && schemaResult.compiledRobotsTxt}
                  {activeSchemaTab === 'hreflang' && schemaResult.compiledHreflangXml}
                  {activeSchemaTab === 'security' && JSON.stringify(schemaResult.securityHeadersCheck, null, 2)}
                </code>
              </pre>
            </div>
          </motion.div>
        )}

        {/* ================================================================== */}
        {/* 5. STATISTICAL HYPOTHESIS TESTING */}
        {/* ================================================================== */}
        {activeAgentId === 'abtest' && (
          <motion.div
            key="abtest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">AGENT 05 &bull; STATISTICAL INFERENCE</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold border border-cyan-400/30">
                      Frequentist Z-Score & Bayesian P2BC
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">A/B Testing & Bayesian Power Calculator</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Solves two-proportion Z-tests, Student's t-test, exact p-values, Minimum Detectable Effect (MDE), and Bayesian probability to beat control.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                  abTestResult.decisionVerdict === 'DECLARE_WINNER'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verdict: {abTestResult.decisionVerdict}</span>
                </div>
              </div>

              {/* Live Inputs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Control Visitors:</label>
                  <input
                    type="number"
                    value={testVisitorsA}
                    onChange={e => { setTestVisitorsA(Number(e.target.value)); handleRecalculateABTest(); }}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Control Conversions:</label>
                  <input
                    type="number"
                    value={testConvA}
                    onChange={e => { setTestConvA(Number(e.target.value)); handleRecalculateABTest(); }}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Variant B Visitors:</label>
                  <input
                    type="number"
                    value={testVisitorsB}
                    onChange={e => { setTestVisitorsB(Number(e.target.value)); handleRecalculateABTest(); }}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-cyan-300"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Variant B Conversions:</label>
                  <input
                    type="number"
                    value={testConvB}
                    onChange={e => { setTestConvB(Number(e.target.value)); handleRecalculateABTest(); }}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-cyan-300"
                  />
                </div>
              </div>
            </div>

            {/* Test Results Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Conversion Rates</span>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-slate-400">Control (A):</span>
                    <div className="text-xl font-black text-white font-mono">{abTestResult.conversionRateA}%</div>
                  </div>
                  <div>
                    <span className="text-xs text-cyan-400">Variant (B):</span>
                    <div className="text-xl font-black text-cyan-300 font-mono">{abTestResult.conversionRateB}%</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 text-xs font-mono text-emerald-400 font-bold">
                  Relative Uplift: +{abTestResult.relativeUplift}%
                </div>
              </div>

              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Statistical Significance</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {abTestResult.confidenceLevelPercentage}%
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Z-Score: <strong>{abTestResult.zScore}</strong> &bull; p-value: <strong>{abTestResult.pValue}</strong>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Bayesian Probability</span>
                <div className="text-2xl font-black text-purple-300 font-mono">
                  {abTestResult.bayesianProbabilityToBeatControl}%
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Power: <strong>{abTestResult.statisticalPower}%</strong> &bull; MDE: <strong>{abTestResult.minimumDetectableEffect}%</strong>
                </div>
              </div>
            </div>

            {/* Explanation card */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-2">
                <Info className="w-4 h-4" />
                <span>Deterministic Scientific Recommendation</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {abTestResult.verdictExplanation}
              </p>
            </div>
          </motion.div>
        )}

        {/* ================================================================== */}
        {/* 6. PERFORMANCE BUDGET & CORE WEB VITALS */}
        {/* ================================================================== */}
        {activeAgentId === 'perfbudget' && (
          <motion.div
            key="perfbudget"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">AGENT 06 &bull; DOM & BYTEWATERFALL</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-400/30">
                      Deterministic Byte Budget Profiler
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">Core Web Vitals & Performance Budget Engine</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzes critical render path RTT roundtrips, CSS selector specificity scores, and automated Nginx / Cloudflare caching headers.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{perfBudgetResult.budgetScore}/100</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Performance Budget Health</span>
                </div>
              </div>

              {/* Vitals Telemetry */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Page Weight</span>
                  <span className="text-lg font-black text-white font-mono">{perfBudgetResult.totalPageWeightKb} KB</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Estimated LCP</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{perfBudgetResult.estimatedLcpMs} ms</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Estimated INP</span>
                  <span className="text-lg font-black text-cyan-300 font-mono">{perfBudgetResult.estimatedInpMs} ms</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Estimated CLS</span>
                  <span className="text-lg font-black text-purple-300 font-mono">{perfBudgetResult.estimatedCls}</span>
                </div>
              </div>
            </div>

            {/* Resource Budget Breakdown */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Resource Type Byte Allocations</h3>
              <div className="space-y-3">
                {perfBudgetResult.items.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-bold">{item.resourceType} ({item.requestCount} requests)</span>
                      <span className={item.actualKb > item.allocatedKb ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {item.actualKb} KB / {item.allocatedKb} KB budget
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.actualKb > item.allocatedKb ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, (item.actualKb / item.allocatedKb) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nginx & Brotli Static Cache Config */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Generated Production Caching & Compression Directive</h3>
                <button
                  onClick={() => handleCopy(perfBudgetResult.generatedNginxConfig, 'nginx_config')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-1"
                >
                  {copiedId === 'nginx_config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'nginx_config' ? 'Copied' : 'Copy Nginx Config'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto border border-white/5">
                <code>{perfBudgetResult.generatedNginxConfig}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
