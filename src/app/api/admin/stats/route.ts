import { NextResponse } from 'next/server';
import { getAdminStats, getAuditLogs, getAllReports, getAllEmployers } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const stats = getAdminStats();
  const auditLogs = getAuditLogs();
  const reports = getAllReports();
  const employers = getAllEmployers();

  return NextResponse.json({
    stats,
    auditLogs,
    reports,
    employers,
  });
}
