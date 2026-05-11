import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MenuItemCard from '@/components/menu/MenuItemCard';
import MenuItemForm from '@/components/menu/MenuItemForm';

const categoryTabs = [
  { value: 'all', label: 'Todos' },
  { value: 'entradas', label: 'Entradas' },
  { value: 'platos_fuertes', label: 'Platos Fuertes' },
  { value: 'postres', label: 'Postres' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'ensaladas', label: 'Ensaladas' },
  { value: 'sopas', label: 'Sopas' },
];

export default function MenuPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: menuItems = [], isLoading } = useQuery({ queryKey: ['menuItems'], queryFn: api.menu.list });

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item) => { setEditingItem(item); setDialogOpen(true); };

  const handleDelete = async (item) => {
    await api.menu.delete(item._id);
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
  };

  const handleToggleAvailability = async (item) => {
    await api.menu.update(item._id, { available: !item.available });
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
  };

  const handleSave = () => {
    setDialogOpen(false);
    setEditingItem(null);
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menú</h1>
          <p className="text-muted-foreground mt-1">Administra los platillos del restaurante</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo platillo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar platillos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="overflow-x-auto">
            {categoryTabs.map(t => <TabsTrigger key={t.value} value={t.value} className="text-xs">{t.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No se encontraron platillos</p>
          <p className="text-sm mt-1">Agrega un nuevo platillo para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <MenuItemCard key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} onToggleAvailability={handleToggleAvailability} />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar platillo' : 'Nuevo platillo'}</DialogTitle>
          </DialogHeader>
          <MenuItemForm item={editingItem} onSave={handleSave} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
