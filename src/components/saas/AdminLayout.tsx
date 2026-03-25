import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, FolderOpen, Receipt, UserCog, BarChart3,
  Settings, LogOut, Menu, X, User, Archive, Clock, ShoppingCart, Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { NotificheDropdown } from '@/components/saas/NotificheDropdown';

interface NavSection {
  label: string;
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const sections: NavSection[] = [
  {
    label: 'Principale',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/clienti', label: 'Clienti', icon: Users },
      { to: '/admin/pratiche', label: 'Pratiche', icon: FolderOpen },
    ],
  },
  {
    label: 'Team',
    items: [
      { to: '/admin/operatori', label: 'Operatori', icon: UserCog },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/admin/fatturazione', label: 'Fatturazione', icon: Receipt },
      { to: '/admin/fatture-passive', label: 'Fatture Passive', icon: ShoppingCart },
      { to: '/admin/scadenzario', label: 'Scadenzario', icon: Clock },
      { to: '/admin/cassetto-fiscale', label: 'Cassetto Fiscale', icon: Archive },
      { to: '/admin/report', label: 'Report', icon: BarChart3 },
      { to: '/admin/impostazioni-fatturazione', label: 'Imp. Fatturazione', icon: Sliders },
      { to: '/admin/impostazioni', label: 'Impostazioni', icon: Settings },
    ],
  },
];

const AdminSidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Violet top band */}
      <div className="h-1 bg-violet-500 shrink-0" />

      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="font-subtitle text-lg font-bold text-slate-800">
            Impresa<span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Leggera</span>
          </span>
          <span className="rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest font-mono-accent">
            Superadmin
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {sections.map((section) => (
          <div key={section.label} className="mb-2">
            <p className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      active
                        ? 'bg-violet-50 text-violet-700 border-l-[3px] border-violet-500 pl-[9px]'
                        : 'text-slate-600 hover:bg-slate-50 border-l-[3px] border-transparent pl-[9px]'
                    )}
                  >
                    <item.icon className={cn('h-[18px] w-[18px]', active ? 'text-violet-600' : 'text-slate-400')} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="mt-auto border-t border-slate-100 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-bold">
            {profile?.full_name?.substring(0, 2).toUpperCase() ?? <User className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{profile?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{profile?.role}</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-200">
        <AdminSidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <AdminSidebarContent onClose={() => setMobileOpen(false)} />
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
            <span className="text-sm font-medium text-slate-400 hidden sm:block">Pannello Amministrazione</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificheDropdown area="admin" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
              {profile?.full_name?.substring(0, 2).toUpperCase() ?? 'A'}
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

export default AdminLayout;
