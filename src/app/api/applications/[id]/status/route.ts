import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getApplicationById,
  updateApplicationStatus,
  getEmployerProfile,
  getJobById,
} from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const statusSchema = z.object({
  status: z.enum([
    'Submitted',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Rejected',
    'Hired',
  ]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || (session.role !== 'employer' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const application = getApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Authorization: employer must own the job
    if (session.role === 'employer') {
      const employer = getEmployerProfile(session.userId);
      const job = getJobById(application.job_id);
      if (!employer || !job || job.employer_id !== employer.id) {
        return NextResponse.json(
          { error: 'You are not authorized to update this application' },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    updateApplicationStatus(id, parsed.data.status, parsed.data.notes);
    const updated = getApplicationById(id);

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Status update failed' }, { status: 500 });
  }
}
