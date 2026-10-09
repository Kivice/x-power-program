import Link from 'next/link';
import { getAllEmployers } from '@/lib/db/queries';
import { Building2, CheckCircle, MapPin, Briefcase, ExternalLink, ArrowRight } from 'lucide-react';

export default function EmployersPage() {
  const employers = getAllEmployers();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
            Certified Recruiter Network
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Top Companies Hiring in Kenya
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Explore verified enterprise partners, fast-scaling startups, and mission-driven institutions offering high-impact career opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employers.map((emp: any) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-cyan-500/50 transition duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {emp.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={emp.logo_url}
                        alt={emp.company_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>

                  {emp.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                      <CheckCircle className="w-3 h-3 text-cyan-600" />
                      Verified
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-1">{emp.company_name}</h2>

                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.industry}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {emp.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md">
                  {emp.open_jobs_count || 0} Open Roles
                </span>

                <Link
                  href={`/employers/${emp.id}`}
                  className="font-bold text-slate-900 hover:text-cyan-700 flex items-center gap-1 transition"
                >
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
