import { useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';
import type { Alert } from '../services/mockApi';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

export function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alertsData = await mockApi.getAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error("Error fetching alerts data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 h-full">
        <div className="text-brand-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="font-medium text-slate-600">Cargando Alertas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Centro de Alertas</h1>
        <p className="text-slate-500 mt-1">Monitoreo de notificaciones y excepciones</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                <th className="font-medium py-3 px-6">ID</th>
                <th className="font-medium py-3 px-6">KPI</th>
                <th className="font-medium py-3 px-6">Estado</th>
                <th className="font-medium py-3 px-6">Fecha</th>
                <th className="font-medium py-3 px-6">Descripción</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No hay alertas activas
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-400">#{alert.id}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{alert.kpi}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${alert.status === 'Crítico' ? 'bg-rose-100 text-rose-700' : 
                          alert.status === 'Advertencia' ? 'bg-amber-100 text-amber-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {alert.status === 'Crítico' && <AlertOctagon size={12} />}
                        {alert.status === 'Advertencia' && <AlertTriangle size={12} />}
                        {alert.status === 'Informativo' && <Info size={12} />}
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{alert.date}</td>
                    <td className="py-4 px-6 text-slate-600 min-w-[250px]">{alert.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
