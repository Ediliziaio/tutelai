import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('La password deve avere almeno 6 caratteri'); return; }
    if (password !== confirm) { setError('Le password non coincidono'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {done ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold font-subtitle text-slate-900 mb-2">Password aggiornata!</h2>
            <p className="text-sm text-slate-500 mb-6">Puoi ora accedere con la nuova password.</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-sky-500 text-white hover:bg-sky-600 rounded-full px-5 py-2.5 font-semibold text-sm transition-all"
            >
              Vai al login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold font-subtitle text-slate-900 mb-1">Nuova password</h2>
            <p className="text-sm text-slate-500 mb-6">Scegli una nuova password per il tuo account.</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nuova password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Conferma password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white hover:bg-sky-600 rounded-full px-5 py-2.5 font-semibold text-sm transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aggiorna password'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
