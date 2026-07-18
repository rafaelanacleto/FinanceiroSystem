import { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Keyboard,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle
} from 'lucide-react'; // Instale lucide-react para ícones, ou substitua por SVGs

export function HelpMenu() {

  // const [openFaq, setOpenFaq] = useState({});

  // Para esta:
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});

  const faqItems = [
    {
      question: "Como faço para cadastrar uma transação recorrente?",
      answer: "No momento de clicar em '+ Nova Transação', você pode marcar a opção de recorrência (mensal, semanal, etc.) para que o sistema gere automaticamente os lançamentos para os meses seguintes."
    },
    {
      question: "Posso importar dados de extratos bancários (OFX/CSV)?",
      answer: "Sim! Você pode importar seus arquivos de extrato diretamente na tela de Configurações para realizar a conciliação de forma massiva e rápida."
    },
    {
      question: "Como funciona o cálculo do saldo do período?",
      answer: "O saldo é a soma de todas as suas receitas confirmadas menos as despesas do período selecionado no filtro do topo. Lançamentos futuros não consolidados não alteram o saldo atual."
    },
    {
      question: "Meus dados financeiros estão seguros?",
      answer: "Com certeza. No FinanceiroPro, utilizamos criptografia de ponta a ponta e as melhores práticas de segurança de dados para garantir que suas finanças permaneçam estritamente privadas."
    }
  ];

  const shortcuts = [
    { key: "N", desc: "Abrir o modal de Nova Transação" },
    { key: "+", desc: "Abrir o modal de Nova Transação" },
    { key: "D", desc: "Ir para a tela do Dashboard" },
    { key: "R", desc: "Ir para a tela de Relatórios" },
    { key: "Esc", desc: "Fechar modais ou cancelar ações" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 text-slate-800">

      {/* TÍTULO DA PÁGINA */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Como podemos ajudar?</h1>
        <p className="mt-2 text-slate-500">Tire suas dúvidas sobre o funcionamento do FinanceiroPro e veja como otimizar seu controle.</p>
      </div>

      {/* SEÇÃO 1: PRIMEIROS PASSOS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-900">Primeiros Passos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold mb-4 text-sm">
              1
            </span>
            <h3 className="font-semibold text-slate-900 mb-2">Configure Categorias</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Defina seus limites de gastos e personalize as tags de categorias no menu de configurações.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold mb-4 text-sm">
              2
            </span>
            <h3 className="font-semibold text-slate-900 mb-2">Saldo Inicial</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Cadastre seu saldo inicial através de um lançamento de receita para começar seu histórico de forma correta.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold mb-4 text-sm">
              3
            </span>
            <h3 className="font-semibold text-slate-900 mb-2">Lance Diariamente</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Use o botão <strong className="text-emerald-600 font-medium">+ Nova Transação</strong> para registrar receitas ou despesas assim que elas ocorrerem.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold mb-4 text-sm">
              4
            </span>
            <h3 className="font-semibold text-slate-900 mb-2">Analise Relatórios</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Veja gráficos detalhados para entender para onde seu dinheiro está indo e onde você pode poupar.</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: PERGUNTAS FREQUENTES (FAQ) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-900">Perguntas Frequentes (FAQ)</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 divide-y divide-slate-100 overflow-hidden">
          {faqItems.map((item, index) => (
            <div key={index} className="group">
              <button
                type="button"
                onClick={() => {
                  setOpenFaq(prev => ({
                    ...prev,
                    [index]: !prev[index]
                  }));
                }}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-slate-800 hover:bg-slate-50/50 transition-colors"
              >
                <span>{item.question}</span>
                {openFaq[index] ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                )}
              </button>
              {openFaq[index] && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-500 leading-relaxed bg-slate-50/30">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 3 & 4 EM DUAS COLUNAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* SEÇÃO 3: ATALHOS DO TECLADO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Keyboard className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Atalhos de Teclado</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 space-y-4">
            <p className="text-sm text-slate-500">Agilize sua navegação diária utilizando os atalhos abaixo:</p>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-slate-600">{shortcut.desc}</span>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-md shadow-sm">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: SUPORTE E FEEDBACK */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Suporte e Feedback</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Card Sugestões */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Sugerir Melhorias</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Sentiu falta de algum recurso ou tem ideias para deixar o app ainda melhor? Envie para nós!</p>
                <a href="mailto:feedback@financeiropro.com" className="inline-block mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Enviar sugestão →
                </a>
              </div>
            </div>

            {/* Card Reportar Erro */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Reportar Bug</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Se alguma coisa não está funcionando como deveria, nos avise para corrigirmos o quanto antes.</p>
                <a href="mailto:suporte@financeiropro.com" className="inline-block mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Abrir chamado →
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}