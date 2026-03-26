import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, AlertTriangle, Info, Clock,
  Mail, Copy, CheckCircle2, ChevronRight, Zap,
} from 'lucide-react';
import { mockMonitorAggiornamenti, mockAiSystems } from '@/data/tutelaiMockData';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

function UrgencyBadgeLarge({ urgenza }: { urgenza: string }) {
  if (urgenza === 'critico')
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold bg-[#FDEAEA] text-[#8B1A1A]">
        <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block" />
        CRITICO — AZIONE URGENTE
      </span>
    );
  if (urgenza === 'attenzione')
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold bg-[#FDF3E3] text-[#854F0B]">
        <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block" />
        ATTENZIONE
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold bg-[#E6F1FB] text-[#185FA5]">
      <span className="w-3 h-3 rounded-full bg-[#22A86B] inline-block" />
      INFO
    </span>
  );
}

function StatoBadge({ stato }: { stato: string }) {
  if (stato === 'critico')
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FDEAEA] text-[#8B1A1A]">Critico</span>;
  if (stato === 'attenzione')
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FDF3E3] text-[#854F0B]">Attenzione</span>;
  if (stato === 'conforme')
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#EAF5EE] text-[#1D6B3A]">Conforme</span>;
  return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500">{stato}</span>;
}

export default function AppMonitorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const item = mockMonitorAggiornamenti.find(m => m.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-[#D97706] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#042C53] mb-2">Aggiornamento non trovato</h2>
          <p className="text-gray-500 mb-4">L'ID "{id}" non corrisponde a nessun aggiornamento nel feed.</p>
          <button
            onClick={() => navigate('/app/monitor')}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#042C53] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al Monitor
          </button>
        </div>
      </div>
    );
  }

  const impactedSystems = mockAiSystems.filter(s => item.sistemi_impattati.includes(s.id));

  // Extract main obligations from sintesi (simplified: split on periods or linebreaks)
  const obblighi = item.sintesi
    .split(/\.\s+/)
    .filter(s => s.length > 20)
    .slice(0, 4)
    .map(s => s.trim().replace(/\.$/, '') + '.');

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to="/app/monitor"
          className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Monitor
        </Link>

        {/* Header card */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 flex-wrap mb-3">
            <UrgencyBadgeLarge urgenza={item.urgenza} />
          </div>
          <h1 className="text-2xl font-bold text-[#042C53] mb-4">{item.titolo}</h1>
          <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500">
            <span className="font-medium text-[#042C53] bg-[#F5F5F3] px-3 py-1 rounded">{item.fonte_label}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDate(item.data)}</span>
            {item.url_originale && (
              <a
                href={item.url_originale}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#185FA5] hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Fonte originale
              </a>
            )}
          </div>
          {item.scadenza_azione && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[#8B1A1A] bg-[#FDEAEA] px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              Scadenza azione: <strong>{formatDate(item.scadenza_azione)}</strong>
            </div>
          )}
        </div>

        {/* Sintesi AI */}
        <section className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#185FA5] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sintesi (generata da AI)</h2>
          </div>
          <div className="space-y-3">
            {item.sintesi.split('. ').reduce((acc: string[], sentence, i, arr) => {
              if (i % 2 === 0) {
                acc.push(arr.slice(i, i + 2).join('. ') + (i + 2 < arr.length ? '.' : ''));
              }
              return acc;
            }, []).map((para, idx) => (
              <p key={idx} className="text-sm text-gray-700 leading-relaxed">{para}</p>
            ))}
          </div>
        </section>

        {/* Obblighi principali */}
        <section className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#DC2626] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Obblighi principali</h2>
          </div>
          <ol className="space-y-2">
            {obblighi.map((ob, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-[#042C53] text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{ob}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Sistemi impattati */}
        <section className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#D97706] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sistemi impattati nella tua azienda</h2>
          </div>
          {impactedSystems.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Nessun sistema impattato nella tua azienda.</p>
          ) : (
            <div className="space-y-3">
              {impactedSystems.map(sys => (
                <div key={sys.id} className="flex items-center justify-between p-3 bg-[#F5F5F3] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#042C53]">{sys.nome}</p>
                    <p className="text-xs text-gray-500">{sys.categoria} — {sys.fornitore}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatoBadge stato={sys.stato_compliance} />
                    <Link
                      to={`/app/registry/${sys.id}`}
                      className="flex items-center gap-1 text-xs text-[#185FA5] hover:underline"
                    >
                      Azione rapida <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Azioni suggerite */}
        <section className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#22A86B] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Azioni suggerite da TutelAI</h2>
          </div>
          <div className="space-y-2">
            {item.azioni_suggerite.map((azione, idx) => (
              <button
                key={idx}
                onClick={() => navigate('/app/docs/new')}
                className="w-full flex items-center justify-between p-3 border border-[#C8C5BC] rounded-lg hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[#185FA5] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#042C53]">{azione}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#185FA5]" />
              </button>
            ))}
          </div>
        </section>

        {/* Fonte originale */}
        {item.url_originale && (
          <section className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#185FA5]" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Fonte originale</h2>
            </div>
            <a
              href={item.url_originale}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#185FA5] hover:underline text-sm font-medium"
            >
              Apri documento originale →
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        )}

        {/* Condividi */}
        <section className="bg-white border border-[#C8C5BC] rounded-xl p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Condividi</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Email inviata al team')}
              className="flex items-center gap-2 px-4 py-2 border border-[#C8C5BC] rounded-lg text-sm text-[#042C53] hover:bg-[#E6F1FB] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Invia per email al team
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copiato negli appunti');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#C8C5BC] rounded-lg text-sm text-[#042C53] hover:bg-[#E6F1FB] transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copia link
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
