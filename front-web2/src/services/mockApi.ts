import type { UserProfile } from '../types/user';

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

// Simulating database delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getCurrentUser: async (): Promise<UserProfile> => {
    await delay(300);

    return {
      id: '1',
      name: 'Admin User',
      role: 'supervisor',
    };
  },
  getSummary: async (): Promise<KpiSummary> => {
    await delay(500);
    return {
      ventasTotales: 20000, // 145M CLP
      margenUtilidad: 32.5, // 32.5%
      stockCritico: 18,
      reclamosActivos: 5,
      ticketPromedio: 45000, // 45k CLP
      satisfaccionCliente: 94, // 94%
    };
  },

  getSales: async (): Promise<MonthlySales[]> => {
    await delay(600);
    return [
      { month: 'Ene', ventas: 110 },
      { month: 'Feb', ventas: 95 },
      { month: 'Mar', ventas: 125 },
      { month: 'Abr', ventas: 115 },
      { month: 'May', ventas: 140 },
      { month: 'Jun', ventas: 145 },
    ];
  },

  getBranchesPerformance: async (): Promise<BranchPerformance[]> => {
    await delay(700);
    return [
      { branch: 'Santiago Centro', desempeño: 98 },
      { branch: 'Providencia', desempeño: 85 },
      { branch: 'Viña del Mar', desempeño: 72 },
      { branch: 'Concepción', desempeño: 65 },
    ];
  },

  getSalesByChannel: async (): Promise<SalesChannel[]> => {
    await delay(400);
    return [
      { channel: 'Tiendas Físicas', value: 65 },
      { channel: 'E-commerce', value: 25 },
      { channel: 'Venta Telefónica', value: 10 },
    ];
  },

  getAlerts: async (): Promise<Alert[]> => {
    await delay(500);
    return [
      {
        id: '1',
        kpi: 'Stock Crítico',
        status: 'Crítico',
        date: '2026-04-27',
        description: 'Quiebre de stock en línea blanca, sucursal Providencia.',
      },
      {
        id: '2',
        kpi: 'Reclamos',
        status: 'Advertencia',
        date: '2026-04-26',
        description: 'Aumento inusual de reclamos por demoras en despacho.',
      },
      {
        id: '3',
        kpi: 'Ventas',
        status: 'Informativo',
        date: '2026-04-25',
        description: 'Meta semanal de ventas superada en Santiago Centro.',
      },
    ];
  }
};
