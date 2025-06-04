const { Project, ProjectUser, User } = require(`${__serverRoot}/models`);

const create = async (userQuery) => {
  const { name, owner, code } = userQuery;

  const projectNameExists = await getByName(name);
  // TODO: More validation if project code or project name already exists
  if (projectNameExists) {
    const error = new Error();
    error.name = 'ProjectNameExistsError';
    error.status = 400;
    error.message = 'Project name already exists';
    throw error;
  }

  const project = await Project.create({ name, owner, code });

  return project;
};

const getProjectsByOwner = async (ownerId) => {
  return Project.findAll({ where: { owner: ownerId } });
};

// TODO: Make this reusable
const getByName = async (name) => {
  const project = await Project.findOne({
    where: {
      name
    }
  });

  return project;
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
