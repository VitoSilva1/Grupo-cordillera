import { useEffect, useState } from 'react';
import { kpisService } from '../services/kpisService';
import type { 
  KpiSummary, 
  MonthlySales, 
  BranchPerformance, 
  SalesChannel, 
  Alert 
} from '../services/kpisService';
import { KpiCard } from '../components/KpiCard';
import { 
  DollarSign, 
  TrendingUp, 
  PackageMinus, 
  AlertOctagon, 
  Receipt, 
  Smile,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
};

export function Dashboard() {
  const [summary, setSummary] = useState<KpiSummary | null>(null);
  const [sales, setSales] = useState<MonthlySales[]>([]);
  const [branches, setBranches] = useState<BranchPerformance[]>([]);
  const [channels, setChannels] = useState<SalesChannel[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          summaryData,
          salesData,
          branchesData,
          channelsData,
          alertsData
        ] = await Promise.all([
          kpisService.getSummary(),
          kpisService.getSales(),
          kpisService.getBranchesPerformance(),
          kpisService.getSalesByChannel(),
          kpisService.getAlerts()
        ]);

        setSummary(summaryData);
        setSales(salesData);
        setBranches(branchesData);
        setChannels(channelsData);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-brand-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="font-medium text-slate-600">Cargando KPIs...</span>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard de KPIs</h1>
        <p className="text-slate-500 mt-1">Monitoreo de indicadores clave del negocio</p>
      </div>

      {/* KPI Cards Grid */}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart: Ventas mensuales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Ventas mensuales (Millones CLP)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value}M`, 'Ventas']}
                />
                <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Desempeño por sucursal */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Desempeño por sucursal (%)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branches} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="desempeno" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart: Distribución por canal */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Ventas por canal</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channels}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channels.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => [`${value}%`, 'Participación']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {channels.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.channel}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Alertas Recientes</h3>
            <button className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Ver todas
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="font-medium py-3 px-6">KPI</th>
                  <th className="font-medium py-3 px-6">Estado</th>
                  <th className="font-medium py-3 px-6">Fecha</th>
                  <th className="font-medium py-3 px-6">Descripción</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
