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
  desempeno: number;
}

export interface SalesChannel {
  channel: string;
  value: number;
}

export interface Alert {
  id: string;
  kpi: string;
  status: string;
  date: string;
  description: string;
}

const KPIS_API_URL = import.meta.env.VITE_KPIS_API_URL;

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${KPIS_API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error consultando KPIs: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

type BranchPerformanceResponse = Record<string, string | number>;

const normalizeBranchPerformance = (branch: BranchPerformanceResponse): BranchPerformance => {
  const performanceEntry = Object.entries(branch).find(([key]) => key.startsWith('desempe'));

  return {
    branch: String(branch.branch),
    desempeno: Number(performanceEntry?.[1] ?? 0),
  };
};

export const kpisService = {
  getSummary: () => getJson<KpiSummary>('/summary'),
  getSales: () => getJson<MonthlySales[]>('/sales/monthly'),
  getBranchesPerformance: async () => {
    const branches = await getJson<BranchPerformanceResponse[]>('/branches/performance');
    return branches.map(normalizeBranchPerformance);
  },
  getSalesByChannel: () => getJson<SalesChannel[]>('/channels'),
  getAlerts: () => getJson<Alert[]>('/alerts'),
};
