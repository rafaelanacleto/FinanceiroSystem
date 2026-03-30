import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { CATEGORIES } from './NewTransactionModal';

export function FinancialChart({ month, year }: { month: number, year: number }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  async function fetchSummary() {
    try {
      const response = await api.get(`/Accounts/summary?month=${month}&year=${year}`);
      const raw = response.data.categoryExpenses || [];
      
      const chartData = raw.map((item: any) => {
        const config = CATEGORIES.find(c => c.id === item.category);
        return {
          name: item.category,
          value: Number(item.total),
          // Mapeamento de cores Tailwind para Hex real
          color: config ? getColorHex(config.color) : '#94a3b8'
        };
      }).filter((i: any) => i.value > 0);

      setData(chartData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function getColorHex(colorClass: string) {
    if (colorClass.includes('orange')) return '#f97316';
    if (colorClass.includes('blue')) return '#3b82f6';
    if (colorClass.includes('purple')) return '#a855f7';
    if (colorClass.includes('red')) return '#ef4444';
    if (colorClass.includes('emerald')) return '#10b981';
    if (colorClass.includes('indigo')) return '#6366f1';
    return '#64748b';
  }

  useEffect(() => { fetchSummary(); }, []);

  if (loading) return <div className="h-[350px] flex items-center justify-center text-slate-400">Carregando análise...</div>;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col">
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Análise de Gastos</h3>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Por Categoria</p>
      </div>

      <div className="flex-1 min-h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}  // Faz o efeito "Donut" (buraco no meio)
              outerRadius={100}
              paddingAngle={8}  // Espaço entre as fatias
              dataKey="value"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value) => typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              formatter={(value) => <span className="text-slate-600 font-medium text-sm ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}