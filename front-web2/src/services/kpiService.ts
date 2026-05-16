export interface KpiSummary {
  ventasTotales: number;
  margenUtilidad: number;
  stockCritico: number;
  reclamosActivos: number;
  ticketPromedio: number;
  satisfaccionCliente: number;
}

export interface MonthlySales {
  month: string;
  ventas: number;
}

export interface BranchPerformance {
  branch: string;
  desempeño: number;
}

export interface SalesChannel {
  channel: string;
  value: number;
}

export interface Alert {
  id: string;
  kpi: string;
  status: 'Crítico' | 'Advertencia' | 'Informativo';
  date: string;
  description: string;
}

const KPIS_API_URL = import.meta.env.VITE_KPIS_API_URL || 'http://localhost:8000/api/kpis';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${KPIS_API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`KPI request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const kpiService = {
  getSummary: () => getJson<KpiSummary>('/summary'),
  getSales: () => getJson<MonthlySales[]>('/sales/monthly'),
  getBranchesPerformance: () => getJson<BranchPerformance[]>('/branches/performance'),
  getSalesByChannel: () => getJson<SalesChannel[]>('/channels'),
  getAlerts: () => getJson<Alert[]>('/alerts'),
};
