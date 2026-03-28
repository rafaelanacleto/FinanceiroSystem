import { useState } from 'react';
import api from '../services/api';

interface NewTransactionModalProps {
  onTransactionCreated: () => void;
}

export function NewTransactionModal({ onTransactionCreated }: NewTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  // 0 = Income (Receita), 1 = Expense (Despesa) - Verifique o seu Enum no C#
  const [type, setType] = useState<number>(0); 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      // O objeto enviado deve bater com o seu CreateTransactionCommand no C#
      await api.post('/Accounts/transactions', {
        description,
        amount: Math.abs(Number(amount)), // Enviamos o valor sempre positivo
        type: type // A API decide se soma ou subtrai baseada no Type
      });

      onTransactionCreated();
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar transação");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Novo Lançamento</h3>

      <div className="space-y-4">
        {/* SELETOR DE TIPO (RADIO BUTTONS ESTILIZADOS) */}
        <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
          <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer transition-all ${type === 0 ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}>
            <input type="radio" className="hidden" name="type" value={0} checked={type === 0} onChange={() => setType(0)} />
            <span className="text-sm font-bold">Receita</span>
          </label>
          
          <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer transition-all ${type === 1 ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}>
            <input type="radio" className="hidden" name="type" value={1} checked={type === 1} onChange={() => setType(1)} />
            <span className="text-sm font-bold">Despesa</span>
          </label>
        </div>

        <input 
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          placeholder="Descrição (ex: Salário, Aluguel...)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <input 
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-lg"
          placeholder="0,00"
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />

        <button 
          type="submit" 
          className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${type === 0 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
        >
          Confirmar {type === 0 ? 'Receita' : 'Despesa'}
        </button>
      </div>
    </form>
  );
}