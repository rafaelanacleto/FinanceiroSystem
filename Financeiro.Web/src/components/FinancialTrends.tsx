import { useEffect, useState } from 'react';
import api, { type SavingsGoal } from '../services/api';
import { SavingsGoalCard } from './SavingsGoalCard';

interface FinancialTrendsProps {
  month: number;
  year: number;
}

export function FinancialTrends({ month, year }: FinancialTrendsProps) {
  const essentialPercentage = 62; 
  const superfluousPercentage = 38; 
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>({ current: 0, target: 5000, percentage: 0 });
  const [savingsGoalLoading, setSavingsGoalLoading] = useState(true);

  const comparisonWithLastMonth = {
    isHigher: false,
    percentageDiff: 4.2,
  };

  useEffect(() => {
    api.get(`/Accounts/summary?month=${month}&year=${year}`)
      .then((response) => setSavingsGoal(response.data.savingsGoal))
      .catch((error) => console.error('Erro ao buscar meta de economia:', error))
      .finally(() => setSavingsGoalLoading(false));
  }, [month, year]);

  return (
    <div className="space-y-6 mt-6">
      
      {/* 1. CARD DE DISTRIBUIÇÃO E COMPARAÇÃO */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase">
            Perfil de Gastos ({month}/{year})
          </h4>
          
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            comparisonWithLastMonth.isHigher 
              ? 'bg-rose-50 text-rose-700 border border-rose-100' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            <span className="text-sm leading-none">
              {comparisonWithLastMonth.isHigher ? '↑' : '↓'}
            </span>
            <span>
              {comparisonWithLastMonth.percentageDiff}% {comparisonWithLastMonth.isHigher ? 'acima' : 'menor'} que mês anterior
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              className="bg-slate-800 h-full transition-all duration-500" 
              style={{ width: `${essentialPercentage}%` }}
              title={`Essencial: ${essentialPercentage}%`}
            />
            <div 
              className="bg-amber-500 h-full transition-all duration-500" 
              style={{ width: `${superfluousPercentage}%` }}
              title={`Supérfluo: ${superfluousPercentage}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
              <span className="text-slate-500">Essencial</span>
              <span className="text-slate-800">{essentialPercentage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <span className="text-slate-500">Supérfluo</span>
              <span className="text-slate-800">{superfluousPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD DE META DE ECONOMIA */}
      <SavingsGoalCard month={month} savingsGoal={savingsGoal} loading={savingsGoalLoading} />

    </div>
  );
}