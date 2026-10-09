import Link from 'next/link';
import { getJobs, getJobSeekerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';
import { calculateJobMatch } from '@/lib/matching';
import JobCard from '@/components/JobCard';
import {
  Search,
  MapPin,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Code2,
  Sprout,
  SunMedium,
  Landmark,
  Truck,
  Palette,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getSession();
  let seekerProfile = null;
  if (session && session.role === 'job_seeker') {
    seekerProfile = getJobSeekerProfile(session.userId);
  }

  const { jobs: featuredJobs } = getJobs({ limit: 6 });

  const categories = [
    { name: 'Software Engineering', count: 184, icon: Code2, color: 'text-sky-600 bg-sky-50' },
    { name: 'AgriTech & Supply Chain', count: 92, icon: Sprout, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'CleanTech & IoT', count: 64, icon: SunMedium, color: 'text-amber-600 bg-amber-50' },
    { name: 'Banking & Financial Services', count: 145, icon: Landmark, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'Operations & Logistics', count: 88, icon: Truck, color: 'text-orange-600 bg-orange-50' },
    { name: 'Design & Creative', count: 52, icon: Palette, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-cyan-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              Kenya&apos;s National Employment Marketplace
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none mb-6">
              Powering Careers. Connecting{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
                Exceptional Talent
              </span>{' '}
              in Kenya.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Match with certified Kenyan employers, explore transparent salary ranges in KES, and get direct candidate-to-recruiter interviews powered by genuine skill compatibility.
            </p>
          </div>

          {/* SEARCH BAR WIDGET */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-3 sm:p-4 shadow-2xl shadow-cyan-950/50 border border-slate-100">
            <form action="/jobs" method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
              <div className="sm:col-span-5 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  placeholder="Job title, skills, or company (e.g. Full-Stack, Python)..."
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-4 relative flex items-center">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  name="location"
                  defaultValue=""
                  aria-label="Filter by Location"
                  className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:bg-white transition appearance-none"
                >
                  <option value="">All Locations (Kenya)</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Eldoret">Eldoret</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-full min-h-[48px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-600/30 transition"
                >
                  <Search className="w-4 h-4" />
                  Search Jobs
                </button>
              </div>
            </form>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                Trending searches in Nairobi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['FinTech Engineer', 'Supply Chain Analyst', 'Solar IoT', 'Product Designer'].map((term) => (
                  <Link
                    key={term}
                    href={`/jobs?q=${encodeURIComponent(term)}`}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* KEY METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">850+</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified Kenyan Employers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">12,400+</div>
              <div className="text-xs text-slate-400 mt-0.5">Job Opportunities</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">94%</div>
              <div className="text-xs text-slate-400 mt-0.5">Application Response Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">KES 0</div>
              <div className="text-xs text-slate-400 mt-0.5">Always Free for Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider">
                Explore Industry Sectors
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                High-Growth Careers in Kenya
              </h2>
            </div>
            <Link
              href="/jobs"
              className="mt-3 sm:mt-0 text-sm font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 group"
            >
              Browse All Vacancies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="group p-5 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-105 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-cyan-700 transition">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.count} open vacancies</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED VERIFIED JOBS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Verified Employers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Featured Employment Opportunities
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Curated openings with transparent salary ranges in Kenyan Shillings (KES).
              </p>
            </div>

            <Link
              href="/jobs"
              className="mt-4 sm:mt-0 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 text-sm font-bold shadow-xs transition"
            >
              View All {featuredJobs.length}+ Jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => {
              const match = calculateJobMatch(job, seekerProfile);
              return <JobCard key={job.id} job={job} match={seekerProfile ? match : undefined} />;
            })}
          </div>
        </div>
      </section>

      {/* 4. TRANSPARENT MATCHING ENGINE SHOWCASE */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                Transparent Matching Architecture
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                No Black-Box Algorithms. Know Exactly Why You Fit.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Unlike traditional job boards that rely on opaque filters, X Power Program calculates a transparent 100-point compatibility score directly comparing your declared skills, location preference, and career interests against the employer&apos;s verified requirements.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">70% Skills Core Alignment</h4>
                    <p className="text-xs text-slate-500">Direct evaluation of required technical and functional proficiencies.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">15% Location & Workplace Fit</h4>
                    <p className="text-xs text-slate-500">Proximity to county centers (Nairobi, Mombasa, Nakuru) or remote flexibility.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">15% Sector & Trajectory Match</h4>
                    <p className="text-xs text-slate-500">Candidate long-term career interests matched against company industry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                  Interactive Candidate Simulation
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  92% Match
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Target Position</div>
                  <div className="text-sm font-bold text-white">Senior Full-Stack Engineer (FinTech & M-PESA)</div>
                  <div className="text-cyan-400">Safaricom PLC &bull; Nairobi (Hybrid)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-slate-300 font-semibold mb-2">Matched Competencies:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="text-slate-400 font-semibold mb-1">Growth Area for 100% Fit:</div>
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[11px]">
                    Microservices Architecture
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL CTA SECTION */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Seekers */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Looking for Meaningful Work?</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Build your digital career profile, upload your PDF resume, and connect directly with hiring managers across Kenya.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/register"
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md transition"
                >
                  Create Seeker Profile
                </Link>
                <Link
                  href="/jobs"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
                >
                  Explore Jobs
                </Link>
              </div>
            </div>

            {/* For Employers */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Recruiting Top Talent in Kenya?</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Publish verified vacancies, review structured candidate applications, schedule interviews, and streamline hiring with zero fraud.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/register"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
                >
                  Post a Job Listing
                </Link>
                <Link
                  href="/employers"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
                >
                  Employer Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
