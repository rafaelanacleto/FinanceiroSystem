import { Bug, CheckCircle2, Sparkles } from 'lucide-react';
import { releaseInfo, type ReleaseEntry } from '../generated/releaseInfo';

interface ReleaseSectionProps {
  entries: ReleaseEntry[];
  emptyMessage: string;
  icon: typeof Sparkles;
  title: string;
  tone: 'emerald' | 'rose';
}

function ReleaseSection({ entries, emptyMessage, icon: Icon, title, tone }: Readonly<ReleaseSectionProps>) {
  const iconClass = tone === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600';
  const checkClass = tone === 'emerald' ? 'text-emerald-500' : 'text-rose-500';

  return (
    <section className="border border-slate-100 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <h4 className="text-sm font-black text-slate-800">{title}</h4>
      </div>

      {entries.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {entries.map((entry) => (
            <li key={entry.hash} className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${checkClass}`} aria-hidden="true" />
              <span>{entry.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400">{emptyMessage}</p>
      )}
    </section>
  );
}

export function ProfileUnderConstruction() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 pb-6 border-b border-slate-100">
        <div className="flex gap-4">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Novidades e Correções</h3>
            <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
              Acompanhe as melhorias e correções incluídas nesta versão.
            </p>
          </div>
        </div>
        <span className="self-start shrink-0 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
          Versão {releaseInfo.version}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <ReleaseSection
          title="Novidades"
          entries={releaseInfo.features}
          emptyMessage="Nenhuma novidade registrada nesta versão."
          icon={Sparkles}
          tone="emerald"
        />
        <ReleaseSection
          title="Bugs resolvidos"
          entries={releaseInfo.fixes}
          emptyMessage="Nenhum bug resolvido registrado nesta versão."
          icon={Bug}
          tone="rose"
        />
      </div>
    </div>
  );
}