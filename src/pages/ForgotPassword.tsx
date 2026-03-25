import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
              <Mail className="h-7 w-7 text-sky-500" />
            </div>
            <h2 className="text-xl font-bold font-subtitle text-slate-900 mb-2">Controlla la tua email</h2>
            <p className="text-sm text-slate-500 mb-6">
              Abbiamo inviato le istruzioni per il reset a <strong>{email}</strong>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-sky-500 hover:text-sky-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Torna al login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold font-subtitle text-slate-900 mb-1">Password dimenticata?</h2>
            <p className="text-sm text-slate-500 mb-6">
              Inserisci la tua email e ti invieremo le istruzioni per reimpostarla.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@azienda.it"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white hover:bg-sky-600 rounded-full px-5 py-2.5 font-semibold text-sm transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invia istruzioni'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Torna al login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
