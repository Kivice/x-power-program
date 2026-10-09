import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAdminStats, getAllEmployers, getAllReports, getAuditLogs } from '@/lib/db/queries';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/auth/login');
  }

  const stats = JSON.parse(JSON.stringify(getAdminStats()));
  const employers = JSON.parse(JSON.stringify(getAllEmployers()));
  const reports = JSON.parse(JSON.stringify(getAllReports()));
  const auditLogs = JSON.parse(JSON.stringify(getAuditLogs()));

  return (
    <AdminClient
      stats={stats}
      initialEmployers={employers}
      initialReports={reports}
      initialAuditLogs={auditLogs}
    />
  );
}
