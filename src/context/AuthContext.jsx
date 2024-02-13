/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from 'react';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_CONTACT = 'SET_CONTACT';
const SET_NOTIFICATION_MESSAGE = 'SET_NOTIFICATION_MESSAGE';

const authReducer = (state, action) => {
  const actionHandlers = {
    [LOGIN]: () => ({
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }),
    [LOGOUT]: () => ({
      ...state,
      isAuthenticated: false,
      user: null,
    }),
    [SET_CONTACT]: () => ({
      ...state,
      contact: action.payload.contact,
    }),
    [SET_NOTIFICATION_MESSAGE]: () => ({
      ...state,
      notificationMessage: action.payload.notificationMessage,
    }),
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialState = {
    isAuthenticated: false,
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user) => {
    dispatch({ type: LOGIN, payload: { user } });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const setContact = (contact) => {
    dispatch({ type: SET_CONTACT, payload: { contact } });
  };

  const setNotificationMessage = (notificationMessage) => {
    dispatch({
      type: SET_NOTIFICATION_MESSAGE,
      payload: { notificationMessage },
    });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, setContact, setNotificationMessage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
