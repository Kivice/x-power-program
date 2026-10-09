'use client';

import { useState } from 'react';
import { Sparkles, Info, Check, AlertCircle } from 'lucide-react';
import { MatchResult } from '@/lib/matching';

interface Props {
  match: MatchResult;
  compact?: boolean;
}

export default function MatchBadge({ match, compact = false }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Score color styles
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let barColor = 'bg-slate-400';

  if (match.score >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (match.score >= 50) {
    badgeColor = 'bg-sky-50 text-sky-800 border-sky-200';
    barColor = 'bg-sky-500';
  } else if (match.score > 0) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    barColor = 'bg-amber-500';
  }

  if (compact) {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor} hover:shadow-xs transition`}
        >
          <Sparkles className="w-3 h-3 text-cyan-600" />
          <span>{match.score}% Match</span>
          <Info className="w-3 h-3 text-slate-400" />
        </button>

        {showTooltip && (
          <div className="absolute z-40 right-0 mt-2 w-72 p-3 bg-white rounded-lg shadow-xl border border-slate-200 text-xs text-slate-700">
            <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-100">
              <span className="font-semibold text-slate-900">Skill Match Breakdown</span>
              <span className="font-bold text-cyan-700">{match.score}%</span>
            </div>
            <p className="text-slate-600 mb-2 leading-relaxed">{match.explanation}</p>

            {match.matchedSkills.length > 0 && (
              <div className="mb-1.5">
                <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 mb-1">
                  <Check className="w-3 h-3" /> Matched Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.matchedSkills.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.missingSkills.length > 0 && (
              <div>
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3 h-3" /> Missing Requirements:
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${badgeColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span className="font-semibold text-sm">Transparent Job Fit Analysis</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold">{match.score}%</span>
          <span className="text-xs text-slate-500 ml-1">compatibility</span>
        </div>
      </div>

      <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden mb-3">
        <div className={`h-full ${barColor}`} style={{ width: `${match.score}%` }} />
      </div>

      <p className="text-xs text-slate-700 mb-3 leading-relaxed">{match.explanation}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div>
          <span className="font-medium text-emerald-700 block mb-1 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Matched ({match.matchedSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.matchedSkills.length > 0 ? (
              match.matchedSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-800 rounded font-medium">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">None yet</span>
            )}
          </div>
        </div>

        <div>
          <span className="font-medium text-slate-500 block mb-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Growth Areas ({match.missingSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.missingSkills.length > 0 ? (
              match.missingSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-emerald-700 italic">Full overlap!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
