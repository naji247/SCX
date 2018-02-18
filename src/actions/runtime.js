/* eslint-disable import/prefer-default-export */

import * as constants from '../constants';
import request from 'request-promise';

export function setRuntimeVariable({ name, value }) {
  return {
    type: constants.SET_RUNTIME_VARIABLE,
    payload: {
      name,
      value,
    },
  };
}

export function getAllPricesStarted() {
  return {
    type: constants.GET_ALL_PRICES_STARTED,
  };
}

export function getAllPricesDone(response) {
  return {
    type: constants.GET_ALL_PRICES_DONE,
    payload: response,
  };
}

export function getPrices() {
  return async dispatch => {
    dispatch(getAllPricesStarted());
    const response = await request.get({
      uri: 'http://localhost:3000/api/analytics',
      json: true,
    });
    dispatch(getAllPricesDone(response));
  };
}
