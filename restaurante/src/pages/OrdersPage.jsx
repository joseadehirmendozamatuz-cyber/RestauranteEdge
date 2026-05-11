import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import OrderCard from '@/components/orders/OrderCard';
import NewOrderForm from '@/components/orders/NewOrderForm';

const statusFlow = ['pendiente', 'en_preparacion', 'lista', 'entregada'];
const filterTabs = [
  { value: 'active', label: 'Activas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'en_preparacion', label: 'Preparando' },
  { value: 'lista', label: 'Listas' },
  { value: 'all', label: 'Todas' },
];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('active');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: api.orders.list });

  const filteredOrders = orders.filter(o => {
    if (filter === 'active') return ['pendiente', 'en_preparacion', 'lista'].includes(o.status);
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const handleAdvanceStatus = async (order) => {
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx < statusFlow.length - 1) {
      await api.orders.update(order._id, { status: statusFlow[currentIdx + 1] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  };

  const handleCancel = async (order) => {
    await api.orders.update(order._id, { status: 'cancelada' });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const handleSave = () => {
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes</h1>
          <p className="text-muted-foreground mt-1">Gestiona las órdenes del restaurante</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nueva orden
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {filterTabs.map(t => <TabsTrigger key={t.value} value={t.value} className="text-xs">{t.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No hay órdenes</p>
          <p className="text-sm mt-1">Crea una nueva orden para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} onAdvanceStatus={handleAdvanceStatus} onCancel={handleCancel} />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Nueva orden</DialogTitle></DialogHeader>
          <NewOrderForm onSave={handleSave} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
