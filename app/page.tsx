'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.replace(token ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-mist border-t-brand" />
    </div>
  );
}
