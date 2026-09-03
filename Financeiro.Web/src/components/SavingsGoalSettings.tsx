import { useEffect, useState, type FormEvent } from 'react';
import { getSavingsGoal, updateSavingsGoal } from '../services/api';

interface SavingsGoalSettingsProps {
  onSaved: () => void;
}

export function SavingsGoalSettings({ onSaved }: SavingsGoalSettingsProps) {
  const [goal, setGoal] = useState('5000');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSavingsGoal()
      .then((value) => setGoal(String(value)))
      .catch(() => setError('Não foi possível carregar sua meta.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(goal.replace(',', '.'));

    if (!Number.isFinite(value) || value <= 0) {
      setError('Informe um valor maior que zero.');
      setFeedback(null);
      return;
    }

    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const savedGoal = await updateSavingsGoal(value);
      setGoal(String(savedGoal));
      setFeedback('Meta atualizada com sucesso.');
      onSaved();
    } catch {
      setError('Não foi possível salvar sua meta.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-5">
        <h3 className="text-lg font-black text-slate-800">Meta de economia</h3>
        <p className="mt-1 text-sm text-slate-500">Defina quanto deseja economizar por mês.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-bold text-slate-700">
          Valor mensal
          <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
            <span className="text-sm font-bold text-slate-400">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              disabled={loading || saving}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base font-bold text-slate-800 outline-none"
              aria-label="Valor mensal da meta de economia"
            />
          </div>
        </label>
        <button
          type="submit"
          disabled={loading || saving}
          className="rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar meta'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
      {feedback && <p className="mt-3 text-sm font-semibold text-emerald-600">{feedback}</p>}
    </div>
  );
}
