'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { USER_API } from '@/../routes/user'
import { showErrorToast, showSuccessToast } from '../../utils/errorSonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Pencil } from 'lucide-react'

interface User {
  id: number
  username: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  role: string
}

export default function EditUserDialog({
  user,
  onUserUpdated
}: {
  user: User
  onUserUpdated?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    role: ''
  })

  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Populate form when user changes
  useEffect(() => {
    if (open && user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || ''
      })
    }
  }, [open, user])

  function isValidUsername(username: string) {
    return /^[a-zA-Z0-9_.]{5,}$/.test(username)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'username') {
      if (!isValidUsername(value)) {
        setUsernameError(
          'Username must be 5+ characters, using letters, numbers, . or _'
        )
      } else {
        setUsernameError(null)
      }
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!isValidUsername(formData.username)) {
      setUsernameError(
        'Username must be at least 5 characters, alphanumeric, and can only use _'
      )
      return
    }

    setUsernameError(null)
    setLoading(true)

    try {
      type FormDataKey = keyof typeof formData
      const changedFields = (Object.keys(formData) as FormDataKey[]).reduce(
        (acc, key) => {
          if (formData[key] !== user[key]) acc[key] = formData[key]
          return acc
        },
        {} as Partial<typeof formData>
      )

      const method =
        Object.keys(changedFields).length < Object.keys(formData).length
          ? 'PATCH'
          : 'PUT'

      // * For checking what request is being sent
      //console.log("Updating user with method:", method, "and data:", method === "PATCH" ? changedFields : formData);

      const res = await fetch(USER_API.update(String(user.id)), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()

      if (res.ok) {
        showSuccessToast('User updated successfully!')
        if (onUserUpdated) onUserUpdated()
        setTimeout(() => {
          setOpen(false)
        }, 1000)
      } else {
        if (
          json.error &&
          typeof json.error === 'string' &&
          json.error.toLowerCase().includes('username')
        ) {
          setUsernameError(json.error)
        } else {
          showErrorToast(json.message || 'Failed to update user')
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorToast(err.message || 'Failed to update user')
      } else {
        showErrorToast('Failed to update user')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/20 transition-colors"
                onClick={() => setOpen(true)}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit User</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1 pb-4">
            <DialogTitle className="text-xl font-semibold">
              Edit User
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
              {usernameError && (
                <span className="text-red-500 text-xs">{usernameError}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-firstName">First Name</Label>
              <Input
                id="edit-firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-middleName">Middle Name</Label>
                <Input
                  id="edit-middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle name (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="edit-role">Access Rights</Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger id="edit-role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !!usernameError}>
              {loading ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
