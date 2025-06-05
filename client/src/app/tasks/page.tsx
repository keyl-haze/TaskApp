'use client'

import { useState, useEffect } from 'react'
import { Search, Bug, CheckSquare, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'
import GenericTable from '@/components/custom/utils/genericTable'
import { type ColumnDef } from '@tanstack/react-table'
import AuthLayout from '@/app/layouts/authLayout'
import { type Task } from '@/types/types'
import { TASK_API } from '@/routes/task'
import AddTaskDialog from '@/components/custom/pages/tasks/addDialog'
import FilterPopover, {
  FilterValue
} from '@/components/custom/pages/tasks/filterPopover'
import EditTaskDialog from '@/components/custom/pages/tasks/editDialog'
import DeleteTaskDialog from '@/components/custom/pages/tasks/deleteDialog'

const PAGE_SIZE = 10

export default function TasksPage() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: string }[]
  >([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterValue>({
    type: [],
    priority: []
  })

  // * Fetch tasks from the API
  const fetchTasks = async (searchValue = globalFilter, filterValue = filters) => {
    setLoading(true)
    setError(null)
    try {
      let url = `${TASK_API.list}?all=true`
      if (searchValue.trim()) {
        const encoded = encodeURIComponent(searchValue.trim())
        url +=
          `&filter[title][iLike]=${encoded}` +
          `&filter[description][iLike]=${encoded}` 
        // Add more fields if needed
      }
      // Add filter params for type and priority
      if (filterValue.priority && filterValue.priority.length > 0) {
        url += `&filter[priority][eq]=${encodeURIComponent(filterValue.priority.join(','))}`
      }
      if (filterValue.type && filterValue.type.length > 0) {
        url += `&filter[type][eq]=${encodeURIComponent(filterValue.type.join(','))}`
      }

      const res = await fetch(url)
      const json = await res.json()
      if (json.status === 'success') {
        const tasksData = json.data.map((task: Task) => ({
          ...task,
          reporter: {
            id: task.Reporter?.id,
            username: task.Reporter?.username,
            email: task.Reporter?.email,
            firstName: task.Reporter?.firstName,
            lastName: task.Reporter?.lastName
          },
          assignee: task.Assignee
            ? {
                id: task.Assignee.id,
                username: task.Assignee.username,
                email: task.Assignee.email,
                firstName: task.Assignee.firstName,
                lastName: task.Assignee.lastName
              }
            : null
        }))
        setTasks(tasksData)
      } else {
        setError(json.message || 'Failed to fetch tasks')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks(globalFilter)
  }, [refreshFlag, globalFilter, filters])

  // * Reset to first page when tasks change or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [tasks.length, globalFilter, filters.type, filters.priority])

  const handleTaskCreated = () => setRefreshFlag((prev) => prev + 1)
  const handleTaskUpdated = () => setRefreshFlag((prev) => prev + 1)
  const handleTaskDeleted = () => setRefreshFlag((prev) => prev + 1)

  const toggleSelectTask = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedTasks.length === paginatedTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(paginatedTasks.map((task) => task.id))
    }
  }

  const columns: ColumnDef<Task>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            selectedTasks.length === table.getFilteredRowModel().rows.length
          }
          onCheckedChange={toggleSelectAll}
          aria-label="Select all"
          className="bg-white"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedTasks.includes(row.original.id)}
          onCheckedChange={() => toggleSelectTask(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const task = row.original
        return (
          <div>
            <div className="font-medium">{task.title}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type
        const typeConfig = {
          bug: {
            icon: Bug,
            color: 'bg-red-100 text-red-800 border-red-200',
            label: 'Bug'
          },
          feature: {
            icon: CheckSquare,
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            label: 'Feature'
          },
          task: {
            icon: AlertCircle,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            label: 'Task'
          }
        }

        const config =
          typeConfig[type as keyof typeof typeConfig] || typeConfig.task
        const Icon = config.icon

        return (
          <Badge
            variant="outline"
            className={`${config.color} flex items-center gap-1 w-fit`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.original.priority
        const priorityConfig = {
          low: {
            color: 'bg-green-100 text-green-800 border-green-300',
            label: 'Low',
            dot: 'bg-green-500'
          },
          medium: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            label: 'Medium',
            dot: 'bg-yellow-500'
          },
          high: {
            color: 'bg-red-100 text-red-800 border-red-300',
            label: 'High',
            dot: 'bg-red-500'
          }
        }

        const config =
          priorityConfig[priority as keyof typeof priorityConfig] ||
          priorityConfig.medium

        return (
          <Badge
            variant="outline"
            className={`${config.color} flex items-center gap-1.5 w-fit font-medium`}
          >
            <div className={`w-2 h-2 rounded-full ${config.dot}`} />
            {config.label}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'reporter',
      header: 'Reporter',
      cell: ({ row }) => {
        const reporter = row.original.Reporter
        return reporter ? (
          <div className="text-sm">
            <span>
              {reporter.firstName} {reporter.lastName}
            </span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Not assigned</div>
        )
      }
    },
    {
      accessorKey: 'assignee',
      header: 'Assignee',
      cell: ({ row }) => {
        const assignee = row.original.Assignee
        return assignee ? (
          <div className="text-sm">
            <span>
              {assignee.firstName} {assignee.lastName}
            </span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Unassigned</div>
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex justify-items-center">
            <EditTaskDialog task={task} onTaskUpdated={handleTaskUpdated} />
            <DeleteTaskDialog task={task} onTaskDeleted={handleTaskDeleted} />
          </div>
        )
      }
    }
  ]

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE)
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <AuthLayout header="Tasks">
      <div className="min-h-screen bg-background">
        <main className="p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="SEARCH..."
                className="w-full pl-8 focus-visible:ring-0"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <FilterPopover
                onFilterChange={(newFilters) => {
                  setFilters(newFilters)
                  fetchTasks(globalFilter, newFilters)
                }}
                activeFilters={filters}
              />
              <AddTaskDialog onTaskCreated={handleTaskCreated} />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center">
              <div className="loader">Loading tasks...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="text-gray-500">No tasks found</div>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <GenericTable
              data={paginatedTasks}
              columns={columns}
              selectedRows={selectedTasks}
              onToggleSelectRow={toggleSelectTask}
              onToggleSelectAll={toggleSelectAll}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              headerClassName="bg-gray-100/90 dark:bg-gray-800"
            />
          )}

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &lt;
                  </Button>
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className="cursor-pointer"
                    >
                      {(i + 1).toString().padStart(2, '0')}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &gt;
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </AuthLayout>
  )
}
