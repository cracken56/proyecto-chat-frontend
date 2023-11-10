import axiosInstance from '../api';
import Cookies from 'js-cookie';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      const requestData = {
        user: formData.username,
        password: formData.password,
      };

      const response = await axiosInstance.post('/api/login', requestData);

      const token = response.data.token;
      Cookies.set('userToken', token);

      // Set auth to logged in
      login(formData.username);

      navigate('/chat');

      console.log('Logged in');
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          setError('El usuario no existe.');
        } else if (status === 401) {
          setError('Contraseña incorrecta.');
        } else {
          setError(`Login failed with status ${status}. Please try again.`);
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
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
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
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
