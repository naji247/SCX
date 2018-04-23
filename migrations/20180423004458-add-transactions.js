'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('transaction', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true,
      },
      sender_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      recipient_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      memo: {
        type: Sequelize.TEXT(),
      },
      in_system: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('transaction'),
};
