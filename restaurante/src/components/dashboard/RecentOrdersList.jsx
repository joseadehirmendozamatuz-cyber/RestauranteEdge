import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle2, Truck, XCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusConfig = {
  pendiente:      { label: 'Pendiente',  icon: Clock,         className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  en_preparacion: { label: 'Preparando', icon: ChefHat,       className: 'bg-blue-100 text-blue-700 border-blue-200' },
  lista:          { label: 'Lista',      icon: CheckCircle2,  className: 'bg-green-100 text-green-700 border-green-200' },
  entregada:      { label: 'Entregada',  icon: Truck,         className: 'bg-muted text-muted-foreground border-border' },
  cancelada:      { label: 'Cancelada',  icon: XCircle,       className: 'bg-red-100 text-red-700 border-red-200' },
};

export default function RecentOrdersList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>No hay órdenes recientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const config = statusConfig[order.status] || statusConfig.pendiente;
        const StatusIcon = config.icon;
        const fecha = order.createdAt ? new Date(order.createdAt) : null;
        const horaFormateada = fecha && !isNaN(fecha) ? format(fecha, 'HH:mm') : '--:--';

        return (
          <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center border border-border font-bold text-sm">
                #{order.table_number}
              </div>
              <div>
                <p className="font-medium text-sm">{order.customer_name || `Mesa ${order.table_number}`}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items?.length || 0} platillos · {horaFormateada}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-sm">${order.total?.toFixed(2) || '0.00'}</p>
              <Badge variant="outline" className={cn('border text-xs gap-1', config.className)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
