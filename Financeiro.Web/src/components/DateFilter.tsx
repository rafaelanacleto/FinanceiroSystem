interface DateFilterProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export function DateFilter({ month, year, onChange }: DateFilterProps) {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = [2024, 2025, 2026]; 

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
      <select 
        value={month} 
        onChange={(e) => onChange(Number(e.target.value), year)}
        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-8"
      >
        {months.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>

      <div className="w-[1px] h-4 bg-slate-200"></div>

      <select 
        value={year} 
        onChange={(e) => onChange(month, Number(e.target.value))}
        className="bg-transparent border-none text-sm font-bold text-slate-400 focus:ring-0 cursor-pointer"
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}