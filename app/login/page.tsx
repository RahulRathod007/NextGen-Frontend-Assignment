'use client';

import { FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;

    inFlight.current = true;
    setLoading(true);
    setError('');

    try {
      const { data } = await authApi.login(username.trim(), password);
      const { accessToken, refreshToken: _r, ...userData } = data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      router.replace('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      inFlight.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden animate-fade-up lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">CartZone Admin</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight text-ink">
              Run your catalog with clarity.
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-muted">
              Search, filter, paginate and manage DummyJSON products from one focused workspace.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md animate-fade-up">
            <div className="panel p-8">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="font-display text-3xl font-bold text-ink">Sign in</h2>
                <p className="mt-1 text-sm text-ink-muted">Use the demo DummyJSON credentials</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="label">
                    Username
                  </label>
                  <input
                    id="username"
                    className="field"
                    value={username}
                    disabled={loading}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="field"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-6 rounded-xl bg-surface-soft p-4 text-sm text-ink-soft">
                <p className="font-semibold text-ink">Demo credentials</p>
                <p className="mt-1">
                  Username: <span className="font-mono text-brand">emilys</span>
                </p>
                <p>
                  Password: <span className="font-mono text-brand">emilyspass</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
