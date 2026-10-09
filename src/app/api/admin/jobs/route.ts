import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateJob, getJobById, logAudit } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const jobModSchema = z.object({
  jobId: z.string(),
  status: z.enum(['active', 'paused', 'closed']),
  reason: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = jobModSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { jobId, status, reason } = parsed.data;
    const job = getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    updateJob(jobId, { status });

    logAudit(
      session.userId,
      `JOB_STATUS_${status.toUpperCase()}`,
      'job',
      jobId,
      `Admin set status to ${status}. Reason: ${reason || 'Administrative policy'}`
    );

    return NextResponse.json({ success: true, jobId, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Job moderation failed' }, { status: 500 });
  }
}
