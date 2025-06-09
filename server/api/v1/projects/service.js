const { Project, ProjectUser, User } = require(`${__serverRoot}/models`);
const { getByField } = require('../utils/projects');

const create = async (userQuery) => {
  const { title, owner, code, description, start, end, status, originalStatus } = userQuery;
  if (!title) {
    const error = new Error('Project name is required');
    error.status = 400;
    throw error;
  }

  const projectNameExists = await getByField(Project, 'title', title);
  if (projectNameExists) {
    const error = new Error('Project name already exists');
    error.name = 'ProjectNameExistsError';
    error.status = 400;
    error.message = 'Project name already exists';
    throw error;
  }
  // Check if project code exists
  if (code) {
    const projectCodeExists = await getByField(Project, 'code', code);
    if (projectCodeExists) {
      const error = new Error('Project code already exists');
      error.name = 'ProjectCodeExistsError';
      error.status = 400;
      throw error;
    }
  }
  const project = await Project.create({
    title,
    owner,
    code,
    description,
    start,
    end,
    status,
    originalStatus
  });
  return project;
};

const getProjectsByOwner = async (ownerId) => {
  return Project.findAll({ where: { owner: ownerId } });
};

const assignUserToProject = async (query) => {
  const { id, userId } = query;
  return ProjectUser.create({ projectId: id, userId });
};

const listProjectUsers = async (projectId) => {
  const projectUsers = await User.findAll({
    include: [
      {
        model: Project,
        through: ProjectUser,
        where: { id: projectId },
        attributes: []
      }
    ]
  });
  return projectUsers;
};
module.exports = {
  assignUserToProject,
  listProjectUsers,
  create,
  getProjectsByOwner
};
