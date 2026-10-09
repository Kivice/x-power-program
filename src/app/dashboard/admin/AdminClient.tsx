'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  AlertTriangle,
  History,
  Check,
  X,
  PauseCircle,
  Eye,
  Flag,
} from 'lucide-react';
import { EmployerProfile, Report, AuditLog } from '@/lib/types';

interface Props {
  stats: {
    totalSeekers: number;
    totalEmployers: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingVerifications: number;
    pendingReports: number;
  };
  initialEmployers: EmployerProfile[];
  initialReports: Report[];
  initialAuditLogs: AuditLog[];
}

export default function AdminClient({
  stats,
  initialEmployers,
  initialReports,
  initialAuditLogs,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<'verifications' | 'reports' | 'audit' | 'employers'>('verifications');
  const [employers, setEmployers] = useState<EmployerProfile[]>(initialEmployers);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function handleVerification(employerId: string, status: 'verified' | 'rejected') {
    try {
      setActionLoading(employerId);
      const res = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employerId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmployers((prev) =>
          prev.map((e) => (e.id === employerId ? { ...e, verification_status: status } : e))
        );
        router.refresh();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch {
      alert('Network error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReportAction(reportId: string, status: 'resolved' | 'dismissed') {
    try {
      setActionLoading(reportId);
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
        router.refresh();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch {
      alert('Network error');
    } finally {
      setActionLoading(null);
    }
  }

  const pendingVerifications = employers.filter((e) => e.verification_status === 'pending');

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Platform Moderation & Security Console
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify Kenyan employers, manage safety reports, audit administrative events, and enforce trust policies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              System Health: 100% Operational
            </span>
          </div>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1">Job Seekers</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalSeekers}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1">Employers</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalEmployers}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1">Total Vacancies</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalJobs}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1">Applications</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalApplications}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-amber-600 font-semibold mb-1">Pending Verifs</div>
            <div className="text-2xl font-extrabold text-amber-600">{stats.pendingVerifications}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] text-rose-600 font-semibold mb-1">User Reports</div>
            <div className="text-2xl font-extrabold text-rose-600">{stats.pendingReports}</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 text-xs font-bold">
          <button
            onClick={() => setTab('verifications')}
            className={`px-4 py-2 rounded-xl transition ${
              tab === 'verifications'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Pending Verifications ({pendingVerifications.length})
          </button>

          <button
            onClick={() => setTab('reports')}
            className={`px-4 py-2 rounded-xl transition ${
              tab === 'reports'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Trust & Safety Reports ({reports.length})
          </button>

          <button
            onClick={() => setTab('employers')}
            className={`px-4 py-2 rounded-xl transition ${
              tab === 'employers'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            All Registered Companies ({employers.length})
          </button>

          <button
            onClick={() => setTab('audit')}
            className={`px-4 py-2 rounded-xl transition ${
              tab === 'audit'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            System Audit Trail
          </button>
        </div>

        {/* Tab 1: Pending Verifications */}
        {tab === 'verifications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Employer Verification Review Queue
            </h2>

            {pendingVerifications.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                All employer verification requests have been processed! No pending requests.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {pendingVerifications.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base text-slate-900">{emp.company_name}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pending Approval
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px] mb-2">
                        {emp.industry} &bull; {emp.location} &bull; Contact: {emp.contact_email}
                      </div>
                      <div className="font-semibold text-slate-800">
                        Registration / KRA PIN: {emp.registration_number || 'Not provided'}
                      </div>
                      {emp.verification_document && (
                        <a
                          href={emp.verification_document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-700 hover:underline font-bold mt-1 inline-block"
                        >
                          Inspect Submitted Document &rarr;
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleVerification(emp.id, 'verified')}
                        disabled={actionLoading === emp.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        Approve & Verify
                      </button>

                      <button
                        onClick={() => handleVerification(emp.id, 'rejected')}
                        disabled={actionLoading === emp.id}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Safety Reports */}
        {tab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              User Reports & Fraud Investigation
            </h2>

            {reports.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                No user reports filed. Platform integrity is sound.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {reports.map((rep) => (
                  <div key={rep.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{rep.reason}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rep.status === 'pending'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed max-w-xl mb-2">
                        {rep.details}
                      </p>
                      <div className="text-[11px] text-slate-400">
                        Reported by: {rep.reporter_email || 'Anonymous'} &bull; Target:{' '}
                        {rep.job_title || rep.reported_job_id || 'User'} &bull; Date:{' '}
                        {new Date(rep.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReportAction(rep.id, 'resolved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          Resolve & Moderate
                        </button>
                        <button
                          onClick={() => handleReportAction(rep.id, 'dismissed')}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Employers List */}
        {tab === 'employers' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Registered Companies
            </h2>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Industry</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Verification</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employers.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{e.company_name}</td>
                      <td className="py-3 text-slate-600">{e.industry}</td>
                      <td className="py-3 text-slate-600">{e.location}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.verification_status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700'
                              : e.verification_status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {e.verification_status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/employers/${e.id}`}
                          className="text-cyan-700 font-bold hover:underline"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {tab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Administrative Security Audit Trail
            </h2>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Action Event</th>
                    <th className="pb-3">Target</th>
                    <th className="pb-3">Actor</th>
                    <th className="pb-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="py-2.5 text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-2.5 font-bold text-cyan-800">{log.action}</td>
                      <td className="py-2.5 text-slate-700">
                        {log.target_type}:{log.target_id}
                      </td>
                      <td className="py-2.5 text-slate-500">{log.actor_email || log.actor_id}</td>
                      <td className="py-2.5 text-slate-600 max-w-xs truncate">{log.details || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
