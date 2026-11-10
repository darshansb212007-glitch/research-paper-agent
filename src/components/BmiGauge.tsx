import React from 'react';
import { BmiCategoryKey } from '../types.ts';
import { BMI_CATEGORIES } from '../utils/bmiCalculator.ts';

interface BmiGaugeProps {
  bmi: number;
  categoryKey: BmiCategoryKey;
}

export const BmiGauge: React.FC<BmiGaugeProps> = ({ bmi, categoryKey }) => {
  // BMI scale runs visually from min 12 to max 42
  const minScale = 12;
  const maxScale = 42;
  const clampedBmi = Math.min(Math.max(bmi, minScale), maxScale);
  const percentage = ((clampedBmi - minScale) / (maxScale - minScale)) * 100;

  // Key marker positions along 12..42 scale
  const markers = [
    { value: 16, label: '16' },
    { value: 18.5, label: '18.5' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
    { value: 35, label: '35' },
    { value: 40, label: '40' },
  ];

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl p-5 border border-slate-800 text-slate-100 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Visual BMI Spectrum
        </span>
        <span className="text-xs text-slate-400">
          WHO Classification Scale (12 – 42+)
        </span>
      </div>

      {/* Spectrum Bar with gradient color bands */}
      <div className="relative pt-6 pb-2">
        {/* Moving Needle Indicator Pin */}
        <div
          className="absolute -top-1 transition-all duration-700 ease-out flex flex-col items-center -translate-x-1/2 z-20 pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <div className="bg-white text-slate-900 px-2 py-0.5 rounded-full text-xs font-bold shadow-md border border-slate-200 flex items-center gap-1">
            <span>{bmi.toFixed(1)}</span>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white drop-shadow-sm"></div>
        </div>

        {/* Multi-segmented color bar */}
        <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-slate-800 border border-slate-700/60">
          {/* Underweight: 12 - 18.5 (6.5 units out of 30) -> 21.67% */}
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-opacity duration-300"
            style={{ width: '21.67%' }}
            title="Underweight (< 18.5)"
          />
          {/* Normal: 18.5 - 25.0 (6.5 units out of 30) -> 21.67% */}
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-opacity duration-300"
            style={{ width: '21.67%' }}
            title="Normal Weight (18.5 – 24.9)"
          />
          {/* Overweight: 25.0 - 30.0 (5 units out of 30) -> 16.66% */}
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-opacity duration-300"
            style={{ width: '16.66%' }}
            title="Overweight (25.0 – 29.9)"
          />
          {/* Obese Class 1: 30.0 - 35.0 (5 units out of 30) -> 16.66% */}
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-opacity duration-300"
            style={{ width: '16.66%' }}
            title="Obese Class I (30.0 – 34.9)"
          />
          {/* Obese Class 2: 35.0 - 40.0 (5 units out of 30) -> 16.66% */}
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-opacity duration-300"
            style={{ width: '16.66%' }}
            title="Obese Class II (35.0 – 39.9)"
          />
          {/* Obese Class 3: 40.0 - 42+ (2 units out of 30) -> 6.68% */}
          <div
            className="h-full bg-rose-900 transition-opacity duration-300"
            style={{ width: '6.68%' }}
            title="Obese Class III (≥ 40.0)"
          />
        </div>

        {/* Marker Ticks & Labels */}
        <div className="relative h-6 mt-1.5 w-full text-[11px] text-slate-400 select-none">
          {markers.map((marker) => {
            const pos = ((marker.value - minScale) / (maxScale - minScale)) * 100;
            return (
              <div
                key={marker.value}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${pos}%` }}
              >
                <div className="w-0.5 h-1.5 bg-slate-600 mb-0.5" />
                <span className="font-mono text-[10px]">{marker.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Legend Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-xs">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
            bmi < 18.5 ? 'bg-blue-500/15 border border-blue-500/40 text-blue-300' : 'text-slate-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
          <div className="truncate">
            <span className="font-medium block leading-tight">Underweight</span>
            <span className="text-[10px] text-slate-400">&lt; 18.5</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
            bmi >= 18.5 && bmi < 25
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              : 'text-slate-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="font-medium block leading-tight">Normal</span>
            <span className="text-[10px] text-slate-400">18.5 – 24.9</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
            bmi >= 25 && bmi < 30
              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
              : 'text-slate-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <div className="truncate">
            <span className="font-medium block leading-tight">Overweight</span>
            <span className="text-[10px] text-slate-400">25.0 – 29.9</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
            bmi >= 30
              ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
              : 'text-slate-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <div className="truncate">
            <span className="font-medium block leading-tight">Obese</span>
            <span className="text-[10px] text-slate-400">≥ 30.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
