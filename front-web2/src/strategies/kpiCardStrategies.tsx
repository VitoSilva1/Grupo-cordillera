import {
  AlertOctagon,
  DollarSign,
  PackageMinus,
  Receipt,
  Smile,
  TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { KpiSummary } from '../services/mockApi';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
};

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
    getValue: (summary) => formatCurrency(summary.ventasTotales),
    icon: <DollarSign size={22} />,
    trend: { value: '12%', isPositive: true },
  },
  {
    title: 'Margen de utilidad',
    getValue: (summary) => `${summary.margenUtilidad}%`,
    icon: <TrendingUp size={22} />,
    trend: { value: '2.1%', isPositive: true },
  },
  {
    title: 'Stock crítico',
    getValue: (summary) => summary.stockCritico,
    icon: <PackageMinus size={22} />,
    trend: { value: '4', isPositive: false },
  },
  {
    title: 'Reclamos activos',
    getValue: (summary) => summary.reclamosActivos,
    icon: <AlertOctagon size={22} />,
    trend: { value: '1', isPositive: false },
  },
  {
    title: 'Ticket promedio',
    getValue: (summary) => formatCurrency(summary.ticketPromedio),
    icon: <Receipt size={22} />,
    trend: { value: '5%', isPositive: true },
  },
  {
    title: 'Satisfacción cliente',
    getValue: (summary) => `${summary.satisfaccionCliente}%`,
    icon: <Smile size={22} />,
    trend: { value: '1%', isPositive: true },
  },
];
