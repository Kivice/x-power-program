'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Building2, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function DemoAccountsBanner() {
  const [loading, setLoading] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  if (process.env.NEXT_PUBLIC_ENABLE_DEMO_SANDBOX === 'false') return null;
  if (dismissed) return null;

  async function handleDemoLogin(role: string) {
    try {
      setLoading(role);
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        if (role === 'job_seeker') {
          router.push('/dashboard/job-seeker');
        } else if (role === 'employer') {
          router.push('/dashboard/employer');
        } else if (role === 'admin') {
          router.push('/dashboard/admin');
        }
        router.refresh();
      } else {
        alert(data.error || 'Demo login failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error logging in');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs px-4 py-2 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Client Showcase Template:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Explore Kenyan employment matching from any perspective:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleDemoLogin('job_seeker')}
            disabled={!!loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
          >
            <UserCheck className="w-3 h-3" />
            {loading === 'job_seeker' ? 'Switching...' : 'Job Seeker (Amina)'}
          </button>

          <button
            onClick={() => handleDemoLogin('employer')}
            disabled={!!loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
          >
            <Building2 className="w-3 h-3" />
            {loading === 'employer' ? 'Switching...' : 'Employer (Safaricom)'}
          </button>

          <button
            onClick={() => handleDemoLogin('admin')}
            disabled={!!loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
          >
            <ShieldCheck className="w-3 h-3" />
            {loading === 'admin' ? 'Switching...' : 'Administrator'}
          </button>

          <a
            href="https://wa.me/254708746611?text=Hi%20Philip,%20I%20am%20reviewing%20the%20X%20Power%20Platform%20template%20and%20would%20like%20to%20discuss%20deploying%20it."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
          >
            <span>⚡ Deploy Template</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 ml-1"
            title="Dismiss demo banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
