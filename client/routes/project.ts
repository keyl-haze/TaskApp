const API_BASE = 'http://localhost:8080/api/v1/projects'

export const PROJECT_API = {
  list: `${API_BASE}`,
  create: `${API_BASE}`,
  get: (id: string) => `${API_BASE}/${id}`,
  restore: (id: string) => `${API_BASE}/${id}/restore`,
  update: (id: string) => `${API_BASE}/${id}`,
  delete: (id: string) => `${API_BASE}/${id}`
}
