'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { token, loginInProgress } = useAuth();

  useEffect(() => {
    // Only redirect if we're not currently processing a login callback
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasCode = params.has('code');

    if (token) {
      // If we have a token, we're authenticated
      router.replace('/explore');
    } else if (!hasCode) {
      // If there's no 'code' in the URL, we're not in a login callback flow
      // so we can safely redirect to explore (even if logged out)
      router.replace('/explore');
    }
    // If there IS a code, we stay here and show the loading state 
    // until 'token' becomes truthy and triggers the first 'if'
  }, [token, router]);

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
