'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mesh">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-mist border-t-brand" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-mesh">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-display text-2xl font-bold text-brand">
              CartZone
            </Link>
            <Link
              href="/dashboard"
              className="hidden text-sm font-semibold text-ink-soft transition hover:text-brand sm:inline"
            >
              Products
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-mist text-brand"
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5.5 19.5c1.5-3.5 4-5 6.5-5s5 1.5 6.5 5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-ink">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-ink-muted">{user?.email}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="btn-secondary py-2 text-xs">
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
