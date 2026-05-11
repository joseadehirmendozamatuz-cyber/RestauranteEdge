import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  pendiente: { label: 'Pendiente', icon: Clock, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  en_preparacion: { label: 'Preparando', icon: ChefHat, className: 'bg-blue-100 text-blue-700 border-blue-200' },
  lista: { label: 'Lista', icon: CheckCircle2, className: 'bg-green-100 text-green-700 border-green-200' },
  entregada: { label: 'Entregada', icon: Truck, className: 'bg-muted text-muted-foreground border-border' },
  cancelada: { label: 'Cancelada', icon: XCircle, className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function OrderStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pendiente;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn('border text-xs gap-1', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}