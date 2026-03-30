import { useEffect, useState } from 'react';
import api from '../services/api';

interface BalanceProps {
  month: number;
  year: number;
}

export function BalanceCard({ month, year }: BalanceProps) {
  const [balanceData, setBalanceData] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchBalance() {
    setLoading(true);
    try {
      // Importante: Passar os parâmetros na URL
      const response = await api.get(`/Accounts/summary?month=${month}&year=${year}`);
      setBalanceData(response.data);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    } finally {
      setLoading(false);
    }
  }

  // O pulo do gato: Sempre que month ou year mudarem, ele executa o fetchBalance
  useEffect(() => {
    fetchBalance();
  }, [month, year]);

  if (loading) return <div className="h-32 bg-slate-50 animate-pulse rounded-3xl" />;

  return (
    <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-200">
      <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest mb-1">Saldo do Período</p>
      <h2 className="text-4xl font-black mb-6">
        {balanceData.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </h2>
      
      <div className="flex justify-between border-t border-emerald-500/50 pt-6">
        <div>
          <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-tighter">Receitas</p>
          <p className="font-bold text-lg">+{balanceData.totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className="text-right">
          <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-tighter">Despesas</p>
          <p className="font-bold text-lg">-{balanceData.totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>
    </div>
  );
}