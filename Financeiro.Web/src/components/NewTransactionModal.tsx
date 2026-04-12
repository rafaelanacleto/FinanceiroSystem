import { useState } from 'react';
import api from '../services/api';

interface NewTransactionModalProps {
  onClose: () => void;           // Agora vamos usar essa prop!
  onTransactionCreated: () => void; 
}

export const CATEGORIES = [
  { id: 'Alimentação', icon: '🍎', color: 'bg-orange-100 text-orange-700' },
  { id: 'Moradia', icon: '🏠', color: 'bg-blue-100 text-blue-700' },
  { id: 'Transporte', icon: '🚗', color: 'bg-slate-100 text-slate-700' },
  { id: 'Lazer', icon: '🎉', color: 'bg-purple-100 text-purple-700' },
  { id: 'Saúde', icon: '🏥', color: 'bg-red-100 text-red-700' },
  { id: 'Salário', icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'Educação', icon: '📚', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'Outros', icon: '🏷️', color: 'bg-slate-100 text-slate-600' },
  { id: 'Investimentos', icon: '📈', color: 'bg-green-100 text-green-700' },
  { id: 'Assinaturas', icon: '📅', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'Presentes', icon: '🎁', color: 'bg-pink-100 text-pink-700' },
  { id: 'Viagem', icon: '✈️', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'Pets', icon: '🐶', color: 'bg-rose-100 text-rose-700' },
  { id: 'Freelance', icon: '🖥️', color: 'bg-violet-100 text-violet-700' },
  { id: 'Doações', icon: '🙏', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'Impostos', icon: '🧾', color: 'bg-red-100 text-red-700' },
  { id: 'Roupas', icon: '👗', color: 'bg-pink-100 text-pink-700' },
  { id: 'Cuidados Pessoais', icon: '✂️', color: 'bg-teal-100 text-teal-700' },
  { id: 'Contas Fixas', icon: '⚡', color: 'bg-amber-100 text-amber-700' },
  { id: 'Empréstimos', icon: '💸', color: 'bg-stone-100 text-stone-700' },
  { id: 'Seguros', icon: '🛡️', color: 'bg-blue-200 text-blue-800' },
  { id: 'Manutenção', icon: '🛠️', color: 'bg-gray-200 text-gray-800' },
  { id: 'Vendas', icon: '🤝', color: 'bg-lime-100 text-lime-700' },
  { id: 'Internet & Celular', icon: '🌐', color: 'bg-sky-100 text-sky-700' },
  { id: 'Streaming', icon: '📺', color: 'bg-red-200 text-red-800' },
  { id: 'Academia', icon: '💪', color: 'bg-orange-200 text-orange-800' },
  { id: 'Beleza', icon: '💄', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'Reembolsos', icon: '🔙', color: 'bg-emerald-200 text-emerald-800' },
  { id: 'Taxas Bancárias', icon: '🏦', color: 'bg-slate-200 text-slate-800' },
];

export function NewTransactionModal({ onClose, onTransactionCreated }: NewTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Outros');
  const [type, setType] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/Accounts/transactions', {
        description,
        amount: Math.abs(Number(amount)),
        type: type,
        category: category
      });

      // Sucesso!
      onTransactionCreated(); // Isso vai dar o refresh e fechar o modal no App.tsx
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    // CAMADA 1: BACKDROP (Fundo escuro)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={onClose} // Fecha se clicar fora do card branco
    >
      
      {/* CAMADA 2: O CARD DO MODAL */}
      <div 
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do formulário feche o modal
      >
        
        {/* BOTÃO FECHAR (X) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <span className="text-2xl">✕</span>
        </button>

        <h3 className="text-2xl font-black text-slate-800 mb-6">Novo Lançamento</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SELETOR DE TIPO */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType(0)}
              className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold transition-all ${type === 0 ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Receita
            </button>

            <button
              type="button"
              onClick={() => setType(1)}
              className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold transition-all ${type === 1 ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Despesa
            </button>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Descrição</label>
              <input
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700 font-medium"
                placeholder="Ex: Aluguel, Compra de Março..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Valor (R$)</label>
                <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                  placeholder="0,00"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 cursor-pointer appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* BOTÃO SALVAR */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 
              type === 0 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'
            }`}
          >
            {loading ? (
               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              `Confirmar ${type === 0 ? 'Receita' : 'Despesa'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}