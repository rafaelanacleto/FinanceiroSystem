interface SavingsGoal {
  current: number;
  target: number;
  percentage: number;
}

interface SavingsGoalCardProps {
  month: number;
  savingsGoal: SavingsGoal;
  loading?: boolean;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function SavingsGoalCard({ month, savingsGoal, loading = false }: SavingsGoalCardProps) {
  const visualPercentage = Math.max(0, Math.min(savingsGoal.percentage, 100));

  if (loading) {
    return <div className="h-40 animate-pulse rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6" />;
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black uppercase tracking-tight text-slate-800">Meta de Economia</h4>
          <p className="mt-0.5 text-xs font-medium text-slate-400">Objetivo para o mês {month}</p>
        </div>
        <span className={`text-xl font-black ${savingsGoal.percentage < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
          {savingsGoal.percentage.toFixed(1)}%
        </span>
      </div>

      <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full border border-slate-100 bg-slate-50">
        <div
          className={`h-full rounded-full transition-all duration-500 ${savingsGoal.percentage < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: `${visualPercentage}%` }}
        />
      </div>

      <p className="text-xs font-semibold text-slate-500">
        Você economizou <span className="font-bold text-emerald-600">{formatCurrency(savingsGoal.current)}</span> de <span className="font-bold text-slate-700">{formatCurrency(savingsGoal.target)}</span> este mês.
      </p>
    </div>
  );
}
