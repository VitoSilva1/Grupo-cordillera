import { useState } from 'react';
import { Route, Switch } from 'wouter';

import { Header, Sidebar, Login } from './components';
import { Dashboard } from './views/Dashboard';
import { KpisView } from './views/KpisView';
import { AlertsView } from './views/AlertsView';
import { CreateUser } from './views/CreateUser';
import { ReportsView } from './views/ReportsView';
import type { UserProfile } from './types/user';

import { clearSessionUser, getSessionUser, saveSessionUser } from './utils/session-utils';

import './App.css';

function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getSessionUser());

  const handleLogin = (authenticatedUser: UserProfile) => {
    saveSessionUser(authenticatedUser);
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    clearSessionUser();
    setUser(null);
  };

  if (!user) {
    return (
      <Switch>
        <Route path="/crear-usuario" component={CreateUser} />
        <Route>
          <Login onLogin={handleLogin} />
        </Route>
      </Switch>
    );
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
            <Route path="/reportes" component={ReportsView} />

            <Route>
              <div className="p-8 text-slate-500">Pagina no encontrada</div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
