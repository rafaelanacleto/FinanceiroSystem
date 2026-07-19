import type { ChangeEvent } from 'react';

interface DateFilterProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

// Gera uma lista de anos (ex: 3 anos atrás até 2 anos no futuro)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 3 + i);

export function DateFilter({ month, year, onChange }: DateFilterProps) {
  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value), year);
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(month, Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
      <select
        value={month}
        onChange={handleMonthChange}
        className="bg-transparent text-sm font-bold text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <div className="h-5 w-px bg-slate-200" />

      <select
        value={year}
        onChange={handleYearChange}
        className="bg-transparent text-sm font-bold text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}