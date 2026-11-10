import React from 'react';
import { BmiResult } from '../types.ts';
import { Target, Scale, Flame, Activity, Zap } from 'lucide-react';

interface MetricsBreakdownProps {
  result: BmiResult;
}

export const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({ result }) => {
  const { healthyWeightRange, weightDifference, ponderalIndex, bmr, tdee, targetCalories } = result;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. HEALTHY WEIGHT RANGE */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Healthy Weight Target
          </span>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {healthyWeightRange.displayMin} – {healthyWeightRange.displayMax}{' '}
            <span className="text-sm font-normal text-slate-400">{healthyWeightRange.unit}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard WHO BMI range (18.5 – 24.9) for your height
          </p>
        </div>
        <div className="text-[11px] text-emerald-300/80 pt-2 border-t border-slate-800/80">
          Optimal baseline longevity zone
        </div>
      </div>

      {/* 2. WEIGHT DIFFERENCE */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-sky-400" />
            Weight Delta
          </span>
        </div>
        <div className="my-2">
          {weightDifference.status === 'normal' ? (
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">0.0 {weightDifference.unit}</div>
              <p className="text-xs text-slate-400 mt-1">Right on target! In healthy zone</p>
            </div>
          ) : weightDifference.status === 'under' ? (
            <div>
              <div className="text-2xl font-bold font-mono text-blue-400">
                +{weightDifference.displayDifference}{' '}
                <span className="text-sm font-normal text-slate-400">{weightDifference.unit}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">To reach minimum healthy threshold</p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">
                -{weightDifference.displayDifference}{' '}
                <span className="text-sm font-normal text-slate-400">{weightDifference.unit}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">To reach upper healthy boundary</p>
            </div>
          )}
        </div>
        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          {weightDifference.status === 'normal'
            ? 'Maintain current healthy habits'
            : weightDifference.status === 'under'
            ? 'Target gradual lean mass gain'
            : 'Target gentle 1-2 lbs / week deficit'}
        </div>
      </div>

      {/* 3. PONDERAL INDEX & PRIME */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Ponderal Index
          </span>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono text-purple-400">
            {ponderalIndex}{' '}
            <span className="text-sm font-normal text-slate-400">kg/m³</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Volumetric body density measure (Normal: 11 – 15 kg/m³)
          </p>
        </div>
        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          More uniform metric for tall or petite builds
        </div>
      </div>

      {/* 4. CALORIC EXPENDITURE & TDEE */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Daily Calories (TDEE)
          </span>
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold font-mono text-orange-400">
            {tdee ? `${tdee.toLocaleString()}` : '—'}{' '}
            <span className="text-sm font-normal text-slate-400">kcal/day</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Basal Metabolic Rate: <span className="font-mono text-slate-300">{bmr || '—'} kcal</span>
          </p>
        </div>
        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          Estimated total daily maintenance energy
        </div>
      </div>
    </div>
  );
};
