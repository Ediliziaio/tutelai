import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, Settings, Download, Search, CheckCheck, ExternalLink,
  BookOpen, Zap, Check, ChevronRight,
} from 'lucide-react';
import { mockMonitorAggiornamenti, mockAiSystems } from '@/data/tutelaiMockData';
import type { MonitorAggiornamento } from '@/types/saas';

type UrgenzaFilter = 'all' | 'critico' | 'attenzione' | 'info';
type FonteFilter = 'all' | 'acn' | 'garante' | 'enisa' | 'ai_act' | 'legge_132';

function urgencyBorderColor(urgenza: string): string {
  if (urgenza === 'critico') return '#DC2626';
  if (urgenza === 'attenzione') return '#D97706';
  return '#185FA5';
}

function urgencyBadge(urgenza: string): React.ReactElement {
  if (urgenza === 'critico')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#FDEAEA] text-[#8B1A1A]">
        <span className="w-2 h-2 rounded-full bg-[#DC2626] inline-block" />
        URGENTE
      </span>
    );
  if (urgenza === 'attenzione')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#FDF3E3] text-[#854F0B]">
        <span className="w-2 h-2 rounded-full bg-[#D97706] inline-block" />
        ATTENZIONE
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#E6F1FB] text-[#185FA5]">
      <span className="w-2 h-2 rounded-full bg-[#22A86B] inline-block" />
      INFO
    </span>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function AppMonitor() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MonitorAggiornamento[]>(mockMonitorAggiornamenti);
  const [fonteFilter, setFonteFilter] = useState<FonteFilter>('all');
  const [urgenzaFilter, setUrgenzaFilter] = useState<UrgenzaFilter>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const unreadCount = items.filter(i => !i.letto).length;

  const filtered = items
    .filter(i => {
      if (fonteFilter !== 'all' && i.fonte !== fonteFilter) return false;
      if (urgenzaFilter !== 'all' && i.urgenza !== urgenzaFilter) return false;
      if (search && !i.titolo.toLowerCase().includes(search.toLowerCase()) && !i.sintesi.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const markAllRead = () => {
    setItems(prev => prev.map(i => ({ ...i, letto: true })));
    showToast('Tutti gli aggiornamenti segnati come letti');
  };

  const markRead = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, letto: true } : i));
  };

  const getSystemName = (id: string) => {
    const sys = mockAiSystems.find(s => s.id === id);
    return sys ? sys.nome : id;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1a375b]">AI Monitor — Aggiornamenti normativi</h1>
              {unreadCount > 0 && (
                <span className="bg-[#DC2626] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Monitoraggio automatico di AI Act, GDPR, Legge 132/2025 e normative correlate</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#1a375b] border border-[#C8C5BC] rounded-lg hover:bg-[#E6F1FB] transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Segna tutti come letti
            </button>
            <Link
              to="/app/monitor/settings"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#1a375b] border border-[#C8C5BC] rounded-lg hover:bg-[#E6F1FB] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Impostazioni alert
            </Link>
            <button
              onClick={() => showToast('Esportazione feed in corso...')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Esporta feed
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <select
            value={fonteFilter}
            onChange={e => setFonteFilter(e.target.value as FonteFilter)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm bg-white text-[#1a375b] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          >
            <option value="all">Tutte le fonti</option>
            <option value="acn">ACN</option>
            <option value="garante">Garante Privacy</option>
            <option value="enisa">ENISA</option>
            <option value="ai_act">AI Act</option>
            <option value="legge_132">Legge 132/2025</option>
          </select>
          <select
            value={urgenzaFilter}
            onChange={e => setUrgenzaFilter(e.target.value as UrgenzaFilter)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm bg-white text-[#1a375b] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          >
            <option value="all">Tutte le urgenze</option>
            <option value="critico">Critico</option>
            <option value="attenzione">Attenzione</option>
            <option value="info">Info</option>
          </select>
          <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[#C8C5BC] rounded-lg bg-white px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca aggiornamenti..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1a375b] placeholder-gray-400"
            />
          </div>
          <span className="text-sm text-gray-500">{filtered.length} aggiornamenti</span>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="bg-white border border-[#C8C5BC] rounded-xl p-10 text-center text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Nessun aggiornamento trovato</p>
            </div>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              className={`bg-white border border-[#C8C5BC] rounded-xl overflow-hidden flex transition-opacity ${item.letto ? 'opacity-60' : 'opacity-100'}`}
            >
              {/* Left urgency bar */}
              <div
                className="w-1.5 flex-shrink-0"
                style={{ backgroundColor: urgencyBorderColor(item.urgenza) }}
              />
              <div className="flex-1 p-5">
                {/* Top row */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {urgencyBadge(item.urgenza)}
                  <span className="text-xs text-gray-500">{formatDate(item.data)}</span>
                  <span className="text-xs font-medium text-[#1a375b] bg-[#F5F5F3] px-2 py-0.5 rounded">
                    {item.fonte_label}
                  </span>
                  {item.letto && (
                    <span className="text-xs text-gray-400 italic">Letto</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#1a375b] mb-2">{item.titolo}</h3>

                {/* Sintesi */}
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.sintesi}</p>

                {/* Sistemi impattati */}
                {item.sistemi_impattati.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs font-medium text-gray-500">Sistemi impattati:</span>
                    {item.sistemi_impattati.map(sId => (
                      <span key={sId} className="text-xs bg-[#E6F1FB] text-[#185FA5] px-2 py-0.5 rounded font-medium">
                        {getSystemName(sId)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Scadenza */}
                {item.scadenza_azione && (
                  <div className="text-xs text-[#8B1A1A] font-medium mb-3">
                    Scadenza azione: {formatDate(item.scadenza_azione)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/app/monitor/${item.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg font-medium transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Leggi
                  </button>
                  <button
                    onClick={() => showToast('Piano d\'azione generato dall\'AI')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#185FA5] text-[#185FA5] hover:bg-[#E6F1FB] rounded-lg font-medium transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Genera piano d'azione
                  </button>
                  {!item.letto && (
                    <button
                      onClick={() => markRead(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#C8C5BC] text-gray-500 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Segna letto
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/app/monitor/${item.id}`)}
                    className="ml-auto flex items-center gap-1 text-xs text-[#185FA5] hover:underline"
                  >
                    Dettaglio <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-6 text-center">
          <button
            onClick={() => showToast('Nessun altro aggiornamento disponibile')}
            className="px-6 py-2 border border-[#C8C5BC] rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Carica altri
          </button>
        </div>
      </div>
    </div>
  );
}
