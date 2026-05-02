import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El formato del correo electrónico no es válido.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Asumiendo que username es el email
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Autenticación exitosa');
        console.log('Respuesta del servidor:', data);
        // Aquí puedes manejar el login exitoso, como redirigir o guardar token
      } else {
        setErrors({ general: data.error || 'Error en la autenticación' });
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setErrors({ general: 'Error de conexión con el servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333'
        }}>Iniciar Sesión</h2>
        {message && <p style={{
          color: '#4caf50',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: '16px'
        }}>{message}</p>}
        {errors.general && <p style={{
          color: '#d32f2f',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: '14px'
        }}>{errors.general}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555'
            }}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && <p style={{
              color: '#d32f2f',
              fontSize: '14px',
              marginTop: '5px'
            }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555'
            }}>Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && <p style={{
              color: '#d32f2f',
              fontSize: '14px',
              marginTop: '5px'
            }}>{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#007bff')}
          >
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;