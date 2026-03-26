import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Linkedin, Copy, CheckCircle2, Shield } from 'lucide-react';
import { mockCorsi } from '@/data/tutelaiMockData';
import { useState } from 'react';

function formatDate(date: Date): string {
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function AppTrainingCertificate() {
  const { id } = useParams<{ id: string }>();
  const [toast, setToast] = useState('');

  const corso = mockCorsi.find(c => c.id === id);
  const today = new Date();

  const userName = 'Florin Andriciuc';
  const userInitials = 'FA';
  const codiceVerifica = `TUTELAI-2026-${userInitials}-001`;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (!corso) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-[#042C53] mb-2">Corso non trovato</p>
          <Link to="/app/training" className="text-[#185FA5] hover:underline text-sm">
            Torna ai corsi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-10 px-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          to="/app/training"
          className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna ai corsi
        </Link>

        {/* Certificate card */}
        <div className="bg-white border-2 border-[#C8C5BC] rounded-2xl overflow-hidden shadow-lg mb-6 print:shadow-none">
          {/* Top blue border */}
          <div className="h-3 bg-gradient-to-r from-[#042C53] to-[#185FA5]" />

          <div className="p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-8 h-8 text-[#185FA5]" />
                <span className="text-2xl font-black text-[#042C53] tracking-tight">TUTELAI</span>
                <span className="text-2xl font-light text-[#185FA5]">PLATFORM</span>
              </div>
              <div className="w-24 h-0.5 bg-[#C8C5BC] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#042C53] tracking-wide uppercase">
                Attestato di completamento
              </h2>
            </div>

            {/* Seal area */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-2">Si certifica che</p>
              <p className="text-3xl font-black text-[#042C53] mb-2">{userName}</p>
              <p className="text-sm text-gray-500 mb-5">ha completato con successo il corso:</p>

              <div className="bg-[#E6F1FB] border border-[#185FA5]/20 rounded-xl p-5 mb-5">
                <h3 className="text-lg font-bold text-[#042C53] mb-1">{corso.titolo}</h3>
                {corso.riferimento_normativo && (
                  <p className="text-sm text-[#185FA5] font-medium mb-3">{corso.riferimento_normativo}</p>
                )}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
                    Punteggio: <strong>5/5</strong>
                  </span>
                  <span>Data: <strong>{formatDate(today)}</strong></span>
                  <span>Durata: <strong>{corso.durata_minuti} minuti</strong></span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Ai sensi dell'<strong>Art. 4 AI Act UE 2024/1689</strong> — Obbligo di AI literacy per i dipendenti
              </p>
            </div>

            {/* Bottom section */}
            <div className="border-t border-[#C8C5BC] pt-6 flex items-center justify-between">
              {/* QR visual */}
              <div className="text-left">
                <div className="w-16 h-16 border-2 border-[#042C53] rounded-lg flex items-center justify-center mb-2">
                  <div className="grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-sm ${Math.random() > 0.4 ? 'bg-[#042C53]' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400">Scansiona per verificare</p>
              </div>

              {/* Verification code */}
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">Codice di verifica</p>
                <p className="text-sm font-mono font-bold text-[#042C53] bg-[#F5F5F3] px-3 py-1.5 rounded-lg inline-block">
                  {codiceVerifica}
                </p>
              </div>

              {/* Logo */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <Shield className="w-5 h-5 text-[#185FA5]" />
                  <span className="text-sm font-black text-[#042C53]">TUTELAI</span>
                </div>
                <p className="text-xs text-gray-400">tutelai.it</p>
                <div className="w-20 h-0.5 bg-[#042C53] mt-2 ml-auto" />
                <p className="text-xs text-gray-400 mt-1">Firma digitale</p>
              </div>
            </div>
          </div>

          {/* Bottom border */}
          <div className="h-1.5 bg-gradient-to-r from-[#185FA5] to-[#042C53]" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => showToast('Scarica PDF — funzionalità in arrivo!')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#042C53] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Scarica PDF
          </button>
          <button
            onClick={() => showToast('Condivisione LinkedIn in corso...')}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#185FA5] text-[#185FA5] hover:bg-[#E6F1FB] rounded-lg text-sm font-medium transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            Condividi LinkedIn
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/verifica/${codiceVerifica}`);
              showToast('Link di verifica copiato negli appunti');
            }}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#C8C5BC] text-[#042C53] hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copia link verifica
          </button>
        </div>
      </div>
    </div>
  );
}
