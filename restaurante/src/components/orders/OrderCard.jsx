import React from 'react';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from './OrderStatusBadge';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

const statusFlow = ['pendiente', 'en_preparacion', 'lista', 'entregada'];
const nextStatusLabel = {
  pendiente: 'Preparar',
  en_preparacion: 'Marcar lista',
  lista: 'Entregar',
};

export default function OrderCard({ order, onAdvanceStatus, onCancel }) {
  const canAdvance = statusFlow.indexOf(order.status) < statusFlow.length - 1 && order.status !== 'cancelada';
  const nextLabel = nextStatusLabel[order.status];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center font-bold text-sm">
            #{order.table_number}
          </div>
          <div>
            <p className="font-semibold text-sm">{order.customer_name || `Mesa ${order.table_number}`}</p>
            <p className="text-xs text-muted-foreground">
              {order.createdAt && !isNaN(new Date(order.createdAt)) ? format(new Date(order.createdAt), 'HH:mm') : '--:--'} · {order.items?.length || 0} platillos
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-1.5 mb-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.quantity}x {item.name}
            </span>
            <span className="font-medium">${item.subtotal?.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2 mb-4 italic">
          📝 {order.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <p className="font-bold">${order.total?.toFixed(2) || '0.00'}</p>
        <div className="flex gap-2">
          {order.status !== 'cancelada' && order.status !== 'entregada' && (
            <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive" onClick={() => onCancel(order)}>
              Cancelar
            </Button>
          )}
          {canAdvance && nextLabel && (
            <Button size="sm" className="text-xs gap-1" onClick={() => onAdvanceStatus(order)}>
              {nextLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}