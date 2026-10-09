import Link from 'next/link';
import { getJobs, getJobSeekerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';
import { calculateJobMatch } from '@/lib/matching';
import JobCard from '@/components/JobCard';
import { Search, Filter, Briefcase, MapPin, Banknote, RefreshCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    employmentType?: string;
    workplaceType?: string;
    salaryMin?: string;
    page?: string;
  }>;
}

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q || '';
  const category = params.category || 'All';
  const location = params.location || 'All';
  const employmentType = params.employmentType || 'All';
  const workplaceType = params.workplaceType || 'All';
  const salaryMin = params.salaryMin ? parseInt(params.salaryMin, 10) : 0;
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 12;
  const offset = (currentPage - 1) * pageSize;

  const session = await getSession();
  let seekerProfile = null;
  if (session && session.role === 'job_seeker') {
    seekerProfile = getJobSeekerProfile(session.userId);
  }

  const { jobs, total } = getJobs({
    search: q,
    category: category !== 'All' ? category : undefined,
    location: location !== 'All' ? location : undefined,
    employmentType: employmentType !== 'All' ? employmentType : undefined,
    workplaceType: workplaceType !== 'All' ? workplaceType : undefined,
    salaryMin: salaryMin > 0 ? salaryMin : undefined,
    limit: pageSize,
    offset,
  });

  const totalPages = Math.ceil(total / pageSize);

  const categories = [
    'All',
    'Software Engineering',
    'AgriTech & Supply Chain',
    'CleanTech & IoT',
    'Banking & Financial Services',
    'Operations & Logistics',
    'Design & Creative',
    'Cybersecurity',
    'DevOps & Cloud',
  ];

  const locations = ['All', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Remote'];
  const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const workplaceTypes = ['All', 'On-site', 'Hybrid', 'Remote'];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                Verified Vacancies
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Explore Jobs in Kenya & Africa
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing {jobs.length} of {total} available positions
              </p>
            </div>

            {seekerProfile && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
                <span>
                  Logged in as <strong className="font-semibold">{seekerProfile.full_name}</strong>. Skills match scores are automatically calculated.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Filter className="w-4 h-4 text-cyan-600" />
                  Filter Listings
                </div>
                {(q || category !== 'All' || location !== 'All' || employmentType !== 'All' || workplaceType !== 'All' || salaryMin > 0) && (
                  <Link
                    href="/jobs"
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Reset
                  </Link>
                )}
              </div>

              <form method="GET" action="/jobs" className="space-y-4 text-xs">
                {/* Search query */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keywords</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      name="q"
                      defaultValue={q}
                      placeholder="Title, skills, keyword..."
                      className="w-full pl-8 pr-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <select
                    name="category"
                    defaultValue={category}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">County / City</label>
                  <select
                    name="location"
                    defaultValue={location}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Workplace Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Workplace Arrangement</label>
                  <select
                    name="workplaceType"
                    defaultValue={workplaceType}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                  >
                    {workplaceTypes.map((wp) => (
                      <option key={wp} value={wp}>
                        {wp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    name="employmentType"
                    defaultValue={employmentType}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                  >
                    {employmentTypes.map((et) => (
                      <option key={et} value={et}>
                        {et}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Monthly Salary (KES) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Minimum Salary (KES)</label>
                    <span className="text-[11px] font-bold text-cyan-700">
                      {salaryMin > 0 ? `KES ${salaryMin.toLocaleString()}` : 'Any'}
                    </span>
                  </div>
                  <input
                    type="range"
                    name="salaryMin"
                    min="0"
                    max="300000"
                    step="20000"
                    defaultValue={salaryMin}
                    className="w-full accent-cyan-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>KES 0</span>
                    <span>KES 150k</span>
                    <span>KES 300k+</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs shadow-xs"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Job Listings Column */}
          <div className="lg:col-span-3">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Matching Vacancies Found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Try adjusting your search terms, clearing specific filters, or expanding your location to see more opportunities across Kenya.
                </p>
                <Link
                  href="/jobs"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => {
                    const match = calculateJobMatch(job, seekerProfile);
                    return (
                      <JobCard
                        key={job.id}
                        job={job}
                        match={seekerProfile ? match : undefined}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      const isCurrent = p === currentPage;
                      return (
                        <Link
                          key={p}
                          href={`/jobs?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&page=${p}`}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                            isCurrent
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
