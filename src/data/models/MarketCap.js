import DataType from 'sequelize';
import Model from '../sequelize';

const MarketCap = Model.define('MarketCaps', {
  marketCap: { type: DataType.FLOAT },
  ticker: { type: DataType.STRING, primaryKey: true },
});
export default MarketCap;
