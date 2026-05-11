import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

const categories = [
  { value: 'entradas', label: 'Entradas' },
  { value: 'platos_fuertes', label: 'Platos Fuertes' },
  { value: 'postres', label: 'Postres' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'ensaladas', label: 'Ensaladas' },
  { value: 'sopas', label: 'Sopas' },
];

export default function MenuItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || 'entradas',
    available: item?.available !== undefined ? item.available : true,
    image_url: item?.image_url || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...formData, price: parseFloat(formData.price) };
    if (item?._id) {
      await api.menu.update(item._id, data);
    } else {
      await api.menu.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Tacos al pastor" required />
      </div>
      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descripción del platillo..." className="h-20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Precio ($)</Label>
          <Input type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>URL de imagen (opcional)</Label>
        <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={formData.available} onCheckedChange={v => setFormData({...formData, available: v})} />
        <Label>Disponible</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={saving} className="flex-1">
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {item ? 'Guardar' : 'Crear platillo'}
        </Button>
      </div>
    </form>
  );
}
