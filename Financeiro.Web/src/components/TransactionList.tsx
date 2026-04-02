import { useEffect, useState } from 'react';
import api from '../services/api';
import { CATEGORIES } from './NewTransactionModal';

// Imports para exportação
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ListProps {
  month: number;
  year: number;
  onEdit: (transaction: any) => void; // Nova prop para abrir o modal de edição
}

export function TransactionList({ month, year, onEdit }: ListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const response = await api.get(`/Accounts/transactions?month=${month}&year=${year}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  // Função para excluir transação
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este lançamento?")) return;

    try {
      await api.delete(`/Accounts/transactions/${id}`);
      // Remove da lista local para dar feedback imediato
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir transação.");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  // --- LÓGICA DE EXPORTAÇÃO EXCEL ---
  const exportToExcel = () => {
    const dataToExport = transactions.map(t => ({
      Descrição: t.description,
      Categoria: t.category,
      Tipo: t.type === 0 ? 'Receita' : 'Despesa',
      Valor: t.amount,
      Data: new Date(t.createdAt).toLocaleDateString('pt-BR')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
    XLSX.writeFile(workbook, `Extrato_${month}_${year}.xlsx`);
  };

  // --- LÓGICA DE EXPORTAÇÃO PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Extrato Financeiro - ${month}/${year}`, 14, 15);
    
    const tableRows = transactions.map(t => [
      t.description,
      t.category,
      t.type === 0 ? 'Receita' : 'Despesa',
      t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      new Date(t.createdAt).toLocaleDateString('pt-BR')
    ]);

    autoTable(doc, {
      head: [['Descrição', 'Categoria', 'Tipo', 'Valor', 'Data']],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] } 
    });

    doc.save(`Extrato_${month}_${year}.pdf`);
  };

  if (loading) return <div className="py-10 text-center text-slate-400 animate-pulse">Buscando extrato...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Extrato Detalhado</h3>
        
        <div className="flex gap-2">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            📊 EXCEL
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-black hover:bg-red-100 transition-all border border-red-100"
          >
            📄 PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">Descrição</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Valor</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Ações / Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">
                      {CATEGORIES.find(c => c.id === t.category)?.icon || '🏷️'}
                    </div>
                    <div>
                      <p className="font-black text-slate-700 leading-tight">{t.description}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.category}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 text-right font-black text-lg ${t.type === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {t.type === 0 ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-6 py-4 text-center">
                  {/* Container que alterna entre Data e Botões de Ação */}
                  <div className="relative flex items-center justify-center h-full">
                    {/* Data (visível por padrão) */}
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter group-hover:opacity-0 transition-opacity">
                      {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                    </span>

                    {/* Botões (visíveis no hover) */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(t)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
                        title="Editar"
                      >
                        <span className="text-sm">✏️</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
                        title="Excluir"
                      >
                        <span className="text-sm">🗑️</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhuma movimentação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}