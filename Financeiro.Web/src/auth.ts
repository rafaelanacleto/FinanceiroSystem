import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080', // URL do seu Docker
  realm: 'Financeiro',
  clientId: 'Financeiro-realm',
});

export default keycloak;