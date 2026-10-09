'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, User, Building2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Seeker form state
  const [seekerEmail, setSeekerEmail] = useState('');
  const [seekerPassword, setSeekerPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [seekerLocation, setSeekerLocation] = useState('Nairobi, Kenya');
  const [headline, setHeadline] = useState('');
  const [skillsStr, setSkillsStr] = useState('TypeScript, React, Node.js');

  // Employer form state
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [empLocation, setEmpLocation] = useState('Nairobi, Kenya');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload =
        role === 'job_seeker'
          ? {
              role: 'job_seeker',
              email: seekerEmail,
              password: seekerPassword,
              fullName,
              location: seekerLocation,
              headline,
              skills: skillsStr
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : {
              role: 'employer',
              email: empEmail,
              password: empPassword,
              companyName,
              industry,
              location: empLocation,
              description,
              website,
              registrationNumber,
            };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (role === 'job_seeker') {
          router.push('/dashboard/job-seeker');
        } else {
          router.push('/dashboard/employer');
        }
        router.refresh();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-slate-900">Create Your Account</h1>
        <p className="mt-1 text-xs text-slate-600">
          Join thousands of professionals and verified companies across Kenya
        </p>

        {/* Role toggle tabs */}
        <div className="mt-6 p-1 bg-slate-200/80 rounded-xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRole('job_seeker');
              setError('');
            }}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              role === 'job_seeker'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-cyan-600" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('employer');
              setError('');
            }}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              role === 'employer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            Employer / Recruiter
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {role === 'job_seeker' ? (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Amina Mwangi"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={seekerEmail}
                    onChange={(e) => setSeekerEmail(e.target.value)}
                    placeholder="amina.mwangi@example.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={seekerPassword}
                    onChange={(e) => setSeekerPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Location</label>
                    <input
                      type="text"
                      required
                      value={seekerLocation}
                      onChange={(e) => setSeekerLocation(e.target.value)}
                      placeholder="e.g. Nairobi, Kenya"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Professional Title / Headline</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Full-Stack Engineer"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="TypeScript, React, Node.js, SQL"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Used to calculate transparent match scores on job listings
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Safaricom PLC, Twiga Foods"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recruitment Work Email</label>
                  <input
                    type="email"
                    required
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    placeholder="recruitment@company.co.ke"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={empPassword}
                    onChange={(e) => setEmpPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                    <input
                      type="text"
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. AgriTech, FinTech"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Headquarters Location</label>
                    <input
                      type="text"
                      required
                      value={empLocation}
                      onChange={(e) => setEmpLocation(e.target.value)}
                      placeholder="e.g. Westlands, Nairobi"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief overview of company operations and workplace culture..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Website URL (Optional)</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.co.ke"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Business Reg / KRA PIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="CPR/2020/12345"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-md shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account...' : `Register as ${role === 'job_seeker' ? 'Job Seeker' : 'Employer'}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-cyan-700 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
