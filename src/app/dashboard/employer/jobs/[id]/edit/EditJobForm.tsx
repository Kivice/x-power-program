'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Job, JobStatus } from '@/lib/types';

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState(job.title);
  const [category, setCategory] = useState(job.category);
  const [employmentType, setEmploymentType] = useState(job.employment_type);
  const [workplaceType, setWorkplaceType] = useState(job.workplace_type);
  const [location, setLocation] = useState(job.location);
  const [salaryMin, setSalaryMin] = useState(job.salary_min);
  const [salaryMax, setSalaryMax] = useState(job.salary_max);
  const [responsibilities, setResponsibilities] = useState(job.responsibilities);
  const [qualifications, setQualifications] = useState(job.qualifications);
  const [skillsStr, setSkillsStr] = useState((job.required_skills || []).join(', '));
  const [deadline, setDeadline] = useState(job.deadline);
  const [status, setStatus] = useState<JobStatus>(job.status);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requiredSkills = skillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
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
          status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Vacancy details updated successfully!');
        setTimeout(() => {
          router.push('/dashboard/employer');
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || 'Update failed.');
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
            Back to Vacancies
          </Link>
          <span className="text-xs font-semibold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-md">
            Job Editor
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="pb-6 mb-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Edit Vacancy: {job.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Update vacancy requirements, compensation ranges, or change status.
              </p>
            </div>

            {/* Status Selector */}
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-xs bg-slate-50 text-slate-800"
              >
                <option value="active">Active (Visible)</option>
                <option value="paused">Paused (Hidden)</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Workplace Arrangement</label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Salary (KES)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={5000}
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maximum Salary (KES)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={5000}
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Key Responsibilities</label>
              <textarea
                rows={4}
                required
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Qualifications</label>
              <textarea
                rows={4}
                required
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Skills</label>
                <input
                  type="text"
                  required
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
