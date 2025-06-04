const { Project } = require(`${__serverRoot}/models`);

const create = async (userQuery) => {
  const { name, owner, code } = userQuery;

  const projectNameExists = await Project.findOne({
    where: {
      name
    },
  });
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

module.exports = {
  create
};
