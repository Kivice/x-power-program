'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Application, ApplicationStatus } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  X,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ApplicationsReviewClient({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-11-15T10:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xpower-interview');
  const [interviewNotes, setInterviewNotes] = useState('Initial technical screen & architectural discussion.');
  const [scheduling, setScheduling] = useState(false);

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  async function updateStatus(id: string, newStatus: ApplicationStatus, notes?: string) {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus, notes: notes || a.notes } : a))
        );
        if (selectedApp?.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus, notes: notes || prev.notes } : null));
        }
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('Network error updating status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleScheduleInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setScheduling(true);
      const res = await fetch(`/api/applications/${selectedApp.id}/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: interviewDate,
          meetingLink,
          notes: interviewNotes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? { ...a, status: 'Interview' } : a))
        );
        setSelectedApp((prev) => (prev ? { ...prev, status: 'Interview' } : null));
        setShowInterviewModal(false);
        alert('Interview scheduled and notification dispatched to candidate!');
      } else {
        alert(data.error || 'Scheduling failed');
      }
    } catch {
      alert('Error scheduling interview');
    } finally {
      setScheduling(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Talent Acquisition
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Candidate Applications & Reviews
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review candidate profiles, inspect verified CVs, shortlist, and schedule interviews.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            {['All', 'Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No candidates found matching the &quot;{statusFilter}&quot; filter.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-6">Candidate Details</th>
                    <th className="py-3.5 px-4">Applied Position</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-6 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">
                          {app.candidate_name || 'Candidate'}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {app.candidate_headline || 'Professional'} &bull; {app.candidate_location}
                        </div>
                        {app.candidate_skills && app.candidate_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {app.candidate_skills.slice(0, 3).map((s) => (
                              <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-700">
                        <span className="font-semibold block">{app.job_title}</span>
                        <span className="text-[11px] text-slate-400">{app.job_location}</span>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {new Date(app.created_at).toLocaleDateString('en-KE', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs shadow-xs"
                        >
                          Review Candidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Profile Review Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 mb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedApp.candidate_name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applied for <strong className="text-slate-800">{selectedApp.job_title}</strong>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedApp.candidate_location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedApp.candidate_email}
                  </span>
                </div>
              </div>
              <StatusBadge status={selectedApp.status} size="md" />
            </div>

            {/* Candidate Cover Letter */}
            {selectedApp.cover_letter && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  Candidate Cover Note:
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedApp.cover_letter}
                </p>
              </div>
            )}

            {/* Candidate Skills */}
            {selectedApp.candidate_skills && selectedApp.candidate_skills.length > 0 && (
              <div className="mb-6 text-xs">
                <span className="font-bold text-slate-800 block mb-2">
                  Stated Competencies & Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.candidate_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume attachment */}
            <div className="mb-6 p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-700" />
                <span className="font-semibold text-slate-800">
                  Candidate Curriculum Vitae (PDF)
                </span>
              </div>
              {selectedApp.cv_url ? (
                <a
                  href={selectedApp.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-cyan-700 hover:underline font-bold"
                >
                  Download / View PDF &rarr;
                </a>
              ) : (
                <span className="text-slate-400 italic">No CV document attached</span>
              )}
            </div>

            {/* Recruiter Actions */}
            <div className="pt-4 border-t border-slate-100 text-xs space-y-4">
              <span className="font-bold text-slate-800 block">
                Update Candidate Status & Workflow:
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(selectedApp.id, 'Under Review')}
                  disabled={updatingId === selectedApp.id}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-bold hover:bg-amber-100 transition"
                >
                  Under Review
                </button>

                <button
                  onClick={() => updateStatus(selectedApp.id, 'Shortlisted')}
                  disabled={updatingId === selectedApp.id}
                  className="px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-800 font-bold hover:bg-purple-100 transition"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => setShowInterviewModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Interview
                </button>

                <button
                  onClick={() => updateStatus(selectedApp.id, 'Hired')}
                  disabled={updatingId === selectedApp.id}
                  className="px-3 py-1.5 rounded-lg border border-green-300 bg-green-700 text-white font-bold hover:bg-green-800 transition"
                >
                  Mark Hired
                </button>

                <button
                  onClick={() => updateStatus(selectedApp.id, 'Rejected')}
                  disabled={updatingId === selectedApp.id}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                >
                  Decline
                </button>

                <Link
                  href="/dashboard/messages"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowInterviewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Schedule Interview with {selectedApp.candidate_name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Position: {selectedApp.job_title}
            </p>

            <form onSubmit={handleScheduleInterview} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Interview Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Virtual Meeting Link or Location *
                </label>
                <input
                  type="text"
                  required
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz or Nairobi Office"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Candidate Notes / Agenda
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs"
                >
                  {scheduling ? 'Scheduling...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
