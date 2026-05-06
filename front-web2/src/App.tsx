import { Route, Switch } from 'wouter';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Dashboard } from './views/Dashboard';
import { KpisView } from './views/KpisView';
import { AlertsView } from './views/AlertsView';
import type { UserProfile } from './types/user';
import { useState } from 'react';
import './App.css';

const SESSION_USER_KEY = 'grupo-cordillera-user';

const getSessionUser = (): UserProfile | null => {
  const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as UserProfile;
  } catch {
    sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
};

function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getSessionUser());

  const handleLogin = (authenticatedUser: UserProfile) => {
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_USER_KEY);
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/kpis" component={KpisView} />
            <Route path="/alertas" component={AlertsView} />

            {/* Rutas no implementadas aún mostrarán un mensaje simple */}
            <Route path="/reportes">
              <div className="p-8 text-slate-500">Módulo de reportes en construcción...</div>
            </Route>

            {/* Catch-all route */}
            <Route>
              <div className="p-8 text-slate-500">Página no encontrada</div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
