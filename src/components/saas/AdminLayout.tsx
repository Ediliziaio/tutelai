import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Building2, Users, Receipt, BarChart3, Settings,
  LogOut, Menu, X, Bell, ChevronDown, Shield, Radio, GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const navSections = [
  {
    label: 'PRINCIPALE',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/aziende', label: 'Aziende', icon: Building2 },
      { to: '/admin/utenti', label: 'Utenti', icon: Users },
    ],
  },
  {
    label: 'PIATTAFORMA',
    items: [
      { to: '/admin/piani', label: 'Piani & Pricing', icon: Receipt },
      { to: '/admin/contenuti', label: 'Contenuti Monitor', icon: Radio },
      { to: '/admin/corsi', label: 'Corsi Training', icon: GraduationCap },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { to: '/admin/report', label: 'Report & Analytics', icon: BarChart3 },
      { to: '/admin/impostazioni', label: 'Impostazioni', icon: Settings },
    ],
  },
];

const pathMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard', '/admin/aziende': 'Aziende', '/admin/utenti': 'Utenti',
  '/admin/piani': 'Piani & Pricing', '/admin/contenuti': 'Contenuti Monitor',
  '/admin/corsi': 'Corsi Training', '/admin/report': 'Report', '/admin/impostazioni': 'Impostazioni',
};

function AdminSidebarContent({ onClose }: { onClose?: () => void }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-[#1a375b] text-white">
      <div className="h-1 bg-gradient-to-r from-[#185FA5] to-[#22A86B] shrink-0" />
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display font-extrabold text-lg">
            Tutel<span className="text-[#22A86B]">AI</span>
            <span className="ml-2 text-[10px] font-bold bg-[#185FA5] text-white px-2 py-0.5 rounded uppercase tracking-wider">SuperAdmin</span>
          </span>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-white/40 mt-1">{profile?.email}</p>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navSections.map((section, si) => (
          <div key={si}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname.startsWith(item.to);
                return (
                  <NavLink key={item.to} to={item.to} onClick={onClose}
                    className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all border-l-2 pl-[10px]',
                      active ? 'bg-white/15 text-white border-[#22A86B]' : 'text-white/60 hover:bg-white/10 hover:text-white border-transparent'
                    )}
                  >
                    <item.icon className={cn('h-[17px] w-[17px] shrink-0', active ? 'text-[#22A86B]' : 'text-white/40')} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/10">
        <button onClick={async () => { await logout(); navigate('/login'); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-white/10 transition-all border-l-2 border-transparent pl-[10px]"
        >
          <LogOut className="h-[17px] w-[17px]" /> Esci
        </button>
      </div>
    </div>
  );
}

function AdminTopbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { profile } = useAuth();
  const location = useLocation();
  const pageName = Object.entries(pathMap).find(([k]) => location.pathname.startsWith(k))?.[1] ?? 'Admin';
  const initials = profile?.full_name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??';

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuOpen} className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><Menu className="h-5 w-5" /></button>
        <div className="text-sm">
          <span className="text-gray-400">SuperAdmin</span>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="font-medium text-[#1a375b]">{pageName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NavLink to="/app/dashboard" className="hidden sm:flex items-center gap-1.5 text-xs text-[#185FA5] hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          <Shield className="h-3.5 w-3.5" /> Vista cliente
        </NavLink>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a375b] text-white text-sm font-bold">{initials}</div>
      </div>
    </header>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col h-full">
        <AdminSidebarContent />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <AdminSidebarContent onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
