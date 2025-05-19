'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcrypt');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    // Hash the passwords manually
    const hashedPassword1 = await bcrypt.hash('keylpassword', saltRounds);
    const hashedPassword2 = await bcrypt.hash('jfpassword', saltRounds);

    return queryInterface.bulkInsert('Users', [
      {
        username: 'kdj.castro',
        firstName: 'Keil',
        middleName: 'De Jesus',
        lastName: 'Castro',
        role: 'super_admin',
        email: 'keylpup.12@gmail.com',
        password: hashedPassword1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jfh.oquindo',
        firstName: 'Julia Francesca',
        middleName: 'Hortal',
        lastName: 'Oquindo',
        role: 'super_admin',
        email: 'jfh.oquindo@gmail.com',
        password: hashedPassword2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
