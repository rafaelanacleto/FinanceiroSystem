import { useEffect, useState } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CATEGORIES } from './NewTransactionModal';

export function TransactionList() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions() {
    try {
      const response = await api.get('/Accounts/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- FUNÇÃO PARA EXPORTAR EXCEL ---
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map(t => ({
        Descrição: t.description,
        Tipo: t.type === 0 ? 'Receita' : 'Despesa',
        Valor: t.amount,
        Categoria: t.category,
        Data: new Date(t.createdAt).toLocaleDateString('pt-BR')
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
    XLSX.writeFile(workbook, "Extrato_Financeiro.xlsx");
  };

  // --- FUNÇÃO PARA EXPORTAR PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Extrato Detalhado - FinanceiroPro", 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['Descrição', 'Tipo', 'Valor', 'Categoria', 'Data']],
      body: transactions.map(t => [
        t.description,
        t.type === 0 ? 'Receita' : 'Despesa',
        `R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        t.category,
        new Date(t.createdAt).toLocaleDateString('pt-BR')
      ]),
      headStyles: { fillColor: [16, 185, 129] }, // Cor Emerald-600
    });

    doc.save("Extrato_Financeiro.pdf");
  };

  if (loading) return <div className="text-center py-20 text-slate-400 animate-pulse">Carregando...</div>;

  return (
    <div className="space-y-4">
      {/* BARRA DE AÇÕES (BOTÕES DE EXPORTAÇÃO) */}
      <div className="flex justify-end gap-3">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all border border-emerald-200"
        >
          <span>📊</span> Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-200"
        >
          <span>📄</span> PDF
        </button>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-center">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{t.description}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${t.type === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {t.type === 0 ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Ícone Dinâmico baseado na categoria */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-sm">
                        {CATEGORIES.find(c => c.id === t.category)?.icon || '🏷️'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 leading-tight">{t.description}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold text-lg ${t.type === 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                    {t.type === 0 ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium text-center">
                    {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="py-20 text-center text-slate-400">Nenhum registro para exportar.</div>
        )}
      </div>
    </div>
  );
}