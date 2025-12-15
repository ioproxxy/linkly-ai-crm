import React, { useState } from 'react';
import { login, register } from '../../services/authService';
import { useAppStore } from '../../store/appStore';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';

export const AuthShell: React.FC = () => {
  const setAuth = useAppStore((s) => s.setAuth);
  const setInitializing = useAppStore((s) => s.setInitializing);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(form.email, form.password);
        setAuth(res.user, res.accessToken);
        localStorage.setItem('linkly_auth', JSON.stringify(res));
      } else {
        const res = await register(form.name, form.organization, form.email, form.password);
        setAuth(res.user, res.accessToken);
        localStorage.setItem('linkly_auth', JSON.stringify(res));
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center rounded-full border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            Linkly.ai • AI Sales Operating System
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Enterprise-grade AI CRM
            <span className="block text-slate-400 text-lg mt-2 font-normal">
              Secure, observable, and built for real revenue teams.
            </span>
          </h1>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• JWT-secured API & audit trails.</li>
            <li>• Lead discovery, campaigns, and AI command center.</li>
            <li>• Designed for production, not demos.</li>
          </ul>
        </div>

        <Card className="bg-slate-900/60 backdrop-blur border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                {mode === 'login' ? 'Need an account?' : 'Have an account?'}
              </button>
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Sign in with your admin credentials to access Linkly.'
                : 'Spin up a new organization in a few seconds.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <div className="space-y-1 text-sm">
                    <label className="text-slate-200">Full name</label>
                    <input
                      required
                      className="w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1 text-sm">
                    <label className="text-slate-200">Organization</label>
                    <input
                      required
                      className="w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.organization}
                      onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1 text-sm">
                <label className="text-slate-200">Work email</label>
                <input
                  type="email"
                  required
                  className="w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="space-y-1 text-sm">
                <label className="text-slate-200">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full mt-2" loading={loading}>
                {mode === 'login' ? 'Sign in' : 'Create workspace'}
              </Button>

              <p className="text-[11px] text-slate-500 mt-2">
                By continuing you agree to internal usage policies. Do not use real customer data in non-production
                environments.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
