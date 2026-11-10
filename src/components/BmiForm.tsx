import React, { useState, useEffect } from 'react';
import { ActivityLevel, BmiCalculationRequest, Gender, UnitSystem } from '../types.ts';
import { Sliders, RotateCcw, ArrowRight, User, Sparkles } from 'lucide-react';

interface BmiFormProps {
  onCalculate: (request: BmiCalculationRequest) => void;
  isLoading?: boolean;
}

export const BmiForm: React.FC<BmiFormProps> = ({ onCalculate, isLoading }) => {
  const [unit, setUnit] = useState<UnitSystem>('metric');

  // Metric state
  const [metricHeight, setMetricHeight] = useState<number>(175); // cm
  const [metricWeight, setMetricWeight] = useState<number>(70); // kg

  // Imperial state
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(9);
  const [imperialWeight, setImperialWeight] = useState<number>(154); // lbs

  // Advanced demographic states
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Trigger calculation whenever inputs change or on demand
  const triggerCurrentCalculation = () => {
    if (unit === 'metric') {
      onCalculate({
        unit: 'metric',
        height: metricHeight,
        weight: metricWeight,
        age,
        gender,
        activityLevel,
      });
    } else {
      const totalInches = feet * 12 + inches;
      onCalculate({
        unit: 'imperial',
        height: totalInches,
        weight: imperialWeight,
        heightFeet: feet,
        heightInches: inches,
        age,
        gender,
        activityLevel,
      });
    }
  };

  // Convert values when switching units so the user doesn't lose their relative proportions
  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;

    if (newUnit === 'imperial') {
      // Metric to imperial
      const totalInches = Math.round(metricHeight / 2.54);
      const newFeet = Math.floor(totalInches / 12);
      const newInches = totalInches % 12;
      const newLbs = Math.round(metricWeight * 2.20462);

      setFeet(Math.max(3, Math.min(7, newFeet)));
      setInches(Math.max(0, Math.min(11, newInches)));
      setImperialWeight(Math.max(60, Math.min(500, newLbs)));
    } else {
      // Imperial to metric
      const totalInches = feet * 12 + inches;
      const newCm = Math.round(totalInches * 2.54);
      const newKg = Math.round(imperialWeight / 2.20462);

      setMetricHeight(Math.max(100, Math.min(240, newCm)));
      setMetricWeight(Math.max(30, Math.min(250, newKg)));
    }

    setUnit(newUnit);
  };

  // Run calculation on initial load and when unit/values switch
  useEffect(() => {
    triggerCurrentCalculation();
  }, [unit, metricHeight, metricWeight, feet, inches, imperialWeight, age, gender, activityLevel]);

  // Preset loaders
  const loadPreset = (preset: 'normal' | 'athletic' | 'underweight' | 'overweight' | 'obese') => {
    if (preset === 'normal') {
      if (unit === 'metric') {
        setMetricHeight(175);
        setMetricWeight(68);
      } else {
        setFeet(5);
        setInches(9);
        setImperialWeight(150);
      }
    } else if (preset === 'athletic') {
      if (unit === 'metric') {
        setMetricHeight(180);
        setMetricWeight(85);
      } else {
        setFeet(5);
        setInches(11);
        setImperialWeight(188);
      }
    } else if (preset === 'underweight') {
      if (unit === 'metric') {
        setMetricHeight(170);
        setMetricWeight(47);
      } else {
        setFeet(5);
        setInches(7);
        setImperialWeight(103);
      }
    } else if (preset === 'overweight') {
      if (unit === 'metric') {
        setMetricHeight(172);
        setMetricWeight(80);
      } else {
        setFeet(5);
        setInches(8);
        setImperialWeight(176);
      }
    } else if (preset === 'obese') {
      if (unit === 'metric') {
        setMetricHeight(176);
        setMetricWeight(102);
      } else {
        setFeet(5);
        setInches(9);
        setImperialWeight(225);
      }
    }
  };

  const handleReset = () => {
    if (unit === 'metric') {
      setMetricHeight(175);
      setMetricWeight(70);
    } else {
      setFeet(5);
      setInches(9);
      setImperialWeight(154);
    }
    setAge(28);
    setGender('male');
    setActivityLevel('moderate');
  };

  // Helper conversion strings for hints
  const metricHeightInFeetInches = () => {
    const totalInches = Math.round(metricHeight / 2.54);
    const f = Math.floor(totalInches / 12);
    const i = totalInches % 12;
    return `${f}'${i}"`;
  };

  const imperialHeightInCm = () => {
    return Math.round((feet * 12 + inches) * 2.54);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Header & Unit Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            Body Measurements
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust sliders or enter numbers for instant live computation.
          </p>
        </div>

        {/* Unit Selector Toggle */}
        <div className="inline-flex p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleUnitChange('metric')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              unit === 'metric'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metric (cm, kg)
          </button>
          <button
            type="button"
            onClick={() => handleUnitChange('imperial')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              unit === 'imperial'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Imperial (ft/in, lbs)
          </button>
        </div>
      </div>

      {/* Preset Quick Badges */}
      <div className="my-4 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Presets:
        </span>
        <button
          type="button"
          onClick={() => loadPreset('normal')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-300 border border-slate-700/60 transition-colors"
        >
          Normal
        </button>
        <button
          type="button"
          onClick={() => loadPreset('athletic')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-950/60 hover:text-amber-300 hover:border-amber-700/60 text-slate-300 border border-slate-700/60 transition-colors"
        >
          Athletic
        </button>
        <button
          type="button"
          onClick={() => loadPreset('underweight')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-950/60 hover:text-blue-300 hover:border-blue-700/60 text-slate-300 border border-slate-700/60 transition-colors"
        >
          Underweight
        </button>
        <button
          type="button"
          onClick={() => loadPreset('overweight')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-orange-950/60 hover:text-orange-300 hover:border-orange-700/60 text-slate-300 border border-slate-700/60 transition-colors"
        >
          Overweight
        </button>
        <button
          type="button"
          onClick={() => loadPreset('obese')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-700/60 text-slate-300 border border-slate-700/60 transition-colors"
        >
          Obese
        </button>
      </div>

      <div className="space-y-6 mt-4">
        {/* HEIGHT INPUT */}
        {unit === 'metric' ? (
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="metric-height" className="text-sm font-semibold text-slate-200">
                Height
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">≈ {metricHeightInFeetInches()}</span>
                <div className="relative">
                  <input
                    id="metric-height"
                    type="number"
                    min={100}
                    max={240}
                    value={metricHeight}
                    onChange={(e) => setMetricHeight(Math.max(50, Math.min(250, Number(e.target.value) || 0)))}
                    className="w-20 px-2 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold text-right text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400 ml-1">cm</span>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={120}
              max={225}
              step={1}
              value={metricHeight}
              onChange={(e) => setMetricHeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>120 cm (3'11")</span>
              <span>175 cm (5'9")</span>
              <span>225 cm (7'5")</span>
            </div>
          </div>
        ) : (
          /* IMPERIAL HEIGHT (FEET & INCHES) */
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-200">Height</span>
              <span className="text-xs text-slate-400">≈ {imperialHeightInCm()} cm</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label htmlFor="feet-select" className="block text-xs text-slate-400 mb-1">
                  Feet (ft)
                </label>
                <select
                  id="feet-select"
                  value={feet}
                  onChange={(e) => setFeet(Number(e.target.value))}
                  className="w-full bg-slate-800/90 border border-slate-700 text-emerald-400 font-mono font-bold rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {[3, 4, 5, 6, 7].map((f) => (
                    <option key={f} value={f}>
                      {f} ft
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="inches-select" className="block text-xs text-slate-400 mb-1">
                  Inches (in)
                </label>
                <select
                  id="inches-select"
                  value={inches}
                  onChange={(e) => setInches(Number(e.target.value))}
                  className="w-full bg-slate-800/90 border border-slate-700 text-emerald-400 font-mono font-bold rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <option key={i} value={i}>
                      {i} in
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <input
              type="range"
              min={48} // 4ft
              max={84} // 7ft
              step={1}
              value={feet * 12 + inches}
              onChange={(e) => {
                const total = Number(e.target.value);
                setFeet(Math.floor(total / 12));
                setInches(total % 12);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>4'0"</span>
              <span>5'9"</span>
              <span>7'0"</span>
            </div>
          </div>
        )}

        {/* WEIGHT INPUT */}
        {unit === 'metric' ? (
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="metric-weight" className="text-sm font-semibold text-slate-200">
                Weight
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  ≈ {Math.round(metricWeight * 2.20462)} lbs
                </span>
                <div className="relative">
                  <input
                    id="metric-weight"
                    type="number"
                    min={30}
                    max={250}
                    value={metricWeight}
                    onChange={(e) => setMetricWeight(Math.max(20, Math.min(300, Number(e.target.value) || 0)))}
                    className="w-20 px-2 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold text-right text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400 ml-1">kg</span>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={35}
              max={180}
              step={0.5}
              value={metricWeight}
              onChange={(e) => setMetricWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>35 kg</span>
              <span>70 kg</span>
              <span>180 kg</span>
            </div>
          </div>
        ) : (
          /* IMPERIAL WEIGHT (LBS) */
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="imperial-weight" className="text-sm font-semibold text-slate-200">
                Weight
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  ≈ {Math.round(imperialWeight * 0.45359237)} kg
                </span>
                <div className="relative">
                  <input
                    id="imperial-weight"
                    type="number"
                    min={60}
                    max={500}
                    value={imperialWeight}
                    onChange={(e) => setImperialWeight(Math.max(50, Math.min(600, Number(e.target.value) || 0)))}
                    className="w-20 px-2 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold text-right text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400 ml-1">lbs</span>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={70}
              max={380}
              step={1}
              value={imperialWeight}
              onChange={(e) => setImperialWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>70 lbs</span>
              <span>154 lbs</span>
              <span>380 lbs</span>
            </div>
          </div>
        )}

        {/* ADVANCED PARAMETERS (Age, Gender, Activity) */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide personal profile (Age, Sex, Calories)' : 'Customize Age, Sex & Calorie Goals'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="age-input" className="text-xs text-slate-300">
                      Age (years)
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400">{age} yrs</span>
                  </div>
                  <input
                    id="age-input"
                    type="range"
                    min={12}
                    max={95}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Biological Sex */}
                <div>
                  <label htmlFor="gender-select" className="block text-xs text-slate-300 mb-1">
                    Biological Sex (for BMR)
                  </label>
                  <select
                    id="gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Neutral Average</option>
                  </select>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label htmlFor="activity-select" className="block text-xs text-slate-300 mb-1">
                  Physical Activity Level
                </label>
                <select
                  id="activity-select"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="sedentary">Sedentary (Desk job, little or no exercise)</option>
                  <option value="light">Lightly Active (Exercise 1-3 days/week)</option>
                  <option value="moderate">Moderately Active (Exercise 3-5 days/week)</option>
                  <option value="active">Active (Heavy exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (Intense training / physical labor)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={triggerCurrentCalculation}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{isLoading ? 'Calculating...' : 'Recalculate & Sync'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to standard defaults"
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/80 transition-colors flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
