import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import TableCard from '@/components/tables/TableCard';

const statusOptions = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupada', label: 'Ocupada' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
];
const locationOptions = [
  { value: 'interior', label: 'Interior' },
  { value: 'terraza', label: 'Terraza' },
  { value: 'bar', label: 'Bar' },
  { value: 'privado', label: 'Privado' },
];

export default function TablesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({ number: '', capacity: '', status: 'disponible', location: 'interior' });

  const { data: tables = [], isLoading } = useQuery({ queryKey: ['tables'], queryFn: api.tables.list });
  const sortedTables = [...tables].sort((a, b) => (a.number || 0) - (b.number || 0));

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setFormData({ number: table.number, capacity: table.capacity, status: table.status, location: table.location });
    setDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedTable(null);
    setFormData({ number: '', capacity: '', status: 'disponible', location: 'interior' });
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { number: parseInt(formData.number), capacity: parseInt(formData.capacity), status: formData.status, location: formData.location };
    if (selectedTable?._id) {
      await api.tables.update(selectedTable._id, data);
    } else {
      await api.tables.create(data);
    }
    setDialogOpen(false);
    setSelectedTable(null);
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  };

  const handleDelete = async () => {
    if (selectedTable?._id) {
      await api.tables.delete(selectedTable._id);
      setDialogOpen(false);
      setSelectedTable(null);
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mesas</h1>
          <p className="text-muted-foreground mt-1">Vista general de las mesas del restaurante</p>
        </div>
        <Button onClick={handleNew} className="gap-2"><Plus className="h-4 w-4" /> Nueva mesa</Button>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400" /><span className="text-muted-foreground">Disponible ({sortedTables.filter(t => t.status === 'disponible').length})</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-muted-foreground">Ocupada ({sortedTables.filter(t => t.status === 'ocupada').length})</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span className="text-muted-foreground">Reservada ({sortedTables.filter(t => t.status === 'reservada').length})</span></div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : sortedTables.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No hay mesas</p>
          <p className="text-sm mt-1">Agrega mesas para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedTables.map(table => <TableCard key={table._id} table={table} onClick={handleTableClick} />)}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedTable?._id ? `Mesa #${selectedTable.number}` : 'Nueva mesa'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número</Label>
                <Input type="number" min="1" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Capacidad</Label>
                <Input type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Select value={formData.location} onValueChange={v => setFormData({...formData, location: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{locationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              {selectedTable?._id && <Button type="button" variant="destructive" onClick={handleDelete} className="text-xs">Eliminar</Button>}
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{selectedTable?._id ? 'Guardar' : 'Crear'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
