import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, AlertTriangle, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryLabels = { carnes:'Carnes', verduras:'Verduras', frutas:'Frutas', lacteos:'Lácteos', bebidas:'Bebidas', secos:'Secos', condimentos:'Condimentos', otros:'Otros' };
const unitLabels = { kg:'kg', litros:'L', unidades:'uds', gramos:'g', piezas:'pzas' };
const categories = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }));
const units = Object.entries(unitLabels).map(([value, label]) => ({ value, label }));

const emptyForm = { name:'', quantity:'', unit:'kg', min_stock:'', category:'otros', cost_per_unit:'' };

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data: inventory = [], isLoading } = useQuery({ queryKey: ['inventory'], queryFn: api.inventory.list });

  const filteredItems = inventory.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, quantity: item.quantity, unit: item.unit, min_stock: item.min_stock, category: item.category, cost_per_unit: item.cost_per_unit });
    setDialogOpen(true);
  };

  const handleNew = () => { setEditingItem(null); setFormData(emptyForm); setDialogOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { name: formData.name, quantity: parseFloat(formData.quantity), unit: formData.unit, min_stock: parseFloat(formData.min_stock) || 0, category: formData.category, cost_per_unit: parseFloat(formData.cost_per_unit) || 0 };
    if (editingItem?._id) {
      await api.inventory.update(editingItem._id, data);
    } else {
      await api.inventory.create(data);
    }
    setSaving(false);
    setDialogOpen(false);
    setEditingItem(null);
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
  };

  const handleDelete = async (item) => {
    await api.inventory.delete(item._id);
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
  };

  const isLowStock = (item) => item.quantity <= (item.min_stock || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground mt-1">Control de ingredientes y productos</p>
        </div>
        <Button onClick={handleNew} className="gap-2"><Plus className="h-4 w-4" /> Nuevo producto</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Producto</TableHead><TableHead>Categoría</TableHead>
              <TableHead className="text-right">Cantidad</TableHead><TableHead className="text-right">Stock mín.</TableHead>
              <TableHead className="text-right">Costo/U</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No hay productos en el inventario</TableCell></TableRow>
            ) : filteredItems.map(item => (
              <TableRow key={item._id} className={cn(isLowStock(item) && "bg-red-50/50")}>
                <TableCell><div className="flex items-center gap-2">{isLowStock(item) && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}<span className="font-medium">{item.name}</span></div></TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{categoryLabels[item.category] || item.category}</Badge></TableCell>
                <TableCell className="text-right font-medium">{item.quantity} {unitLabels[item.unit] || item.unit}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.min_stock || '—'} {item.min_stock ? (unitLabels[item.unit] || item.unit) : ''}</TableCell>
                <TableCell className="text-right">{item.cost_per_unit ? `$${item.cost_per_unit.toFixed(2)}` : '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingItem ? 'Editar producto' : 'Nuevo producto'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>Nombre</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Tomate" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Cantidad</Label><Input type="number" step="0.01" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Unidad</Label>
                <Select value={formData.unit} onValueChange={v => setFormData({...formData, unit: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Stock mínimo</Label><Input type="number" step="0.01" min="0" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: e.target.value})} /></div>
              <div className="space-y-2"><Label>Costo/Unidad ($)</Label><Input type="number" step="0.01" min="0" value={formData.cost_per_unit} onChange={e => setFormData({...formData, cost_per_unit: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Categoría</Label>
              <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={saving} className="flex-1">{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editingItem ? 'Guardar' : 'Crear'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
