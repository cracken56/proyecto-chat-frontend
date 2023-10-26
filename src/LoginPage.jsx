import { useState } from 'react';

import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      <h1>Bienvenid@</h1>
      {showLogin ? (
        <div>
          <h2>Login</h2>
          <LoginForm />
          <p>
            No tienes cuenta?{' '}
            <button onClick={handleToggleForm}>Register</button>
          </p>
        </div>
      ) : (
        <div>
          <h2>Registrarse</h2>
          <RegistrationForm />
          <p>
            Ya tienes cuenta? <button onClick={handleToggleForm}>Login</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
