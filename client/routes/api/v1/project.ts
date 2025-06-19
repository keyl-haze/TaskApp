import API_V1_BASE from '@/routes/api/base'
import { API_ROUTES } from '@/types/api'

const PROJECT_BASE = `${API_V1_BASE}/projects`
export const PROJECT_API: API_ROUTES = {
  list: `${PROJECT_BASE}`,
  create: `${PROJECT_BASE}`,
  get: (id: string) => `${PROJECT_BASE}/${id}`,
  restore: (id: string) => `${PROJECT_BASE}/${id}/restore`,
  update: (id: string) => `${PROJECT_BASE}/${id}`,
  delete: (id: string) => `${PROJECT_BASE}/${id}`
}
