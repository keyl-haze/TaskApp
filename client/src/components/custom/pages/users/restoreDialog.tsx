'use client'

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
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { USER_API } from '@/../routes/user'
import { showErrorToast, showSuccessToast } from '../../utils/errorSonner'
import { RotateCcw, UserCheck, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { User as UserType } from '@/../types/types'

interface RestoreUserDialogProps {
  user: UserType & { name: string; initials: string }
  onUserRestored?: () => void
}

export default function RestoreUserDialog({
  user,
  onUserRestored
}: RestoreUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRestore = async () => {
    setLoading(true)
    try {
      const res = await fetch(USER_API.restore(String(user.id)), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      const json = await res.json()
      if (res.ok) {
        showSuccessToast('User restored successfully!')
        if (onUserRestored) onUserRestored()
        setOpen(false)
      } else {
        showErrorToast(json.message || 'Failed to restore user')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message || 'Failed to restore user')
      } else {
        showErrorToast('Failed to restore user')
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
            <TooltipContent side="top">
              <p>Restore user account</p>
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
                Restore User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                Reactivate this user account.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="py-4">
          <AlertDialogDescription className="text-sm">
            Are you sure you want to restore{' '}
            <span className="font-semibold text-foreground">{user.name}</span>
            &apos;s account?
          </AlertDialogDescription>
          <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-emerald-800 dark:text-emerald-200">
                <p className="font-medium">This will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
                  <li>Reactivate the user account</li>
                  <li>Restore their access to the system</li>
                  <li>Make their profile visible again</li>
                  <li>Allow them to log in immediately</li>
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
