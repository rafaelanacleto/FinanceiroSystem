import { BalanceCard } from './components/BalanceCard';

function App() {
  return (
    // 'min-h-screen' faz ocupar a tela toda, 'bg-slate-50' dá um fundo cinza claro
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-bold text-slate-800">Meu Dashboard Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <BalanceCard label="Saldo Disponível" amount={1250.50} />
        <BalanceCard label="Investimentos" amount={-450.00} />
      </div>
    </div>
  );
}

export default App;