import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getEmployerProfile, getJobs, getApplicationsByEmployer } from '@/lib/db/queries';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle,
  PlusCircle,
  Eye,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EmployerDashboard() {
  const session = await getSession();
  if (!session || (session.role !== 'employer' && session.role !== 'admin')) {
    redirect('/auth/login');
  }

  const employer = getEmployerProfile(session.userId);
  if (!employer) {
    redirect('/auth/login');
  }

  const { jobs } = getJobs({ employerId: employer.id, limit: 100 });
  const applications = getApplicationsByEmployer(employer.id);

  const activeJobs = jobs.filter((j) => j.status === 'active');
  const totalViews = jobs.reduce((acc, j) => acc + (j.views_count || 0), 0);
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Verification banner if unverified or pending */}
        {employer.verification_status !== 'verified' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <strong className="font-bold">
                  {employer.verification_status === 'pending'
                    ? 'Verification Request Under Review'
                    : 'Employer Verification Recommended'}
                </strong>
                <p className="text-amber-700 mt-0.5">
                  {employer.verification_status === 'pending'
                    ? 'Our compliance team is verifying your business documents. You will receive an official badge once approved.'
                    : 'Submit your business registration number or certificate to earn the Verified Employer badge and increase candidate trust.'}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/employer/verification"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex-shrink-0 text-center"
            >
              {employer.verification_status === 'pending' ? 'View Status' : 'Verify Business Now'}
            </Link>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {employer.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={employer.logo_url}
                    alt={employer.company_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {employer.company_name}
                  </h1>
                  {employer.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Recruitment & Talent Operations Hub &bull; {employer.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/employer/applications"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                Review Applicants ({applications.length})
              </Link>
              <Link
                href="/dashboard/employer/jobs/new"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Post New Vacancy
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Active Vacancies</span>
              <Briefcase className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{activeJobs.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">of {jobs.length} total published</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Total Applicants</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{applications.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">across all open positions</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Interviews Active</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-700">{interviewCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">{shortlistedCount} shortlisted</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Job Views</span>
              <Eye className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{totalViews}</div>
            <div className="text-[11px] text-slate-400 mt-1">candidate impressions</div>
          </div>
        </div>

        {/* Published Jobs Management */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Published Vacancies</h2>
              <p className="text-xs text-slate-500">Edit, pause, or view applicants for your listings.</p>
            </div>
            <Link
              href="/dashboard/employer/jobs/new"
              className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
            >
              + Create Listing
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              You haven&apos;t posted any job vacancies yet.{' '}
              <Link href="/dashboard/employer/jobs/new" className="text-cyan-700 font-bold hover:underline">
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Position Title</th>
                    <th className="pb-3">Type & Location</th>
                    <th className="pb-3">Salary Range (KES)</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Deadline</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => {
                    const jobApps = applications.filter((a) => a.job_id === job.id);
                    return (
                      <tr key={job.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 pr-4">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="font-bold text-slate-900 hover:text-cyan-700 block text-sm"
                          >
                            {job.title}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            {jobApps.length} applicants &bull; {job.views_count} views
                          </span>
                        </td>

                        <td className="py-3.5 pr-4 text-slate-600">
                          <div>{job.workplace_type} &bull; {job.employment_type}</div>
                          <div className="text-[11px] text-slate-400">{job.location}</div>
                        </td>

                        <td className="py-3.5 pr-4 font-semibold text-slate-800">
                          KES {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                        </td>

                        <td className="py-3.5 pr-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              job.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : job.status === 'paused'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>

                        <td className="py-3.5 pr-4 text-slate-600">
                          {new Date(job.deadline).toLocaleDateString('en-KE', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 text-right space-x-2">
                          <Link
                            href={`/dashboard/employer/applications?jobId=${job.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
                          >
                            Applicants ({jobApps.length})
                          </Link>
                          <Link
                            href={`/dashboard/employer/jobs/${job.id}/edit`}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 font-bold text-white transition"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
