import { AlertCircle, LockKeyhole, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'wouter';
import { authService } from '../services/authService';
import type { UserProfile } from '../types/user';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

interface LoginErrors {
  login?: string;
  password?: string;
  general?: string;
}

export function Login({ onLogin }: LoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    if (!login.trim()) {
      nextErrors.login = 'Ingresa tu usuario o correo.';
    }

    if (!password) {
      nextErrors.password = 'Ingresa tu contrasena.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const user = await authService.login(login.trim(), password);
      onLogin(user);
    } catch (error) {
      setErrors({
        general: error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesion.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <div className="w-11 h-11 rounded bg-brand-50 text-brand-800 flex items-center justify-center mb-5">
            <LockKeyhole size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesion</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa con tu usuario de Grupo Cordillera.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errors.general && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <div>
            <label htmlFor="login" className="block text-sm font-medium text-slate-700 mb-1.5">
              Usuario o correo
            </label>
            <div className="relative">
              <UserRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login"
                type="text"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                autoComplete="username"
              />
            </div>
            {errors.login && <p className="mt-1.5 text-sm text-red-600">{errors.login}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Contrasena
            </label>
            <div className="relative">
              <LockKeyhole size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                autoComplete="current-password"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? 'Validando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-slate-500">
            No tienes usuario?{' '}
            <Link href="/crear-usuario" className="font-semibold text-brand-800 transition hover:text-brand-900">
              Crear usuario
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
