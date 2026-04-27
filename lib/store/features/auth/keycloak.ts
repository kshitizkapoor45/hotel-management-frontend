import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8443',
    realm: 'hotel-microservice',
    clientId: 'oauth2-hotel-client',
});

export default keycloak;