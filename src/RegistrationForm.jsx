import bcrypt from 'bcryptjs';
import axiosInstance from './api';
import Cookies from 'js-cookie';

import { useReducer, useState } from 'react';

const formReducer = (state, action) => {
  const actions = {
    SET_FIELD: { ...state, [action.field]: action.value },
    RESET_FORM: { username: '', password: '', confirmPassword: '' },
  };

  return actions[action.type] || state;
};

const RegistrationForm = () => {
  const [formData, dispatch] = useReducer(formReducer, {
    username: '',
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
      setError('Passwords do not match');
      return;
    }

    try {
      setError(null);

      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const requestData = {
        user: formData.username,
        hashedPassword,
      };

      const response = await axiosInstance.post('/api/register', requestData);

      const token = response.data.token;
      Cookies.set('userToken', token);

      // Redirect to another page or perform other actions
      // ...

      // Reset the form or perform any additional actions here
      dispatch({ type: 'RESET_FORM' });
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
    <div className="registration-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
