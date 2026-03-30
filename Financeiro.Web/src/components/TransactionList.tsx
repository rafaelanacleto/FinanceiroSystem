import { useEffect, useState } from 'react';
import api from '../services/api';
import { CATEGORIES } from './NewTransactionModal';

interface ListProps {
  month: number;
  year: number;
}

export function TransactionList({ month, year }: ListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions() {
    setLoading(true);
    try {
      // Filtramos o extrato por mês e ano também
      const response = await api.get(`/Accounts/transactions?month=${month}&year=${year}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [month, year]); // Recarrega quando a data mudar

  if (loading) return <div className="py-10 text-center text-slate-400 animate-pulse">Buscando extrato...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Descrição</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Valor</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {CATEGORIES.find(c => c.id === t.category)?.icon || '🏷️'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{t.description}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{t.category}</p>
                  </div>
                </div>
              </td>
              <td className={`px-6 py-4 text-right font-bold ${t.type === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === 0 ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td className="px-6 py-4 text-sm text-slate-400 text-center">
                {new Date(t.createdAt).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && (
        <div className="py-12 text-center text-slate-400 font-medium">Nenhuma movimentação neste mês.</div>
      )}
    </div>
  );
}