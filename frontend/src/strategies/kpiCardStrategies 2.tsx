import {
  AlertOctagon,
  DollarSign,
  PackageMinus,
  Receipt,
  Smile,
  TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { KpiSummary } from '../types/kpi';
import { formatCurrency } from '../utils/formatters-utils';

interface KpiCardStrategy {
  title: string;
  getValue: (summary: KpiSummary) => string | number;
  icon: ReactNode;
  trend: {
    value: string;
    isPositive: boolean;
  };
}

export const kpiCardStrategies: KpiCardStrategy[] = [
  {
    title: 'Ventas totales (Mes)',
    getValue: (summary) => formatCurrency(summary.totalSales),
    icon: <DollarSign size={22} />,
    trend: { value: '12%', isPositive: true },
  },
  {
    title: 'Margen de utilidad',
    getValue: (summary) => `${summary.profitMargin}%`,
    icon: <TrendingUp size={22} />,
    trend: { value: '2.1%', isPositive: true },
  },
  {
    title: 'Stock crítico',
    getValue: (summary) => summary.criticalStock,
    icon: <PackageMinus size={22} />,
    trend: { value: '4', isPositive: false },
  },
  {
    title: 'Reclamos activos',
    getValue: (summary) => summary.activeClaims,
    icon: <AlertOctagon size={22} />,
    trend: { value: '1', isPositive: false },
  },
  {
    title: 'Ticket promedio',
    getValue: (summary) => formatCurrency(summary.averageTicket),
    icon: <Receipt size={22} />,
    trend: { value: '5%', isPositive: true },
  },
  {
    title: 'Satisfacción cliente',
    getValue: (summary) => `${summary.customerSatisfaction}%`,
    icon: <Smile size={22} />,
    trend: { value: '1%', isPositive: true },
  },
];
