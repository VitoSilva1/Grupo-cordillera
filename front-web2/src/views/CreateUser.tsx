import { AlertCircle, ArrowLeft, CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { userService } from '../services/userService';
import type { CreateUserPayload } from '../types/user';

type FormState = CreateUserPayload;

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  general?: string;
}

const initialForm: FormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'Vendedor',
};

const roles = ['Gerente', 'Supervisor', 'Vendedor'];

export function CreateUser() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, general: undefined }));
    setSuccessMessage('');
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = 'Ingresa el nombre.';
    if (!form.lastName.trim()) nextErrors.lastName = 'Ingresa el apellido.';
    if (!form.username.trim()) nextErrors.username = 'Ingresa el usuario.';
    if (!form.email.trim()) nextErrors.email = 'Ingresa el correo.';
    if (form.email.trim() && !form.email.includes('@')) nextErrors.email = 'Ingresa un correo valido.';
    if (!form.password) nextErrors.password = 'Ingresa una contrasena.';
    if (!form.role) nextErrors.role = 'Selecciona un cargo.';

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await userService.createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
      });
      setSuccessMessage('Usuario creado correctamente. Ya puedes iniciar sesion.');
      setForm(initialForm);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'No se pudo crear el usuario.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-800"
          >
            <ArrowLeft size={16} />
            Volver al inicio de sesion
          </Link>

          <div className="w-11 h-11 rounded bg-brand-50 text-brand-800 flex items-center justify-center mt-5 mb-5">
            <UserRound size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Crear usuario</h1>
          <p className="mt-2 text-sm text-slate-500">
            Registra una cuenta para ingresar al panel de Grupo Cordillera.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errors.general && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="firstName"
              label="Nombre"
              value={form.firstName}
              error={errors.firstName}
              onChange={(value) => updateField('firstName', value)}
              autoComplete="given-name"
            />
            <Field
              id="lastName"
              label="Apellido"
              value={form.lastName}
              error={errors.lastName}
              onChange={(value) => updateField('lastName', value)}
              autoComplete="family-name"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="username"
              label="Usuario"
              value={form.username}
              error={errors.username}
              onChange={(value) => updateField('username', value)}
              icon="user"
              autoComplete="username"
            />
            <Field
              id="email"
              label="Correo"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(value) => updateField('email', value)}
              icon="mail"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="password"
              label="Contrasena"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(value) => updateField('password', value)}
              icon="lock"
              autoComplete="new-password"
            />

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">
                Cargo
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(event) => updateField('role', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-1.5 text-sm text-red-600">{errors.role}</p>}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  icon?: 'user' | 'mail' | 'lock';
  autoComplete?: string;
}

function Field({ id, label, value, onChange, error, type = 'text', icon, autoComplete }: FieldProps) {
  const Icon = icon === 'user' ? UserRound : icon === 'mail' ? Mail : icon === 'lock' ? LockKeyhole : null;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-md border border-slate-300 bg-white py-2.5 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${Icon ? 'pl-10' : 'pl-3'}`}
          autoComplete={autoComplete}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
