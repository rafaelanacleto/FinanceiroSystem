import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { App } from './App'
import './index.css'
import { setupInterceptors } from './services/api';

// 1. Configure sua instância do Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8080', // URL do seu servidor Keycloak
  realm: 'Financeiro',           // Nome do seu Realm
  clientId: 'financeiro-api',    // Nome do seu Client
});

setupInterceptors(keycloak);

// 2. Configurações de inicialização (opcional)
const initOptions = {
  onLoad: 'login-required', // Obriga o login ao abrir o app
  checkLoginIframe: false
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. O SEGREDO: authClient recebe a instância do keycloak */}
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>,
)