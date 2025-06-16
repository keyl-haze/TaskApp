const { Project, User, ProjectUser } = require(`${__serverRoot}/models`);

/**
 * Generic utility to get a record by any field from a Sequelize model.
 * @param {Model} Model - The Sequelize model
 * @param {string} field - The field name
 * @param {any} value - The value to search for
 * @returns {Promise<Model|null>}
 */
const getByField = async (Model, field, value) => {
  if (!Model || !field || typeof value === 'undefined') {
    throw new Error('getByField: Model, field, and value are required');
  }
  const where = {};
  where[field] = value;
  return await Model.findOne({ where });
};

/**
 * @param { string } title
 * @returns {Promise<boolean>} - Returns true if project title exists, false if otherwise
 */
const doesProjectTitleExist = async (title) => {
  if (!title) {
    throw new Error('Project title is required');
  }
  const project = await getByField(Project, 'title', title);
  return !!project;
};

/**
 * @param { string } code
 * @returns {Promise<boolean>} - Returns true if project code exists, false if otherwise
 */
const doesProjectCodeExist = async (code) => {
  if (!code) {
    throw new Error('Project code is required');
  }
  const project = await getByField(Project, 'code', code);
  return !!project;
};

/**
 * @param { integer } userId
 * @returns {Promise<boolean>} - Returns true if user exists, false if otherwise
 */
const doesUserExist = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const user = await getByField(User, 'id', userId);
  return !!user;
};

/**
 * @param { integer } projectId
 * @returns { Promise<boolean>} - Returns true if project, false if otherwise
 */
const doesProjectExist = async (projectId) => {
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  const project = await getByField(Project, 'id', projectId);
  return !!project;
};

/**
 * @param { integer } projectId
 * @param { integer } userId
 * @returns { Promise<boolean>} - Returns true if user is already assigned to project, false if otherwise
 */
const isUserAssignedToProject = async (projectId, userId) => {
  if (!projectId || !userId) {
    throw new Error('Project ID and User ID are required');
  }
  const project = await ProjectUser.findOne({
    where: {
      projectId,
      userId
    }
  });
  return !!project;
};

module.exports = {
  getByField,
  doesProjectTitleExist,
  doesProjectCodeExist,
  doesUserExist,
  doesProjectExist,
  isUserAssignedToProject
};
