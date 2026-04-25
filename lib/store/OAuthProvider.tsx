'use client';

import { AuthProvider } from 'react-oauth2-code-pkce';
import { authConfig } from './authConfig';
import { useEffect, useState } from 'react';

export default function OAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <AuthProvider authConfig={authConfig}>{children}</AuthProvider>;
}
