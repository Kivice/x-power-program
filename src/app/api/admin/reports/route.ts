import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createReport, updateReportStatus, getAllReports, logAudit } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const reportCreateSchema = z.object({
  reportedJobId: z.string().optional(),
  reportedUserId: z.string().optional(),
  reason: z.string().min(3, 'Reason is required'),
  details: z.string().min(10, 'Details are required'),
});

const reportUpdateSchema = z.object({
  reportId: z.string(),
  status: z.enum(['pending', 'investigating', 'resolved', 'dismissed']),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const reports = getAllReports();
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Please log in to report a job or user.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reportCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const report = createReport({
      reporterId: session.userId,
      reportedJobId: parsed.data.reportedJobId,
      reportedUserId: parsed.data.reportedUserId,
      reason: parsed.data.reason,
      details: parsed.data.details,
    });

    logAudit(
      session.userId,
      'REPORT_SUBMITTED',
      'report',
      report.id,
      `Reported for reason: ${parsed.data.reason}`
    );

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Report submission failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = reportUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    updateReportStatus(parsed.data.reportId, parsed.data.status);

    logAudit(
      session.userId,
      `REPORT_${parsed.data.status.toUpperCase()}`,
      'report',
      parsed.data.reportId,
      `Admin changed report status to ${parsed.data.status}`
    );

    return NextResponse.json({ success: true, status: parsed.data.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}
