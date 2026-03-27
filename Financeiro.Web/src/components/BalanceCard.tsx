interface BalanceProps {
  amount: number;
  label: string;
}

export function BalanceCard({ amount, label }: BalanceProps) {
  const isNegative = amount < 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </p>
      
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">R$</span>
        <span className={`text-4xl font-extrabold tracking-tight ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
          {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="mt-4 flex items-center text-sm">
        <span className={isNegative ? 'text-red-500' : 'text-emerald-500'}>
          {isNegative ? '↓' : '↑'} 12%
        </span>
        <span className="ml-2 text-slate-400">em relação ao mês passado</span>
      </div>
    </div>
  );
}