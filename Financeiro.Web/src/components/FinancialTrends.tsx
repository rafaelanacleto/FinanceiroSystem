interface FinancialTrendsProps {
  month: number;
  year: number;
}

export function FinancialTrends({ month, year }: FinancialTrendsProps) {
  // Simulando dados que viriam do seu backend/contexto baseado no mês/ano
  const essentialPercentage = 62; 
  const superfluousPercentage = 38; 
  
  const savingsGoal = {
    current: 350,
    target: 5000,
    percentage: 7, 
  };

  const comparisonWithLastMonth = {
    isHigher: false,
    percentageDiff: 4.2,
  };

  return (
    <div className="space-y-6 mt-6">
      
      {/* 1. CARD DE DISTRIBUIÇÃO E COMPARAÇÃO */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
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
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase">
              Meta de Economia
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Objetivo para o mês {month}
            </p>
          </div>
          <span className="text-xl font-black text-emerald-600">
            {savingsGoal.percentage}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden mb-3">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-200" 
            style={{ width: `${savingsGoal.percentage}%` }}
          />
        </div>

        <p className="text-xs font-semibold text-slate-500">
          Você economizou <span className="text-emerald-600 font-bold">{savingsGoal.percentage}%</span> da sua meta este mês.
        </p>
      </div>

    </div>
  );
}