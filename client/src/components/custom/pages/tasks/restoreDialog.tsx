'use client'

import { Task as TaskType } from '@/types/types'
import { TASK_API } from '@/routes/task'
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
import { Info, RotateCcw, UserCheck } from 'lucide-react'
import { useState } from 'react'

interface RestoreTaskDialogProps {
  task: TaskType
  onTaskRestored?: () => void
}

export default function RestoreTaskDialog({
  task,
  onTaskRestored
}: RestoreTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRestore = async () => {
    setLoading(true)
    try {
      const res = await fetch(TASK_API.restore(String(task.id)), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      const json = await res.json()
      if (res.ok) {
        showSuccessToast('Task restored successfully!')
        if (onTaskRestored) onTaskRestored()
        setOpen(false)
      } else {
        showErrorToast(json.message || 'Failed to restore task')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message || 'Failed to restore task')
      } else {
        showErrorToast('Failed to restore task')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/20 transition-colors"
                onClick={() => setOpen(true)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restore task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                Restore Task
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                Restore this task.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="py-4">
          <AlertDialogDescription className="text-sm">
            Are you sure you want to restore{' '}
            <span className="font-semibold text-foreground">{task.title}</span>
            &apos;s account?
          </AlertDialogDescription>
          <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-emerald-800 dark:text-emerald-200">
                <p className="font-medium">This will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                  <li>Reactivate the task</li>
                  <li>Restore task to the system</li>
                  <li>Make the task details visible again</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRestore}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Restoring...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Restore
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
