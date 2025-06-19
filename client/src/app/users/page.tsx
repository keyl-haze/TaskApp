'use client'

import AuthLayout from '@/app/layouts/authLayout'
import { USER_API } from '@/routes/api/v1/user'
import type { User as UserType } from '@/types/entities'
import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import AddUser from '@/components/custom/pages/users/addDialog'
import GenericTable from '@/components/custom/genericTable'
import Pagination from '@/components/custom/pagination'
import { type ColumnDef } from '@tanstack/react-table'
import FilterPopover, {
  FilterValue
} from '@/components/custom/pages/users/filterTablePopover'
import EditUserDialog from '@/components/custom/pages/users/editDialog'
import DeleteUserDialog from '@/components/custom/pages/users/deleteDialog'
import RestoreUserDialog from '@/components/custom/pages/users/restoreDialog'

interface User extends UserType {
  name: string
  initials: string
  status: 'Active' | 'Inactive' | 'Wait'
  avatarSrc?: string
}

const PAGE_SIZE = 10

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [globalFilter, setGlobalFilter] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterValue>({
    status: ['Active'],
    role: []
  })

  // * Fetch users from the API
  const fetchUsers = useCallback(
    async (searchValue = globalFilter, filterValue = filters) => {
      setLoading(true)
      setError(null)
      try {
        let url = `${USER_API.list}?all=true`
        if (searchValue.trim()) {
          const encoded = encodeURIComponent(searchValue.trim())
          url +=
            `&filter[firstName][iLike]=${encoded}` +
            `&filter[lastName][iLike]=${encoded}` +
            `&filter[email][iLike]=${encoded}` +
            `&filter[username][iLike]=${encoded}`
        }
        if (filterValue.role && filterValue.role.length > 0) {
          url += `&filter[role][eq]=${encodeURIComponent(filterValue.role.join(','))}`
        }
        if (filterValue.status && filterValue.status.length > 0) {
          url += `&filter[status][eq]=${encodeURIComponent(filterValue.status.join(','))}`
        }
        const res = await fetch(url)
        const json = await res.json()
        if (json.status === 'success') {
          // * Map the users to the frontend
          const mappedUsers: User[] = json.data.map((users: UserType) => ({
            ...users,
            name: `${users.firstName} ${users.lastName}`,
            initials:
              `${users.firstName[0] ?? ''}${users.lastName[0] ?? ''}`.toUpperCase(),
            status: users.deletedAt ? 'Inactive' : 'Active',
            avatarSrc: undefined
          }))
          setUsers(mappedUsers)
        } else {
          setError(json.message || 'Failed to fetch users')
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || 'Failed to fetch users')
        } else {
          setError('Failed to fetch users')
        }
      } finally {
        setLoading(false)
      }
    },
    [filters, globalFilter]
  )

  useEffect(() => {
    fetchUsers(globalFilter)
  }, [refreshFlag, fetchUsers, globalFilter])

  const handleUserChange = () => setRefreshFlag((prev) => prev + 1)

  // * Search and filter, then paginate
  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      globalFilter.trim() === '' ||
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )

    // Role filter
    const roleMatch = !filters.role?.length || filters.role.includes(user.role)

    // Status filter
    let statusMatch = true
    if (filters.status?.length) {
      statusMatch = filters.status.some((status) => {
        if (status === 'Active') return !user.deletedAt
        if (status === 'Inactive') return !!user.deletedAt
        if (status === 'Wait') return user.status === 'Wait'
        return false
      })
    }

    return matchesSearch && roleMatch && statusMatch
  })

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  // * Columns for the data table
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Users',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 text-primary">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">
                {user.username}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const user = row.original
        const statusConfig = {
          Active: {
            variant: 'default' as const,
            className:
              'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
            dotColor: 'bg-emerald-500',
            icon: '●'
          },
          Wait: {
            variant: 'secondary' as const,
            className:
              'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
            dotColor: 'bg-amber-500',
            icon: '●'
          },
          Inactive: {
            variant: 'outline' as const,
            className:
              'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
            dotColor: 'bg-slate-400',
            icon: '●'
          }
        }

        const config = statusConfig[user.status]

        return (
          <Badge
            variant={config.variant}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${config.className}`}
          >
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${config.dotColor}`}
            ></span>
            {user.status}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const roleConfig: Record<
          string,
          {
            label: string
            className: string
            variant: 'default' | 'secondary' | 'outline'
          }
        > = {
          super_admin: {
            label: 'Super Admin',
            className:
              'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
            variant: 'outline'
          },
          admin: {
            label: 'Admin',
            className:
              'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
            variant: 'outline'
          },
          manager: {
            label: 'Manager',
            className:
              'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
            variant: 'outline'
          },
          viewer: {
            label: 'Viewer',
            className:
              'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
            variant: 'outline'
          }
        }

        const config = roleConfig[row.original.role] || {
          label: row.original.role,
          className: 'bg-gray-50 text-gray-600 border-gray-200',
          variant: 'outline' as const
        }

        return (
          <Badge
            variant={config.variant}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${config.className}`}
          >
            {config.label}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'email',
      header: 'E-mail'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-items-center">
            {user.status === 'Inactive' ? (
              <RestoreUserDialog
                user={user}
                onUserRestored={handleUserChange}
              />
            ) : (
              <>
                <EditUserDialog user={user} onUserUpdated={handleUserChange} />
                <DeleteUserDialog
                  user={user}
                  onUserDeleted={handleUserChange}
                />
              </>
            )}
          </div>
        )
      }
    }
  ]

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <AuthLayout header="Users">
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
                onChange={(e) => {
                  setGlobalFilter(e.target.value)
                  setRefreshFlag((prev) => prev + 1)
                }}
              />
            </div>
            <div className="flex gap-2">
              <FilterPopover
                activeFilters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters)
                  fetchUsers(globalFilter, newFilters)
                }}
              />
              <AddUser onUserCreated={handleUserChange} />
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center">
              <div className="loader"> Loading users...</div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {/* Empty table */}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="text-gray-500">No users found</div>
            </div>
          )}

          {/* Loaded table */}
          {!loading && !error && filteredUsers.length > 0 && (
            <GenericTable
              data={paginatedUsers}
              columns={columns}
              selectedRows={selectedUsers}
              onToggleSelectRow={toggleSelectUser}
              headerClassName={'bg-gray-100/90 dark:bg-gray-800'}
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
