export interface User {
  id: number
  firstName: string
  middleName: string
  lastName: string
  username: string
  role: 'super_admin' | 'admin' | 'manager' | 'viewer'
  email: string
  deletedAt?: string | null
}

export interface Task {
  id: number
  title: string
  description: string
  type: 'bug' | 'feature' | 'task'
  priority: 'low' | 'medium' | 'high'
  status: 'to_do' | 'in_progress' | 'done' | 'archived'
  Project: {
    id: number
    title: string
  }
  Reporter: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }
  Assignee: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  } | null
  deletedAt: string | null
}

export interface Project {
  id: number
  code: string
  title: string
  description: string | null
  owner: number
  start: string | null
  end: string | null
  status: 'to_do' | 'in_progress' | 'done' | 'archived'
  originalStatus: 'to_do' | 'in_progress' | 'done' | 'archived' | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  Owner: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }
  Members?: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }[]
  ProjectAssignments?: {
    userId: number
    projectId: number
    createdAt: string
    updatedAt: string
  }[]
}
