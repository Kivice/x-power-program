'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/types';
import { MatchResult } from '@/lib/matching';
import MatchBadge from './MatchBadge';
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  Bookmark,
  CheckCircle,
  Banknote,
  ArrowRight,
} from 'lucide-react';

interface Props {
  job: Job;
  match?: MatchResult;
  initialSaved?: boolean;
  onSaveToggle?: (saved: boolean) => void;
}

export default function JobCard({ job, match, initialSaved = false, onSaveToggle }: Props) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  async function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      setSaving(true);
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch(`/api/jobs/${job.id}/save`, { method });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
        if (onSaveToggle) onSaveToggle(data.saved);
      } else {
        alert(data.error || 'Please log in to save jobs.');
      }
    } catch {
      alert('Could not update saved job');
    } finally {
      setSaving(false);
    }
  }

  const formatSalary = (min: number, max: number, curr = 'KES') => {
    return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}/mo`;
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-cyan-500/50 hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.company_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company_logo}
                  alt={job.company_name || 'Employer'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-700">
                  {job.company_name || 'Verified Employer'}
                </span>
                {job.company_verified && (
                  <span
                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded"
                    title="Verified Employer by X Power Program"
                  >
                    <CheckCircle className="w-3 h-3 text-cyan-600" />
                    Verified
                  </span>
                )}
              </div>

              <Link href={`/jobs/${job.id}`} className="block mt-0.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-lg border transition ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges / Meta */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-600 mb-3.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.workplace_type} &bull; {job.employment_type}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.required_skills || []).slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {(job.required_skills || []).length > 4 && (
            <span className="px-1.5 py-0.5 text-xs text-slate-400 font-medium">
              +{(job.required_skills || []).length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          {match && <MatchBadge match={match} compact />}
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Closes {new Date(job.deadline).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 transition"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
