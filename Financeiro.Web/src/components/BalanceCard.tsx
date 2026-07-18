import { useEffect, useState } from 'react';
import api from '../services/api';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceProps {
  month: number;
  year: number;
}

interface BalanceData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  annualBalance: number;
}

export function BalanceCard({ month, year }: BalanceProps) {
  const [balanceData, setBalanceData] = useState<BalanceData>({ 
    totalIncome: 0, 
    totalExpenses: 0, 
    balance: 0, 
    annualBalance: 0 
  });
  const [loading, setLoading] = useState(true);

  async function fetchBalance() {
    setLoading(true);
    try {
      const response = await api.get(`/Accounts/summary?month=${month}&year=${year}`);
      setBalanceData(response.data);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, [month, year]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <div className="bg-[#10b981]/5 dark:bg-[#10b981]/10 border border-emerald-100 dark:border-emerald-950/20 rounded-[2rem] p-6 lg:p-8 h-full flex flex-col justify-between animate-pulse min-h-[350px]">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
            <div className="border-l border-slate-200/50 dark:border-slate-700/50 pl-4">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
          <div>
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 lg:p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-100 dark:shadow-none h-full flex flex-col justify-between transition-all duration-300 min-h-[350px]">
      <div>
        <div className="flex items-center gap-2 mb-6 opacity-85">
          <Wallet className="w-5 h-5 text-emerald-100" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Visão Geral do Saldo</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-emerald-100/80 font-bold uppercase text-[10px] tracking-widest mb-1.5">Saldo do Período</p>
            <h2 className="text-xl lg:text-3xl font-black truncate" title={formatCurrency(balanceData.balance)}>
              {formatCurrency(balanceData.balance)}
            </h2>
          </div>
          <div className="border-l border-emerald-500/30 pl-4">
            <p className="text-emerald-100/80 font-bold uppercase text-[10px] tracking-widest mb-1.5">Saldo Anual ({year})</p>
            <h2 className="text-xl lg:text-3xl font-black truncate" title={formatCurrency(balanceData.annualBalance)}>
              {formatCurrency(balanceData.annualBalance)}
            </h2>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between border-t border-emerald-500/40 pt-6 mt-auto">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-emerald-500/20 rounded-xl mt-0.5">
            <TrendingUp className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <p className="text-emerald-200/80 text-[10px] font-bold uppercase tracking-wider mb-0.5">Receitas</p>
            <p className="font-extrabold text-base lg:text-lg">+{formatCurrency(balanceData.totalIncome)}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-right justify-end">
          <div className="text-left md:text-right">
            <p className="text-emerald-200/80 text-[10px] font-bold uppercase tracking-wider mb-0.5">Despesas</p>
            <p className="font-extrabold text-base lg:text-lg">-{formatCurrency(balanceData.totalExpenses)}</p>
          </div>
          <div className="p-2 bg-rose-500/20 rounded-xl mt-0.5 order-first md:order-last">
            <TrendingDown className="w-4 h-4 text-rose-200" />
          </div>
        </div>
      </div>
    </div>
  );
}