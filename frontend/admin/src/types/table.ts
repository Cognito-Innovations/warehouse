import React from 'react';

export interface ColumnDefinition<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
}

export interface TablePaginationConfig {
  mode?: 'client' | 'server';
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
}

export interface TableFilterConfig {
  statusOptions?: { value: string; label: string }[];
  onStatusChange?: (status: string | null) => void;
  filtersComponent?: React.ReactNode;
}

export interface TableActionsConfig {
  onViewDetails?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onToggle?: (id: string | number, newActive: boolean) => Promise<void>;
  isToggleLoading?: (id: string | number) => boolean;
}
