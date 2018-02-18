import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import price from './priceReducer';

export default combineReducers({
  user,
  runtime,
  price,
});
