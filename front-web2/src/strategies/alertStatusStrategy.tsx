import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Alert } from '../services/mockApi';

interface AlertStatusStrategy {
  className: string;
  icon: ReactNode;
}

export const alertStatusStrategies: Record<Alert['status'], AlertStatusStrategy> = {
  Crítico: {
    className: 'bg-rose-100 text-rose-700',
    icon: <AlertOctagon size={12} />,
  },
  Advertencia: {
    className: 'bg-amber-100 text-amber-700',
    icon: <AlertTriangle size={12} />,
  },
  Informativo: {
    className: 'bg-blue-100 text-blue-700',
    icon: <Info size={12} />,
  },
};
