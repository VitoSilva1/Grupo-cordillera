import { Route, Switch } from 'wouter';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './views/Dashboard';
import { KpisView } from './views/KpisView';
import { AlertsView } from './views/AlertsView';
import { userService } from './services/userService';
import { mockApi } from './services/mockApi';
import type { UserProfile } from './types/user';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching current user', error);
        const fallbackUser = await mockApi.getCurrentUser();
        setUser(fallbackUser);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header user={user} />

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
