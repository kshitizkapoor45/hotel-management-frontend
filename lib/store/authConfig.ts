import { TAuthConfig } from 'react-oauth2-code-pkce';

export const authConfig: TAuthConfig = {
    clientId: 'oauth2-hotel-client',
    authorizationEndpoint: 'http://localhost:8443/realms/hotel-microservice/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8443/realms/hotel-microservice/protocol/openid-connect/token',
    logoutEndpoint: 'http://localhost:8443/realms/hotel-microservice/protocol/openid-connect/logout',
    redirectUri: 'http://localhost:3000',
    logoutRedirect: 'http://localhost:3000',
    scope: 'openid email profile offline_access',
    autoLogin: false,
    storage: 'local',
    onRefreshTokenExpire: () => {
        console.warn('Session expired');
    }
}