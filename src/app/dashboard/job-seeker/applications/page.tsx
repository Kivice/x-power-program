import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getJobSeekerProfile, getApplicationsBySeeker } from '@/lib/db/queries';
import StatusBadge from '@/components/StatusBadge';
import {
  Briefcase,
  Calendar,
  Building2,
  FileText,
  MessageSquare,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ApplicationsTrackerPage() {
  const session = await getSession();
  if (!session || session.role !== 'job_seeker') {
    redirect('/auth/login');
  }

  const profile = getJobSeekerProfile(session.userId);
  if (!profile) {
    redirect('/auth/login');
  }

  const applications = getApplicationsBySeeker(profile.id);

  const stages = ['Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Hired'];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Candidate Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Application Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitor the real-time progress of your job applications and interview invites.
            </p>
          </div>

          <Link
            href="/jobs"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            Explore More Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Applications Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              When you apply for vacancies on X Power Program, your full timeline progress will appear here.
            </p>
            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
            >
              Browse Openings
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const currentStageIdx = stages.indexOf(app.status);
              const isRejected = app.status === 'Rejected';

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {app.company_logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={app.company_logo}
                            alt={app.company_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-0.5">
                          {app.company_name}
                        </div>
                        <Link
                          href={`/jobs/${app.job_id}`}
                          className="text-base sm:text-lg font-bold text-slate-900 hover:text-cyan-700 transition"
                        >
                          {app.job_title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                          <span>Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                          <span>&bull;</span>
                          <span>Location: {app.job_location}</span>
                          <span>&bull;</span>
                          <span className="font-semibold text-slate-700">
                            KES {app.salary_min?.toLocaleString()} - {app.salary_max?.toLocaleString()}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                      <StatusBadge status={app.status} size="md" />
                      <Link
                        href="/dashboard/messages"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-700 hover:underline font-bold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Messages
                      </Link>
                    </div>
                  </div>

                  {/* Stage Timeline */}
                  <div className="py-6 border-b border-slate-100">
                    <div className="relative">
                      {isRejected ? (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span>
                            This application was reviewed and not moved forward. Keep applying to other matching opportunities!
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                          {stages.map((stage, idx) => {
                            const isPast = currentStageIdx >= idx;
                            const isCurrent = app.status === stage;

                            return (
                              <div
                                key={stage}
                                className={`p-2.5 rounded-xl border transition ${
                                  isCurrent
                                    ? 'bg-cyan-50 border-cyan-300 font-bold text-cyan-900'
                                    : isPast
                                    ? 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
                                    : 'bg-white border-dashed border-slate-200 text-slate-400'
                                }`}
                              >
                                <div className="text-[10px] text-slate-400 mb-0.5">
                                  Step {idx + 1}
                                </div>
                                <div className="text-xs truncate">{stage}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes / Details */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      {app.notes ? (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                          <strong className="font-semibold">Recruiter Update: </strong>
                          {app.notes}
                        </div>
                      ) : (
                        <span className="text-slate-400">
                          Last status update on {new Date(app.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {app.cv_url && (
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Submitted CV
                        </a>
                      )}
                      <Link
                        href={`/jobs/${app.job_id}`}
                        className="inline-flex items-center gap-1 text-cyan-700 hover:underline font-bold"
                      >
                        View Vacancy
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
