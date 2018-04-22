/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    password: {
      type: DataType.STRING(255),
      allowNull: false,
    },

    email: {
      type: DataType.STRING(255),
      validate: { isEmail: true },
      unique: true,
    },

    emailConfirmed: {
      type: DataType.BOOLEAN,
      defaultValue: false,
    },

    firstName: {
      type: DataType.STRING(255),
      allowNull: false,
    },

    lastName: {
      type: DataType.STRING(255),
      allowNull: false,
    },

    phoneNumber: {
      type: DataType.STRING(20),
    },

    country: {
      type: DataType.STRING(255),
    },

    // TODO: Add refresh token later to invalidate auth tokens
    // token: {
    //   type: DataType.STRING(255),
    //   defaultValue: null,
    //   unique: true,
    //   allowNull: true,
    // },
  },
  {
    indexes: [{ fields: ['email'] }],
  },
);

export default User;
