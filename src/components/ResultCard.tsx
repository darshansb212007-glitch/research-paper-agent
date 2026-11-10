import React, { useState } from 'react';
import { BmiResult } from '../types.ts';
import { Check, Copy, BookmarkPlus, HeartPulse, Info } from 'lucide-react';

interface ResultCardProps {
  result: BmiResult;
  onSaveHistory: () => void;
  isSaved?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onSaveHistory, isSaved }) => {
  const [copied, setCopied] = useState(false);

  const copySummary = () => {
    const text = `BMI Report:
- BMI: ${result.bmi} (${result.category})
- Healthy Weight Range: ${result.healthyWeightRange.displayMin} - ${result.healthyWeightRange.displayMax} ${result.healthyWeightRange.unit}
- Status: ${result.weightDifference.message}
- Ponderal Index: ${result.ponderalIndex} kg/m³
- Maintenance Calories: ${result.tdee} kcal/day`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Color mapping for badge and glow
  const getCategoryStyles = () => {
    switch (result.categoryKey) {
      case 'severe_thinness':
      case 'moderate_thinness':
      case 'mild_thinness':
        return {
          glow: 'from-blue-500/20 via-blue-500/5 to-transparent',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          numberColor: 'text-blue-400',
        };
      case 'normal':
        return {
          glow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          numberColor: 'text-emerald-400',
        };
      case 'overweight':
        return {
          glow: 'from-amber-500/20 via-amber-500/5 to-transparent',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          numberColor: 'text-amber-400',
        };
      case 'obese_1':
      case 'obese_2':
      case 'obese_3':
      default:
        return {
          glow: 'from-rose-500/20 via-rose-500/5 to-transparent',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          numberColor: 'text-rose-400',
        };
    }
  };

  const style = getCategoryStyles();

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl backdrop-blur-md`}>
      {/* Background radial highlight */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br ${style.glow} rounded-full blur-3xl pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              Calculated Body Mass Index
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className={`text-5xl sm:text-6xl font-extrabold tracking-tight font-mono ${style.numberColor}`}>
              {result.bmi.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-slate-400">kg/m²</span>
          </div>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
              {result.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Prime: {result.bmiPrime} (Ideal: 0.74 - 1.0)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            type="button"
            onClick={copySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSaveHistory}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 cursor-default'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved to Log' : 'Save to History'}</span>
          </button>
        </div>
      </div>

      {/* Narrative summary */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <p className="text-sm text-slate-300 leading-relaxed">
          {result.weightDifference.message}
        </p>
      </div>
    </div>
  );
};
