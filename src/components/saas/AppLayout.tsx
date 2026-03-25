import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FolderOpen, Receipt, FileText, Settings,
  Plus, LogOut, Menu, X, ChevronDown, User, Clock, FileDown, Archive, Coins, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NotificheDropdown } from '@/components/saas/NotificheDropdown';
import { mockNotifiche } from '@/data/mockDashboardData';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/pratiche', label: 'Pratiche', icon: FolderOpen },
  { to: '/app/fatture', label: 'Fatture', icon: Receipt },
  { to: '/app/fatture-ricevute', label: 'Fatture Ricevute', icon: FileDown },
  { to: '/app/scadenzario', label: 'Scadenzario', icon: Clock },
  { to: '/app/cassetto-fiscale', label: 'Cassetto Fiscale', icon: Archive },
  { to: '/app/crediti', label: 'Crediti', icon: Coins },
  { to: '/app/notifiche', label: 'Notifiche', icon: Bell, badge: 'notifiche' },
  { to: '/app/documenti', label: 'Documenti', icon: FileText },
  { to: '/app/impostazioni', label: 'Impostazioni', icon: Settings },
];

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { profile, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <span className="font-subtitle text-lg font-bold text-slate-800">
          Impresa<span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Leggera</span>
        </span>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Azienda selector */}
      {tenant && (
        <div className="px-3 py-3 border-b border-slate-100">
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 text-sm font-bold">
              {tenant.ragione_sociale.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{tenant.ragione_sociale}</p>
              <p className="text-xs text-slate-400">Piano {tenant.piano}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const isCrediti = item.to === '/app/crediti';
          const isNotifiche = (item as any).badge === 'notifiche';
          const notifNonLette = isNotifiche ? mockNotifiche.filter((n) => n.user_id === 'cliente' && !n.letta).length : 0;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-sky-50 text-sky-700 border-l-[3px] border-sky-500 pl-[9px]'
                  : 'text-slate-600 hover:bg-slate-50 border-l-[3px] border-transparent pl-[9px]'
              )}
            >
              <item.icon className={cn('h-[18px] w-[18px]', active ? 'text-sky-600' : 'text-slate-400')} />
              {item.label}
              {isCrediti && tenant && (
                <span className={cn(
                  'ml-auto text-[10px] font-bold rounded-full px-1.5 py-0.5',
                  (tenant.crediti_residui ?? 0) < 10 ? 'bg-red-100 text-red-600' :
                  (tenant.crediti_residui ?? 0) < 50 ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                )}>
                  €{tenant.crediti_residui ?? 0}
                </span>
              )}
              {isNotifiche && notifNonLette > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notifNonLette}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="px-3 py-3">
        <button
          onClick={() => { navigate('/app/pratiche/nuova'); onClose?.(); }}
          className="flex w-full items-center justify-center gap-2 bg-sky-500 text-white hover:bg-sky-600 hover:shadow-md hover:shadow-sky-500/20 rounded-xl py-2.5 text-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" /> Nuova Richiesta
        </button>
      </div>

      {/* User footer */}
      <div className="mt-auto border-t border-slate-100 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-bold">
            {profile?.full_name?.substring(0, 2).toUpperCase() ?? <User className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{profile?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-slate-200">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-500">
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <NotificheDropdown area="app" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
              {profile?.full_name?.substring(0, 2).toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
