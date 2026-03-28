import React from 'react';

interface BalanceCardProps {
  label: string;
  amount: number;
}

export function BalanceCard({ label, amount }: BalanceCardProps) {
  // 1. Garantia contra valores nulos ou indefinidos (Safety First)
  const safeAmount = amount ?? 0;

  // 2. Formatador de Moeda Brasileiro
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(safeAmount);

  // 3. Lógica de cores baseada no valor
  const isNegative = safeAmount < 0;
  const amountColorClass = isNegative ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-w-[280px] transition-all hover:shadow-md">
      {/* Label superior em caixa alta e cinza */}
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </p>

      {/* Valor principal com cor dinâmica */}
      <div className="flex items-baseline gap-1">
        <h3 className={`text-3xl font-extrabold tracking-tight ${amountColorClass}`}>
          {formattedAmount}
        </h3>
      </div>

      {/* Indicador visual simples de status */}
      <div className="mt-4 flex items-center gap-2">
        <span className={`flex h-2 w-2 rounded-full ${isNegative ? 'bg-red-400' : 'bg-emerald-400'}`} />
        <p className="text-slate-400 text-xs font-medium">
          {isNegative ? 'Atenção ao limite' : 'Saldo disponível'}
        </p>
      </div>
    </div>
  );
}