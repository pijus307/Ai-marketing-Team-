/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, Sliders, Database, Laptop, Key, Check, 
  AlertCircle, RefreshCw, Eye, EyeOff, Bot, Server, Zap, Cpu, Star
} from 'lucide-react';

interface AIProviderConfig {
  enabled: boolean;
  apiKey: string;
  selectedModel: string;
  isDefault: boolean;
  status: 'connected' | 'not-connected' | 'testing';
}

interface ProviderDetails {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  brandColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  models: string[];
}

export default function AIProvidersView() {
  const userId = 'pijussadhukhan2006@gmail.com'; // Stable user identification

  // Available models lists
  const providers: ProviderDetails[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      subtitle: 'Native Developer Engine',
      description: 'High-speed multimodality and industry-leading context window. Default native provider.',
      icon: <Sparkles className="w-5 h-5" />,
      brandColor: 'bg-indigo-600',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      badgeText: 'text-indigo-600',
      glowColor: 'shadow-indigo-500/20',
      models: ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.1-pro-preview']
    },
    {
      id: 'omniroute',
      name: 'OmniRoute Gateway',
      subtitle: 'Universal Model Router',
      description: 'diegosouzapw/OmniRoute integration. Aggregates 100+ AI models, 19+ routing strategies, quota auto-fallback, and RTK Caveman token compression.',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      brandColor: 'bg-indigo-600',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      badgeText: 'text-indigo-600',
      glowColor: 'shadow-indigo-500/20',
      models: ['omniroute/cost-zero-maximizer', 'omniroute/ultra-low-latency', 'omniroute/deep-reasoning', 'omniroute/editorial-craft', 'omniroute/quota-fallback']
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      subtitle: 'Unified API Gateway',
      description: 'Access any open source or proprietary model via a single universal API interface.',
      icon: <Layers className="w-5 h-5" />,
      brandColor: 'bg-purple-600',
      borderColor: 'border-purple-500/30',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-150',
      badgeText: 'text-purple-600',
      glowColor: 'shadow-purple-500/20',
      models: ['meta-llama/llama-3-70b-instruct', 'mistralai/mixtral-8x7b-instruct', 'anthropic/claude-3.5-sonnet']
    },
    {
      id: 'nvidia',
      name: 'NVIDIA NIM',
      subtitle: 'Accelerated Microservices',
      description: 'Optimized cloud endpoints running with ultra-low latency acceleration.',
      icon: <Cpu className="w-5 h-5" />,
      brandColor: 'bg-emerald-600',
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      badgeText: 'text-emerald-600',
      glowColor: 'shadow-emerald-500/20',
      models: ['meta/llama3-70b-instruct', 'nvidia/nemotron-4-340b-instruct', 'mistralai/mixtral-8x22b-instruct']
    },
    {
      id: 'openai',
      name: 'OpenAI',
      subtitle: 'Industry Gold Standard',
      description: 'Pioneering frontier intelligence models for high-quality instruction adherence.',
      icon: <Zap className="w-5 h-5" />,
      brandColor: 'bg-zinc-900',
      borderColor: 'border-zinc-500/30',
      badgeBg: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      badgeText: 'text-zinc-700',
      glowColor: 'shadow-zinc-500/20',
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      subtitle: 'Steered Safe Cognition',
      description: 'Superior reasoning, technical coding, and sophisticated editorial tone.',
      icon: <Bot className="w-5 h-5" />,
      brandColor: 'bg-amber-600',
      borderColor: 'border-amber-500/30',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-150',
      badgeText: 'text-amber-600',
      glowColor: 'shadow-amber-500/20',
      models: ['claude-3-5-sonnet-latest', 'claude-3-opus-latest', 'claude-3-haiku-latest']
    },
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      subtitle: 'On-Premises Autonomy',
      description: 'Run completely offline local models on your local hardware structure securely.',
      icon: <Laptop className="w-5 h-5" />,
      brandColor: 'bg-sky-600',
      borderColor: 'border-sky-500/30',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-150',
      badgeText: 'text-sky-600',
      glowColor: 'shadow-sky-500/20',
      models: ['llama3', 'mistral', 'phi3', 'gemma2']
    }
  ];

  // Initialize state with default config values
  const [configs, setConfigs] = useState<Record<string, AIProviderConfig>>({
    gemini: { enabled: true, apiKey: '••••••••••••••••••••••••••••', selectedModel: 'gemini-2.5-flash', isDefault: true, status: 'connected' },
    omniroute: { enabled: true, apiKey: 'omniroute-universal-gateway', selectedModel: 'omniroute/cost-zero-maximizer', isDefault: false, status: 'connected' },
    openrouter: { enabled: false, apiKey: '', selectedModel: 'meta-llama/llama-3-70b-instruct', isDefault: false, status: 'not-connected' },
    nvidia: { enabled: false, apiKey: '', selectedModel: 'meta/llama3-70b-instruct', isDefault: false, status: 'not-connected' },
    openai: { enabled: false, apiKey: '', selectedModel: 'gpt-4o', isDefault: false, status: 'not-connected' },
    anthropic: { enabled: false, apiKey: '', selectedModel: 'claude-3-5-sonnet-latest', isDefault: false, status: 'not-connected' },
    ollama: { enabled: false, apiKey: 'http://localhost:11434', selectedModel: 'llama3', isDefault: false, status: 'not-connected' }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Load saved configurations from backend database on page load
  useEffect(() => {
    async function loadProviderSettings() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/ai-providers?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setConfigs(prev => {
              const next = { ...prev };
              data.forEach((row: any) => {
                const pId = row.provider_name;
                if (next[pId]) {
                  next[pId] = {
                    enabled: !!row.is_enabled,
                    apiKey: row.api_key || '',
                    selectedModel: row.default_model || prev[pId].selectedModel,
                    isDefault: !!row.is_default,
                    status: row.is_enabled ? 'connected' : 'not-connected'
                  };
                }
              });
              return next;
            });
          }
        }
      } catch (e) {
        console.error('Failed to load database provider settings', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProviderSettings();
  }, []);

  const handleToggle = (providerId: string) => {
    setConfigs(prev => {
      const nextEnabled = !prev[providerId].enabled;
      return {
        ...prev,
        [providerId]: {
          ...prev[providerId],
          enabled: nextEnabled,
          status: nextEnabled ? (prev[providerId].apiKey ? 'connected' : 'not-connected') : 'not-connected'
        }
      };
    });
  };

  const handleSetDefault = (providerId: string) => {
    setConfigs(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = {
          ...next[key],
          isDefault: key === providerId
        };
      });
      return next;
    });
  };

  const handleApiKeyChange = (providerId: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        apiKey: value
      }
    }));
  };

  const handleModelChange = (providerId: string, model: string) => {
    setConfigs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        selectedModel: model
      }
    }));
  };

  const toggleKeyVisibility = (providerId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  // Validates and saves single provider settings to DB
  const handleSave = async (providerId: string) => {
    const config = configs[providerId];
    
    // Validate the API key is not empty
    if (!config.apiKey || config.apiKey.trim() === '') {
      setAlert({
        type: 'error',
        message: `Validation Error: API Key/Endpoint is required for ${providers.find(p => p.id === providerId)?.name}.`
      });
      return;
    }

    try {
      const response = await fetch('/api/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          provider_name: providerId,
          api_key: config.apiKey,
          default_model: config.selectedModel,
          is_enabled: config.enabled,
          is_default: config.isDefault
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update frontend configs with masked API key and adjust default flags
        setConfigs(prev => {
          const next = { ...prev };
          if (config.isDefault) {
            Object.keys(next).forEach(key => {
              if (key !== providerId) {
                next[key] = {
                  ...next[key],
                  isDefault: false
                };
              }
            });
          }
          next[providerId] = {
            ...next[providerId],
            apiKey: data.provider.api_key
          };
          return next;
        });

        setAlert({
          type: 'success',
          message: `Successfully saved ${providers.find(p => p.id === providerId)?.name} settings to database.`
        });
      } else {
        const err = await response.json();
        setAlert({
          type: 'error',
          message: err.error || 'Failed to save settings.'
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Network error: Failed to connect to backend server.'
      });
    }

    // Auto dismiss alert after 4s
    setTimeout(() => {
      setAlert(prev => prev.message ? { type: null, message: '' } : prev);
    }, 4000);
  };

  const handleTestConnection = async (providerId: string) => {
    const config = configs[providerId];
    
    // Set to testing status
    setConfigs(prev => ({
      ...prev,
      [providerId]: { ...prev[providerId], status: 'testing' }
    }));

    try {
      const response = await fetch('/api/ai-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          provider_name: providerId,
          api_key: config.apiKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConfigs(prev => ({
          ...prev,
          [providerId]: { ...prev[providerId], status: 'connected' }
        }));
        setAlert({
          type: 'success',
          message: data.message || `Successfully connected to ${providers.find(p => p.id === providerId)?.name}!`
        });
      } else {
        const err = await response.json();
        setConfigs(prev => ({
          ...prev,
          [providerId]: { ...prev[providerId], status: 'not-connected' }
        }));
        setAlert({
          type: 'error',
          message: err.error || `Connection test failed for ${providers.find(p => p.id === providerId)?.name}.`
        });
      }
    } catch (err: any) {
      setConfigs(prev => ({
        ...prev,
        [providerId]: { ...prev[providerId], status: 'not-connected' }
      }));
      setAlert({
        type: 'error',
        message: 'Network error: Failed to connect to the testing server endpoint.'
      });
    }

    setTimeout(() => {
      setAlert(prev => prev.message ? { type: null, message: '' } : prev);
    }, 4500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Workstation Header */}
      <div className="bg-zinc-900 border border-zinc-950 rounded-md p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-xs text-zinc-100 font-mono tracking-wider uppercase font-semibold mb-4">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            System Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Provider Configurations
          </h1>
          <p className="text-zinc-300 text-sm md:text-base mt-2 leading-relaxed">
            Configure system models, provision secret API keys, set localized network endpoints, and optimize inference layers of your marketing agency.
          </p>
        </div>
      </div>

      {/* Loading overlay for DB fetch */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 gap-3 text-zinc-500 font-mono text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
          Synchronizing credentials table...
        </div>
      )}

      {/* Alert banner */}
      {!isLoading && alert.type && (
        <div className={`p-4 rounded-md border flex items-start gap-3 shadow-sm transition-all animate-fadeIn ${
          alert.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {alert.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          )}
          <div className="text-xs font-semibold font-sans">
            {alert.message}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map(provider => {
            const config = configs[provider.id] || { enabled: false, apiKey: '', selectedModel: provider.models[0], isDefault: false, status: 'not-connected' };
            const isKeyVisible = visibleKeys[provider.id];

            return (
              <div 
                key={provider.id}
                className={`bg-white border rounded-md p-6 shadow-sm transition-all relative overflow-hidden flex flex-col justify-between ${
                  config.enabled 
                    ? 'border-zinc-300 ring-1 ring-zinc-100' 
                    : 'border-zinc-200 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Top Row: Brand Info + Toggle */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded text-white flex-shrink-0 ${provider.brandColor} shadow-inner`}>
                        {provider.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                          {provider.name}
                          {config.isDefault && (
                            <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border bg-amber-50 border-amber-200 text-amber-700 flex items-center gap-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              Default
                            </span>
                          )}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wide mt-0.5">
                          {provider.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* iOS/Slide Toggle Switch */}
                    <button
                      onClick={() => handleToggle(provider.id)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                        config.enabled ? 'bg-indigo-600' : 'bg-zinc-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          config.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-4">
                    {provider.description}
                  </p>

                  {/* Settings Inputs Form */}
                  <div className="mt-5 space-y-4 pt-4 border-t border-zinc-100">
                    {/* API Key or Connection URL Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1">
                        <Key className="w-3 h-3 text-zinc-400" />
                        {provider.id === 'ollama' ? 'Local Connection Endpoint URL' : 'API Key Credential'}
                      </label>
                      <div className="relative">
                        <input
                          type={isKeyVisible ? 'text' : 'password'}
                          value={config.apiKey}
                          disabled={!config.enabled}
                          onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                          placeholder={provider.id === 'ollama' ? 'http://localhost:11434' : 'sk-...'}
                          className={`w-full bg-zinc-50 text-zinc-900 placeholder-zinc-400 text-xs rounded-md border border-zinc-200 pl-3 pr-10 py-2.5 focus:outline-none transition-all font-mono font-semibold ${
                            config.enabled ? 'focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10' : 'opacity-60 select-none'
                          }`}
                        />
                        {provider.id !== 'ollama' && (
                          <button
                            type="button"
                            disabled={!config.enabled}
                            onClick={() => toggleKeyVisibility(provider.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer disabled:opacity-40"
                          >
                            {isKeyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Model Selection Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1">
                        <Bot className="w-3 h-3 text-zinc-400" />
                        Default Inference Model
                      </label>
                      <select
                        value={config.selectedModel}
                        disabled={!config.enabled}
                        onChange={(e) => handleModelChange(provider.id, e.target.value)}
                        className={`w-full bg-zinc-50 text-zinc-900 text-xs rounded-md border border-zinc-200 px-3 py-2.5 focus:outline-none transition-all font-semibold ${
                          config.enabled ? 'focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 cursor-pointer' : 'opacity-60'
                        }`}
                      >
                        {provider.models.map(model => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Default Selector Checkbox Button */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1">
                        System Priority Routing
                      </span>
                      <button
                        type="button"
                        disabled={!config.enabled}
                        onClick={() => handleSetDefault(provider.id)}
                        className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                          config.isDefault
                            ? 'bg-amber-50 border-amber-300 text-amber-700 font-extrabold shadow-sm'
                            : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-500 disabled:opacity-40'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${config.isDefault ? 'fill-amber-500 text-amber-500' : 'text-zinc-400'}`} />
                        {config.isDefault ? 'Default Routing' : 'Set as Default'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row: Save, Test, and Connection Status */}
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3 flex-wrap">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      {config.status === 'testing' ? (
                        <span className="animate-spin h-2.5 w-2.5 rounded-full border border-indigo-500 border-t-transparent" />
                      ) : (
                        <>
                          {config.enabled && config.status === 'connected' && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          )}
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            !config.enabled 
                              ? 'bg-zinc-300' 
                              : config.status === 'connected' 
                                ? 'bg-emerald-500' 
                                : 'bg-zinc-400'
                          }`} />
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-zinc-500">
                      {config.status === 'testing' ? (
                        <span className="text-indigo-600">Testing...</span>
                      ) : !config.enabled ? (
                        'Disabled'
                      ) : config.status === 'connected' ? (
                        <span className="text-emerald-600 font-bold">Connected</span>
                      ) : (
                        'Not Connected'
                      )}
                    </span>
                  </div>

                  {/* Save and Test Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!config.enabled || config.status === 'testing'}
                      onClick={() => handleTestConnection(provider.id)}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 border border-zinc-250 hover:border-zinc-350 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${config.status === 'testing' ? 'animate-spin' : ''}`} />
                      Test Connection
                    </button>

                    <button
                      type="button"
                      disabled={!config.enabled}
                      onClick={() => handleSave(provider.id)}
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 disabled:opacity-40 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-1 shadow-sm font-extrabold"
                    >
                      <Check className="w-3 h-3" />
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Integration Instructions Footer Card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-md p-5 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
        <div className="p-3 bg-white border rounded shadow-sm text-zinc-600 flex-shrink-0">
          <Server className="w-6 h-6 text-zinc-500 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase font-mono text-zinc-900 tracking-wider">
            Gateway Routing Protocol & Fallbacks
          </h4>
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
            By default, the agency squad resolves positioning blueprints and crawls via Google Gemini. If secondary providers are enabled with valid credentials, routing rules will automatically split or fallback workloads to minimize pricing margins and guarantee system fault tolerance.
          </p>
        </div>
      </div>
    </div>
  );
}
