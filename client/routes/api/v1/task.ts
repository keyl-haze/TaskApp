import API_V1_BASE from '@/routes/api/base';
import { API_ROUTES } from '@/types/api';

const TASK_BASE = `${API_V1_BASE}/tasks`;
export const TASK_API: API_ROUTES = {
  list: `${TASK_BASE}`,
  create: `${TASK_BASE}`,
  get: (id: string) => `${TASK_BASE}/${id}`,
  restore: (id: string) => `${TASK_BASE}/${id}/restore`,
  update: (id: string) => `${TASK_BASE}/${id}`,
  delete: (id: string) => `${TASK_BASE}/${id}`
}
