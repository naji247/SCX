import { combineReducers } from 'redux';
import runtime from './runtime';
import price from './priceReducer';
import userState from './user';

export default combineReducers({
  runtime,
  price,
  userState,
});
