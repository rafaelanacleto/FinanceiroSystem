import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import keycloak from './auth'

keycloak.init({ 
  onLoad: 'login-required', // Obriga o login imediatamente
  checkLoginIframe: false 
}).then((authenticated) => {
  if (authenticated) {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }
}).catch(() => {
  console.error("Falha na autenticação com Keycloak");
});
