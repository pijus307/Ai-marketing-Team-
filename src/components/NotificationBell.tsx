/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Check, 
  CheckCheck, 
  X, 
  Sliders, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Zap,
  Globe,
  Star
} from 'lucide-react';
import { 
  CompetitorSurveillanceEngine, 
  CompetitorAlert, 
  AlertSeverity 
} from '../lib/competitor-poller';

interface NotificationBellProps {
  onOpenCenter: () => void;
  onNavigateToCompetitor?: () => void;
}

export default function NotificationBell({ onOpenCenter, onNavigateToCompetitor }: NotificationBellProps) {
  const [alerts, setAlerts] = useState<CompetitorAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [toastAlert, setToastAlert] = useState<CompetitorAlert | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const engine = CompetitorSurveillanceEngine.getInstance();

  useEffect(() => {
    const unsubscribe = engine.subscribe((newAlerts) => {
      // Check if there is a new critical or unread alert to toast
      const prevAlerts = alerts;
      if (prevAlerts.length > 0 && newAlerts.length > prevAlerts.length) {
        const newest = newAlerts[0];
        if (!newest.isRead) {
          setToastAlert(newest);
          setTimeout(() => {
            setToastAlert(null);
          }, 6000);
        }
      }
      setAlerts(newAlerts);
    });

    // Start auto polling
    engine.startPolling();

    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [alerts.length]);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const handlePollNow = async () => {
    setIsPolling(true);
    await engine.pollCompetitorData();
    setTimeout(() => {
      setIsPolling(false);
    }, 600);
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <Flame className="w-3 h-3 text-rose-400 animate-pulse" />,
          label: 'CRITICAL'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          label: 'WARNING'
        };
      case 'opportunity':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <TrendingDown className="w-3 h-3 text-emerald-400" />,
          label: 'OPPORTUNITY'
        };
      default:
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
          label: 'INSIGHT'
        };
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg glow-cyan'
            : unreadCount > 0
            ? 'glass-panel hover:bg-white/10 border-cyan-500/40 text-cyan-300 hover:text-white'
            : 'glass-panel hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
        }`}
        title="Competitor Surveillance & Alerts"
        aria-label="Competitor Notifications"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-cyan-400 animate-[wiggle_1s_ease-in-out_infinite]' : ''}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-[10px] font-black font-mono text-white shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Live Alert Toast (Appears when polling detects shift) */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 max-w-sm w-full glass-panel border border-rose-500/50 bg-slate-950/95 p-4 rounded-2xl shadow-2xl backdrop-blur-xl text-white pointer-events-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  <Flame className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400 block">
                    Competitor Alert Detected
                  </span>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {toastAlert.competitorName}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setToastAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              {toastAlert.title}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
              <span className="text-slate-400 font-mono">
                {toastAlert.delta.previousValue} &rarr; <strong className="text-cyan-300">{toastAlert.delta.currentValue}</strong>
              </span>
              <button
                onClick={() => {
                  setToastAlert(null);
                  onOpenCenter();
                }}
                className="text-cyan-300 hover:text-cyan-200 font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                Inspect Alert &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Quick Tray */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden text-white flex flex-col max-h-[520px]"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Competitor Radar
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-mono border border-rose-500/40">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  <span className="text-[9px] font-mono text-slate-400">Live Traffic & SERP Surveillance</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePollNow}
                  disabled={isPolling}
                  className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors"
                  title="Poll Competitor Telemetry Now"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={() => engine.markAllAsRead()}
                    className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-slate-300 hover:text-emerald-300 border border-white/10 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Alert List */}
            <div className="overflow-y-auto flex-grow divide-y divide-white/5 p-1 max-h-[340px]">
              {alerts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Globe className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                  <p className="text-xs font-mono">No competitive shift alerts detected.</p>
                  <span className="text-[10px] text-slate-600 block">Polling active every 30 seconds</span>
                </div>
              ) : (
                alerts.slice(0, 5).map((alert) => {
                  const badge = getSeverityBadge(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      onClick={() => {
                        engine.markAsRead(alert.id);
                        setIsOpen(false);
                        onOpenCenter();
                      }}
                      className={`p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer flex items-start gap-3 group ${
                        !alert.isRead ? 'bg-cyan-500/[0.06]' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <span className={`p-1.5 rounded-lg border flex items-center justify-center ${badge.bg}`}>
                          {badge.icon}
                        </span>
                      </div>

                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold font-mono text-cyan-300 truncate">
                            {alert.competitorName}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                          {alert.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {alert.summary}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300">
                            {alert.delta.previousValue} &rarr; <strong className="text-emerald-400">{alert.delta.currentValue}</strong>
                          </span>
                          {alert.isStarred && (
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-300 mt-2 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation */}
            <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onNavigateToCompetitor) onNavigateToCompetitor();
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3 h-3" />
                View Competitors
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCenter();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer glow-cyan"
              >
                <span>Full Notification Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
