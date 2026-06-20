export interface KpiSummary {
  totalSales: number;
  profitMargin: number;
  criticalStock: number;
  activeClaims: number;
  averageTicket: number;
  customerSatisfaction: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export interface BranchPerformance {
  branch: string;
  performance: number;
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

type RawKpiSummary = Record<string, number>;

type RawMonthlySales = {
  month: string;
} & Record<string, number | string>;

type RawBranchPerformance = {
  branch: string;
} & Record<string, number | string | undefined>;

const KPIS_API_URL = import.meta.env.VITE_KPIS_API_URL || 'http://localhost:8000/api/kpis';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${KPIS_API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`KPI request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const kpiService = {
  getSummary: async (): Promise<KpiSummary> => {
    const summary = await getJson<RawKpiSummary>('/summary');
    return {
      totalSales: summary['ventasTotales'],
      profitMargin: summary['margenUtilidad'],
      criticalStock: summary['stockCritico'],
      activeClaims: summary['reclamosActivos'],
      averageTicket: summary['ticketPromedio'],
      customerSatisfaction: summary['satisfaccionCliente'],
    };
  },
  getSales: async (): Promise<MonthlySales[]> => {
    const sales = await getJson<RawMonthlySales[]>('/sales/monthly');
    return sales.map((item) => ({ month: item.month, sales: Number(item['ventas']) }));
  },
  getBranchesPerformance: async (): Promise<BranchPerformance[]> => {
    const branches = await getJson<RawBranchPerformance[]>('/branches/performance');
    return branches.map((item) => ({
      branch: item.branch,
      performance: Number(item['desempeño'] ?? item['desempeÃ±o'] ?? 0),
    }));
  },
  getSalesByChannel: () => getJson<SalesChannel[]>('/channels'),
  getAlerts: () => getJson<Alert[]>('/alerts'),
};
