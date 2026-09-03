import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5283/api',
});

export interface SavingsGoal {
  current: number;
  target: number;
  percentage: number;
}

export async function getSavingsGoal(): Promise<number> {
  const response = await api.get<{ monthlySavingsGoal: number }>('/Accounts/savings-goal');
  return response.data.monthlySavingsGoal;
}

export async function updateSavingsGoal(monthlySavingsGoal: number): Promise<number> {
  const response = await api.put<{ monthlySavingsGoal: number }>('/Accounts/savings-goal', {
    monthlySavingsGoal,
  });
  return response.data.monthlySavingsGoal;
}

// O SDK do Supabase renova o token em background; buscamos o mais recente a cada request
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;