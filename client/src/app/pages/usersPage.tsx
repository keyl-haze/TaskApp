'use client'

import AuthLayout from '../layouts/authLayout'
import { USER_API } from '../../../routes/user'
import type { User as UserType } from '@/../types/types'
import { useState, useEffect } from 'react'
import { Search, MoreVertical, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import AddUser from '@/components/custom/pages/users/addDialog'
import GenericTable from '@/components/custom/utils/genericTable'
import { type ColumnDef } from '@tanstack/react-table'
import FilterPopover, {
  FilterValue
} from '@/components/custom/pages/users/filterTablePopover'
import EditUserDialog from '@/components/custom/pages/users/editDialog'

interface User extends UserType {
  name: string
  initials: string
  status: 'Active' | 'Offline' | 'Wait'
  avatarSrc?: string
}

const PAGE_SIZE = 10

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: string }[]
  >([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterValue>({})

  // * Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(USER_API.list)
      const json = await res.json()
      if (json.status === 'success') {
        // * Map the users to the frontend
        const mappedUsers: User[] = json.data.map((users: UserType) => ({
          ...users,
          name: `${users.firstName} ${users.lastName}`,
          initials:
            `${users.firstName[0] ?? ''}${users.lastName[0] ?? ''}`.toUpperCase(),
          status: 'Active',
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
  }

  useEffect(() => {
    fetchUsers()
  }, [refreshFlag])

  // * Reset to first page if users change, search, or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [users.length, globalFilter, filters.role, filters.status])

  const handleUserCreated = () => setRefreshFlag((prev) => prev + 1)

  const handleUserUpdated = () => {
    setRefreshFlag((prev) => prev + 1)
  }

  // * Search and filter, then paginate
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      globalFilter.trim() === '' ||
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )

    const matchesRole =
      !filters.role ||
      filters.role.length === 0 ||
      filters.role.includes(user.role)
    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.includes(user.status)

    return matchesSearch && matchesRole && matchesStatus
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

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id))
    }
  }

  // * Columns for the data table
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getFilteredRowModel().rows.length > 0 &&
            selectedUsers.length === table.getFilteredRowModel().rows.length
          }
          onCheckedChange={toggleSelectAll}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedUsers.includes(row.original.id)}
          onCheckedChange={() => toggleSelectUser(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
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
        return (
          <Badge
            variant="outline"
            className={`rounded-full px-2 py-0.5 text-xs font-normal ${
              user.status === 'Active'
                ? 'bg-green-50 text-green-700 border-green-200'
                : user.status === 'Wait'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {user.status === 'Active' && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
            )}
            {user.status === 'Wait' && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            )}
            {user.status === 'Offline' && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gray-500"></span>
            )}
            {user.status}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const roleMap: Record<string, string> = {
          super_admin: 'Super Admin',
          admin: 'Admin',
          manager: 'Manager',
          viewer: 'Viewer'
        }
        return roleMap[row.original.role] || row.original.role
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
            <EditUserDialog user={user} onUserUpdated={handleUserUpdated} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8  text-red-500 hover:text-red-400 cursor-pointer"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
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
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <FilterPopover
                onFilterChange={setFilters}
                activeFilters={filters}
              />
              <AddUser onUserCreated={handleUserCreated} />
              <Button variant="outline" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
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
              onToggleSelectAll={toggleSelectAll}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}

          {/* Pagination */}
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
                    {/* Renders < */}
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
                    {/* Renders > */}
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
