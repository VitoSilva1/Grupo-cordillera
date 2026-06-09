import { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Bell,
  Users,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { reportService } from '../services/reportService';

type LoadingKey = string;

interface ReportConfig {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  downloadPdf: () => Promise<void>;
  downloadXlsx: () => Promise<void>;
}

const REPORTS: ReportConfig[] = [
  {
    key: 'kpiSummary',
    icon: <TrendingUp size={22} />,
    title: 'Resumen de KPIs',
    description:
      'Ventas totales, margen de utilidad, stock crítico, reclamos activos y satisfacción del cliente.',
    downloadPdf: reportService.downloadKpiSummaryPdf,
    downloadXlsx: reportService.downloadKpiSummaryXlsx,
  },
  {
    key: 'monthlySales',
    icon: <BarChart2 size={22} />,
    title: 'Ventas Mensuales',
    description: 'Evolución de ventas mes a mes durante el período registrado.',
    downloadPdf: reportService.downloadMonthlySalesPdf,
    downloadXlsx: reportService.downloadMonthlySalesXlsx,
  },
  {
    key: 'branches',
    icon: <BarChart2 size={22} />,
    title: 'Desempeño por Sucursal',
    description: 'Indicadores de rendimiento comparativos agrupados por sucursal.',
    downloadPdf: reportService.downloadBranchPdf,
    downloadXlsx: reportService.downloadBranchXlsx,
  },
  {
    key: 'channels',
    icon: <PieChart size={22} />,
    title: 'Canales de Venta',
    description: 'Distribución porcentual de ventas por canal comercial.',
    downloadPdf: reportService.downloadChannelsPdf,
    downloadXlsx: reportService.downloadChannelsXlsx,
  },
  {
    key: 'alerts',
    icon: <Bell size={22} />,
    title: 'Alertas del Sistema',
    description: 'Historial de alertas críticas, advertencias e informativas registradas.',
    downloadPdf: reportService.downloadAlertsPdf,
    downloadXlsx: reportService.downloadAlertsXlsx,
  },
  {
    key: 'users',
    icon: <Users size={22} />,
    title: 'Usuarios del Sistema',
    description: 'Listado completo de usuarios registrados con rol, email y fecha de alta.',
    downloadPdf: reportService.downloadUsersPdf,
    downloadXlsx: reportService.downloadUsersXlsx,
  },
];

function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
  );
}

export function ReportsView() {
  const [loading, setLoading] = useState<Record<LoadingKey, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleDownload(key: LoadingKey, fn: () => Promise<void>) {
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(null);
    try {
      await fn();
    } catch {
      setError('No se pudo generar el reporte. Verifica que todos los servicios estén activos.');
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reportes</h1>
        <p className="text-slate-500 mt-1">
          Selecciona un reporte y descárgalo en formato PDF o Excel
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
          <span className="mt-0.5 shrink-0">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {REPORTS.map(report => {
          const pdfKey = `${report.key}-pdf`;
          const xlsxKey = `${report.key}-xlsx`;
          const isPdfLoading = !!loading[pdfKey];
          const isXlsxLoading = !!loading[xlsxKey];
          const isAnyLoading = isPdfLoading || isXlsxLoading;

          return (
            <div
              key={report.key}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5"
            >
              {/* Icon + title */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-50 text-brand-800 rounded-lg shrink-0">
                  {report.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 leading-snug">{report.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Download buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleDownload(pdfKey, report.downloadPdf)}
                  disabled={isAnyLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-800 text-white text-sm font-medium hover:bg-brand-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPdfLoading ? <Spinner /> : <Download size={15} />}
                  PDF
                </button>

                <button
                  onClick={() => handleDownload(xlsxKey, report.downloadXlsx)}
                  disabled={isAnyLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isXlsxLoading ? <Spinner /> : <FileSpreadsheet size={15} />}
                  Excel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
