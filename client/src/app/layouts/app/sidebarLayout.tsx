'use client'

import {
  HelpCircle,
  Settings,
  Users,
  ListChecks,
  Rocket,
  LayoutDashboard,
  CheckCheck
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { logout } from '@/lib/actions/auth'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { User } from '@/types/entities'
import { USER_API } from '@/routes/api/v1/user'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    color: 'text-'
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: ListChecks
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: Rocket
  }
]

const supportItems = [
  {
    title: 'Help Center',
    url: '#',
    icon: HelpCircle
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

// Fetch user details from  API
async function fetchUserDetails(id: string): Promise<User | null> {
  const res = await fetch(USER_API.get(String(id)))
  if (!res.ok) return null
  const data = await res.json()
  //console.log('Fetched user:', data)
  return data.data as User
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  viewer: 'Viewer'
}

export default function SidebarLayout() {
  const { data: session, status } = useSession()
  //console.log('Session:', session)
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true)
      fetchUserDetails(String(session.user.id)).then((data) => {
        setUserDetails(data)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [session?.user?.id])

  //  * sign out user if session is unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      signOut({ callbackUrl: '/' })
    }
  }, [status])

  if (status === 'loading' || loading) {
    return <div>Loading...</div>
  }

  // Prefer fetched user details for role and name
  const user = userDetails
    ? {
        name:
          [userDetails.firstName, userDetails.lastName]
            .filter(Boolean)
            .join(' ') ||
          userDetails.username ||
          'Unknown User',
        title:
          roleLabels[userDetails.role as keyof typeof roleLabels] ||
          userDetails.role ||
          'Member',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        initials: (
          [userDetails.firstName, userDetails.lastName]
            .filter(Boolean)
            .map((n) => n[0])
            .join('') || 'UU'
        ).toUpperCase()
      }
    : {
        name: 'Unknown User',
        title: 'Member',
        avatarUrl: '/placeholder.svg?height=40&width=40',
        initials: 'UU'
      }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a className="font-semibold">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500 text-sidebar-primary-foreground">
                  <CheckCheck className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Task App</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={`${user.name} - ${user.title}`}
                >
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage
                      src={user.avatarUrl || '/placeholder.svg'}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.title}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left"
                  >
                    Sign Out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
