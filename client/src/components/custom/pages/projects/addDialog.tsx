'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { PROJECT_API } from '@/routes/api/v1/project'
import {
  showErrorToast,
  showSuccessToast
} from '@/components/custom/utils/errorSonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Calendar, PackagePlus } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { USER_API } from '@/routes/api/v1/user'
import { CircleDashed, Loader, CircleCheckBig } from 'lucide-react'
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'

interface AddProjectDialogProps {
  onProjectCreated?: () => void
}

interface FormData {
  title: string
  code: string
  description: string
  owner: string
  start?: string
  end?: string
  status: 'to_do' | 'in_progress' | 'done' | 'archived'
}

interface User {
  id: number
  username: string
  firstName?: string
  lastName?: string
}

const initialFormData: FormData = {
  title: '',
  code: '',
  description: '',
  owner: '',
  start: undefined,
  end: undefined,
  status: 'to_do'
}

interface StatusOption {
  value: 'to_do' | 'in_progress' | 'done' | 'archived'
  icon?: React.ElementType
  label: string
  textColor: string
}

export default function AddProjectDialog({
  onProjectCreated
}: AddProjectDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    if (open) fetchUsers()
  }, [open])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch(USER_API.list)
      const data = await res.json()
      if (data.status === 'success') setUsers(data.data)
      else showErrorToast('Failed to fetch users')
    } catch (error) {
      console.error('Create project error:', error)
      showErrorToast('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, value: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value.toISOString() : undefined
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showErrorToast('Title is required')
      return
    }
    if (!formData.code.trim()) {
      showErrorToast('Code is required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...formData
      }
      const res = await fetch(PROJECT_API.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        showSuccessToast('Project created successfully')
        onProjectCreated?.()
        handleClose()
      } else {
        showErrorToast(data.message || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      showErrorToast('An error occurred while creating the project')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFormData(initialFormData)
  }

  const statusOptions: StatusOption[] = [
    {
      value: 'to_do',
      label: 'To Do',
      icon: CircleDashed,
      textColor: 'text-slate-600'
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      icon: Loader,
      textColor: 'text-blue-600'
    },
    {
      value: 'done',
      label: 'Done',
      icon: CircleCheckBig,
      textColor: 'text-green-600'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <PackagePlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Add New Project</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="w-full"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Project Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. PRJ-001"
                  className="w-full"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner" className="text-sm font-medium">
                  Owner
                </Label>
                <Select
                  value={formData.owner}
                  onValueChange={(value) => handleSelectChange('owner', value)}
                  disabled={loadingUsers}
                  required
                >
                  <SelectTrigger id="owner" className="w-full">
                    <SelectValue
                      placeholder={
                        loadingUsers ? 'Loading users...' : 'Select owner'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-[250px]">
                    {users.map((user) => {
                      const initials =
                        `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
                      return (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                              {initials || user.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <span className="font-medium">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                ({user.username})
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.start && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.start
                          ? format(new Date(formData.start), 'PPP')
                          : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          formData.start ? new Date(formData.start) : undefined
                        }
                        onSelect={(date) => handleDateChange('start', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.end && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.end
                          ? format(new Date(formData.end), 'PPP')
                          : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          formData.end ? new Date(formData.end) : undefined
                        }
                        onSelect={(date) => handleDateChange('end', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {Icon && (
                              <Icon className={`h-4 w-4 ${option.textColor}`} />
                            )}
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the project..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <span className="animate-spin">◌</span>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
