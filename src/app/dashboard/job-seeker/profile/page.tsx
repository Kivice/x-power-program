'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { JobSeekerProfile } from '@/lib/types';

export default function SeekerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [interestsStr, setInterestsStr] = useState('');
  const [cvFilename, setCvFilename] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile/job-seeker');
      if (res.ok) {
        const data = await res.json();
        const p: JobSeekerProfile = data.profile;
        if (p) {
          setFullName(p.full_name || '');
          setPhone(p.phone || '');
          setLocation(p.location || 'Nairobi, Kenya');
          setHeadline(p.headline || '');
          setBio(p.bio || '');
          setEducation(p.education || '');
          setExperience(p.experience || '');
          setSkillsStr((p.skills || []).join(', '));
          setInterestsStr((p.career_interests || []).join(', '));
          setCvFilename(p.cv_filename || '');
          setCvUrl(p.cv_url || '');
        }
      }
    } catch {
      setErrorMsg('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const skills = skillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const careerInterests = interestsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/profile/job-seeker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          location,
          headline,
          bio,
          education,
          experience,
          skills,
          careerInterests,
          cvFilename,
          cvUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch {
      setErrorMsg('Network error while saving.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file (.pdf)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be under 5MB');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cv');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCvFilename(data.filename);
        setCvUrl(data.url);
        setSuccessMsg('PDF CV uploaded and attached successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Upload failed');
      }
    } catch {
      setErrorMsg('Network error uploading CV');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/job-seeker"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md">
            Candidate Profile Editor
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="pb-6 mb-6 border-b border-slate-100 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Professional Profile & CV
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Your profile information powers the transparent matching system and is shared with employers when you apply.
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* CV Upload Box */}
          <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              Upload Curriculum Vitae (PDF)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Accepted format: PDF up to 5MB. Employers will inspect this resume when reviewing your applications.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">
                    {cvFilename || 'No CV currently attached'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {cvUrl ? 'Verified & ready for applications' : 'Attach your updated resume'}
                  </div>
                </div>
              </div>

              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Uploading...' : cvFilename ? 'Replace PDF' : 'Upload PDF'}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleCvUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Section 1: Basic Information */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
                1. Basic Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number (Kenya)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
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
                    placeholder="e.g. Nairobi, Kenya"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Bio */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Professional Summary / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, key strengths, and what drives you professionally..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Section 3: Skills & Interests */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
                2. Skills & Career Match Parameters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Technical & Professional Skills (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="TypeScript, React, Python, SQL, Docker, Machine Learning"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Our transparent matching engine evaluates these skills directly against job descriptions.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Career Interests & Industries (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={interestsStr}
                    onChange={(e) => setInterestsStr(e.target.value)}
                    placeholder="Software Engineering, FinTech, AgriTech, CleanTech"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Education & Experience */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-1 border-b border-slate-100">
                3. Education & Work History
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Highest Education
                  </label>
                  <textarea
                    rows={3}
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="BSc Computer Science, University of Nairobi (2021)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Recent Work Experience
                  </label>
                  <textarea
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Software Engineer at PayKenya (2021-Present) building payment APIs"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-md shadow-slate-900/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
