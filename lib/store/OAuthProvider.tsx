'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './features/auth/keycloak';
import { Loader2 } from 'lucide-react';

export function OAuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show a loading state during the initial server/client hydration
    // to prevent children from calling useKeycloak() before the provider is ready.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4 font-medium">Initializing StayWise...</p>
      </div>
    );
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        redirectUri: 'http://localhost:3000',
      }}
      LoadingComponent={
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground mt-4 font-medium">Connecting to Secure Session...</p>
        </div>
      }
    >
      {children}
    </ReactKeycloakProvider>
  );
}
