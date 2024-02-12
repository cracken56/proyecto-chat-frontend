import bcrypt from 'bcryptjs';
import axiosInstance from '../api';
import Cookies from 'js-cookie';

import { useAuth } from '../context/AuthContext';
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formReducer = (state, action) => {
  const actions = {
    SET_FIELD: { ...state, [action.field]: action.value },
  };

  return actions[action.type] || state;
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, dispatch] = useReducer(formReducer, {
    user: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('La contraseña no coincide.');
      return;
    }

    try {
      setError(null);

      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const requestData = {
        user: formData.user,
        hashedPassword,
      };

      const response = await axiosInstance.post('/api/register', requestData);

      const token = response.data.token;
      Cookies.set('userToken', token);

      login(formData.user);
      navigate('/chat');
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 409) {
          setError('El usuario ya existe.');
        } else {
          setError(
            `Registration failed with status ${status}. Please try again.`
          );
        }
      } else {
        console.error(
          'Error hashing the password or making the API request:',
          error
        );
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="user">Usuario: </label>
        <input
          type="text"
          id="user"
          name="user"
          value={formData.user}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Contraseña: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">Confirmar contraseña: </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button className="button" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
