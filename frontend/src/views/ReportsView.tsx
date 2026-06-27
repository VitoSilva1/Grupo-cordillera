import { AlertCircle, CheckCircle2, FileText, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { reportService } from '../services/reportService';
import type { CreateReportPayload, Report } from '../types/report';

const initialForm: CreateReportPayload = {
  title: '',
  description: '',
  reportType: 'SALES',
  status: 'PENDING',
};

const reportTypes = ['SALES', 'STOCK', 'CLAIMS', 'KPI'];
const statuses = ['PENDING', 'GENERATED', 'FAILED'];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  GENERATED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
};

export function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [form, setForm] = useState<CreateReportPayload>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadReports = async () => {
    const reportsData = await reportService.getReports();
    setReports(reportsData);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await loadReports();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los reportes');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const updateField = (field: keyof CreateReportPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Ingresa el titulo del reporte.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await reportService.createReport({
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        reportType: form.reportType,
        status: form.status,
      });
      setForm(initialForm);
      setSuccessMessage('Reporte creado correctamente.');
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el reporte');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 h-full">
        <div className="text-brand-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <span className="font-medium text-slate-600">Cargando reportes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reportes</h1>
          <p className="text-slate-500 mt-1">Reportes generados desde el microservicio de reportes</p>
        </div>
        <div className="w-11 h-11 rounded-lg bg-brand-50 text-brand-800 flex items-center justify-center">
          <FileText size={22} />
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Plus size={18} className="text-brand-700" />
          <h2 className="text-lg font-semibold text-slate-800">Crear reporte</h2>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr_auto]">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
              Titulo
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-slate-700 mb-1.5">
              Tipo
            </label>
            <select
              id="reportType"
              value={form.reportType}
              onChange={(event) => updateField('reportType', event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">
              Estado
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? 'Creando...' : 'Crear'}
            </button>
          </div>

          <div className="lg:col-span-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Descripcion
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={3}
              className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>
      </section>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                <th className="font-medium py-3 px-6">ID</th>
                <th className="font-medium py-3 px-6">Titulo</th>
                <th className="font-medium py-3 px-6">Tipo</th>
                <th className="font-medium py-3 px-6">Estado</th>
                <th className="font-medium py-3 px-6">Generado</th>
                <th className="font-medium py-3 px-6">Descripcion</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No hay reportes registrados
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-400">#{report.id}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{report.title}</td>
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{report.reportType}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[report.status] ?? 'bg-slate-100 text-slate-700'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{formatDate(report.generatedAt)}</td>
                    <td className="py-4 px-6 text-slate-600 min-w-[260px]">{report.description || 'Sin descripcion'}</td>
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
