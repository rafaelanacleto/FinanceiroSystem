import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { App } from './App'
import './index.css'
import { setupInterceptors } from './services/api';
import keycloak from './auth';

setupInterceptors(keycloak);

// 2. Configurações de inicialização (opcional)
const initOptions = {
  onLoad: 'login-required', // Obriga o login ao abrir o app
  checkLoginIframe: false,
  redirectUri: window.location.origin, 
  pkceMethod: 'S256',
  enableLogging: true
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. O SEGREDO: authClient recebe a instância do keycloak */}
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>,
)