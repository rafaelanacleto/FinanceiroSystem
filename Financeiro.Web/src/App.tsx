import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

// Importação dos seus Componentes
import { BalanceCard } from './components/BalanceCard';
import { TransactionList } from './components/TransactionList';
import { FinancialChart } from './components/FinancialChart';
import { NewTransactionModal } from './components/NewTransactionModal';
import { DateFilter } from './components/DateFilter';

type Page = 'dashboard' | 'relatorios';

export function App() {
  const { keycloak, initialized } = useKeycloak();

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const userName = keycloak?.tokenParsed?.given_name || "Usuário";

  const handleTransactionCreated = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    window.location.reload();
  };

  if (!initialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Substitua sua <nav> por esta */}
      <nav className="bg-white border-b border-slate-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">
                F
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tighter">FinanceiroPro</span>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${currentPage === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
              >Dashboard</button>
              <button
                onClick={() => setCurrentPage('relatorios')}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${currentPage === 'relatorios' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
              >Relatórios</button>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-600 px-4 py-2 transition-colors">Configurações</a>
            </div>
          </div>

          <button
            onClick={() => keycloak.logout()}
            className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">

        {/* CABEÇALHO COM FILTRO DE DATA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Olá, {userName}! 👋</h2>
            <p className="text-slate-500 font-medium mt-1">
              Gerencie suas finanças de <span className="text-emerald-600 font-bold">Março/2026</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* COMPONENTE DE FILTRO QUE CRIAMOS */}
            <DateFilter
              month={selectedMonth}
              year={selectedYear}
              onChange={(m, y) => {
                setSelectedMonth(m);
                setSelectedYear(y);
              }}
            />

            <button
              onClick={() => setIsModalOpen(true)} // Apenas abre o modal
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              <span className="text-xl">+</span> Nova Transação
            </button>
          </div>
        </div>

        {/* GRID DO DASHBOARD */}
        {currentPage === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* COLUNA DA ESQUERDA (SALDO) */}
            <div className="lg:col-span-4 space-y-8">
              <BalanceCard
                month={selectedMonth}
                year={selectedYear}
              />
            </div>

            {/* COLUNA DA DIREITA (GRÁFICO) */}
            <div className="lg:col-span-8">
              <FinancialChart
                month={selectedMonth}
                year={selectedYear}
              />
            </div>

          </div>
        )}

        {/* PÁGINA DE RELATÓRIOS (EXTRATO DETALHADO) */}
        {currentPage === 'relatorios' && (
          <TransactionList
            month={selectedMonth}
            year={selectedYear}
            onEdit={(t) => {
              setEditingTransaction(t);
              setIsModalOpen(true);
            }}
          />
        )}
      </main>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <NewTransactionModal 
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }} 
          onTransactionCreated={handleTransactionCreated}
        />
      )}
    </div>
  );
}