'use client'

import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { UserRoundPlus } from 'lucide-react'

export default function AddUserDialog({onUserCreated}: { onUserCreated?: () => void }) {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  })
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  function isValidUsername(username: string) {
    return /^[a-zA-Z0-9_.]{5,}$/.test(username)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'username') {
      if (!isValidUsername(value)) {
        setUsernameError('Username must be 5+ characters, using letters, numbers, . or _')
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
    if (!isValidUsername(formData.username)) {
      setUsernameError('Username must be at least 5 characters, alphanumeric, and can only use _')
      return
    }
    setUsernameError(null)
    setLoading(true)
    try {
      const res = await fetch(USER_API.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (res.ok) {
        showSuccessToast('User created!')
        setFormData({
          username: '',
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          password: '',
          role: ''
        });
        if (onUserCreated) onUserCreated();
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
          showErrorToast(json.message || 'Failed to create user')
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorToast(err.message || 'Failed to create user')
      } else {
        showErrorToast('Failed to create user')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className='center'>
          <UserRoundPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1 pb-4">
            <DialogTitle className="text-xl font-semibold">
              Add User
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Enter user details to create a new account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle name (optional)"
                  />
                </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="accessRights">Access Rights</Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger id="role" className='w-full'>
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
            <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !!usernameError}>
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}