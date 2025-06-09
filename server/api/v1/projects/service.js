const { get } = require("../users/service");

const { Project, ProjectUser, User } = require(`${__serverRoot}/models`);

const create = async (userQuery) => {
  const { title, owner, code } = userQuery;
  if (!title) {
    const error = new Error('Project name is required');
    error.status = 400;
    throw error;
  }

  const projectNameExists = await getByField('title', title);
  if (projectNameExists) {
    const error = new Error('Project name already exists');
    error.title = 'ProjectNameExistsError';
    error.status = 400;
    error.message = 'Project name already exists';
    throw error;
  }
  // Check if project code exists
  if (code) {
    const projectCodeExists = await getByField('code', code);
    if (projectCodeExists) {
      const error = new Error('Project code already exists');
      error.title = 'ProjectCodeExistsError';
      error.status = 400;
      throw error;
    }
  }
  const project = await Project.create({ title, owner, code });
  return project;
};
const getProjectsByOwner = async (ownerId) => {
  return Project.findAll({ where: { owner: ownerId } });
};

/**
 * Get a project by any field and value.
 * @param {string} field - The field name (e.g. 'name', 'code', 'id')
 * @param {any} value - The value to search for
 * @returns {Promise<Project|null>}
 */
const getByField = async (field, value) => {
  if (!field || typeof value === 'undefined') {
    throw new Error('getByField: field and value are required');
  }
  const where = {};
  where[field] = value;
  return await Project.findOne({ where });
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
  getProjectsByOwner,
  getByField
};