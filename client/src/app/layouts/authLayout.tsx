"use client"

import type { ReactNode } from "react"
import { Search, HelpCircle, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthLayoutProps {
  children: ReactNode
  user?: {
    name: string
    title: string
    avatarUrl?: string
    initials?: string
  }
}

export default function AuthLayout({
  children,
  user = {
    name: "JOHN DOE",
    title: "TEAM LEAD",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    initials: "JD",
  },
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="SEARCH..." className="w-full bg-background pl-8 focus-visible:ring-0" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.title}</div>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6">{children}</main>
    </div>
  )
}
