import React, { useState } from 'react';
import { BmiResult } from '../types.ts';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Dumbbell, Apple, Stethoscope, AlertTriangle } from 'lucide-react';

interface HealthGuidanceProps {
  result: BmiResult;
}

export const HealthGuidance: React.FC<HealthGuidanceProps> = ({ result }) => {
  const [showLimitations, setShowLimitations] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            Clinical Insights & Recommendations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evidence-based considerations for the {result.category} tier.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Risk Considerations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Associated Health Observations
          </div>

          <div className="space-y-2.5">
            {result.risks.map((risk, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Health Strategies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Actionable Next Steps
          </div>

          <div className="space-y-2.5">
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-200/90 leading-relaxed"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caloric Guidance breakdown if available */}
      {result.targetCalories && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
          <div className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Apple className="w-4 h-4 text-emerald-400" />
            Caloric Guidance Target Summary
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Weight Maintenance</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                ~{result.targetCalories.maintain} kcal/day
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Gradual Weight Loss (-0.5 lb/wk)</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                ~{result.targetCalories.mildWeightLoss} kcal/day
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Gradual Muscle/Weight Gain</span>
              <span className="text-sm font-bold font-mono text-sky-400">
                ~{result.targetCalories.weightGain} kcal/day
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Limitations of BMI Collapsible Section */}
      <div className="border-t border-slate-800/80 pt-4">
        <button
          type="button"
          onClick={() => setShowLimitations(!showLimitations)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Important: Clinical Limitations of the BMI Formula</span>
          </div>
          {showLimitations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLimitations && (
          <div className="mt-3 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/80 leading-relaxed space-y-2 animate-in fade-in duration-200">
            <p>
              <strong>Athletes &amp; Bodybuilders:</strong> BMI does not distinguish between lean muscle tissue and adipose fat. Muscular individuals may register as "Overweight" or "Obese" despite having very low body fat percentage and excellent cardiovascular health.
            </p>
            <p>
              <strong>Age &amp; Bone Density:</strong> Older adults naturally lose bone and muscle mass, which may cause BMI to underestimate relative body fat. Conversely, growing adolescents require specialized age-adjusted percentiles.
            </p>
            <p>
              <strong>Fat Distribution:</strong> Visceral fat around the abdomen carries greater cardiometabolic risk than subcutaneous fat on hips or thighs. Waist circumference or waist-to-height ratio often provides supplementary insight.
            </p>
            <p className="text-[11px] text-amber-400/90 pt-1 font-medium">
              * This application is for educational and screening purposes only and does not replace medical advice, diagnosis, or care from a qualified healthcare professional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
