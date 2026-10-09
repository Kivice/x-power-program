'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, AlertCircle, ArrowRight, Sparkles, Building2, UserCheck, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user.role === 'job_seeker') {
          router.push('/dashboard/job-seeker');
        } else if (data.user.role === 'employer') {
          router.push('/dashboard/employer');
        } else if (data.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(e: string, p: string) {
    setEmail(e);
    setPassword(p);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-cyan-500 flex items-center justify-center text-white shadow-md">
            <Zap className="w-5 h-5 fill-cyan-300 text-cyan-300" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900">
            X POWER <span className="text-cyan-600 font-semibold">PROGRAM</span>
          </span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Sign In to Your Account
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Access your recruitment dashboard or job seeker applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.co.ke"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-md shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill Box */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Fill Demo Test Accounts:
            </div>
            <div className="grid grid-cols-1 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemo('amina.mwangi@example.com', 'Password123!')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                  Job Seeker: amina.mwangi@example.com
                </span>
                <span className="text-cyan-700 font-bold">Autofill</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('recruitment@safaricom.co.ke', 'Password123!')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Employer: recruitment@safaricom.co.ke
                </span>
                <span className="text-emerald-700 font-bold">Autofill</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin@xpower.co.ke', 'Password123!')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Admin: admin@xpower.co.ke
                </span>
                <span className="text-amber-700 font-bold">Autofill</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/auth/register" className="font-bold text-cyan-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
