import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useAppDispatch, useAppSelector } from './hooks';
import { setAuth, clearAuth } from './features/auth/authSlice';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const reduxToken = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!context) return;

    // Sync from Keycloak context to Redux if Keycloak has a session
    if (context.token) {
      const userId = context.tokenData?.sub || '';
      dispatch(setAuth({ token: context.token, userId }));
    }
    // If Keycloak is empty, ONLY clear Redux if Redux is also empty or if we explicitly logged out
    // This prevents the library from wiping out a manual BTS login
    else if (!reduxToken) {
      dispatch(clearAuth());
    }
  }, [context?.token, context?.tokenData, dispatch, reduxToken]);

  const reduxUserId = useAppSelector((state) => state.auth.userId);
  const router = useRouter();

  const handleLogOut = () => {
    // 1. Clear Redux and LocalStorage
    dispatch(clearAuth());
    
    // 2. Redirect to login page manually
    router.push('/login');
  };

  if (!context) {
    return {
      logIn: () => { },
      logOut: handleLogOut,
      token: reduxToken,
      userId: reduxUserId,
      error: null,
      loginInProgress: false,
    };
  }

  return {
    logIn: context.logIn,
    logOut: handleLogOut,
    token: context.token || reduxToken,
    userId: context.tokenData?.sub || reduxUserId,
    error: context.error,
    loginInProgress: context.loginInProgress,
  };
};
