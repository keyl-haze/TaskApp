import { PROJECT_API } from '@/routes/api/v1/project'
import { TASK_API } from '@/routes/api/v1/task'
import { USER_API } from '@/routes/api/v1/user'

const API_V1 = {
  projects: PROJECT_API,
  tasks: TASK_API,
  users: USER_API
}

export default API_V1
