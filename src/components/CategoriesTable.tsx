import React from 'react';
import { BmiCategoryKey } from '../types.ts';
import { BMI_CATEGORIES } from '../utils/bmiCalculator.ts';
import { Table, Check } from 'lucide-react';

interface CategoriesTableProps {
  currentCategoryKey?: BmiCategoryKey;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({ currentCategoryKey }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            WHO Standard BMI Reference Table
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Official World Health Organization classification thresholds for adults.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Classification</th>
              <th className="py-3 px-3 font-mono">BMI Range (kg/m²)</th>
              <th className="py-3 px-3">Health Risk Level</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {BMI_CATEGORIES.map((cat) => {
              const isCurrent = cat.key === currentCategoryKey;
              return (
                <tr
                  key={cat.key}
                  className={`transition-colors ${
                    isCurrent
                      ? 'bg-emerald-500/10 text-white font-semibold'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.label}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {cat.min === 0
                      ? `< ${cat.max + 0.01}`
                      : cat.max >= 100
                      ? `≥ ${cat.min.toFixed(1)}`
                      : `${cat.min.toFixed(1)} – ${cat.max.toFixed(1)}`}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{cat.healthRisk}</td>
                  <td className="py-3 px-3 text-right">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        Current
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
