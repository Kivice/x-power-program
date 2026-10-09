import Link from 'next/link';
import { Zap, ShieldCheck, Target, Users, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            Our Mission & Impact
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Catalyzing Africa&apos;s Workforce Transformation
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            X Power Program is building the digital infrastructure for fair, transparent, and verified employment matching — starting in Kenya and scaling across Africa.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 mb-12 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">
            Bridging the Talent Gap with Technology and Integrity
          </h2>
          <p>
            Across Kenya, talented professionals face opaque hiring processes, unverified postings, and algorithmic black boxes. Concurrently, fast-growing companies in Silicon Savannah, Nairobi, and regional commercial hubs struggle to efficiently identify candidates with genuine, verifiable competencies.
          </p>
          <p>
            X Power Program was engineered from the ground up to eliminate recruitment ambiguity. By combining strict employer business verification with transparent skill overlap diagnostics, we ensure job seekers know precisely where they stand and recruiters connect with qualified, motivated talent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 text-center">
            <div>
              <div className="text-3xl font-extrabold text-cyan-700">850+</div>
              <div className="text-xs text-slate-500 mt-1">Verified Employers</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">12,000+</div>
              <div className="text-xs text-slate-500 mt-1">Matched Applications</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">47 Counties</div>
              <div className="text-xs text-slate-500 mt-1">Kenyan Nationwide Reach</div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Verified Enterprises</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every recruiter is certified against official Kenyan registration databases to eradicate scam listings and wage fraud.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Transparent Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We provide clear percentage breakdowns of your matched skills and actionable learning roadmaps for unmatched criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Data Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully compliant with the Kenya Data Protection Act, 2019. Candidate data and CVs are never shared without explicit consent.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Join the X Power Movement</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Whether you are stepping into your next career milestone or seeking world-class talent in Kenya, X Power Program is your partner in growth.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs shadow-md transition"
            >
              Browse Open Jobs
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-xs transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
