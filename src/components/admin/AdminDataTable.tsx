import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { PrimaryButton, SecondaryButton } from '../../components/ui';
import { Search, Edit, Trash2, Eye } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  searchable?: boolean;
  addButtonLabel?: string;
}

export function AdminDataTable<T extends { id: string }>({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchable = true,
  addButtonLabel = 'Agregar Nuevo'
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = searchable
    ? data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const getCellValue = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row);
    }
    return String(row[column.key as keyof T] || '');
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
              />
            </div>
          )}
          {onAdd && (
            <PrimaryButton onClick={onAdd} className="whitespace-nowrap">
              {addButtonLabel}
            </PrimaryButton>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="text-left py-3 px-4 text-sm font-semibold text-text-secondary"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-text-secondary"
                >
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border hover:bg-surface-2/30 transition-colors"
                >
                  {columns.map((column, index) => (
                    <td key={index} className="py-3 px-4 text-sm text-text-primary">
                      {getCellValue(row, column)}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye size={16} className="text-text-secondary" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} className="text-blue-500" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-text-secondary">
          Mostrando {filteredData.length} de {data.length} resultados
        </div>
      )}
    </Card>
  );
}
