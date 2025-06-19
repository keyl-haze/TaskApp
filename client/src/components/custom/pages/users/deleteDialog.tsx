'use client'

import { AlertDialogTrigger } from '@/components/ui/alert-dialog'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { USER_API } from '@/routes/api/v1/user'
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
import { Trash2, AlertTriangle } from 'lucide-react'
import { type User } from '@/types/entities'

interface DeleteUserDialogProps {
  user: User
  onUserDeleted?: () => void
}

export default function DeleteUserDialog({
  user,
  onUserDeleted
}: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!user) return

    setLoading(true)

    try {
      const res = await fetch(USER_API.delete(String(user.id)), {
        method: 'DELETE'
      })
      const json = await res.json()

      if (res.ok) {
        showSuccessToast('User deleted successfully!')
        if (onUserDeleted) onUserDeleted()
        setOpen(false)
      } else {
        showErrorToast(json.message || 'Failed to delete user')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showErrorToast(err.message || 'Failed to delete user')
      } else {
        showErrorToast('Failed to delete user')
      }
    } finally {
      setLoading(false)
    }
  }

  const userName = `${user.firstName} ${user.lastName}`.trim()

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
            <TooltipContent>Remove User</TooltipContent>
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
                Remove User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone easily.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="py-4">
          <AlertDialogDescription className="text-sm">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-foreground">{userName}</span>?
          </AlertDialogDescription>
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">This will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                  <li>Soft delete the user (can be restored later)</li>
                  <li>Revoke their access to the system immediately</li>
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
