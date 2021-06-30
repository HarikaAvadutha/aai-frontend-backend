import actions from './actions';
import axios from 'axios';
import { BASE_API_URL } from '../../settings'

const { loginBegin, loginSuccess, loginErr, logoutBegin, logoutSuccess, logoutErr, registerBegin, registerSuccess, registerErr, userLoaded, userLoading, authErr } = actions;

const loadUser = () => (dispatch, getState) => {
  // User Loading
  dispatch(userLoading());

  axios
    .get(BASE_API_URL + '/api/auth/user', tokenConfig(getState))
    .then((res) => {
      dispatch(userLoaded(res.data));
    })
    .catch((err) => {
      dispatch(authErr(err.response));
    });
};

const login = (username, password) => (dispatch) => {

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ username, password });

  console.log(body)
  dispatch(loginBegin());  
  axios
    .post(BASE_API_URL + '/api/login/', body, config)
    .then((res) => {
      console.log("SUCCESS")
      dispatch(loginSuccess(res.data));
    })
    .catch((err) => {
      console.log(err.response)
      dispatch(loginErr(err.response));
    });
};


const register = ({name, username, password, email }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({name, username, email, password });

  dispatch(registerBegin());  
  axios
    .post(BASE_API_URL + '/api/auth/register', body, config)
    .then((res) => {
      dispatch(registerSuccess(res.data));
    })
    .catch((err) => {
      dispatch(registerErr(err.response.data));
    });
};

const logOut = () => (dispatch, getState) => {
  dispatch(logoutBegin());
  axios
    .post(BASE_API_URL + '/api/auth/logout/', null, tokenConfig(getState))
    .then((res) => {
      dispatch(logoutSuccess(null));
    })
    .catch((err) => {
      dispatch(logoutErr(err.response));
    });
};

const tokenConfig = (getState) => {
  // Get token from state
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config;
};

export { login, logOut, register, loadUser, tokenConfig };
