import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import {
  getJobSeekerProfile,
  getApplicationsBySeeker,
  getSavedJobs,
  getNotifications,
  getJobs,
} from '@/lib/db/queries';
import { calculateJobMatch } from '@/lib/matching';
import StatusBadge from '@/components/StatusBadge';
import MatchBadge from '@/components/MatchBadge';
import {
  User,
  Briefcase,
  Bookmark,
  Bell,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function JobSeekerDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'job_seeker') {
    redirect('/auth/login');
  }

  const profile = getJobSeekerProfile(session.userId);
  if (!profile) {
    redirect('/auth/login');
  }

  const applications = getApplicationsBySeeker(profile.id);
  const savedJobs = getSavedJobs(session.userId);
  const notifications = getNotifications(session.userId);
  const { jobs: allJobs } = getJobs({ limit: 10 });

  // Calculate top recommended jobs based on skill score
  const recommendedJobs = allJobs
    .map((job) => ({
      job,
      match: calculateJobMatch(job, profile),
    }))
    .filter((item) => item.match.score >= 40)
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 4);

  // Profile completion calculation
  let completionScore = 30; // base account
  if (profile.full_name && profile.location) completionScore += 20;
  if (profile.skills && profile.skills.length > 0) completionScore += 20;
  if (profile.education) completionScore += 15;
  if (profile.cv_url) completionScore += 15;
  completionScore = Math.min(100, completionScore);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Job Seeker Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                Welcome back, {profile.full_name}!
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                {profile.headline || 'Update your headline to catch recruiter interest.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/job-seeker/profile"
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-xs transition"
              >
                Edit Profile & CV
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs transition"
              >
                Explore Vacancies
              </Link>
            </div>
          </div>

          {/* Profile completion bar */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">Profile Completeness</span>
              <span className="font-bold text-cyan-400">{completionScore}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            {completionScore < 100 && (
              <p className="text-[11px] text-slate-400 mt-2">
                Tip: Complete your education, career interests, and upload a PDF CV to reach 100% and rank higher in employer candidate searches.
              </p>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Applications & Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Applications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    My Job Applications ({applications.length})
                  </h2>
                </div>
                <Link
                  href="/dashboard/job-seeker/applications"
                  className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  You haven&apos;t applied for any jobs yet.{' '}
                  <Link href="/jobs" className="text-cyan-700 font-bold hover:underline">
                    Browse open roles
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <Link
                          href={`/jobs/${app.job_id}`}
                          className="font-bold text-slate-900 hover:text-cyan-700 transition"
                        >
                          {app.job_title}
                        </Link>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {app.company_name} &bull; Applied on{' '}
                          {new Date(app.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                        <Link
                          href="/dashboard/job-seeker/applications"
                          className="text-[11px] font-bold text-slate-700 hover:text-cyan-700"
                        >
                          Tracker &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended for You */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Top Skill-Matched Opportunities
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Calculated from your skills: {profile.skills.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>
                <Link
                  href="/jobs"
                  className="text-xs font-bold text-cyan-700 hover:underline"
                >
                  All Jobs &rarr;
                </Link>
              </div>

              {recommendedJobs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Add more skills to your profile to get personalized match scores!
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedJobs.map(({ job, match }) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl border border-slate-200/90 hover:border-cyan-500/60 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-700">{job.company_name}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-slate-500">{job.location}</span>
                        </div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-cyan-700 transition"
                        >
                          {job.title}
                        </Link>
                        <div className="font-medium text-emerald-700 mt-1">
                          KES {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}/mo
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MatchBadge match={match} compact />
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-cyan-700 transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Profile snippet & Saved Jobs */}
          <div className="space-y-8">
            {/* CV & Profile Quick Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Profile Snapshot</span>
                <Link
                  href="/dashboard/job-seeker/profile"
                  className="text-cyan-700 hover:underline font-bold text-xs"
                >
                  Edit
                </Link>
              </h3>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <span className="font-semibold text-slate-800">{profile.location}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Active Resume</span>
                  {profile.cv_filename ? (
                    <span className="font-semibold text-cyan-800 flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-3.5 h-3.5" />
                      {profile.cv_filename}
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      No CV uploaded yet
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Key Competencies</span>
                  <div className="flex flex-wrap gap-1">
                    {(profile.skills || []).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Jobs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Bookmark className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Saved Jobs ({savedJobs.length})
                </div>
              </div>

              {savedJobs.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  No bookmarked jobs yet. Tap the bookmark icon on any vacancy to save it for later.
                </p>
              ) : (
                <div className="space-y-3">
                  {savedJobs.slice(0, 4).map((job) => (
                    <div
                      key={job.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                    >
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-bold text-slate-900 hover:text-cyan-700 block mb-0.5"
                      >
                        {job.title}
                      </Link>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{job.company_name}</span>
                        <span className="font-semibold text-slate-700">
                          KES {job.salary_min.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm pb-3 mb-3 border-b border-slate-100">
                <Bell className="w-4 h-4 text-cyan-600" />
                Recent Alerts
              </div>

              {notifications.length === 0 ? (
                <p className="text-slate-500 text-center py-3">No new notifications.</p>
              ) : (
                <div className="space-y-2.5">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900 mb-0.5">{n.title}</div>
                      <p className="text-slate-600 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
