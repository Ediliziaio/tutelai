import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, AlertOctagon, CheckCircle2, Phone, X, Clock, Shield,
} from 'lucide-react';
import { mockBreaches, mockAiSystems } from '@/data/tutelaiMockData';
import type { Breach } from '@/types/saas';

interface NewBreachForm {
  titolo: string;
  data_scoperta: string;
  sistemi_coinvolti: string[];
  descrizione: string;
}

const EMPTY_FORM: NewBreachForm = {
  titolo: '',
  data_scoperta: '',
  sistemi_coinvolti: [],
  descrizione: '',
};

export default function AppGdprBreach() {
  const [breaches] = useState<Breach[]>(mockBreaches);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewBreachForm>(EMPTY_FORM);
  const [toast, setToast] = useState<string | null>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleSistema(id: string) {
    setForm((f) => ({
      ...f,
      sistemi_coinvolti: f.sistemi_coinvolti.includes(id)
        ? f.sistemi_coinvolti.filter((s) => s !== id)
        : [...f.sistemi_coinvolti, id],
    }));
  }

  function handleSubmit() {
    if (!form.titolo.trim()) return;
    setShowModal(false);
    setForm(EMPTY_FORM);
    showToastMsg('Breach segnalato. Workflow 72h avviato.');
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-5 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1a375b]">Segnala nuovo breach</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Titolo breach *</label>
                <input
                  value={form.titolo}
                  onChange={(e) => setForm((f) => ({ ...f, titolo: e.target.value }))}
                  placeholder="Es. Accesso non autorizzato ai dati HR"
                  className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data scoperta</label>
                <input
                  type="date"
                  value={form.data_scoperta}
                  onChange={(e) => setForm((f) => ({ ...f, data_scoperta: e.target.value }))}
                  className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Sistemi AI coinvolti</label>
                <div className="flex flex-wrap gap-2">
                  {mockAiSystems.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSistema(s.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        form.sistemi_coinvolti.includes(s.id)
                          ? 'bg-[#1a375b] text-white border-[#1a375b]'
                          : 'border-[#C8C5BC] text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {s.nome}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrizione evento</label>
                <textarea
                  value={form.descrizione}
                  onChange={(e) => setForm((f) => ({ ...f, descrizione: e.target.value }))}
                  rows={3}
                  placeholder="Descrivi cosa è successo, i dati coinvolti e l'impatto stimato..."
                  className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-[#8B1A1A] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Segnala breach
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/app/gdpr" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            GDPR+AI
          </Link>
          <h1 className="text-2xl font-bold text-[#1a375b] flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-[#185FA5]" />
            Gestione Data Breach AI — Workflow 72h
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#8B1A1A] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Segnala nuovo breach
        </button>
      </div>

      {/* Active breaches */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6">
        <h2 className="font-semibold text-[#1a375b] mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#185FA5]" />
          Breach attivi
        </h2>
        {breaches.length === 0 ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-sm text-green-900 font-medium">Nessun breach attivo</span>
          </div>
        ) : (
          <div className="space-y-3">
            {breaches.map((b) => (
              <div key={b.id} className="border border-red-200 bg-red-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#8B1A1A]">{b.titolo}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Scoperto: {b.data_scoperta} | Notifica entro: {b.notifica_garante_entro}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#FDEAEA] text-[#8B1A1A]">{b.stato}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storico */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6">
        <h2 className="font-semibold text-[#1a375b] mb-4">Storico breach</h2>
        <div className="text-center py-8 text-gray-400 text-sm">Nessun breach registrato</div>
      </div>

      {/* Processo */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-[#1a375b] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#185FA5]" />
          Processo di riferimento
        </h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
          {[
            {
              time: '0-24h',
              title: 'Identificazione e contenimento',
              desc: 'Blocca l\'accesso, identifica i dati coinvolti, avvia il log degli eventi.',
              cta: 'Avvia workflow →',
              color: 'bg-[#FDEAEA] text-[#8B1A1A]',
            },
            {
              time: '24-72h',
              title: 'Valutazione rischio — notifica Garante',
              desc: 'Valuta la gravità, notifica il Garante Privacy se il rischio è elevato.',
              color: 'bg-[#FDF3E3] text-[#854F0B]',
            },
            {
              time: '72h+',
              title: 'Comunicazione agli interessati',
              desc: 'Se il rischio è elevato, comunica il breach agli interessati senza indebito ritardo.',
              color: 'bg-[#EAF5EE] text-[#1D6B3A]',
            },
          ].map((s, i) => (
            <div key={i} className="flex gap-4 pl-10 pb-6 relative">
              <div className="absolute left-3 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[#185FA5] z-10" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.time}</span>
                  <span className="font-medium text-[#1a375b] text-sm">{s.title}</span>
                </div>
                <p className="text-xs text-gray-600">{s.desc}</p>
                {s.cta && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-2 text-xs text-[#185FA5] hover:underline font-medium"
                  >
                    {s.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 italic">
          TutelAI gestisce l'intero processo per i clienti AI Shield Pro/Enterprise.
        </p>
        <a
          href="tel:+390000000000"
          className="inline-flex items-center gap-2 border border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Phone className="w-4 h-4" />
          Chiama supporto urgente
        </a>
      </div>
    </div>
  );
}
