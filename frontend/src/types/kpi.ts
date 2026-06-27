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
