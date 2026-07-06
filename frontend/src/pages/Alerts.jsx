import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/common/Card';
import { getAlerts } from '../services/api';
import { AlertCircle, Bell, BellOff, RefreshCw, CheckCheck, ShieldAlert, Info, Zap } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: {
    border: 'border-l-[#ff3b30]',
    badge: 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20',
    dot: 'bg-[#ff3b30]',
    icon: <ShieldAlert size={16} className="text-[#ff3b30]" />,
    label: 'Critical',
  },
  warning: {
    border: 'border-l-[#f59e0b]',
    badge: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    dot: 'bg-[#f59e0b]',
    icon: <AlertCircle size={16} className="text-[#f59e0b]" />,
    label: 'Warning',
  },
  info: {
    border: 'border-l-[#3b82f6]',
    badge: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
    dot: 'bg-[#3b82f6]',
    icon: <Info size={16} className="text-[#3b82f6]" />,
    label: 'Info',
  },
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(() => {
    getAlerts()
      .then(data => {
        setAlerts(data);
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsLoading(false);
      })
      .catch(() => {
        setAlerts([
          { id: 1, type: 'FALLBACK', severity: 'warning', title: 'Backend Unreachable', icon: '⚠️',
            message: 'Could not connect to the backend. Showing cached data.', timestamp: '--', date: '--', read: false }
        ]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAlerts();
    const iv = setInterval(fetchAlerts, 8000);
    return () => clearInterval(iv);
  }, [fetchAlerts]);

  const markRead = (id) => setReadIds(prev => new Set([...prev, id]));
  const markAllRead = () => setReadIds(new Set(alerts.map(a => a.id)));

  const isRead = (a) => a.read || readIds.has(a.id);

  const filtered = filter === 'all' ? alerts
    : filter === 'unread' ? alerts.filter(a => !isRead(a))
    : alerts.filter(a => a.severity === filter);

  const unreadCount = alerts.filter(a => !isRead(a)).length;

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap size={13} className="animate-pulse" /> Live Intelligence Feed
          </div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            Alerts
            {unreadCount > 0 && (
              <span className="text-sm font-black bg-[#ff3b30] text-white rounded-full px-2 py-0.5 animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">AI-driven market signals powered by live model outputs — refreshed every 8s</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-semibold">
            <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
            {lastUpdated || 'Connecting...'}
          </div>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#112240]/40 hover:bg-[#112240] border border-[#112240] rounded-lg px-3 py-1.5 transition-all"
          >
            <CheckCheck size={12} /> Mark all read
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts',    value: alerts.length,   color: 'text-violet-400',   icon: <Bell size={16} /> },
          { label: 'Unread',          value: unreadCount,     color: 'text-[#F8FAFC]',    icon: <BellOff size={16} /> },
          { label: 'Critical',        value: criticalCount,   color: 'text-[#ff3b30]',    icon: <ShieldAlert size={16} /> },
          { label: 'Warnings',        value: warningCount,    color: 'text-[#f59e0b]',    icon: <AlertCircle size={16} /> },
        ].map((s, i) => (
          <Card key={i} className="flex items-center gap-3 h-[72px] p-4">
            <div className={`${s.color} opacity-70`}>{s.icon}</div>
            <div>
              <div className={`text-2xl font-black ${s.color}`}>{isLoading ? '—' : s.value}</div>
              <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#112240] pb-0">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread${unreadCount ? ` (${unreadCount})` : ''}` },
          { key: 'critical', label: 'Critical' },
          { key: 'warning', label: 'Warning' },
          { key: 'info', label: 'Info' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`pb-3 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              filter === tab.key
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[#112240]/20 animate-pulse border border-[#112240]" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={32} className="text-[#334155] mx-auto mb-3" />
            <p className="text-[#64748B] text-sm font-semibold">No alerts in this category</p>
          </div>
        ) : filtered.map((alert, i) => {
          const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
          const read = isRead(alert);
          return (
            <div
              key={i}
              onClick={() => markRead(alert.id)}
              className={`relative flex gap-4 p-4 rounded-xl border-l-[3px] border border-[#112240]/60 cursor-pointer transition-all duration-200 hover:border-[#1E3A8A]/40 hover:bg-[#112240]/10 ${cfg.border} ${read ? 'opacity-60' : 'bg-[#060D19]/80'}`}
            >
              {/* Unread dot */}
              {!read && (
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
              )}

              <div className="text-2xl shrink-0 mt-0.5">{alert.icon}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-bold text-[#F8FAFC]">{alert.title}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  {!read && (
                    <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase">
                      New
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{alert.message}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-[#64748B]">
                  <span>{alert.date}</span>
                  <span>•</span>
                  <span>{alert.timestamp}</span>
                  <span>•</span>
                  <span className="font-mono">{alert.type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Alerts;
