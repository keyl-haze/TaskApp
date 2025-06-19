/* eslint-disable no-unused-vars */

import { ColumnDef } from '@tanstack/react-table'

export interface GenericTableProps<T> {
  data: T[] // Table data
  columns: ColumnDef<T>[] // Column definitions
  selectedRows?: number[] // Selected rows
  onToggleSelectRow?: (id: number) => void // Callback for toggling a selected row
  headerClassName?: string // Optional class for table header styling
}

export interface PaginationProps {
  currentPage: number // Current page number
  totalPages: number // Total number of pages
  onPageChange: (page: number) => void // Callback for page change
}
