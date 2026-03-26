import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

// Days until Aug 2, 2026
const aiActDeadline = new Date('2026-08-02');
const daysLeft = Math.max(0, Math.floor((aiActDeadline.getTime() - Date.now()) / 86400000));

const Login = () => {
  const { login, isSuperAdmin, isCliente, user, tenant } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (isSuperAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (isCliente) {
        if (tenant?.onboarding_completato) {
          navigate('/app/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }
    }
  }, [user, isSuperAdmin, isCliente, tenant, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenziali non valide.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'AI Registry — censimento sistemi AI',
    'Doc Generator AI — documenti compliance',
    'Audit Trail — tracciabilità immutabile',
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel — dark navy */}
      <div className="hidden lg:flex lg:w-[45%] flex-col bg-[#042C53] px-12 xl:px-16 py-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-auto">
            <div className="mb-12">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                Tutel<span className="text-[#22A86B]">AI</span>
              </span>
              <span className="ml-3 text-[11px] font-bold bg-[#185FA5] text-white px-2 py-0.5 rounded uppercase tracking-wider align-middle">
                Platform
              </span>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold text-white leading-snug mb-4">
              Il sistema operativo per la compliance AI delle PMI italiane
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10">
              Gestisci i tuoi sistemi AI, genera documenti conformi e forma il tuo team — tutto in un'unica piattaforma.
            </p>

            <div className="space-y-3 mb-10">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#22A86B]/20 border border-[#22A86B]/40 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-[#22A86B]" />
                  </div>
                  <span className="text-sm text-white/80 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency badge */}
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">Scadenza AI Act</p>
            </div>
            <p className="text-white font-semibold text-sm">
              2 agosto 2026 — <span className="text-amber-300 font-bold">{daysLeft} giorni</span>
            </p>
            <p className="text-white/50 text-xs mt-1">Le PMI devono essere conformi entro questa data.</p>
          </div>
        </div>
      </div>

      {/* Right panel — white form */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-extrabold text-[#042C53]">
              Tutel<span className="text-[#22A86B]">AI</span>
            </span>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
              AI Act: {daysLeft} giorni alla scadenza
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#042C53]">Accedi al tuo account</h2>
          <p className="text-sm text-gray-500 mt-1 mb-7">Inserisci le tue credenziali per continuare.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@azienda.it"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53] outline-none transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#185FA5] hover:underline font-medium">
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white rounded-lg px-5 py-2.5 font-semibold text-sm transition-all disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>

          {/* Demo credentials — always visible, non-dismissable */}
          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2.5">Credenziali demo</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Demo aziendale</span>
                <button
                  type="button"
                  onClick={() => { setEmail('florin@aedix.it'); setPassword('demo'); }}
                  className="text-xs font-mono text-[#185FA5] hover:underline"
                >
                  florin@aedix.it
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">SuperAdmin</span>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@tutelai.it'); setPassword('demo'); }}
                  className="text-xs font-mono text-[#185FA5] hover:underline"
                >
                  admin@tutelai.it
                </button>
              </div>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-200">
                (qualsiasi password — clicca l'email per precompilare)
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Non hai ancora un account?{' '}
            <Link to="/contatti" className="text-[#185FA5] hover:underline font-medium">
              Contattaci →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
