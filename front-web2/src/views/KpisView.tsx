import { useEffect, useState } from 'react';
import { kpiService } from '../services/kpiService';
import type { KpiSummary } from '../services/kpiService';
import { KpiCard } from '../components/KpiCard';
import { kpiCardStrategies } from '../strategies/kpiCardStrategies';

export function KpisView() {
  const [summary, setSummary] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await kpiService.getSummary();
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching KPI data', error);
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
          <span className="font-medium text-slate-600">Cargando KPIs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Indicadores de Rendimiento</h1>
        <p className="text-slate-500 mt-1">Detalle de todos los KPIs activos</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiCardStrategies.map((strategy) => (
            <KpiCard
              key={strategy.title}
              title={strategy.title}
              value={strategy.getValue(summary)}
              icon={strategy.icon}
              trend={strategy.trend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
