/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import { ColumnDef } from '@tanstack/react-table'

export interface GenericTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  selectedRows?: number[]
  onToggleSelectRow?: (id: number) => void
  onToggleSelectAll?: () => void
  columnFilters?: any
  setColumnFilters?: (filters: any) => void
  globalFilter?: string
  setGlobalFilter?: (filter: string) => void
  headerClassName?: string
}
