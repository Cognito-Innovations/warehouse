import React from 'react';

export interface ColumnDefinition<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
}