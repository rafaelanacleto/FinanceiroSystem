import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://192.168.0.234:8080',
  realm: 'Financeiro',
  clientId: 'financeiro-api',
});

export default keycloak;