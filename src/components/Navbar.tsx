'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Zap,
  Briefcase,
  Building2,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  MessageSquare,
  PlusCircle,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, [pathname]);

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setSession(data.user);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      router.push('/');
      router.refresh();
    } catch {
      // ignore
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="kenya-stripe" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-sky-800 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
                <Zap className="w-5 h-5 fill-cyan-300 text-cyan-300" />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  X POWER <span className="text-cyan-600 font-semibold">PROGRAM</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  Employment Kenya
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                href="/jobs"
                className={`px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition ${
                  pathname.startsWith('/jobs') ? 'text-cyan-700 bg-cyan-50/60 font-semibold' : ''
                }`}
              >
                Find Jobs
              </Link>
              <Link
                href="/employers"
                className={`px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition ${
                  pathname.startsWith('/employers') ? 'text-cyan-700 bg-cyan-50/60 font-semibold' : ''
                }`}
              >
                Companies
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition ${
                  pathname === '/about' ? 'text-cyan-700 bg-cyan-50/60 font-semibold' : ''
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition ${
                  pathname === '/contact' ? 'text-cyan-700 bg-cyan-50/60 font-semibold' : ''
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <NotificationBell />

                <Link
                  href="/dashboard/messages"
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {session.role === 'job_seeker' && (
                  <Link
                    href="/dashboard/job-seeker"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Candidate Dashboard</span>
                  </Link>
                )}

                {session.role === 'employer' && (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/employer/jobs/new"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Job</span>
                    </Link>
                    <Link
                      href="/dashboard/employer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                    >
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span>Employer Hub</span>
                    </Link>
                  </div>
                )}

                {session.role === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-cyan-700 rounded-lg shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {session && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Find Jobs
          </Link>
          <Link
            href="/employers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Companies
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Contact
          </Link>

          <div className="pt-3 border-t border-slate-200">
            {session ? (
              <div className="space-y-2">
                {session.role === 'job_seeker' && (
                  <Link
                    href="/dashboard/job-seeker"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm"
                  >
                    Candidate Dashboard
                  </Link>
                )}
                {session.role === 'employer' && (
                  <Link
                    href="/dashboard/employer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm"
                  >
                    Employer Hub
                  </Link>
                )}
                {session.role === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-lg bg-amber-600 text-white font-medium text-sm"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 rounded-lg border border-rose-200 text-rose-600 font-medium text-sm"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg border border-slate-200 text-slate-800 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
