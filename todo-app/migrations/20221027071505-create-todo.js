'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: [5, 255],
        },
      },
      dueDate: {
        type: Sequelize.DATEONLY,
      },
      completed: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    };

    await queryInterface.createTable('Todos', tableDefinition);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Todos');
  },
};
