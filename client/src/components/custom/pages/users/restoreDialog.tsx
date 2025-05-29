"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { USER_API } from "@/../routes/user"
import { showErrorToast, showSuccessToast } from "../../utils/errorSonner"
import { Trash, RotateCcw, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User as UserType } from "@/../types/types"
import { Input } from "@/components/ui/input"

interface DeletedUser extends UserType {
  name: string
  initials: string
}

export default function RestoreUserDialog({
  onUserRestored,
}: {
  onUserRestored?: () => void
}) {
  const [deletedUsers, setDeletedUsers] = useState<DeletedUser[]>([])
  const [loading, setLoading] = useState(false)
  const [restoringId, setRestoringId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const fetchDeletedUsers = async () => {
    setLoading(true)
    try {
      // Assuming there's an API endpoint to fetch soft-deleted users
      const res = await fetch(`${USER_API.list}?deleted=true`)
      const json = await res.json()
      if (json.status === "success") {
        // Map the users to the frontend format
        const mappedUsers: DeletedUser[] = json.data.map((user: UserType) => ({
          ...user,
          name: `${user.firstName} ${user.lastName}`,
          initials: `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase(),
        }))
        setDeletedUsers(mappedUsers)
      } else {
        showErrorToast(json.message || "Failed to fetch deleted users")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message || "Failed to fetch deleted users")
      } else {
        showErrorToast("Failed to fetch deleted users")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchDeletedUsers()
    }
  }, [open])

  const handleRestore = async (userId: number) => {
    setRestoringId(userId)
    try {
      const res = await fetch(USER_API.restore(String(userId)), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      })
      const json = await res.json()
      if (res.ok) {
        showSuccessToast("User restored successfully!")
        // Remove the restored user from the list
        setDeletedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
        if (onUserRestored) onUserRestored()
      } else {
        showErrorToast(json.message || "Failed to restore user")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message || "Failed to restore user")
      } else {
        showErrorToast("Failed to restore user")
      }
    } finally {
      setRestoringId(null)
    }
  }

const roleMap: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  viewer: 'Viewer'
};

const filteredUsers = deletedUsers.filter(user => {
  const q = search.toLowerCase()
  return (
    user.name.toLowerCase().includes(q) ||
    user.username.toLowerCase().includes(q) ||
    user.email.toLowerCase().includes(q) ||
    (roleMap[user.role] || user.role).toLowerCase().includes(q)
  )
})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restore Deleted Users</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-1 pb-4">
          <DialogTitle className="text-xl font-semibold">Restore Deleted Users</DialogTitle>
          <DialogDescription className="text-gray-500">View and restore users that have been deleted</DialogDescription>
        </DialogHeader>

        {/* --- Search Bar --- */}
        <div className="mb-4">
          <Input
            placeholder="Search deleted users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Trash className="h-12 w-12 mb-2 opacity-30" />
              <p>No deleted users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 text-primary">
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.username} • {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                      {roleMap[user.role] || user.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(user.id)}
                      disabled={restoringId === user.id}
                    >
                      {restoringId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <RotateCcw className="h-4 w-4 mr-1" />
                      )}
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
