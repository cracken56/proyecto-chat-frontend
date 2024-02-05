import { useState } from 'react';

import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';

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
          <h2>Conectarse</h2>
          <LoginForm />
          <p>
            No tienes cuenta?{' '}
            <button onClick={handleToggleForm}>Registrarse</button>
          </p>
        </div>
      ) : (
        <div>
          <h2>Registrarse</h2>
          <RegistrationForm />
          <p>
            Ya tienes cuenta? <button onClick={handleToggleForm}></button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
