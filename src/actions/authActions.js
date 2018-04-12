import * as constants from '../constants';
import request from 'request-promise';
import { APP_URL } from '../secrets';
import store from 'store';
import history from '../history';

export function loginStart() {
  return {
    type: constants.LOGIN_START,
  };
}

export function loginDone(response) {
  return {
    type: constants.LOGIN_DONE,
    payload: response,
  };
}

export function loginError(error) {
  return {
    type: constants.LOGIN_ERROR,
    payload: error,
  };
}

export function logout() {
  if (store.get('scx_token')) store.remove('scx_token');
  return {
    type: constants.LOGOUT,
  };
}

export function login(email, password) {
  return async dispatch => {
    dispatch(loginStart());
    // TODO: Add long term storage
    // if (store.get('scx_token')) store.remove('scx_token');
    try {
      const response = await request
        .post({
          uri: `${APP_URL}/auth/login`,
          json: true,
        })
        .form({
          email,
          password,
        });
      // TODO: Add long term storage
      // store.set('scx_token', response.token);
      dispatch(loginDone(response));
      history.push('/');
    } catch (error) {
      dispatch(loginError(error));
    }
  };
}

export function signupStart() {
  return {
    type: constants.SIGNUP_START,
  };
}

export function signupDone(response) {
  return {
    type: constants.SIGNUP_DONE,
    payload: response,
  };
}

export function signupError(error) {
  return {
    type: constants.SIGNUP_ERROR,
    payload: error,
  };
}

export function signup(email, password) {
  return async dispatch => {
    dispatch(signupStart());
    // TODO: Add long term storage
    // if (store.get('scx_token')) store.remove('scx_token');
    try {
      const response = await request
        .post({
          uri: `${APP_URL}/auth/signup`,
          json: true,
        })
        .form({
          email,
          password,
        });
      // TODO: Add long term storage
      // store.set('scx_token', response.token);
      dispatch(signupDone(response));
      history.push('/');
    } catch (error) {
      dispatch(signupError(error));
    }
  };
}
