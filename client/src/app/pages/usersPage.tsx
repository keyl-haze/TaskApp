'use client'

import AuthLayout from '../layouts/authLayout'
import { USER_API } from '../../../routes/user'
import { User as UserType } from '@/../types/types'
import { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Info, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'

interface User extends UserType {
  name: string
  initials: string
  status: 'Active' | 'Offline' | 'Wait'
  avatarSrc?: string
}

export default function UsersPage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)

      // * Fetch users from the API
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
    fetchUsers()
  }, [])

  const toggleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

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
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-primary border-primary">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">Add user</Button>
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

          {/* Loaded table */}
          {!loading && !error && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
