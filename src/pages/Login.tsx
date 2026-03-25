import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, isAdmin, isCliente, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (isAdmin) navigate('/admin', { replace: true });
      else if (isCliente) navigate('/app', { replace: true });
    }
  }, [user, isAdmin, isCliente, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // After login, useAuth will update — redirect handled by effect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di accesso');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Pratiche monitorate in tempo reale',
    'Fatturazione automatica e trasparente',
    'Team dedicato sempre raggiungibile',
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left column — gradient */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-subtitle text-2xl font-bold tracking-tight">
              Impresa<span className="font-normal opacity-80">Leggera</span>
            </span>

            <h2 className="mt-8 text-3xl xl:text-4xl font-subtitle font-bold leading-tight">
              Il tuo Back-Office,
              <br />
              finalmente leggero.
            </h2>

            <div className="mt-8 space-y-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  MB
                </div>
                <div>
                  <p className="text-sm font-semibold">Marco B.</p>
                  <p className="text-xs text-white/70">Artigiano — Serramenti</p>
                </div>
              </div>
              <p className="text-sm text-white/90 italic leading-relaxed">
                "Da quando uso Impresa Leggera ho dimezzato il tempo per la burocrazia. Finalmente posso concentrarmi sul cantiere."
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right column — form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-subtitle text-xl font-bold text-slate-900">
              Impresa<span className="text-sky-500">Leggera</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold font-subtitle text-slate-900">Bentornato</h2>
          <p className="text-sm text-slate-500 mt-1 mb-8">Le tue pratiche ti aspettano.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-sky-500 hover:text-sky-600 font-medium">
                  Password dimenticata?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white hover:bg-sky-600 rounded-full px-5 py-2.5 font-semibold text-sm transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Accedi <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Non hai un account?{' '}
            <Link to="/" className="text-sky-500 hover:text-sky-600 font-medium">
              Richiedi demo
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            Accedendo accetti i{' '}
            <a href="/termini" className="underline">Termini di Servizio</a>{' '}
            e la{' '}
            <a href="/privacy" className="underline">Privacy Policy</a>
          </p>

          {/* Dev hint */}
          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-600 mb-1">🔑 Account demo</p>
            <p>Admin: <code className="font-mono-accent text-sky-600">admin@impresaleggera.it</code></p>
            <p>Cliente: <code className="font-mono-accent text-sky-600">cliente@demo.it</code></p>
            <p className="text-slate-400 mt-1">Password: qualsiasi</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
