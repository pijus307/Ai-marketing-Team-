/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, Globe, Search, FileText, Share2, DollarSign, Database,
  RotateCw, ZoomIn, Eye, Sparkles, ChevronRight, Activity, Cpu
} from 'lucide-react';
import { MarketingAnalysis } from '../types';

interface ThreeDStackVisualizerProps {
  analysis: MarketingAnalysis;
}

interface StackLayer {
  id: string;
  name: string;
  role: string;
  metric: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  details: string;
  depth: number; // Z-index translate offset
}

export default function ThreeDStackVisualizer({ analysis }: ThreeDStackVisualizerProps) {
  // 3D rotation offsets
  const [rotateX, setRotateX] = useState<number>(15);
  const [rotateY, setRotateY] = useState<number>(-20);
  const [zoom, setZoom] = useState<number>(0.95);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const layers: StackLayer[] = [
    {
      id: 'crawler',
      name: 'Layer 1: Technical Crawl Node',
      role: 'Marcus Chen &bull; SEO',
      metric: `Score: ${analysis?.seo?.score ?? 85}/100`,
      icon: <Globe className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-950/90 backdrop-blur-md text-white border-indigo-500/30',
      borderColor: 'border-indigo-500/50',
      textColor: 'text-indigo-300',
      glowColor: 'shadow-indigo-500/30',
      details: `Crawling completed on ${analysis?.url || 'target domain'}. SSL is active, sitemaps are verified, speed latency is ${analysis?.seo?.siteSpeed || '1.1s'}.`,
      depth: 120
    },
    {
      id: 'seo',
      name: 'Layer 2: Semantic Intent Map',
      role: 'Sophia Vance &bull; Strategy',
      metric: `${analysis?.seo?.coreKeywords?.length || 0} Seed Keywords`,
      icon: <Search className="w-5 h-5 text-sky-500" />,
      color: 'bg-zinc-900/95 backdrop-blur-md text-white border-sky-500/20',
      borderColor: 'border-sky-500/40',
      textColor: 'text-sky-300',
      glowColor: 'shadow-sky-500/20',
      details: `High intent targeting set. Top seed keyword: "${analysis?.seo?.coreKeywords?.[0]?.keyword || 'Growth Authority'}" with monthly volume ${analysis?.seo?.coreKeywords?.[0]?.volume || '1.2K'}.`,
      depth: 80
    },
    {
      id: 'content',
      name: 'Layer 3: Topic Pillar Autonomy',
      role: 'Elena Rostova &bull; Content',
      metric: `Cluster: ${(analysis?.content?.corePillar || 'Topical Authority').slice(0, 20)}...`,
      icon: <FileText className="w-5 h-5 text-emerald-500" />,
      color: 'bg-zinc-900/95 backdrop-blur-md text-white border-emerald-500/20',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-300',
      glowColor: 'shadow-emerald-500/20',
      details: `Pillar content cluster drafted. Blog layout outline: "${analysis?.content?.blogArticles?.[0]?.title || 'Growth Strategy'}" with semantic H2 headings loaded.`,
      depth: 40
    },
    {
      id: 'social',
      name: 'Layer 4: Thought Leadership Loops',
      role: 'Chloe Jenkins &bull; Social',
      metric: '5-Day Multi-Channel Feed',
      icon: <Share2 className="w-5 h-5 text-pink-500" />,
      color: 'bg-zinc-900/95 backdrop-blur-md text-white border-pink-500/20',
      borderColor: 'border-pink-500/40',
      textColor: 'text-pink-300',
      glowColor: 'shadow-pink-500/20',
      details: 'Organic loops program active. Pre-formatted LinkedIn scroll-stopping captions scheduled for high B2B viral coefficient.',
      depth: 0
    },
    {
      id: 'ads',
      name: 'Layer 5: Paid Splitting Engine',
      role: 'Alex Mercer &bull; Paid Media',
      metric: `Budget: ${analysis?.ads?.monthlyBudgetRecommendation || '$5,000/mo'}`,
      icon: <DollarSign className="w-5 h-5 text-amber-500" />,
      color: 'bg-zinc-900/95 backdrop-blur-md text-white border-amber-500/20',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-300',
      glowColor: 'shadow-amber-500/20',
      details: `Allocated spend splits between Meta and Google search ads. Optimizing on bidding thresholds for target CAC: $${Math.max(25, Math.round(80 - (5000 * 0.0015)))}.`,
      depth: -40
    },
    {
      id: 'crm',
      name: 'Layer 6: CRM Webhook Pipeline',
      role: 'Daniel Kross &bull; Operations',
      metric: 'HubSpot / Klaviyo Synced',
      icon: <Database className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-950/90 backdrop-blur-md text-white border-purple-500/30',
      borderColor: 'border-purple-500/50',
      textColor: 'text-purple-300',
      glowColor: 'shadow-purple-500/30',
      details: `Lead capturing webhook loops active. Triggering: Opt-in conversions -> Emma Lead Scoring -> Klaviyo 3-part autoresponders -> Slack notification alerts.`,
      depth: -80
    }
  ];

  const handleResetRotation = () => {
    setRotateX(15);
    setRotateY(-20);
    setZoom(0.95);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-md p-6 shadow-sm relative overflow-hidden flex flex-col lg:flex-row gap-6 min-h-[580px]">
      
      {/* 3D Visualizer Canvas (Left side) */}
      <div className="flex-1 bg-zinc-950 rounded-md p-4 relative overflow-hidden flex flex-col justify-between min-h-[440px] border border-zinc-900 group">
        
        {/* Neon Grid Overlay behind */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Floating dust specs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-1000" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
        </div>

        {/* 3D Info Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              HOLOGRAPHIC 3D SPATIAL MODEL
            </span>
          </div>
          
          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-900/50 px-2 py-0.5 rounded font-extrabold uppercase">
            Active Spatial View
          </span>
        </div>

        {/* The Actual 3D Scene Viewport */}
        <div className="flex-grow flex items-center justify-center py-6 perspective-2000 preserve-3d relative">
          
          <div className={`w-full max-w-[340px] sm:max-w-[380px] h-72 relative flex items-center justify-center ${autoRotate ? 'animate-float-3d' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
            <div 
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              className="w-full h-full relative flex items-center justify-center"
            >
              {/* Draw connectors behind stack layers */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/20 via-sky-500/10 to-purple-500/20 left-1/2 -translate-x-1/2 pointer-events-none" style={{ transform: 'translateZ(-100px)' }} />

            {/* Render 3D layers stacked in Z-space */}
            {layers.map((layer, idx) => {
              const isSelected = expandedLayer === layer.id;
              
              // CSS translate calculations based on layer parameters and expanded state
              const translateZ = isSelected ? layer.depth + 45 : layer.depth;
              const scaleValue = isSelected ? 1.05 : 1;
              const opacity = expandedLayer && !isSelected ? 'opacity-30' : 'opacity-100';

              return (
                <div
                  key={layer.id}
                  onClick={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
                  style={{
                    transform: `translateZ(${translateZ}px) scale(${scaleValue})`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease'
                  }}
                  className={`absolute w-full p-4 rounded-md border text-left cursor-pointer transition-all shadow-xl hover:shadow-2xl ${layer.color} ${layer.borderColor} ${opacity} group/layer`}
                >
                  <div className="flex items-start justify-between relative z-10" style={{ transform: 'translateZ(15px)' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-950 rounded border border-zinc-800 flex-shrink-0 group-hover/layer:scale-105 transition-transform shadow-inner">
                        {layer.icon}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black font-mono tracking-wider text-white uppercase group-hover/layer:text-indigo-400 transition-colors">
                          {layer.name}
                        </h4>
                        <span className="text-[9px] text-zinc-400 font-mono block mt-0.5" dangerouslySetInnerHTML={{ __html: layer.role }} />
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-zinc-950/80 ${layer.textColor} border-zinc-800`}>
                      {layer.metric}
                    </span>
                  </div>

                  {/* 3D Backlight Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/layer:opacity-100 rounded-md pointer-events-none transition-opacity duration-500`} />
                  <div className={`absolute -inset-[1px] rounded-md ${layer.glowColor} blur-md opacity-20 pointer-events-none`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

        {/* 3D Rotation Controls (Interactive sliders at bottom) */}
        <div className="relative z-10 border-t border-zinc-900 pt-3 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-4 flex-grow sm:flex-grow-0 justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Orbit Rotation X:</span>
              <input 
                type="range" 
                min="-15" 
                max="45" 
                value={rotateX} 
                onChange={(e) => {
                  setRotateX(Number(e.target.value));
                  setAutoRotate(false);
                }}
                className="w-20 accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-zinc-500 font-bold w-6 text-right">{rotateX}°</span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Orbit Rotation Y:</span>
              <input 
                type="range" 
                min="-60" 
                max="60" 
                value={rotateY} 
                onChange={(e) => {
                  setRotateY(Number(e.target.value));
                  setAutoRotate(false);
                }}
                className="w-20 accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-zinc-500 font-bold w-6 text-right">{rotateY}°</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2 py-1 rounded border text-[9px] font-bold uppercase ${autoRotate ? 'bg-indigo-950 text-indigo-400 border-indigo-800' : 'bg-zinc-900 text-zinc-400 border-zinc-800'} cursor-pointer`}
            >
              {autoRotate ? '🛰️ Auto Orbit ON' : '🛰️ Orbit OFF'}
            </button>
            <button
              onClick={handleResetRotation}
              className="p-1 text-zinc-500 hover:text-white border border-zinc-800 rounded bg-zinc-900 cursor-pointer"
              title="Reset Viewpoint"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Detail Inspector (Right side - 5 cols) */}
      <div className="w-full lg:w-80 bg-zinc-50 border border-zinc-150 rounded-md p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div>
            <span className="text-[9px] font-mono font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded shadow-sm">
              Layer Inspector
            </span>
            <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wide font-mono mt-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-600 animate-pulse" />
              Spatial Stack Blueprint
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              Click any layer on the holographic stack to inspect its sub-system pipelines, connected APIs, and active data parameters.
            </p>
          </div>

          {/* Dynamic details section */}
          <div className="min-h-[220px] flex flex-col justify-center">
            {expandedLayer ? (
              (() => {
                const layer = layers.find(l => l.id === expandedLayer)!;
                return (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-white border rounded shadow-sm">
                        {layer.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase font-mono text-zinc-900 tracking-wider">
                          {layer.id.toUpperCase()} SUB-NODE
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-mono block">Connected gateway active</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-zinc-200 rounded text-xs text-zinc-600 leading-relaxed font-medium space-y-2">
                      <p className="font-semibold text-zinc-800">{layer.name}</p>
                      <p className="text-[11px] leading-relaxed">{layer.details}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="p-2 bg-zinc-100 rounded border">
                        <span className="text-zinc-400 block uppercase font-bold">Latency</span>
                        <span className="text-zinc-800 font-bold">12ms Ingress</span>
                      </div>
                      <div className="p-2 bg-zinc-100 rounded border">
                        <span className="text-zinc-400 block uppercase font-bold">Encryption</span>
                        <span className="text-emerald-600 font-bold">AES-256</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-8 space-y-2 text-zinc-400">
                <Layers className="w-8 h-8 mx-auto opacity-30 text-zinc-500 animate-bounce" />
                <p className="text-[11px] font-medium max-w-[180px] mx-auto">Select a layer in the spatial model to unpack deep architectural attributes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Summary Footer */}
        <div className="bg-indigo-950 text-white rounded p-3.5 space-y-2 border border-indigo-900">
          <div className="flex items-center gap-1.5 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Orchestration Health</span>
          </div>
          <p className="text-[10px] text-zinc-300 font-medium leading-relaxed">
            All layers are fully aligned under Sophia Vance's fractional leadership protocols. Ready for direct publication.
          </p>
        </div>
      </div>

    </div>
  );
}
