import { useEffect, useState } from 'react';
import { kpiService } from '../services/kpiService';
import type { KpiSummary } from '../services/kpiService';
import { KpiCard } from '../components/KpiCard';
import { DollarSign, TrendingUp, PackageMinus, AlertOctagon, Receipt, Smile } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
};

export function KpisView() {
  const [summary, setSummary] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await kpiService.getSummary();
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching KPI data", error);
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
          <KpiCard 
            title="Ventas totales (Mes)" 
            value={formatCurrency(summary.ventasTotales)} 
            icon={<DollarSign size={22} />}
            trend={{ value: '12%', isPositive: true }}
          />
          <KpiCard 
            title="Margen de utilidad" 
            value={`${summary.margenUtilidad}%`} 
            icon={<TrendingUp size={22} />}
            trend={{ value: '2.1%', isPositive: true }}
          />
          <KpiCard 
            title="Stock crítico" 
            value={summary.stockCritico} 
            icon={<PackageMinus size={22} />}
            trend={{ value: '4', isPositive: false }}
          />
          <KpiCard 
            title="Reclamos activos" 
            value={summary.reclamosActivos} 
            icon={<AlertOctagon size={22} />}
            trend={{ value: '1', isPositive: false }}
          />
          <KpiCard 
            title="Ticket promedio" 
            value={formatCurrency(summary.ticketPromedio)} 
            icon={<Receipt size={22} />}
            trend={{ value: '5%', isPositive: true }}
          />
          <KpiCard 
            title="Satisfacción cliente" 
            value={`${summary.satisfaccionCliente}%`} 
            icon={<Smile size={22} />}
            trend={{ value: '1%', isPositive: true }}
          />
        </div>
      )}
    </div>
  );
}
