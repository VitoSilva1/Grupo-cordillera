import { LayoutDashboard, Activity, FileText, Bell } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Activity size={20} />, label: 'KPIs', path: '/kpis' },
    { icon: <FileText size={20} />, label: 'Reportes', path: '/reportes' },
    { icon: <Bell size={20} />, label: 'Alertas', path: '/alertas' },
  ];

  return (
    <aside className="w-64 bg-brand-950 text-slate-300 flex flex-col h-screen shrink-0 border-r border-brand-900">
      <div className="p-6 border-b border-brand-900 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-white shadow-inner">
          GC
        </div>
        <div>
          <h1 className="text-white font-semibold tracking-wide">Cordillera</h1>
          <p className="text-xs text-brand-100/60 font-medium">KPI Service</p>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const isActive = location === item.path;
          return (
            <Link key={index} href={item.path}>
              <a
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-800 text-white shadow-sm' 
                    : 'hover:bg-brand-900/50 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-900">
        <div className="text-xs text-center text-brand-100/40">
          v1.0.0 - Admin Portal
        </div>
      </div>
    </aside>
  );
}
