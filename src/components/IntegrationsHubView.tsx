/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Key,
  Globe,
  BarChart2,
  Search,
  Users,
  ShoppingBag,
  Share2,
  Target,
  Zap,
  Trash2,
  Check,
  Copy,
  Layers,
  ArrowRight,
  Sliders,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import {
  SUPPORTED_INTEGRATIONS,
  ToolIntegrationConfig,
  ConnectedToolState
} from '../lib/tool-integrations-config';

interface IntegrationsHubViewProps {
  onNavigateToTab?: (tabId: string) => void;
}

export default function IntegrationsHubView({ onNavigateToTab }: IntegrationsHubViewProps) {
  const [integrations, setIntegrations] = useState<ConnectedToolState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTool, setSelectedTool] = useState<ToolIntegrationConfig | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Modal / Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // WordPress quick publish test modal
  const [showWpPublishModal, setShowWpPublishModal] = useState(false);
  const [wpTitle, setWpTitle] = useState('Top 10 Growth Marketing Strategies for 2026');
  const [wpStatus, setWpStatus] = useState<'draft' | 'publish'>('draft');
  const [wpPublishing, setWpPublishing] = useState(false);
  const [wpResult, setWpResult] = useState<any>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations || []);
      }
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getToolIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'Search': return <Search className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Users': return <Users className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'Share2': return <Share2 className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Zap': return <Zap className={className} />;
      default: return <Plug className={className} />;
    }
  };

  const handleOpenConnect = (tool: ToolIntegrationConfig) => {
    setSelectedTool(tool);
    setTestResult(null);
    setErrorMsg(null);
    setSuccessMsg(null);

    // If already connected, prepopulate non-masked values or empty
    const existing = integrations.find(i => i.toolId === tool.id);
    if (existing && existing.config) {
      setFormData({ ...existing.config });
    } else {
      const initial: Record<string, string> = {};
      tool.fields.forEach(f => {
        initial[f.key] = '';
      });
      setFormData(initial);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedTool) return;
    setTesting(true);
    setTestResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool.id,
          config: formData
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.error || 'Connection verification failed.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network exception during test.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool.id,
          config: formData
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Connected successfully!');
        await fetchIntegrations();
        setTimeout(() => {
          setSelectedTool(null);
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to save integration.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async (toolId: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return;
    try {
      const res = await fetch('/api/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const handleWpPublishTest = async () => {
    setWpPublishing(true);
    setWpResult(null);
    try {
      const res = await fetch('/api/integrations/wordpress/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: wpTitle,
          status: wpStatus,
          content: '<p>Generated by Sophia Vance & Elena Rostova autonomous marketing swarm.</p>'
        })
      });
      const data = await res.json();
      setWpResult(data);
    } catch (err: any) {
      setWpResult({ error: err.message });
    } finally {
      setWpPublishing(false);
    }
  };

  const filteredTools = SUPPORTED_INTEGRATIONS.filter(t => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'connected') {
      return integrations.some(i => i.toolId === t.id && i.status === 'connected');
    }
    return t.category === filterCategory;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-panel border border-cyan-500/30 rounded-3xl p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Plug className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Unified Ecosystem Hub
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Connect External Accounts, Analytics & CMS Tools
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Supercharge your autonomous 16-agent marketing workforce with real-time first-party data. Connect <strong>Google Analytics 4</strong>, <strong>WordPress REST API</strong>, <strong>Google Search Console</strong>, <strong>HubSpot</strong>, <strong>Shopify</strong>, and <strong>Paid Ad Channels</strong> to feed live conversion feedback into agent reasoning loops.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-2xl font-black text-cyan-300 font-mono">{connectedCount}</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Connected</div>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-2xl font-black text-white font-mono">{SUPPORTED_INTEGRATIONS.length}</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Available</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Encrypted</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-white/10 mt-6 text-xs font-mono">
          <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
            <Sliders className="w-3.5 h-3.5" /> Category:
          </span>
          {[
            { id: 'all', label: 'All Tools' },
            { id: 'connected', label: `Connected (${connectedCount})` },
            { id: 'analytics', label: 'Analytics & Traffic' },
            { id: 'seo', label: 'SEO & Search' },
            { id: 'cms', label: 'CMS & Storefronts (WordPress/Shopify)' },
            { id: 'crm', label: 'CRM & Leads (HubSpot)' },
            { id: 'advertising', label: 'Paid Ad Channels (Meta/Google)' },
            { id: 'automation', label: 'Webhooks & Zapier' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-bold ${
                filterCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => {
          const connected = integrations.find(i => i.toolId === tool.id && i.status === 'connected');

          return (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel border rounded-3xl p-6 transition-all flex flex-col justify-between group relative overflow-hidden ${
                connected
                  ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/5 via-slate-900/90 to-slate-950 shadow-lg shadow-cyan-500/5'
                  : 'border-white/10 bg-slate-900/70 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                {/* Top Row: Icon + Badge + Status */}
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} p-0.5 shadow-md flex items-center justify-center text-white`}>
                    <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center backdrop-blur-xs">
                      {getToolIcon(tool.iconName, 'w-6 h-6')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px] font-bold">
                      {tool.badge}
                    </span>
                    {connected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Connected & Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Plug className="w-3 h-3" /> Ready to Connect
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400 font-semibold">{tool.tagline}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>

                {/* Live Synced Telemetry Data (If connected) */}
                {connected && connected.syncedMetrics && (
                  <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-cyan-500/20 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      <span>{connected.syncedMetrics.summary}</span>
                      <span className="text-emerald-400 font-bold">Synced</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                      {connected.syncedMetrics.dataPoints.slice(0, 2).map((dp, i) => (
                        <div key={i} className="space-y-0.5">
                          <span className="text-[10px] font-mono text-slate-500 block truncate">{dp.label}</span>
                          <span className="text-xs font-mono text-white font-bold">{dp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capabilities List */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block">
                    Agent Superpowers:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {tool.capabilities.slice(0, 2).map((cap, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-2 mt-4">
                {connected ? (
                  <>
                    <button
                      onClick={() => handleOpenConnect(tool)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      Configure
                    </button>

                    {tool.id === 'wordpress' && (
                      <button
                        onClick={() => setShowWpPublishModal(true)}
                        className="px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Test Post
                      </button>
                    )}

                    <button
                      onClick={() => handleDisconnect(tool.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                      title="Disconnect integration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenConnect(tool)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plug className="w-4 h-4" />
                    Connect {tool.name.split(' ')[0]}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Connect / Configuration Modal */}
      <AnimatePresence>
        {selectedTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel border border-cyan-500/40 rounded-3xl p-6 lg:p-8 bg-slate-950 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedTool.color} flex items-center justify-center text-white shadow-md`}>
                    {getToolIcon(selectedTool.iconName, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Connect {selectedTool.name}</h3>
                    <p className="text-xs font-mono text-slate-400">{selectedTool.tagline}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTool(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Status alerts */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              {testResult && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                  testResult.success
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Security Badge */}
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2.5 text-xs text-slate-300">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>All API keys and credentials are encrypted on the server with AES-256 and never exposed to the client.</span>
              </div>

              {/* Dynamic Form Fields */}
              <form onSubmit={handleSaveConnection} className="space-y-4">
                {selectedTool.fields.map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-300">
                      {field.label} {field.required && <span className="text-cyan-400">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    {field.helperText && (
                      <p className="text-[11px] text-slate-500 font-mono">{field.helperText}</p>
                    )}
                  </div>
                ))}

                {/* Documentation link */}
                <div className="pt-2">
                  <a
                    href={selectedTool.docLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
                  >
                    <span>Official {selectedTool.name} API Documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    disabled={testing || saving}
                    onClick={handleTestConnection}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                    Test Connection
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Save & Authenticate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WordPress Test Publish Modal */}
      <AnimatePresence>
        {showWpPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel border border-cyan-500/40 rounded-3xl p-6 lg:p-8 bg-slate-950 max-w-lg w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-6 h-6 text-sky-400" />
                  <h3 className="text-lg font-black text-white">Direct WordPress Auto-Publish</h3>
                </div>
                <button
                  onClick={() => setShowWpPublishModal(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Article Title:</label>
                  <input
                    type="text"
                    value={wpTitle}
                    onChange={e => setWpTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Publish Mode:</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                      <input
                        type="radio"
                        name="wpStatus"
                        checked={wpStatus === 'draft'}
                        onChange={() => setWpStatus('draft')}
                      />
                      Save as Draft
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                      <input
                        type="radio"
                        name="wpStatus"
                        checked={wpStatus === 'publish'}
                        onChange={() => setWpStatus('publish')}
                      />
                      Publish Live
                    </label>
                  </div>
                </div>

                {wpResult && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    wpResult.success
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}>
                    {wpResult.message || wpResult.error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setShowWpPublishModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={wpPublishing}
                    onClick={handleWpPublishTest}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold flex items-center gap-2"
                  >
                    {wpPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Execute WordPress Dispatch
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
