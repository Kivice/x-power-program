import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEmployerProfileById, getJobs } from '@/lib/db/queries';
import JobCard from '@/components/JobCard';
import { Building2, CheckCircle, MapPin, Globe, Mail, Phone, Briefcase, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployerDetailPage({ params }: Props) {
  const { id } = await params;
  const employer = getEmployerProfileById(id);

  if (!employer) {
    notFound();
  }

  const { jobs } = getJobs({ employerId: employer.id });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/employers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Employer Directory
        </Link>

        {/* Company Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {employer.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={employer.logo_url}
                    alt={employer.company_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {employer.company_name}
                  </h1>
                  {employer.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                      Verified Employer
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {employer.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {employer.location}
                  </span>
                  {employer.website && (
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-700 hover:underline font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {employer.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-lg bg-cyan-50 text-cyan-800 text-xs font-bold">
                {jobs.length} Active Positions
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              About the Company
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed max-w-4xl whitespace-pre-line">
              {employer.description}
            </p>
          </div>
        </div>

        {/* Open Positions List */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
            <span>Open Positions at {employer.company_name}</span>
            <span className="text-xs font-normal text-slate-500">{jobs.length} vacancies</span>
          </h2>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              There are currently no active vacancies published by this employer. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
