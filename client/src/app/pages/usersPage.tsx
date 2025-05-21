"use client"

import AuthLayout from "../layouts/authLayout"
import { USER_API } from "../../../routes/user"
import type { User as UserType } from "@/../types/types"
import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Info, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import AddUser from "@/components/custom/pages/users/addDialog"

// Import shadcn data table components
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User extends UserType {
  name: string
  initials: string
  status: "Active" | "Offline" | "Wait"
  avatarSrc?: string
}

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(0)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // * Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(USER_API.list);
      const json = await res.json()
      if (json.status === "success") {
        // * Map the users to the frontend
        const mappedUsers: User[] = json.data.map((users: UserType) => ({
          ...users,
          name: `${users.firstName} ${users.lastName}`,
          initials: `${users.firstName[0] ?? ""}${users.lastName[0] ?? ""}`.toUpperCase(),
          status: "Active",
          avatarSrc: undefined,
        }))
        setUsers(mappedUsers)
      } else {
        setError(json.message || "Failed to fetch users")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to fetch users")
      } else {
        setError("Failed to fetch users")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [refreshFlag])

  const handleUserCreated = () => setRefreshFlag((prev) => prev + 1)

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  // Define columns for the data table
  const columns: ColumnDef<User>[] = [
    {
      id: "select",
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
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Users",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 text-primary">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.username}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original
        return (
          <Badge
            variant="outline"
            className={`rounded-full px-2 py-0.5 text-xs font-normal ${
              user.status === "Active"
                ? "bg-green-50 text-green-700 border-green-200"
                : user.status === "Wait"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {user.status === "Active" && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
            )}
            {user.status === "Wait" && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            )}
            {user.status === "Offline" && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gray-500"></span>
            )}
            {user.status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      id: "actions",
      cell: () => {
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Initialize the table
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, columnId, filterValue) => {
      return Object.values(row.original).some((value) =>
        String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      )
    }
  })

  return (
    <AuthLayout>
      <div className="min-h-screen bg-background">
        {/* Main content */}
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Users</h1>
          </div>

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
              <Button variant="outline" className="text-primary border-primary">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
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
          {!loading && !error && users.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="text-gray-500">No users found</div>
            </div>
          )}

          {/* Loaded table - now using shadcn data table */}
          {!loading && !error && users.length > 0 && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={selectedUsers.includes(row.original.id) ? "selected" : undefined}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink isActive>01</PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </AuthLayout>
  )
}
