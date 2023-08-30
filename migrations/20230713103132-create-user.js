'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
     user_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number:{
        type: Sequelize.STRING,
        allowNull: false
      },
      age:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      weight:{
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      gender:{
        type:Sequelize.ENUM('Male','Female'),
        allowNull: false
      },
      password:{
        type: Sequelize.STRING,
        allowNull: false
      },
      profile_image:{
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};