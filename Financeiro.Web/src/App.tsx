import { useEffect, useState } from 'react';
import { BalanceCard } from './components/BalanceCard';
import api from './services/api';
import keycloak from './auth';

function App() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Gatilho que roda assim que o componente aparece na tela
  useEffect(() => {
    async function fetchBalance() {
      try {
        // Chamada para o seu endpoint da AccountsController
        // Supondo que você tenha um: GET /api/accounts/balance
        const response = await api.get('/Accounts/balance');
        setBalance(response.data.amount);
      } catch (error) {
        console.error("Erro ao buscar saldo Rafi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Financeiro Pro</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">Olá, {keycloak.tokenParsed?.preferred_username}</span>
          <button 
            onClick={() => keycloak.logout()}
            className="bg-slate-200 hover:bg-red-100 hover:text-red-600 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </header>
      
      <div className="w-full max-w-4xl">
        {loading ? (
          <p className="text-slate-500">Carregando saldo...</p>
        ) : (
          <BalanceCard label="Saldo em Conta" amount={balance} />
        )}
      </div>
    </div>
  );
}

export default App;