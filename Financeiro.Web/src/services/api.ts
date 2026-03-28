import axios from 'axios';
import keycloak from '../auth';

const api = axios.create({
  baseURL: 'http://localhost:5283/api', // Ajuste para a porta da sua API .NET
});

// O "Pedágio": Antes de cada requisição, este código roda
api.interceptors.request.use((config) => {
  if (keycloak.token) {
    // Injeta o "Bearer Token" no Header Authorization
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;