import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard, Check, X, Download, Pencil, ChevronRight, RefreshCw,
} from 'lucide-react';
import { mockSubscription } from '@/data/tutelaiMockData';
import { useAuth } from '@/contexts/AuthContext';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const ADDON_ICONS: Record<string, string> = {
  'AI Lawyer Chat': '⚖️',
  'Firma digitale FEA': '✍️',
  'WhatsApp alert': '💬',
};

export default function AppBilling() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const [sub, setSub] = useState(mockSubscription);
  const [toast, setToast] = useState<string | null>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleAddon(id: string) {
    setSub((s) => ({
      ...s,
      add_ons: s.add_ons.map((a) => a.id === id ? { ...a, attivo: !a.attivo } : a),
    }));
    const addon = sub.add_ons.find((a) => a.id === id);
    if (addon) {
      showToastMsg(addon.attivo ? `${addon.nome} disattivato.` : `${addon.nome} attivato.`);
    }
  }

  const totaleAddon = sub.add_ons.filter((a) => a.attivo).reduce((sum, a) => sum + a.prezzo, 0);
  const totale = sub.importo_mensile + totaleAddon;

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#042C53] flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-[#185FA5]" />
          Billing — Il tuo abbonamento
        </h1>
      </div>

      {/* Piano card */}
      <div className="bg-white border-2 border-[#042C53] rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#042C53] text-white px-3 py-1 rounded-full text-sm font-semibold">
                TutelAI Platform Business
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-[#EAF5EE] text-[#1D6B3A] px-2 py-0.5 rounded-full font-medium">
                <Check className="w-3 h-3" />
                Attivo
              </span>
            </div>
            <div className="text-3xl font-bold text-[#042C53]">
              €{sub.importo_mensile}<span className="text-base font-normal text-gray-500">/mese</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Fatturazione {sub.fatturazione} · Prossimo rinnovo: {formatDate(sub.prossimo_rinnovo)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/app/billing/upgrade')}
              className="bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              Cambia piano
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Gestisci add-on
            </button>
            <button className="bg-[#8B1A1A] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Cancella abbonamento
            </button>
          </div>
        </div>
      </div>

      {/* Add-on */}
      <div>
        <h2 className="font-semibold text-[#042C53] mb-3">Add-on disponibili</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sub.add_ons.map((addon) => (
            <div
              key={addon.id}
              className={`bg-white border rounded-xl p-5 space-y-3 ${addon.attivo ? 'border-[#185FA5]' : 'border-[#C8C5BC]'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{ADDON_ICONS[addon.nome]}</span>
                {addon.attivo ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#EAF5EE] text-[#1D6B3A] px-2 py-0.5 rounded-full font-medium">
                    <Check className="w-3 h-3" />
                    Attivo
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Non attivo</span>
                )}
              </div>
              <div>
                <div className="font-semibold text-[#042C53] text-sm">{addon.nome}</div>
                <div className="text-[#185FA5] font-bold">€{addon.prezzo}<span className="text-xs font-normal text-gray-500">/mese</span></div>
              </div>
              <button
                onClick={() => toggleAddon(addon.id)}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  addon.attivo
                    ? 'border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53]'
                    : 'bg-[#042C53] hover:bg-[#185FA5] text-white'
                }`}
              >
                {addon.attivo ? 'Disattiva' : 'Attiva'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totale */}
      <div className="bg-[#E6F1FB] border border-[#185FA5]/30 rounded-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#042C53]">
          <RefreshCw className="w-4 h-4 text-[#185FA5]" />
          <span className="font-semibold">Totale mensile</span>
          <span className="text-xs text-gray-500">(piano + add-on attivi)</span>
        </div>
        <div className="text-2xl font-bold text-[#042C53]">
          €{totale}<span className="text-sm font-normal text-gray-500">/mese</span>
        </div>
      </div>

      {/* Storico fatture */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#042C53]">Storico fatture</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[#C8C5BC]">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Data</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Importo</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Stato</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sub.storico_fatture.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-700">{formatDate(f.data)}</td>
                  <td className="px-6 py-3 font-semibold text-[#042C53]">€{f.importo}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      f.stato === 'pagata' ? 'bg-[#EAF5EE] text-[#1D6B3A]' :
                      f.stato === 'in_attesa' ? 'bg-[#FDF3E3] text-[#854F0B]' :
                      'bg-[#FDEAEA] text-[#8B1A1A]'
                    }`}>
                      {f.stato.charAt(0).toUpperCase() + f.stato.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Scarica PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dati fatturazione */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#042C53]">Dati di fatturazione</h2>
          <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            Modifica
          </button>
        </div>
        <div className="text-sm text-gray-700 space-y-0.5">
          <div className="font-medium text-[#042C53]">{tenant?.ragione_sociale}</div>
          <div>P.IVA: {tenant?.partita_iva}</div>
          <div>PEC: {tenant?.pec}</div>
          <div>Email: {tenant?.email_principale}</div>
        </div>
      </div>
    </div>
  );
}
