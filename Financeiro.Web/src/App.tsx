import { useEffect, useState } from 'react';
import { BalanceCard } from './components/BalanceCard';
import { NewTransactionModal } from './components/NewTransactionModal';
import { TransactionList } from './components/TransactionList';
import { FinancialChart } from './components/FinancialChart'; // NOVO
import api from './services/api';
import keycloak from './auth';

function App() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'extrato'>('dashboard');
  const [userName] = useState(keycloak.tokenParsed?.given_name || "Usuário");

  // RefetchKey serve para forçar o gráfico a atualizar quando uma nova transação for criada
  const [refreshKey, setRefreshKey] = useState(0);

  async function fetchBalance() {
    try {
      const response = await api.get('/Accounts/balance');
      const amount = response.data.amount ?? response.data.balance ?? 0;
      setBalance(amount);
      // Sempre que o saldo atualiza, avisamos para os outros componentes recarregarem
      setRefreshKey(prev => prev + 1);
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
      {/* HEADER */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-600">
             <span className="font-black text-2xl">💰</span>
             <h1 className="text-xl font-bold tracking-tight text-slate-800">Financeiro<span className="text-emerald-600">Pro</span></h1>
          </div>
          <button onClick={() => keycloak.logout()} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Sair da Conta</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* TABS MENU */}
        <div className="flex gap-8 mb-8 border-b border-slate-200">
          <button onClick={() => setView('dashboard')} className={`pb-4 text-sm font-bold transition-all ${view === 'dashboard' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Dashboard</button>
          <button onClick={() => setView('extrato')} className={`pb-4 text-sm font-bold transition-all ${view === 'extrato' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Extrato Detalhado</button>
        </div>

        {view === 'dashboard' ? (
          <div className="animate-in fade-in duration-500 space-y-8">
            <header>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Olá, {userName}!</h2>
              <p className="text-slate-500">Veja como estão suas finanças hoje.</p>
            </header>

            {/* GRID DO DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* COLUNA ESQUERDA: CARDS E GRÁFICO */}
              <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BalanceCard label="Saldo Total" amount={balance} />
                  {/* Você pode criar outro BalanceCard para "Gasto do Mês" aqui depois */}
                </div>
                
                {/* O gráfico recebe a refreshKey para atualizar sozinho */}
                <FinancialChart key={refreshKey} />
              </div>

              {/* COLUNA DIREITA: FORMULÁRIO */}
              <div className="lg:col-span-4">
                <NewTransactionModal onTransactionCreated={fetchBalance} />
                
                <div className="mt-6 p-6 bg-slate-800 rounded-3xl text-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status da API</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <p className="text-sm font-medium">Conectado ao SQL Server</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <TransactionList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;