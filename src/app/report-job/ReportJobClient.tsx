'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flag, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Job } from '@/lib/types';

export default function ReportJobClient({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedJobId = searchParams.get('jobId') || (jobs.length > 0 ? jobs[0].id : '');

  const [jobId, setJobId] = useState(preselectedJobId);
  const [reason, setReason] = useState('Soliciting recruitment or interview fee');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!details.trim() || details.length < 10) {
      setError('Please provide at least 10 characters explaining your concern.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedJobId: jobId || undefined,
          reason,
          details,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit report.');
      }
    } catch {
      setError('Network error submitting report.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Report a Suspicious or Fraudulent Vacancy
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Protect Kenya&apos;s job market. All submissions are investigated by our security team.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Report Dispatched to Moderation Queue
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                Thank you for safeguarding the community. An administrator will review this listing within 4 business hours.
              </p>
              <Link
                href="/jobs"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Return to Jobs Directory
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Vacancy Listing
                </label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white"
                >
                  <option value="">General Platform Concern (No specific job)</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} — {j.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Violation Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white"
                >
                  <option value="Soliciting recruitment or interview fee">
                    Soliciting recruitment, medical, or interview fee (Strictly Illegal)
                  </option>
                  <option value="Misleading compensation or fraudulent company">
                    Misleading compensation or fraudulent company
                  </option>
                  <option value="Phishing or suspicious external link">
                    Phishing attempt or suspicious off-platform link
                  </option>
                  <option value="Discriminatory requirements">
                    Discriminatory or unlawful requirements
                  </option>
                  <option value="Duplicate or spam vacancy">
                    Spam or duplicate job listing
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Details & Evidence *
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe what occurred, any messages received, or specific suspicious clauses..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
                >
                  <Flag className="w-4 h-4" />
                  {loading ? 'Submitting Report...' : 'Submit Report to Trust & Safety'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
