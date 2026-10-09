import Link from 'next/link';
import { Zap, MapPin, Mail, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-sky-800 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Zap className="w-5 h-5 fill-cyan-300 text-cyan-300" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                X POWER <span className="text-cyan-400 font-semibold">PROGRAM</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering Kenya&apos;s workforce with transparent recruitment, verified employer partnerships, and seamless career pathways. Built for Nairobi, expanding across East Africa.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>The Mirage Towers, Chiromo Rd, Westlands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>support@xpower.co.ke</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+254 700 890 000</span>
              </div>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-cyan-400 transition">
                  Browse Vacancies
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Software+Engineering" className="hover:text-cyan-400 transition">
                  Tech & Software Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?workplaceType=Remote" className="hover:text-cyan-400 transition">
                  Remote Opportunities
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-cyan-400 transition">
                  Upload CV & Create Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/job-seeker/applications" className="hover:text-cyan-400 transition">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard/employer/jobs/new" className="hover:text-cyan-400 transition">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-cyan-400 transition">
                  Employer Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employer/verification" className="hover:text-cyan-400 transition">
                  Company Verification
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-cyan-400 transition">
                  Create Recruiter Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard/employer" className="hover:text-cyan-400 transition">
                  Recruitment Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Kenya Data Protection Act
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/report-job" className="hover:text-cyan-400 transition text-amber-300">
                  Report Suspicious Job
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition">
                  About X Power
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition">
                  Help & Contact Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400">
            &copy; 2026 X Power Program (Kenya). All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Nairobi, Kenya
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
