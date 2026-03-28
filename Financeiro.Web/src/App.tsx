import { useEffect, useState } from 'react';
import { BalanceCard } from './components/BalanceCard';
import { NewTransactionModal } from './components/NewTransactionModal';
import { TransactionList } from './components/TransactionList'; // Componente que criaremos a seguir
import api from './services/api';
import keycloak from './auth';

function App() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'extrato'>('dashboard');
  const [userName] = useState(keycloak.tokenParsed?.given_name || "Usuário");

  // Busca o saldo atualizado
  async function fetchBalance() {
    try {
      const response = await api.get('/Accounts/balance');
      const amount = response.data.amount ?? response.data.balance ?? 0;
      setBalance(amount);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER FIXO */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <span className="text-white font-black text-xl">F</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Financeiro<span className="text-emerald-600">Pro</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:block">Olá, {userName}</span>
            <button 
              onClick={() => keycloak.logout()}
              className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* MENU DE NAVEGAÇÃO (TABS) */}
        <div className="flex gap-8 mb-8 border-b border-slate-200">
          <button 
            onClick={() => setView('dashboard')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              view === 'dashboard' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Resumo
            {view === 'dashboard' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 animate-in fade-in italic" />}
          </button>
          
          <button 
            onClick={() => setView('extrato')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              view === 'extrato' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Extrato Detalhado
            {view === 'extrato' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 animate-in fade-in" />}
          </button>
        </div>

        {/* CONTEÚDO CONDICIONAL */}
        {view === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-800">Meu Dashboard</h2>
              <p className="text-slate-500 text-sm">Visão geral das suas finanças.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1 space-y-6">
                {loading ? (
                  <div className="h-32 w-full bg-slate-200 animate-pulse rounded-2xl" />
                ) : (
                  <BalanceCard label="Saldo Atual" amount={balance} />
                )}
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <p className="text-blue-700 text-xs font-semibold leading-relaxed">
                    💡 Dica: Use o formulário ao lado para registrar suas movimentações diárias.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <NewTransactionModal onTransactionCreated={fetchBalance} />
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-800">Histórico de Lançamentos</h2>
              <p className="text-slate-500 text-sm">Consulte todas as suas receitas e despesas.</p>
            </header>
            
            <TransactionList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;