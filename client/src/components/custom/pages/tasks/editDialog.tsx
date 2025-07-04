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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Pencil,
  Bug,
  CheckSquare,
  UserRound,
  Sparkles,
  CircleDashed,
  Loader,
  CircleCheckBig,
  Package
} from 'lucide-react'
import { TASK_API } from '@/routes/api/v1/task'
import { USER_API } from '@/routes/api/v1/user'
import { PROJECT_API } from '@/routes/api/v1/project'
import {
  showErrorToast,
  showSuccessToast
} from '@/components/custom/utils/errorSonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { User, Task } from '@/types/entities'

interface EditTaskDialogProps {
  task: Task
  onTaskUpdated?: () => void
  trigger?: React.ReactNode
}

interface FormData {
  title: string
  description: string
  type: 'bug' | 'feature' | 'task'
  priority: 'low' | 'medium' | 'high'
  status: 'to_do' | 'in_progress' | 'done' | 'archived'
  reporter: string
  assignee: string
  project?: number
}

interface TypeOption {
  value: 'bug' | 'feature' | 'task'
  label: string
  icon: React.ElementType
  color: string
}

interface PriorityOption {
  value: 'low' | 'medium' | 'high'
  label: string
  color: string
}

interface StatusOption {
  value: 'to_do' | 'in_progress' | 'done' | 'archived'
  icon?: React.ElementType
  label: string
  textColor: string
}

interface ProjectOption {
  id: number
  title: string
}

const typeOptions: TypeOption[] = [
  { value: 'bug', label: 'Bug', icon: Bug, color: 'text-red-600' },
  {
    value: 'feature',
    label: 'Feature',
    icon: Sparkles,
    color: 'text-purple-600'
  },
  { value: 'task', label: 'Task', icon: CheckSquare, color: 'text-blue-600' }
]

const priorityOptions: PriorityOption[] = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' }
]

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

export default function EditTaskDialog({
  task,
  onTaskUpdated
}: EditTaskDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    status: 'to_do',
    reporter: '',
    assignee: 'unassigned',
    project: task.Project ? task.Project.id : undefined
  })
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  // Initialize form data when task prop changes or dialog opens
  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        type: task.type || 'task',
        priority: task.priority || 'medium',
        status: task.status || 'to_do',
        reporter: task.Reporter?.id?.toString() || '',
        assignee: task.Assignee?.id
          ? task.Assignee.id.toString()
          : 'unassigned',
        project: task.Project ? task.Project.id : undefined
      })
    }
  }, [task, open])

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true)
      try {
        const res = await fetch(`${PROJECT_API.list}?all=true`)
        const data = await res.json()
        if (data.status === 'success' && Array.isArray(data.data)) {
          setProjects(
            data.data
              .filter(
                (p: { id?: unknown; title?: unknown }) =>
                  typeof p.id === 'number' && typeof p.title === 'string'
              )
              .map((p: { id: number; title: string }) => ({
                id: p.id,
                title: p.title
              }))
          )
        }
      } catch (error) {
        console.error('Fetch projects error:', error)
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch(USER_API.list)
      const data = await res.json()

      if (data.status === 'success') {
        setUsers(data.data)
      } else {
        showErrorToast('Failed to fetch users')
      }
    } catch (error) {
      console.error('Fetch users error:', error)
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

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [updateMode] = useState<'PATCH' | 'PUT'>('PATCH')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      showErrorToast('Title is required')
      return
    }

    if (!formData.reporter) {
      showErrorToast('Reporter is required')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        reporter: Number.parseInt(formData.reporter),
        assignee:
          formData.assignee === 'unassigned'
            ? null
            : Number.parseInt(formData.assignee)
      }

      const res = await fetch(TASK_API.update(String(task.id)), {
        method: updateMode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        showSuccessToast('Task updated successfully')
        onTaskUpdated?.()
        handleClose()
      } else {
        showErrorToast(data.message || 'Failed to update task')
      }
    } catch (error) {
      console.error('Update task error:', error)
      showErrorToast('An error occurred while updating the task')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8  text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/20 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Edit Task</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Edit Task</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the task details below to modify the existing task
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive task title"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide additional details about the task"
                className="min-h-[100px] resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleSelectChange('type', value as FormData['type'])
                  }
                >
                  <SelectTrigger id="type" className="h-10 w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange(
                      'priority',
                      value as FormData['priority']
                    )
                  }
                >
                  <SelectTrigger id="priority" className="h-10 w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${option.color}`}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange('status', value as FormData['status'])
                }
              >
                <SelectTrigger id="status" className="h-10 w-full">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporter" className="text-sm font-medium">
                  Reporter <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.reporter}
                  onValueChange={(value) =>
                    handleSelectChange('reporter', value)
                  }
                  required
                  disabled={loadingUsers}
                >
                  <SelectTrigger id="reporter" className="h-10 w-full">
                    <SelectValue
                      placeholder={
                        loadingUsers ? 'Loading users...' : 'Select reporter'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-[250px]">
                    {users.map((user) => {
                      const initials =
                        `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
                      return (
                        <SelectItem
                          key={`reporter-${user.id}`}
                          value={user.id.toString()}
                        >
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

              <div className="space-y-2">
                <Label htmlFor="assignee" className="text-sm font-medium">
                  Assignee
                </Label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value) =>
                    handleSelectChange('assignee', value)
                  }
                  disabled={loadingUsers}
                >
                  <SelectTrigger id="assignee" className="h-10 w-full">
                    <SelectValue
                      placeholder={
                        loadingUsers
                          ? 'Loading users...'
                          : 'Select assignee (optional)'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-[250px]">
                    <SelectItem value="unassigned">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <UserRound className="h-3 w-3 text-gray-400" />
                        </div>
                        <span className="text-muted-foreground">
                          Unassigned
                        </span>
                      </div>
                    </SelectItem>
                    {users.map((user) => {
                      const initials =
                        `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
                      return (
                        <SelectItem
                          key={`assignee-${user.id}`}
                          value={user.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-medium">
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project" className="text-sm font-medium">
                Assign to Project
              </Label>
              <Select
                value={formData.project ? String(formData.project) : 'none'}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    project: value === 'none' ? undefined : Number(value)
                  }))
                }
                disabled={loadingProjects}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue
                    placeholder={
                      loadingProjects ? 'Loading projects...' : 'Select Project'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">
                      Select Project
                    </span>
                  </SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      <Package className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[100px]">
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
