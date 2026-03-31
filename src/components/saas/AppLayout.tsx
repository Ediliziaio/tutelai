import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Shield, FileText, Radio, GraduationCap, Lock,
  ClipboardList, Settings, CreditCard, Users, Plug, LogOut,
  Menu, X, Bell, ChevronDown, HelpCircle, ArrowLeft, CalendarDays,
  GitBranch, MessageSquare, FileSignature, BarChart2, Download,
  Building2, BellRing,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { mockNotifiche } from '@/data/tutelaiMockData';

// ─── Navigation structure ─────────────────────────────────────────────────────
// Organized by user mental model: overview → compliance → privacy → training → deadlines → reports → settings

const navSections = [
  {
    // Top-level overview — no section label
    items: [
      { to: '/app/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
      { to: '/app/executive',  label: 'Executive',  icon: BarChart2 },
    ],
  },
  {
    label: 'COMPLIANCE AI',
    items: [
      { to: '/app/registry',     label: 'AI Registry',       icon: Shield },
      { to: '/app/gap-analysis', label: 'Gap Analysis',      icon: GitBranch },
      { to: '/app/monitor',      label: 'AI Monitor',        icon: Radio },
      { to: '/app/docs',         label: 'Doc Generator',     icon: FileText },
      { to: '/app/ai-lawyer',    label: 'AI Legal Advisor',  icon: MessageSquare },
    ],
  },
  {
    label: 'PRIVACY & GDPR',
    items: [
      { to: '/app/gdpr',   label: 'GDPR + AI',        icon: Lock },
      { to: '/app/firma',  label: 'Firma Digitale',   icon: FileSignature },
      { to: '/app/vendor', label: 'Vendor AI',         icon: Building2 },
    ],
  },
  {
    label: 'FORMAZIONE',
    items: [
      { to: '/app/training', label: 'Training Hub', icon: GraduationCap },
    ],
  },
  {
    label: 'SCADENZE',
    items: [
      { to: '/app/calendario', label: 'Calendario', icon: CalendarDays },
      { to: '/app/reminders',  label: 'Reminder',   icon: BellRing },
    ],
  },
  {
    label: 'REPORT',
    items: [
      { to: '/app/audit',  label: 'Audit Trail', icon: ClipboardList },
      { to: '/app/report', label: 'Report PDF',  icon: Download },
    ],
  },
  {
    label: 'IMPOSTAZIONI',
    items: [
      { to: '/app/settings/company',      label: 'Azienda',      icon: Settings },
      { to: '/app/settings/team',         label: 'Team',         icon: Users },
      { to: '/app/billing',               label: 'Billing',      icon: CreditCard },
      { to: '/app/settings/integrations', label: 'Integrazioni', icon: Plug },
    ],
  },
];

// ─── Breadcrumb path map ──────────────────────────────────────────────────────

const pathMap: Record<string, string> = {
  '/app/dashboard':            'Dashboard',
  '/app/executive':            'Executive Dashboard',
  '/app/registry':             'AI Registry',
  '/app/docs':                 'Doc Generator',
  '/app/monitor':              'AI Monitor',
  '/app/gap-analysis':         'Gap Analysis',
  '/app/ai-lawyer':            'AI Legal Advisor',
  '/app/training':             'Training Hub',
  '/app/gdpr':                 'GDPR + AI',
  '/app/firma':                'Firma Digitale',
  '/app/vendor':               'Vendor AI',
  '/app/audit':                'Audit Trail',
  '/app/calendario':           'Calendario',
  '/app/reminders':            'Reminder',
  '/app/report':               'Report PDF',
  '/app/settings/company':     'Impostazioni',
  '/app/settings/team':        'Team',
  '/app/settings/security':    'Sicurezza',
  '/app/settings/notifications':'Notifiche',
  '/app/settings/integrations':'Integrazioni',
  '/app/billing':              'Billing',
  '/app/notifications':        'Notifiche',
};

// ─── Piano badge ──────────────────────────────────────────────────────────────

const pianoBadge: Record<string, string> = {
  starter:    'bg-gray-200 text-gray-700',
  business:   'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800',
};

// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { profile, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = mockNotifiche.filter((n) => n.user_id === profile?.id && !n.letta).length;

  return (
    <div className="flex h-full flex-col bg-[#F5F5F3] border-r border-[#C8C5BC]">

      {/* ── Logo + company switcher ── */}
      <div className="px-4 py-4 border-b border-[#C8C5BC] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-extrabold text-lg text-[#1a375b]">
            Tutel<span className="text-[#eab913]">AI</span>
          </span>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {tenant && (
          <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-white transition-colors text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a375b] text-white text-xs font-bold">
              {tenant.ragione_sociale ? tenant.ragione_sociale.substring(0, 2).toUpperCase() : '??'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1a375b] truncate leading-tight">
                {tenant.ragione_sociale || 'Nuova azienda'}
              </p>
              <span className={cn(
                'inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5',
                pianoBadge[tenant.piano] ?? pianoBadge.starter
              )}>
                {tenant.piano}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-3">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-400 select-none">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all border-l-2',
                      active
                        ? 'bg-[#FDF8E7] text-[#1a375b] border-[#eab913]'
                        : 'text-[#444] hover:bg-white border-transparent hover:text-[#1a375b]'
                    )}
                  >
                    <item.icon className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      active ? 'text-[#eab913]' : 'text-gray-400'
                    )} />
                    <span className="flex-1 leading-none">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Subtle divider after each section (except last) */}
            {si < navSections.length - 1 && (
              <div className="mt-3 border-b border-[#C8C5BC]/40" />
            )}
          </div>
        ))}
      </nav>

      {/* ── Footer utilities ── */}
      <div className="px-3 py-3 border-t border-[#C8C5BC] space-y-0.5 shrink-0">
        <NavLink
          to="/app/notifications"
          onClick={onClose}
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all border-l-2',
            location.pathname === '/app/notifications'
              ? 'bg-[#FDF8E7] text-[#1a375b] border-[#eab913]'
              : 'text-[#444] hover:bg-white border-transparent'
          )}
        >
          <Bell className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="flex-1 leading-none">Notifiche</span>
          {unreadCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shrink-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavLink>

        <a
          href="#"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#444] hover:bg-white transition-all border-l-2 border-transparent"
        >
          <HelpCircle className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="leading-none">Supporto</span>
        </a>

        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all border-l-2 border-transparent"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="leading-none">Esci</span>
        </button>
      </div>
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { profile, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const unreadCount = mockNotifiche.filter((n) => n.user_id === profile?.id && !n.letta).length;

  // Match longest prefix first for accurate breadcrumb
  const pageName = Object.entries(pathMap)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => location.pathname.startsWith(k))?.[1] ?? 'Pagina';

  const initials = profile?.full_name
    ?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??';

  return (
    <header className="h-[56px] bg-white border-b border-[#C8C5BC] flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-sm text-gray-400">
          <span>App</span>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="font-semibold text-[#1a375b]">{pageName}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Notifications bell */}
        <NavLink
          to="/app/notifications"
          className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#1a375b] transition-colors"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavLink>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a375b] text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#1a375b] leading-none">{profile?.full_name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{tenant?.ragione_sociale ?? 'SuperAdmin'}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl bg-white border border-gray-200 shadow-lg py-1 text-sm">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="font-semibold text-[#1a375b] text-xs">{profile?.full_name}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{profile?.email}</p>
                </div>
                <NavLink
                  to="/app/settings/company"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Settings className="h-4 w-4 text-gray-400" /> Impostazioni
                </NavLink>
                <NavLink
                  to="/app/billing"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <CreditCard className="h-4 w-4 text-gray-400" /> Billing
                </NavLink>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={async () => { setUserMenuOpen(false); await logout(); navigate('/login'); }}
                  className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                >
                  <LogOut className="h-4 w-4" /> Esci
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Impersonation banner ─────────────────────────────────────────────────────

function ImpersonationBanner() {
  const { impersonating, impersonatedTenant, stopImpersonation } = useAuth();
  const navigate = useNavigate();

  if (!impersonating || !impersonatedTenant) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-sm font-medium shrink-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
        <span className="text-sm">
          Visualizzazione come <strong>{impersonatedTenant.ragione_sociale}</strong>
          <span className="text-amber-200 font-normal"> — modalità SuperAdmin</span>
        </span>
      </div>
      <button
        onClick={() => { stopImpersonation(); navigate('/admin/aziende'); }}
        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 transition-colors text-xs font-semibold shrink-0 ml-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Torna all'Admin
      </button>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[230px] shrink-0 flex-col h-full">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[230px]">
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ImpersonationBanner />
        <Topbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
