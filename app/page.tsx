'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { token, loginInProgress, isAdmin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCode = params.has('code');

    // If we have a token, we are successfully logged in
    if (token) {
      if (isAdmin) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/explore');
      }
    } 
    // If we are NOT currently in the middle of a login callback flow -> go to explore
    else if (!loginInProgress && !hasCode) {
      router.replace('/explore');
    }
    // If we have a 'code' but no 'token' yet, we stay here and wait for the exchange
  }, [token, loginInProgress, isAdmin, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">
          {loginInProgress ? 'Finalizing secure login...' : 'Loading StayWise...'}
        </p>
      </div>
    </div>
  );
}
