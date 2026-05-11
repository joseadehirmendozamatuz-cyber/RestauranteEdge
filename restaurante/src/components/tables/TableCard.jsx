import React from 'react';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

const statusStyles = {
  disponible: 'bg-green-50 border-green-200 text-green-700',
  ocupada: 'bg-primary/10 border-primary/30 text-primary',
  reservada: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  mantenimiento: 'bg-muted border-border text-muted-foreground',
};

const statusLabels = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  reservada: 'Reservada',
  mantenimiento: 'Mantenimiento',
};

const locationLabels = {
  interior: 'Interior',
  terraza: 'Terraza',
  bar: 'Bar',
  privado: 'Privado',
};

export default function TableCard({ table, onClick }) {
  return (
    <button
      onClick={() => onClick(table)}
      className={cn(
        "rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md hover:scale-[1.02]",
        statusStyles[table.status]
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold">#{table.number}</span>
        <div className="flex items-center gap-1 text-xs opacity-80">
          <Users className="h-3.5 w-3.5" />
          {table.capacity}
        </div>
      </div>
      <p className="text-sm font-medium">{statusLabels[table.status]}</p>
      {table.location && (
        <p className="text-xs opacity-70 mt-0.5">{locationLabels[table.location] || table.location}</p>
      )}
    </button>
  );
}