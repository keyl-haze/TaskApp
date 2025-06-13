'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  CircleDashed,
  Loader,
  CircleCheckBig,
  Archive,
  Calendar,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { PROJECT_API } from '@/routes/project'
import { type Project } from '@/types/types'
import AddProjectDialog from '@/components/custom/pages/projects/addDialog'
import EditProjectDialog from '@/components/custom/pages/projects/editDialog'
import DeleteProjectDialog from '@/components/custom/pages/projects/deleteDialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PAGE_SIZE = 10

export default function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: string }[]
  >([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // * Fetch projects from the API
  const fetchProjects = useCallback(
    async (searchValue = globalFilter) => {
      setLoading(true)
      setError(null)
      try {
        let url = `${PROJECT_API.list}?all=true`
        if (searchValue.trim()) {
          const encoded = encodeURIComponent(searchValue.trim())
          url +=
            `&filter[title][iLike]=${encoded}` +
            `&filter[description][iLike]=${encoded}` +
            `&filter[code][iLike]=${encoded}`
        }

        const res = await fetch(url)
        const json = await res.json()
        if (json.status === 'success') {
          const projectsData = json.data.map((project: Project) => ({
            ...project,
            Owner: {
              id: project.Owner?.id,
              username: project.Owner?.username,
              email: project.Owner?.email,
              firstName: project.Owner?.firstName,
              lastName: project.Owner?.lastName
            }
          }))
          setProjects(projectsData)
        } else {
          setError(json.message || 'Failed to fetch projects')
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
    },
    [globalFilter]
  )

  useEffect(() => {
    fetchProjects(globalFilter)
  }, [refreshFlag, globalFilter, fetchProjects])

  // * Reset to first page when projects change or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [projects.length, globalFilter])

  const handleProjectCreated = () => setRefreshFlag((prev) => prev + 1)

  const toggleSelectProject = (projectId: number) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProjects.length === paginatedProjects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(paginatedProjects.map((project) => project.id))
    }
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'code',
      header: () => <div className="px-3 font-semibold">Code</div>,
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className="py-2 px-3">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800 dark:hover:bg-blue-900 gap-2"
            >
              <Package className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span>{project.code}</span>
            </Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'title',
      header: () => <div className="px-3">Title</div>,
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className="py-1 px-3">
            <div className="font-medium text-foreground leading-relaxed text-sm min-h-[1.5rem] flex items-center justify-start">
              {project.title}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex flex-col gap-2 min-w-[140px]">
          <span className="font-medium">Status</span>
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs bg-background border-muted-foreground/20 focus:ring-1 focus:ring-primary/30">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                All Statuses
              </SelectItem>
              <SelectItem value="to_do" className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                To Do
              </SelectItem>
              <SelectItem value="in_progress" className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                In Progress
              </SelectItem>
              <SelectItem value="done" className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Done
              </SelectItem>
              <SelectItem value="archived" className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                Archived
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status
        const statusConfig = {
          to_do: {
            icon: CircleDashed,
            color: 'bg-slate-100 text-slate-800 border-slate-200',
            label: 'To Do',
            iconColor: 'text-slate-600'
          },
          in_progress: {
            icon: Loader,
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            label: 'In Progress',
            iconColor: 'text-blue-600'
          },
          done: {
            icon: CircleCheckBig,
            color: 'bg-green-100 text-green-800 border-green-200',
            label: 'Done',
            iconColor: 'text-green-600'
          },
          archived: {
            icon: Archive,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            label: 'Archived',
            iconColor: 'text-gray-600'
          }
        }

        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.to_do
        const Icon = config.icon

        return (
          <Badge
            variant="outline"
            className={`${config.color} flex items-center gap-1 w-fit`}
          >
            <Icon className={`h-3 w-3 ${config.iconColor}`} />
            {config.label}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'Owner',
      header: 'Owner',
      cell: ({ row }) => {
        const owner = row.original.Owner
        return owner ? (
          <div className="text-sm">
            <span>
              {owner.firstName} {owner.lastName}
            </span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No owner</div>
        )
      }
    },
    {
      accessorKey: 'dates',
      header: 'Timeline',
      cell: ({ row }) => {
        const project = row.original
        const startDate = project.start
          ? new Date(project.start).toLocaleDateString()
          : null
        const endDate = project.end
          ? new Date(project.end).toLocaleDateString()
          : null

        return (
          <div className="text-sm">
            {startDate || endDate ? (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">
                  {startDate && endDate
                    ? `${startDate} - ${endDate}`
                    : startDate
                      ? `Start: ${startDate}`
                      : endDate
                        ? `End: ${endDate}`
                        : ''}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">No dates set</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const createdAt = new Date(row.original.createdAt).toLocaleDateString()
        return <div className="text-sm text-muted-foreground">{createdAt}</div>
      }
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className="flex items-center gap-2">
            <EditProjectDialog
              project={project}
              onProjectUpdated={handleProjectCreated}
            />
            <DeleteProjectDialog
              project={project}
              onProjectDeleted={handleProjectCreated}
            />
          </div>
        )
      }
    }
  ]

  // * Search and filter, then paginate
  const filteredProjects = projects.filter((project) => {
    const matchesStatus = !statusFilter || project.status === statusFilter
    const matchesGlobal =
      globalFilter.trim() === '' ||
      Object.values(project).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )
    return matchesStatus && matchesGlobal
  })

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <AuthLayout header="Projects">
      <div className="min-h-screen bg-background">
        <main className="p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="SEARCH PROJECTS..."
                className="w-full pl-8 focus-visible:ring-0"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {/* Add filter popover and add project dialog here */}
              <AddProjectDialog onProjectCreated={handleProjectCreated} />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center">
              <div className="loader">Loading projects...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="text-gray-500">No projects found</div>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <GenericTable
              data={paginatedProjects}
              columns={columns}
              selectedRows={selectedProjects}
              onToggleSelectRow={toggleSelectProject}
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
