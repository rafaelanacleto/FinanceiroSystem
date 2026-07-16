import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.234:5283/api', // Ajuste para a porta da sua API .NET
});

// Criamos uma função para configurar o interceptor com a instância real do Keycloak
export const setupInterceptors = (keycloakInstance: any) => {
  api.interceptors.request.use((config) => {
    const token = keycloakInstance.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default api;