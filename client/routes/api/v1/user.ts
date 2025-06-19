import API_V1_BASE from '@/routes/api/base';
import { API_ROUTES } from '@/types/api';

const USER_BASE = `${API_V1_BASE}/users`;
export const USER_API: API_ROUTES = {
  list: `${USER_BASE}`,
  create: `${USER_BASE}`,
  get: (id: string) => `${USER_BASE}/${id}`,
  restore: (id: string) => `${USER_BASE}/${id}/restore`,
  update: (id: string) => `${USER_BASE}/${id}`,
  delete: (id: string) => `${USER_BASE}/${id}`
}
