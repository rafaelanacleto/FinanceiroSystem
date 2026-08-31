import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';

// Importação dos seus Componentes
import { BalanceCard } from './components/BalanceCard';
import { HelpMenu } from './components/HelpMenu';
import { TransactionList } from './components/TransactionList';
import { FinancialChart } from './components/FinancialChart';
import { NewTransactionModal } from './components/NewTransactionModal';
import { ProfileUnderConstruction } from './components/ProfileUnderConstruction';
import { DateFilter } from './components/DateFilter';
import { FinancialTrends } from './components/FinancialTrends';
import { EvolutionChart } from './components/EvolutionChart';
import { NotificationCenter } from './components/NotificationCenter';
import { LoginForm } from './components/LoginForm';

type Page = 'dashboard' | 'relatorios' | 'configuracoes' | 'perfil' | 'ajuda';
type ThemeMode = 'light' | 'dark';

export function App() {
  const { user, initialized, signOut } = useAuth();

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem('financeiro-theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email || "Usuário";

  const handleTransactionCreated = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
    window.location.reload();
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('financeiro-theme', theme);
  }, [theme]);

  const mobileNavigation = [
    ['dashboard', 'Dashboard'],
    ['relatorios', 'Relatórios'],
    ['configuracoes', 'Configurações'],
    ['perfil', 'Perfil'],
    ['ajuda', 'Ajuda'],
  ] as const;

  if (!initialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10 sm:pb-20">
      {/* Substitua sua <nav> por esta */}
      <nav className="relative bg-white border-b border-slate-100 mb-5 sm:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0 gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">
                F
              </div>
              <span className="text-base sm:text-xl font-black text-slate-800 tracking-tighter truncate">FinanceiroPro</span>
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
              <button
                onClick={() => setCurrentPage('configuracoes')}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${currentPage === 'configuracoes' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
              >Configurações</button>
              <button
                onClick={() => setCurrentPage('perfil')}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${currentPage === 'perfil' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
              >Perfil</button>
              <button
                onClick={() => setCurrentPage('ajuda')}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${currentPage === 'ajuda' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
              >Ajuda</button>
            </div>
          </div>

          <div className="flex items-center shrink-0 gap-2 sm:gap-4">
            <NotificationCenter />
            <button
              onClick={() => signOut()}
              className="hidden md:block text-sm font-bold text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap"
            >
              Sair da conta
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className="md:hidden w-11 h-11 inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-full z-40 border-y border-slate-100 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 grid gap-1">
              {mobileNavigation.map(([page, label]) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`min-h-11 rounded-xl px-4 text-left text-sm font-bold transition-colors ${currentPage === page ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => signOut()}
                className="min-h-11 mt-2 rounded-xl border border-red-100 px-4 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* CABEÇALHO COM FILTRO DE DATA */}
        {currentPage !== 'configuracoes' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight break-words">Olá, {userName}! 👋</h2>
              <p className="text-slate-500 font-medium mt-1">
                Gerencie suas finanças de <span className="text-emerald-600 font-bold">{selectedMonth}/{selectedYear}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3 sm:gap-4">
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
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span className="text-xl">+</span> Nova Transação
              </button>
            </div>
          </div>
        )}

        {/* GRID DO DASHBOARD */}
        {currentPage === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">

            {/* COLUNA DA ESQUERDA (SALDO) */}
            <div className="lg:col-span-5 flex flex-col">
              <BalanceCard
                month={selectedMonth}
                year={selectedYear}
              />
            </div>

            {/* COLUNA DA DIREITA (GRÁFICO) */}
            <div className="lg:col-span-7">
              <FinancialChart
                month={selectedMonth}
                year={selectedYear}
              />
            </div>

            {/* NOVA COLUNA TESTE */}
            <div className="lg:col-span-5 flex flex-col">
              <FinancialTrends month={selectedMonth} year={selectedYear} />
            </div>

            <div className='lg:col-span-7'>
              {/* SEU NOVO GRÁFICO DE EVOLUÇÃO TEMPORAL AQUI */}
              <EvolutionChart
                currentMonth={selectedMonth}
                currentYear={selectedYear}
              />
            </div>

          </div>
        )}

        {/* PÁGINA DE RELATÓRIOS (EXTRATO DETALHADO) */}
        {currentPage === 'relatorios' && (
          <TransactionList
            month={selectedMonth}
            year={selectedYear}
            onEdit={(transaction) => {
              setTransactionToEdit(transaction);
              setIsModalOpen(true);
            }}
          />
        )}

        {currentPage === 'configuracoes' && (
          <section className="max-w-3xl">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configurações</h2>
              <p className="text-slate-500 font-medium mt-1">Personalize a aparência do sistema.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-800">Tema</h3>
                <p className="text-sm text-slate-500 mt-1">Escolha entre modo claro e modo escuro.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    theme === 'light'
                      ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-base font-black text-slate-800">Claro</p>
                  <p className="text-xs text-slate-500 mt-1">Visual limpo com fundo claro.</p>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    theme === 'dark'
                      ? 'border-emerald-500 bg-emerald-950/30 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-base font-black text-slate-800">Escuro</p>
                  <p className="text-xs text-slate-500 mt-1">Menos brilho para uso noturno.</p>
                </button>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'perfil' && (
          <ProfileUnderConstruction />
        )}

        {/* PÁGINA DE RELATÓRIOS (AJUDA) */}
        {currentPage === 'ajuda' && (
          <HelpMenu />
        )}
      </main>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <NewTransactionModal 
          onClose={() => {
            setIsModalOpen(false);
            setTransactionToEdit(null);
          }} 
          onTransactionCreated={handleTransactionCreated}
          transactionToEdit={transactionToEdit}
        />
      )}
    </div>
  );
}