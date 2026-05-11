import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Loader2, Trash2 } from 'lucide-react';

export default function NewOrderForm({ onSave, onCancel }) {
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const { data: menuItems = [] } = useQuery({ queryKey: ['menuItems'], queryFn: api.menu.list });
  const availableItems = menuItems.filter(m => m.available !== false);

  const addItem = (menuItemId) => {
    const menuItem = availableItems.find(m => m._id === menuItemId);
    if (!menuItem) return;
    const existing = orderItems.find(o => o.menu_item_id === menuItemId);
    if (existing) {
      setOrderItems(prev => prev.map(o => o.menu_item_id === menuItemId
        ? { ...o, quantity: o.quantity + 1, subtotal: (o.quantity + 1) * o.unit_price }
        : o
      ));
    } else {
      setOrderItems(prev => [...prev, { menu_item_id: menuItem._id, name: menuItem.name, quantity: 1, unit_price: menuItem.price, subtotal: menuItem.price, notes: '' }]);
    }
  };

  const updateQuantity = (index, delta) => {
    setOrderItems(prev => {
      const updated = [...prev];
      updated[index].quantity = Math.max(1, updated[index].quantity + delta);
      updated[index].subtotal = updated[index].quantity * updated[index].unit_price;
      return updated;
    });
  };

  const removeItem = (index) => setOrderItems(prev => prev.filter((_, i) => i !== index));
  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.orders.create({ table_number: parseInt(tableNumber), customer_name: customerName, items: orderItems, notes, total, status: 'pendiente' });
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mesa #</Label>
          <Input type="number" min="1" value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="1" required />
        </div>
        <div className="space-y-2">
          <Label>Cliente (opcional)</Label>
          <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nombre del cliente" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Agregar platillo</Label>
        <Select onValueChange={addItem}>
          <SelectTrigger><SelectValue placeholder="Seleccionar platillo..." /></SelectTrigger>
          <SelectContent>
            {availableItems.map(item => (
              <SelectItem key={item._id} value={item._id}>{item.name} — ${item.price?.toFixed(2)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orderItems.length > 0 && (
        <div className="space-y-2">
          {orderItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">${item.unit_price?.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(idx, -1)}><Minus className="h-3 w-3" /></Button>
                <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(idx, 1)}><Plus className="h-3 w-3" /></Button>
              </div>
              <p className="text-sm font-semibold w-16 text-right">${item.subtotal?.toFixed(2)}</p>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 px-1">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instrucciones especiales..." className="h-16" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={saving || orderItems.length === 0} className="flex-1">
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Crear orden
        </Button>
      </div>
    </form>
  );
}
