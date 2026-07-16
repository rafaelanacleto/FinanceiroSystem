import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Terminal, 
  Wrench, 
  Sparkles, 
  RefreshCw, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LogMessage {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warn';
}

export function ProfileUnderConstruction() {
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState<boolean>(false);

  // Mensagens divertidas para o "Terminal de Calibração"
  const logTemplates: Omit<LogMessage, 'id'>[] = [
    { text: "Iniciando verificação de credenciais de Rafael...", type: "info" },
    { text: "Conectando ao banco de dados PostgreSQL...", type: "info" },
    { text: "Verificando se o saldo do período de R$ -5,00 é um bug ou apenas realidade...", type: "warn" },
    { text: "Otimizando consultas de transações...", type: "info" },
    { text: "Limpando caches de cache do Docker...", type: "success" },
    { text: "Desviando de meteoros de bugs...", type: "warn" },
    { text: "Criptografando chaves de segurança...", type: "success" },
    { text: "Sincronizando fuso horário de Esteio, RS...", type: "info" },
    { text: "Calibração concluída! Painel de Perfil pronto para o lançamento.", type: "success" },
  ];

  const startCalibration = () => {
    if (isCalibrating) return;
    
    setIsCalibrating(true);
    setCalibrationProgress(0);
    setLogs([]);
    setSecretUnlocked(false);

    let currentProgress = 0;
    let logIndex = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsCalibrating(false);
        setSecretUnlocked(true);
      }

      setCalibrationProgress(currentProgress);

      // Adiciona logs gradualmente com base no progresso
      const targetLogCount = Math.floor((currentProgress / 100) * logTemplates.length);
      if (logIndex < targetLogCount && logIndex < logTemplates.length) {
        const nextLog = logTemplates[logIndex];
        setLogs(prev => [...prev, { ...nextLog, id: Date.now() + logIndex }]);
        logIndex++;
      }
    }, 250);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-slate-800">
      
      {/* CARD PRINCIPAL - FEEDBACK DE CONSTRUÇÃO */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12 text-center space-y-6">
        
        {/* Detalhes de Background Decorativos */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

        {/* Ícone Animado */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping scale-150 opacity-25"></div>
          <div className="relative p-6 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
            <User className="w-12 h-12" />
            <Wrench className="w-6 h-6 absolute -bottom-1 -right-1 bg-slate-900 text-white rounded-lg p-1 border-2 border-white animate-bounce" />
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Área em Otimização Orbitária
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Seu Painel de Perfil está em Construção!
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Estamos polindo as ferramentas de edição, upload de avatar e configurações de segurança para que fiquem tão rápidas quanto o seu backend.
          </p>
        </div>

        {/* Barra de Progresso Interativa */}
        <div className="max-w-md mx-auto space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500">
            <span>Status do Motor do Perfil</span>
            <span className="font-mono text-emerald-600">{calibrationProgress}%</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${calibrationProgress}%` }}
            ></div>
          </div>

          <button
            onClick={startCalibration}
            disabled={isCalibrating}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isCalibrating
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-950 text-white hover:bg-slate-800 shadow-md active:scale-[0.98]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isCalibrating ? 'animate-spin' : ''}`} />
            {calibrationProgress === 0 ? 'Calibrar Módulos do Perfil' : isCalibrating ? 'Calibrando...' : 'Recalibrar Módulos'}
          </button>
        </div>
      </div>

      {/* SEÇÃO ABAIXO - LOG DE CALIBRAÇÃO (TERMINAL) */}
      {(logs.length > 0 || isCalibrating) && (
        <div className="bg-slate-950 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-xs shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold">
              <Terminal className="w-4 h-4 text-emerald-500" /> terminal@financeiropro:~
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                {log.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                {log.type === 'warn' && <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
                {log.type === 'info' && <span className="text-blue-400 shrink-0">$&gt;</span>}
                <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-amber-400' : ''}>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EASTER EGG / SEGREDO DESBLOQUEADO */}
      {secretUnlocked && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg border border-emerald-400/30 animate-fade-in flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base flex items-center gap-1.5">
              <Sparkles className="w-5 h-5" /> Módulos Alinhados com Sucesso!
            </h4>
            <p className="text-xs text-emerald-50 opacity-90 leading-relaxed max-w-xl">
              Você calibrou todos os subsistemas do perfil. Enquanto o front-end final de gerenciamento está sendo compilado com React, Tailwind e toda a segurança que seu ecossistema merece, você está com tudo pronto para decolar nas finanças!
            </p>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-mono font-bold tracking-wider">
            CODE: RAFAEL_42
          </span>
        </div>
      )}
    </div>
  );
}