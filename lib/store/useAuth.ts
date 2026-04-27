import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import { useAppDispatch, useAppSelector } from './hooks';
import { setAuth, clearAuth } from './features/auth/authSlice';
import { setAccessTokenGetter } from './features/auth/authTokenProvider';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const reduxRoles = useAppSelector((state) => state.auth.roles);
  const reduxUserId = useAppSelector((state) => state.auth.userId);

  /**
   * ✅ Sync Keycloak → Redux (ONLY derived data)
   */
  useEffect(() => {
    if (!initialized) return;

    // Bridge for API layer
    setAccessTokenGetter(() => keycloak.token ?? null);

    if (keycloak.authenticated && keycloak.tokenParsed) {
      const userId = keycloak.tokenParsed.sub || '';

      const clientRoles =
        keycloak.tokenParsed.resource_access?.['oauth2-hotel-client']?.roles || [];

      dispatch(setAuth({ userId, roles: clientRoles }));
    } else {
      dispatch(clearAuth());
    }
  }, [initialized, keycloak.authenticated, keycloak.token, dispatch]);

  /**
   * ✅ CRITICAL: Handle token expiry properly
   * This is what prevents random logout
   */
  useEffect(() => {
    if (!initialized) return;

    keycloak.onTokenExpired = () => {
      console.log('Token expired, attempting refresh...');

      keycloak
        .updateToken(30) // refresh if <30 sec remaining
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed successfully');
          } else {
            console.log('Token still valid');
          }
        })
        .catch(() => {
          console.error('Refresh failed → logging out');
          keycloak.logout({
            redirectUri: window.location.origin + '/explore',
          });
        });
    };
  }, [initialized, keycloak]);

  /**
   * ✅ OPTIONAL (but recommended): proactive refresh loop
   * Prevents edge-case race conditions (401 before refresh)
   */
  useEffect(() => {
    if (!initialized || !keycloak.authenticated) return;

    const interval = setInterval(() => {
      keycloak
        .updateToken(60) // refresh if <60 sec remaining
        .catch(() => {
          console.error('Silent refresh failed');
        });
    }, 60000); // every 1 min

    return () => clearInterval(interval);
  }, [initialized, keycloak.authenticated]);

  /**
   * ✅ Logout handler
   */
  const handleLogOut = () => {
    dispatch(clearAuth());

    keycloak.logout({
      redirectUri: window.location.origin + '/explore',
    });
  };

  const isAdmin = reduxRoles.includes('ADMIN');

  return {
    logIn: () => keycloak.login(),
    logOut: handleLogOut,

    // ✅ SINGLE SOURCE OF TRUTH
    token: keycloak.token,

    userId: keycloak.tokenParsed?.sub || reduxUserId,
    roles: reduxRoles,
    isAdmin,

    // ❗ DO NOT MIX REDUX HERE
    isAuthenticated: keycloak.authenticated,

    error: null,
    loginInProgress: !initialized,
  };
};