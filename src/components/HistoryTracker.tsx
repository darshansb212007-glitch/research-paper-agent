import React from 'react';
import { BmiHistoryRecord } from '../types.ts';
import { History, Trash2, Calendar, Scale, ArrowUpRight } from 'lucide-react';

interface HistoryTrackerProps {
  records: BmiHistoryRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onSelectRecord?: (record: BmiHistoryRecord) => void;
}

export const HistoryTracker: React.FC<HistoryTrackerProps> = ({
  records,
  onClearHistory,
  onDeleteRecord,
  onSelectRecord,
}) => {
  if (records.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center text-slate-400">
        <History className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
        <h4 className="text-sm font-semibold text-slate-300">No Calculations Saved Yet</h4>
        <p className="text-xs text-slate-500 mt-1">
          Click "Save to History" in the results card to record measurements and track changes over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Saved Measurement History ({records.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Local session history for monitoring trends.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border shadow-sm shrink-0"
                style={{
                  backgroundColor: `${record.categoryColor}15`,
                  borderColor: `${record.categoryColor}40`,
                  color: record.categoryColor,
                }}
              >
                {record.bmi.toFixed(1)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {record.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {record.timestamp}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Height: {record.heightDisplay}</span>
                  <span>•</span>
                  <span>Weight: {record.weightDisplay}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDeleteRecord(record.id)}
                title="Delete entry"
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
