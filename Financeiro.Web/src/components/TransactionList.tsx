import { useEffect, useState } from 'react';
import api from '../services/api';

export function TransactionList() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTransactions() {
    try {
      setError(null);
      const response = await api.get('/Accounts/transactions');
      setTransactions(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);
      setError(err.response?.status === 405 
        ? "Erro 405: O Backend não permite GET nesta rota. Verifique o Controller." 
        : "Não foi possível carregar o extrato.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400 animate-pulse font-medium">Buscando histórico...</div>;

  if (error) return (
    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center">
      <p className="font-bold">Ops! Algo deu errado</p>
      <p className="text-sm">{error}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Descrição</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right">Valor</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{t.description}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    t.type === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {t.type === 0 ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-mono font-bold text-lg ${
                  t.type === 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {t.type === 0 ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                  {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <div className="py-20 text-center text-slate-400 font-medium">Nenhum registro encontrado.</div>
      )}
    </div>
  );
}