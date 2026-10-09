'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, JobSeekerProfile, Application } from '@/lib/types';
import { MatchResult } from '@/lib/matching';
import MatchBadge from '@/components/MatchBadge';
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  Bookmark,
  CheckCircle,
  Banknote,
  Send,
  Flag,
  FileText,
  AlertCircle,
  Share2,
  X,
} from 'lucide-react';

interface Props {
  job: Job;
  profile: JobSeekerProfile | null;
  match: MatchResult;
  existingApplication: Application | null;
  initialSaved: boolean;
}

export default function JobDetailView({
  job,
  profile,
  match,
  existingApplication: initialApplication,
  initialSaved,
}: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [existingApp, setExistingApp] = useState(initialApplication);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleToggleSave() {
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch(`/api/jobs/${job.id}/save`, { method });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
      } else {
        alert(data.error || 'Please log in to save jobs.');
      }
    } catch {
      alert('Could not update saved job');
    }
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setApplyError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coverLetter,
          cvUrl: profile?.cv_url,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplySuccess(true);
        setExistingApp(data.application);
        setTimeout(() => {
          setShowApplyModal(false);
          router.refresh();
        }, 1500);
      } else {
        setApplyError(data.error || 'Application submission failed.');
      }
    } catch {
      setApplyError('Network error while submitting application.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800">
            Home
          </Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-slate-800">
            Jobs
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{job.title}</span>
        </div>

        {/* Main Card Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {job.company_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.company_logo}
                    alt={job.company_name || 'Employer'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-slate-700">
                    {job.company_name || 'Verified Recruiter'}
                  </span>
                  {job.company_verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                      Verified Employer
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 mt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {job.workplace_type} &bull; {job.employment_type}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    KES {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} / month
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2.5 flex-shrink-0">
              {existingApp ? (
                <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Status: {existingApp.status}
                </div>
              ) : profile ? (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Apply for Job
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition text-center"
                >
                  Log In to Apply
                </Link>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSave}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    isSaved
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                  title="Copy link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {copied && <span className="text-[11px] text-emerald-600 font-semibold">Link copied!</span>}
              </div>
            </div>
          </div>

          {/* Transparent Match Assessment */}
          <div className="mt-6">
            <MatchBadge match={match} />
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Responsibilities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Key Responsibilities
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {job.responsibilities}
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Required Qualifications & Experience
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {job.qualifications}
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Required Technical & Domain Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {(job.required_skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Info Column */}
          <div className="space-y-6">
            {/* Job Summary card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Job Overview
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Employment Type</span>
                <span className="font-semibold text-slate-800">{job.employment_type}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Arrangement</span>
                <span className="font-semibold text-slate-800">{job.workplace_type}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location</span>
                <span className="font-semibold text-slate-800">{job.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Application Deadline</span>
                <span className="font-semibold text-slate-800">
                  {new Date(job.deadline).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Views</span>
                <span className="font-semibold text-slate-800">{job.views_count} views</span>
              </div>
            </div>

            {/* Employer info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 mb-3">
                About the Employer
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {job.company_name} is an active employer partner on X Power Program.
              </p>
              <Link
                href={`/employers/${job.employer_id}`}
                className="text-cyan-700 font-bold hover:underline"
              >
                View Company Profile & All Openings &rarr;
              </Link>
            </div>

            {/* Trust and Report */}
            <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                Notice something suspicious?
              </span>
              <Link
                href={`/report-job?jobId=${job.id}`}
                className="text-rose-600 font-bold hover:underline"
              >
                Report Listing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Apply for {job.title}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Submitting application to <strong className="font-semibold text-slate-700">{job.company_name}</strong>
            </p>

            {applySuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-base mb-1">Application Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  The recruiter will review your profile and CV. You can track this in your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                {applyError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                {/* Candidate CV status */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-bold text-slate-800">
                        {profile?.cv_filename || 'Default Professional Profile CV.pdf'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Attached from your job seeker profile
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/job-seeker/profile"
                    className="text-cyan-700 hover:underline font-bold text-[11px]"
                  >
                    Change CV
                  </Link>
                </div>

                {/* Optional Cover letter */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cover Note / Message to Recruiter (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly describe your interest in this role and why you are a strong match..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md shadow-cyan-600/20 transition flex items-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
