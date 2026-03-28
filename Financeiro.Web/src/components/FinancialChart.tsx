import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';

export function FinancialChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSummary() {
    try {
      const response = await api.get('/Accounts/summary');
      const { totalIncome, totalExpenses } = response.data;

      // Formatando para o formato que o Recharts entende
      const chartData = [
        { name: 'Receitas', value: totalIncome || 0 },
        { name: 'Despesas', value: Math.abs(totalExpenses || 0) },
      ];

      setData(chartData);
    } catch (error) {
      console.error("Erro ao buscar resumo para o gráfico:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  const COLORS = ['#10b981', '#ef4444']; // Emerald-500 e Red-500 do Tailwind

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-400">Calculando proporções...</div>;

  const hasData = data.some(item => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full min-h-[350px]">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Distribuição de Fluxo</h3>
      
      {hasData ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl">📊</div>
           <p className="text-sm font-medium">Sem dados para exibir o gráfico</p>
        </div>
      )}
    </div>
  );
}