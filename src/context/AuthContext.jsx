/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from 'react';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const authReducer = (state, action) => {
  const actionHandlers = {
    [LOGIN]: () => ({
      ...state,
      isAuthenticated: true,
      username: action.payload.username,
    }),
    [LOGOUT]: () => ({
      ...state,
      isAuthenticated: false,
      username: null,
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
    username: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (username) => {
    console.log('Auth true');
    dispatch({ type: LOGIN, payload: { username } });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
