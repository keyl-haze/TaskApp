'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  CircleDashed,
  Loader,
  CircleCheckBig,
  Archive,
  Package
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import GenericTable from '@/components/custom/genericTable'
import Pagination from '@/components/custom/utils/pagination'
import { type ColumnDef } from '@tanstack/react-table'
import AuthLayout from '@/app/layouts/authLayout'
import { PROJECT_API } from '@/routes/api/v1/project'
import { type Project } from '@/types/entities'
import AddProjectDialog from '@/components/custom/pages/projects/addDialog'
import EditProjectDialog from '@/components/custom/pages/projects/editDialog'
import DeleteProjectDialog from '@/components/custom/pages/projects/deleteDialog'
import FilterPopover, {
  FilterValue
} from '@/components/custom/pages/projects/filterPopover'
import RestoreProjectDialog from '@/components/custom/pages/projects/restoreDialog'

const PAGE_SIZE = 10

export default function ProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [filters, setFilters] = useState<FilterValue>({
    status: ['to_do', 'in_progress', 'done']
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // * Fetch projects from the API
  const fetchProjects = useCallback(
    async (searchValue = globalFilter, filterValue = filters) => {
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

        if (filterValue.status?.length && filterValue.status.length > 0) {
          url += `&filter[status][eq]=${encodeURIComponent(filterValue.status.join(','))}`
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
    [filters, globalFilter]
  )

  useEffect(() => {
    fetchProjects(globalFilter)
  }, [refreshFlag, globalFilter, fetchProjects])

  // * Reset to first page when projects change or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [projects.length, globalFilter])

  const handleProjectChange = () => setRefreshFlag((prev) => prev + 1)

  const toggleSelectProject = (projectId: number) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
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
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const project = row.original
        const isArchived = project.status === 'archived'
        return (
          <div className="flex items-center gap-2">
            {isArchived ? (
              <RestoreProjectDialog
                project={project}
                onProjectRestored={handleProjectChange}
              />
            ) : (
              <>
                <EditProjectDialog
                  project={project}
                  onProjectUpdated={handleProjectChange}
                />
                <DeleteProjectDialog
                  project={project}
                  onProjectDeleted={handleProjectChange}
                />
              </>
            )}
          </div>
        )
      }
    }
  ]

  // * Search and filter, then paginate
  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(project.status)
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
              <FilterPopover
                onFilterChange={(newFilters) => {
                  setFilters(newFilters)
                  fetchProjects(globalFilter)
                }}
                activeFilters={filters}
              />
              <AddProjectDialog onProjectCreated={handleProjectChange} />
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
              headerClassName="bg-gray-100/90 dark:bg-gray-800"
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </AuthLayout>
  )
}
