import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryLabels = {
  entradas: 'Entradas',
  platos_fuertes: 'Platos Fuertes',
  postres: 'Postres',
  bebidas: 'Bebidas',
  ensaladas: 'Ensaladas',
  sopas: 'Sopas',
};

export default function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }) {
  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group",
      !item.available && "opacity-60"
    )}>
      {item.image_url ? (
        <div className="h-40 overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-40 bg-muted flex items-center justify-center">
          <span className="text-4xl">🍽️</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <Badge variant="outline" className="text-xs mt-1">
              {categoryLabels[item.category] || item.category}
            </Badge>
          </div>
          <p className="text-lg font-bold text-primary">${item.price?.toFixed(2)}</p>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => onToggleAvailability(item)} className="text-xs gap-1">
            {item.available ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {item.available ? 'Ocultar' : 'Mostrar'}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}