'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isAdmin, loginInProgress } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Only perform check after mounting and when login check is not in progress
    if (!loginInProgress) {
      if (!token || !isAdmin) {
        console.warn('Unauthorized access to admin panel. Redirecting...');
        router.replace('/explore');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [token, isAdmin, loginInProgress, router]);

  // Show loading state while checking authorization
  if (loginInProgress || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
