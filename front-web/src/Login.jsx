import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_BFF_API_URL || 'http://localhost:8000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
        const usersResponse = await fetch(`${API_BASE_URL}/api/auth/users`);
        const users = usersResponse.ok ? await usersResponse.json() : [];
        const normalizedEmail = email.trim().toLowerCase();
        const matchedUser = users.find(
          (user) =>
            user.email?.toLowerCase() === normalizedEmail ||
            user.username?.toLowerCase() === normalizedEmail ||
            user.username?.toLowerCase() === data.username?.toLowerCase()
        );

        const dashboardResponse = await fetch(`${API_BASE_URL}/api/dashboard`);
        const dashboardJson = dashboardResponse.ok ? await dashboardResponse.json() : null;

        setCurrentUser({
          username: matchedUser?.username || data.username || email,
          email: matchedUser?.email || email,
          role: matchedUser?.role || 'Vendedor',
        });
        setDashboardData(dashboardJson);
        setMessage('Autenticación exitosa');
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

  const logout = () => {
    setCurrentUser(null);
    setDashboardData(null);
    setMessage('');
    setPassword('');
  };

  const renderKpiProfile = () => {
    if (!currentUser) return null;

    const role = currentUser.role;
    const summary = dashboardData?.summary;
    const sales = dashboardData?.sales || [];
    const branches = dashboardData?.branches || [];
    const alerts = dashboardData?.alerts || [];
    const channels = dashboardData?.channels || [];

    return (
      <div style={{ width: '100%', maxWidth: '980px' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: '24px',
          marginBottom: '16px'
        }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Perfil KPI</h2>
          <p style={{ margin: 0, color: '#4b5563' }}>
            Usuario: <strong>{currentUser.email}</strong> | Rol: <strong>{role}</strong>
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {(role === 'Gerente' || role === 'Vendedor') && summary && (
            <>
              <KpiCard title="Ventas Totales" value={summary.ventasTotales} />
              <KpiCard title="Ticket Promedio" value={summary.ticketPromedio} />
            </>
          )}
          {(role === 'Gerente' || role === 'Supervisor') && summary && (
            <>
              <KpiCard title="Margen Utilidad (%)" value={summary.margenUtilidad} />
              <KpiCard title="Stock Crítico" value={summary.stockCritico} />
              <KpiCard title="Reclamos Activos" value={summary.reclamosActivos} />
            </>
          )}
          {role === 'Gerente' && (
            <KpiCard title="Canales de Venta" value={channels.length} />
          )}
          {role === 'Supervisor' && (
            <KpiCard title="Sucursales Monitoreadas" value={branches.length} />
          )}
          {role === 'Vendedor' && (
            <KpiCard title="Ventas Mensuales Cargadas" value={sales.length} />
          )}
          <KpiCard title="Alertas Activas" value={alerts.length} />
        </div>

        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={logout}
            style={{
              padding: '10px 16px',
              backgroundColor: '#1f2937',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  };

  if (currentUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        padding: '32px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        {renderKpiProfile()}
      </div>
    );
  }

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

const KpiCard = ({ title, value }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '16px'
  }}>
    <p style={{ margin: '0 0 6px 0', color: '#6b7280', fontSize: '14px' }}>{title}</p>
    <p style={{ margin: 0, color: '#111827', fontSize: '24px', fontWeight: 700 }}>
      {value ?? '-'}
    </p>
  </div>
);

export default Login;
