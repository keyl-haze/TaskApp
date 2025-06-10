const express = require('express');
const router = new express.Router();
const controller = require(`${__serverRoot}/api/v1/projects/controller`);
router.post('/', controller.create);
router.get('/', controller.list);
router.get('/owner/:owner', controller.getByOwner);
router.post('/:projectId/users/:userId', controller.assignUserToProject);
router.post('/:projectId/users', controller.assignMultipleUsersToProject);
router.get('/users/:userId', controller.listProjectsOfUser);
router.get('/:projectId/members', controller.listMembersOfProject);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);

module.exports = router;