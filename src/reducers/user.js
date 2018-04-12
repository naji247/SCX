import * as constants from '../constants';

const initialState = {
  isLoadingLogin: false,
  loginError: null,

  isLoadingSignup: false,
  signupError: null,
  token: null,
};

export default function userState(state = initialState, action) {
  switch (action.type) {
    case constants.LOGIN_START:
      return { ...state, isLoadingLogin: true, token: null, loginError: null };
    case constants.LOGIN_DONE:
      return { ...state, token: action.payload.token, isLoadingLogin: false };
    case constants.LOGIN_ERROR:
      return {
        ...state,
        token: null,
        isLoadingLogin: false,
        loginError: action.payload,
      };
    case constants.SIGNUP_START:
      return {
        ...state,
        isLoadingSignup: true,
        token: null,
        signupError: null,
      };
    case constants.SIGNUP_DONE:
      return { ...state, token: action.payload.token, isLoadingSignup: false };
    case constants.SIGNUP_ERROR:
      return {
        ...state,
        token: null,
        isLoadingSignup: false,
        signupError: action.payload,
      };

    case constants.LOGOUT:
      return initialState;

    default:
      return state;
  }
}
