import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { BmiForm } from './components/BmiForm.tsx';
import { BmiGauge } from './components/BmiGauge.tsx';
import { ResultCard } from './components/ResultCard.tsx';
import { MetricsBreakdown } from './components/MetricsBreakdown.tsx';
import { HealthGuidance } from './components/HealthGuidance.tsx';
import { CategoriesTable } from './components/CategoriesTable.tsx';
import { HistoryTracker } from './components/HistoryTracker.tsx';
import { BmiCalculationRequest, BmiHistoryRecord, BmiResult } from './types.ts';
import { calculateBmi } from './utils/bmiCalculator.ts';
import { Activity, Shield, HelpCircle, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<BmiResult>(() =>
    calculateBmi({
      unit: 'metric',
      height: 175,
      weight: 70,
      age: 28,
      gender: 'male',
      activityLevel: 'moderate',
    })
  );

  const [lastRequest, setLastRequest] = useState<BmiCalculationRequest>({
    unit: 'metric',
    height: 175,
    weight: 70,
    age: 28,
    gender: 'male',
    activityLevel: 'moderate',
  });

  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [history, setHistory] = useState<BmiHistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem('bmi_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Verify backend health on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setIsApiConnected(true);
        }
      } catch {
        setIsApiConnected(false);
      }
    };
    checkApi();
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bmi_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [history]);

  // Main calculation handler
  const handleCalculate = useCallback(async (req: BmiCalculationRequest) => {
    setLastRequest(req);
    setIsSaved(false);

    // Compute immediately on client for instantaneous feedback
    const localResult = calculateBmi(req);
    setResult(localResult);

    // If API is available, optionally verify with Node.js backend
    try {
      setIsLoading(true);
      const res = await fetch('/api/bmi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResult(json.data);
          setIsApiConnected(true);
        }
      }
    } catch {
      // In case server is offline or restarting, client result remains solid
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save current record to history
  const handleSaveHistory = async () => {
    const isMetric = lastRequest.unit === 'metric';
    let heightDisplay = '';
    let weightDisplay = '';

    if (isMetric) {
      heightDisplay = `${lastRequest.height} cm`;
      weightDisplay = `${lastRequest.weight} kg`;
    } else {
      const ft = lastRequest.heightFeet ?? Math.floor(lastRequest.height / 12);
      const inches = lastRequest.heightInches ?? lastRequest.height % 12;
      heightDisplay = `${ft}'${inches}"`;
      weightDisplay = `${lastRequest.weight} lbs`;
    }

    const now = new Date();
    const formattedTime = now.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: BmiHistoryRecord = {
      id: `record_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: formattedTime,
      unit: lastRequest.unit,
      heightDisplay,
      weightDisplay,
      bmi: result.bmi,
      category: result.category,
      categoryColor: result.categoryColor,
    };

    setHistory((prev) => [newRecord, ...prev]);
    setIsSaved(true);

    // Sync to backend history store as well
    try {
      await fetch('/api/bmi/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch {
      // Local fallback already handled
    }
  };

  const handleClearHistory = async () => {
    setHistory([]);
    try {
      await fetch('/api/bmi/history', { method: 'DELETE' });
    } catch {
      // ignore
    }
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar isApiConnected={isApiConnected} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Intro Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900/60 border border-emerald-900/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Shield className="w-4 h-4" />
              Evidence-Based Anthropometric Assessment
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Body Mass Index &amp; Healthy Weight Analyzer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Calculate your BMI using metric or imperial measurements, analyze your position against
              World Health Organization standards, and discover your recommended healthy weight range.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 px-3.5 py-2 rounded-2xl border border-slate-800 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dual Unit Support (cm/kg &amp; ft/lbs)</span>
          </div>
        </div>

        {/* Primary Interactive Workspace: Input Form & Visual Spectrum */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Visual Gauge */}
          <div className="lg:col-span-5 space-y-6">
            <BmiForm onCalculate={handleCalculate} isLoading={isLoading} />
            <BmiGauge bmi={result.bmi} categoryKey={result.categoryKey} />
          </div>

          {/* Right Column: Result Card, Key Metrics, Health Guidance */}
          <div className="lg:col-span-7 space-y-6">
            <ResultCard
              result={result}
              onSaveHistory={handleSaveHistory}
              isSaved={isSaved}
            />

            <MetricsBreakdown result={result} />

            <HealthGuidance result={result} />
          </div>
        </div>

        {/* Secondary Section: WHO Standards Table & History Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <CategoriesTable currentCategoryKey={result.categoryKey} />
          </div>
          <div className="lg:col-span-5">
            <HistoryTracker
              records={history}
              onClearHistory={handleClearHistory}
              onDeleteRecord={handleDeleteRecord}
            />
          </div>
        </div>

        {/* FAQ & Educational Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Frequently Asked Questions About BMI
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-semibold text-white mb-1.5">What is the Body Mass Index formula?</h5>
              <p className="text-slate-400">
                BMI is calculated as weight in kilograms divided by height in meters squared:{' '}
                <span className="font-mono text-emerald-400">BMI = kg / m²</span>. In imperial units, it is:{' '}
                <span className="font-mono text-emerald-400">BMI = 703 × lbs / inches²</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-semibold text-white mb-1.5">What is a healthy BMI target?</h5>
              <p className="text-slate-400">
                For most adults aged 20+, a BMI between <span className="text-emerald-400 font-bold">18.5 and 24.9</span> is considered normal. This range is statistically linked with the lowest risk of cardiovascular disease, metabolic syndrome, and mortality.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h5 className="font-semibold text-white mb-1.5">What is the Ponderal Index?</h5>
              <p className="text-slate-400">
                The Ponderal Index calculates <span className="font-mono text-purple-400">kg / m³</span>. Unlike BMI, it accounts for three-dimensional body volume, giving more consistent estimations for particularly tall or short individuals.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Built with React, Node.js, Express &amp; Tailwind CSS</span>
          </div>
          <p className="text-[11px] text-slate-500">
            For personal health education and screening purposes only. Always consult a physician for clinical diagnoses.
          </p>
        </div>
      </footer>
    </div>
  );
}
