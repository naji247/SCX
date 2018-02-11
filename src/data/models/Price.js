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

const Price = Model.define('Prices', {
  id: {
    type: DataType.UUID,
    primaryKey: true,
  },

  price: {
    type: DataType.FLOAT,
  },

  ticker: {
    type: DataType.STRING(6),
  },

  timestamp: {
    type: DataType.DATE,
  },
});

export default Price;
