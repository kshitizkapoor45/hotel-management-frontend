'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/store/useAuth';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { logIn, loginInProgress } = useAuth();

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to StayWise</CardTitle>
          <CardDescription>
            Sign in securely using our Single Sign-On provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => logIn()}
            className="w-full h-12 text-lg font-medium"
            disabled={loginInProgress}
          >
            {loginInProgress ? 'Connecting to Keycloak...' : 'Sign in with Keycloak'}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4 px-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}