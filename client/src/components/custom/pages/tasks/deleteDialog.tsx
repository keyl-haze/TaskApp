'use client'

import { TASK_API } from '@/routes/api/v1/task'
import { Task } from '@/types/entities'
import { useState } from 'react'
import {
  showErrorToast,
  showSuccessToast
} from '@/components/custom/utils/errorSonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface DeleteTaskDialogProps {
  task: Task
  onTaskDeleted?: () => void
}

export default function DeleteTaskDialog({
  task,
  onTaskDeleted
}: DeleteTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!task) return

    setLoading(true)

    try {
      const res = await fetch(TASK_API.delete(String(task.id)), {
        method: 'DELETE'
      })
      const json = await res.json()

      if (res.ok) {
        showSuccessToast('Task deleted successfully!')
        if (onTaskDeleted) onTaskDeleted()
        setOpen(false)
      } else {
        showErrorToast(json.message || 'Failed to delete task')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorToast(err.message || 'Failed to delete task')
      } else {
        showErrorToast('Failed to delete task')
      }
    } finally {
      setLoading(false)
    }
  }

  const taskName = `${task.title}`.trim()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 transition-colors"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Trash</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                Move Task to Trash
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone easily.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="py-4">
          <AlertDialogDescription className="text-sm">
            Are you sure you want to move{' '}
            <span className="font-semibold text-foreground">{taskName}</span> to
            the trash?
          </AlertDialogDescription>
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">This will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                  <li>Soft delete the task (can be restored later)</li>
                  <li>Preserve their data for potential restoration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Remove
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
