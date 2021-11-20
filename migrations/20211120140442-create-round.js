'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rounds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomId:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING
      },
      playerOnePoint: {
        type: Sequelize.INTEGER
      },
      playerTwoPoint: {
        type: Sequelize.INTEGER
      },
      winner: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rounds');
  }
};