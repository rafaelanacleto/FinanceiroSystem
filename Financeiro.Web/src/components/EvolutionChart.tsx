import { useEffect, useState } from 'react';
import api from '../services/api';

interface EvolutionChartProps {
  currentMonth: number;
  currentYear: number;
}

interface MonthlyEvolutionResponse {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

interface MonthlyData {
  label: string;
  income: number;
  expense: number;
  balance: number;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

function formatMonthLabel(month: number, year: number) {
  const label = monthFormatter.format(new Date(year, month - 1, 1)).replace('.', '');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function EvolutionChart({ currentMonth, currentYear }: Readonly<EvolutionChartProps>) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvolution() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await api.get<MonthlyEvolutionResponse[]>('/Accounts/evolution', {
          params: { month: currentMonth, year: currentYear },
          signal: controller.signal,
        });

        setMonthlyData(response.data.map((item) => ({
          label: formatMonthLabel(item.month, item.year),
          income: item.totalIncome,
          expense: item.totalExpenses,
          balance: item.balance,
        })));
      } catch {
        if (!controller.signal.aborted) {
          setErrorMessage('Não foi possível carregar a evolução financeira.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadEvolution();
    return () => controller.abort();
  }, [currentMonth, currentYear]);

  const width = 500;
  const height = 180;
  const padding = 40;
  const values = monthlyData.flatMap((data) => [data.income, data.expense, data.balance]);
  const minimumAmount = Math.min(0, ...values);
  const maximumAmount = Math.max(0, ...values);
  const amountRange = maximumAmount - minimumAmount || 1;
  const hasTransactions = monthlyData.some((data) =>
    data.income !== 0 || data.expense !== 0 || data.balance !== 0,
  );

  const getX = (index: number) => padding + (index * (width - padding * 2)) / (monthlyData.length - 1);
  const getY = (amount: number) => height - padding - (((amount - minimumAmount) / amountRange) * (height - padding * 2));
  const getPath = (value: keyof Pick<MonthlyData, 'income' | 'expense' | 'balance'>) =>
    monthlyData.map((data, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(data[value])}`).join(' ');

  const incomePath = getPath('income');
  const expensePath = getPath('expense');
  const balancePath = getPath('balance');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 mt-5 sm:mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase">
            Evolução Temporal
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Fluxo de caixa dos últimos 6 meses até {currentMonth}/{currentYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
            <span className="text-slate-600">Receitas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
            <span className="text-slate-600">Despesas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-500 rounded-full" />
            <span className="text-slate-600">Saldo</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="h-[180px] flex items-center justify-center text-sm font-medium text-slate-400">
          Carregando evolução financeira...
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="h-[180px] flex items-center justify-center text-center text-sm font-medium text-rose-500">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && !hasTransactions && (
        <div className="h-[180px] flex items-center justify-center text-sm font-medium text-slate-400">
          Nenhuma movimentação registrada neste período.
        </div>
      )}

      {!isLoading && !errorMessage && hasTransactions && (
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const yValue = height - padding - (ratio * (height - padding * 2));
              return (
                <line
                  key={ratio}
                  x1={padding}
                  y1={yValue}
                  x2={width - padding}
                  y2={yValue}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            <path d={incomePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={expensePath} fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={balancePath} fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {monthlyData.map((data, index) => (
              <g key={data.label} className="group/node cursor-pointer">
                {([
                  ['income', '#10B981', 'Receita'],
                  ['expense', '#F43F5E', 'Despesa'],
                  ['balance', '#0EA5E9', 'Saldo'],
                ] as const).map(([value, color, name]) => (
                  <g key={value}>
                    <circle cx={getX(index)} cy={getY(data[value])} r="4" fill="#FFFFFF" stroke={color} strokeWidth="2.5" />
                    <circle cx={getX(index)} cy={getY(data[value])} r="8" fill={color} className="opacity-0 group-hover/node:opacity-10 transition-opacity" />
                    <title>{`${name}: ${currencyFormatter.format(data[value])}`}</title>
                  </g>
                ))}
              </g>
            ))}

            {monthlyData.map((data, index) => (
              <text
                key={`label-${data.label}`}
                x={getX(index)}
                y={height - 12}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-400 font-sans"
              >
                {data.label}
              </text>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}