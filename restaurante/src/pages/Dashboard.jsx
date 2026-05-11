import React from 'react';
import { api } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/dashboard/StatCard';
import RecentOrdersList from '@/components/dashboard/RecentOrdersList';
import { DollarSign, ClipboardList, Grid3X3, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: api.orders.list });
  const { data: tables = [] } = useQuery({ queryKey: ['tables'], queryFn: api.tables.list });
  const { data: inventory = [] } = useQuery({ queryKey: ['inventory'], queryFn: api.inventory.list });

  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders
    .filter(o => o.status !== 'cancelada')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const activeOrders = orders.filter(o => ['pendiente', 'en_preparacion', 'lista'].includes(o.status));
  const occupiedTables = tables.filter(t => t.status === 'ocupada').length;
  const lowStockItems = inventory.filter(i => i.quantity <= (i.min_stock || 0));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen del día de tu restaurante</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ventas del día" value={`$${todayRevenue.toFixed(2)}`} subtitle={`${todayOrders.length} órdenes`} icon={DollarSign} />
        <StatCard title="Órdenes activas" value={activeOrders.length} subtitle="En proceso" icon={ClipboardList} />
        <StatCard title="Mesas ocupadas" value={`${occupiedTables}/${tables.length}`} subtitle={`${tables.length - occupiedTables} disponibles`} icon={Grid3X3} />
        <StatCard title="Stock bajo" value={lowStockItems.length} subtitle="Necesitan reposición" icon={AlertTriangle} />
      </div>
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Órdenes recientes</h2>
        <RecentOrdersList orders={orders.slice(0, 8)} />
      </div>
    </div>
  );
}
