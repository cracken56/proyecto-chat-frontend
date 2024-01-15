/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from 'react';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_CONTACT = 'SET_CONTACT';

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
    // Add more action handlers if needed
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
    console.log('Auth true');
    dispatch({ type: LOGIN, payload: { user } });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const setContact = (contact) => {
    dispatch({ type: SET_CONTACT, payload: { contact } });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setContact }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
