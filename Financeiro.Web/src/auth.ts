import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080', // URL do seu Docker
  realm: 'Financeiro',
  clientId: 'financeiro-api2',
});

export default keycloak;