interface EvolutionChartProps {
  currentMonth: number;
  currentYear: number;
}

export function EvolutionChart({ currentMonth, currentYear }: EvolutionChartProps) {
  // Simulando histórico dos últimos 6 meses com base no mês/ano atual
  const monthlyData = [
    { label: 'Fev', income: 4200, expense: 3100 },
    { label: 'Mar', income: 4500, expense: 3800 },
    { label: 'Abr', income: 4100, expense: 2900 },
    { label: 'Mai', income: 5200, expense: 3500 },
    { label: 'Jun', income: 4900, expense: 4100 },
    { label: 'Jul', income: 5500, expense: 3400 },
  ];

  // Configurações para mapeamento do SVG dinâmico
  const width = 500;
  const height = 180;
  const padding = 40;

  const maxAmount = Math.max(...monthlyData.flatMap(d => [d.income, d.expense])) * 1.1;

  // Função auxiliar para converter valores financeiros em coordenadas Y do SVG
  const getX = (index: number) => padding + (index * (width - padding * 2)) / (monthlyData.length - 1);
  const getY = (amount: number) => height - padding - ((amount / maxAmount) * (height - padding * 2));

  // Gerando as strings de caminhos (path) para as linhas do gráfico
  const incomePath = monthlyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.income)}`).join(' ');
  const expensePath = monthlyData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.expense)}`).join(' ');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase">
            Evolução Temporal
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Análise de fluxo de caixa dos últimos 6 meses ({currentMonth}/{currentYear})
          </p>
        </div>

        {/* Legendas customizadas */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
            <span className="text-slate-600">Receitas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
            <span className="text-slate-600">Despesas</span>
          </div>
        </div>
      </div>

      {/* Área do Gráfico em SVG */}
      <div className="w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible"
        >
          {/* Linhas de Grade de Fundo (Y) */}
          {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const yVal = height - padding - (ratio * (height - padding * 2));
            return (
              <line
                key={idx}
                x1={padding}
                y1={yVal}
                x2={width - padding}
                y2={yVal}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Linha de Receitas (Glow + Linha Principal) */}
          <path
            d={incomePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)]"
          />

          {/* Linha de Despesas (Glow + Linha Principal) */}
          <path
            d={expensePath}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_4px_rgba(244,63,94,0.2)]"
          />

          {/* Pontos de Interação das Receitas */}
          {monthlyData.map((d, i) => (
            <g key={`inc-${i}`} className="group/node cursor-pointer">
              <circle
                cx={getX(i)}
                cy={getY(d.income)}
                r="4"
                fill="#FFFFFF"
                stroke="#10B981"
                strokeWidth="2.5"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.income)}
                r="8"
                fill="#10B981"
                className="opacity-0 group-hover/node:opacity-10 transition-opacity"
              />
              <title>{`Receita: R$ ${d.income}`}</title>
            </g>
          ))}

          {/* Pontos de Interação das Despesas */}
          {monthlyData.map((d, i) => (
            <g key={`exp-${i}`} className="group/node cursor-pointer">
              <circle
                cx={getX(i)}
                cy={getY(d.expense)}
                r="4"
                fill="#FFFFFF"
                stroke="#F43F5E"
                strokeWidth="2.5"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.expense)}
                r="8"
                fill="#F43F5E"
                className="opacity-0 group-hover/node:opacity-10 transition-opacity"
              />
              <title>{`Despesa: R$ ${d.expense}`}</title>
            </g>
          ))}

          {/* Eixo X - Rótulos dos Meses */}
          {monthlyData.map((d, i) => (
            <text
              key={`label-${i}`}
              x={getX(i)}
              y={height - 12}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-400 font-sans"
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}