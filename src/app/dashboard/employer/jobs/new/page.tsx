'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, ArrowLeft, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('Hybrid');
  const [location, setLocation] = useState('Nairobi, Kenya');
  const [salaryMin, setSalaryMin] = useState(150000);
  const [salaryMax, setSalaryMax] = useState(250000);
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [skillsStr, setSkillsStr] = useState('TypeScript, React, PostgreSQL');
  const [deadline, setDeadline] = useState('2026-12-31');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requiredSkills = skillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          employmentType,
          workplaceType,
          location,
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
          responsibilities,
          qualifications,
          requiredSkills,
          deadline,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard/employer');
        router.refresh();
      } else {
        setError(data.error || 'Failed to publish job.');
      }
    } catch {
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/employer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Employer Dashboard
          </Link>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md">
            New Vacancy Publisher
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="pb-6 mb-6 border-b border-slate-100">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Create & Publish Job Vacancy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide thorough requirements and transparent salary specifications in Kenyan Shillings.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Agricultural Operations Manager"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Industry Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="AgriTech & Supply Chain">AgriTech & Supply Chain</option>
                  <option value="CleanTech & IoT">CleanTech & IoT</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Operations & Logistics">Operations & Logistics</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Data Science & Analytics">Data Science & Analytics</option>
                </select>
              </div>
            </div>

            {/* Employment Type, Workplace & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Workplace Arrangement
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Location (City / County) *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Westlands, Nairobi"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Salary Range in KES */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-semibold text-slate-800">
                Monthly Salary Compensation in Kenyan Shillings (KES) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block">Minimum Salary (KES)</span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={5000}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 mb-1 block">Maximum Salary (KES)</span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={5000}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Core Job Responsibilities *
              </label>
              <textarea
                rows={5}
                required
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="* Outline specific duties, project scopes, team collaboration expectations..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Qualifications */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Required Qualifications & Experience *
              </label>
              <textarea
                rows={5}
                required
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="* Bachelor's degree or equivalent practical experience...&#10;* 3+ years in production environments..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Required Skills & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Competencies & Skills (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="Python, SQL, Financial Modeling, Power BI"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Used directly by the transparent skill matching score.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/dashboard/employer"
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition text-xs shadow-md shadow-cyan-600/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {loading ? 'Publishing...' : 'Publish Vacancy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
