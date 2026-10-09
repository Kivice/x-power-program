'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  XCircle,
} from 'lucide-react';
import { EmployerProfile } from '@/lib/types';

export default function EmployerVerificationPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [regNo, setRegNo] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [docName, setDocName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile/employer');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        if (data.profile?.registration_number) {
          setRegNo(data.profile.registration_number);
        }
        if (data.profile?.verification_document) {
          setDocumentUrl(data.profile.verification_document);
          setDocName('Incorporation_Document.pdf');
        }
      }
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'verification');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setDocumentUrl(data.url);
        setDocName(data.filename);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Error uploading verification file');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!regNo || !documentUrl) {
      setError('Please provide your business registration number and supporting document.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const res = await fetch('/api/profile/employer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNumber: regNo,
          documentUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Verification request successfully submitted for administrative review!');
        fetchProfile();
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch {
      setError('Network connection error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading verification data...
      </div>
    );
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
            Back to Employer Hub
          </Link>
          <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md">
            Trust & Compliance
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Employer Business Verification
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Protect candidates and display the verified badge by certifying your registered business entity.
              </p>
            </div>

            {/* Current Status Pill */}
            <div>
              {profile?.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Business
                </span>
              )}
              {profile?.verification_status === 'pending' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Verification Pending Review
                </span>
              )}
              {profile?.verification_status === 'unverified' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-slate-500" />
                  Unverified
                </span>
              )}
              {profile?.verification_status === 'rejected' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Verification Rejected
                </span>
              )}
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {profile?.verification_status === 'verified' ? (
            <div className="p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-emerald-950 mb-1">
                Your Company is Fully Verified
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed mb-4">
                Registration Number: <strong className="font-semibold">{profile.registration_number}</strong>. All published vacancies display the verified recruiter badge.
              </p>
              <Link
                href="/dashboard/employer"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Return to Recruiter Hub
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">
                  Verification Requirements in Kenya:
                </h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Valid Certificate of Incorporation (BRS) or Business Name Registration</li>
                  <li>KRA PIN Certificate of the company or enterprise</li>
                  <li>Authorized recruitment officer credentials</li>
                </ul>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Registration Number / Tax PIN *
                </label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. CPR/2012/84930 or P051234567Z"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Registration Certificate (PDF or Image) *
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    <div>
                      <div className="font-bold text-slate-800">
                        {docName || 'No document currently selected'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Accepts PDF, PNG, JPG up to 5MB
                      </div>
                    </div>
                  </div>

                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {submitting ? 'Submitting Request...' : 'Submit Verification for Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
