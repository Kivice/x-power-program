import { NextResponse } from 'next/server';
import { getJobById, updateJob, incrementJobViews, getEmployerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job listing not found' }, { status: 404 });
    }

    // Increment view count
    incrementJobViews(id);

    return NextResponse.json({ job });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Authorization check
    if (session.role === 'employer') {
      const employer = getEmployerProfile(session.userId);
      if (!employer || employer.id !== job.employer_id) {
        return NextResponse.json(
          { error: 'You are not authorized to edit this job' },
          { status: 403 }
        );
      }
    } else if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updated = updateJob(id, body);

    return NextResponse.json({ success: true, job: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update job' }, { status: 500 });
  }
}
