import { TAuthConfig } from 'react-oauth2-code-pkce';

export const authConfig: TAuthConfig = {
    clientId: 'oauth2-hotel-client',
    authorizationEndpoint: 'http://localhost:8443/realms/hotel-microservice/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8443/realms/hotel-microservice/protocol/openid-connect/token',
    // Removed logoutEndpoint to prevent redirect to Keycloak UI on logout
    redirectUri: 'http://localhost:3000',
    scope: 'openid email profile offline_access',
    onRefreshTokenExpire: (event) => event.logIn(),
}