export function ProfileUnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
      <div className="relative mb-6">
        {/* Círculo de fundo pulsante */}
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75 scale-75"></div>
        
        {/* Ícone ou Container Central */}
        <div className="relative w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">
          🛈
        </div>
      </div>

      <h3 className="text-2xl font-black text-slate-800 tracking-tight">
        Página de Perfil em Construção
      </h3>
      
      <p className="text-slate-500 font-medium mt-2 max-w-sm">
        Estamos preparando uma área exclusiva para você gerenciar seus dados cadastrais e preferências de segurança.
      </p>

      <div className="mt-8 flex gap-2 items-center text-xs font-bold px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        Disponível na próxima atualização
      </div>
    </div>
  );
}