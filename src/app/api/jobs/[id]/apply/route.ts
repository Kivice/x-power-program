import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getJobById,
  getJobSeekerProfile,
  getApplicationByJobAndSeeker,
  createApplication,
  createNotification,
} from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const applySchema = z.object({
  coverLetter: z.string().optional(),
  cvUrl: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const session = await getSession();
    if (!session || session.role !== 'job_seeker') {
      return NextResponse.json(
        { error: 'You must be logged in as a Job Seeker to apply for jobs.' },
        { status: 401 }
      );
    }

    const job = getJobById(jobId);
    if (!job || job.status !== 'active') {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications.' },
        { status: 400 }
      );
    }

    const seeker = getJobSeekerProfile(session.userId);
    if (!seeker) {
      return NextResponse.json(
        { error: 'Please complete your job seeker profile before applying.' },
        { status: 400 }
      );
    }

    // Check duplicate application
    const existing = getApplicationByJobAndSeeker(jobId, seeker.id);
    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied for this job.' },
        { status: 409 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = applySchema.safeParse(body);
    const coverLetter = parsed.success ? parsed.data.coverLetter : '';
    const cvUrl = (parsed.success && parsed.data.cvUrl) || seeker.cv_url || '';

    const appId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const application = createApplication({
      id: appId,
      jobId,
      seekerId: seeker.id,
      coverLetter,
      cvUrl,
    });

    // Notify seeker
    createNotification(
      session.userId,
      'Application Submitted',
      `Your application for "${job.title}" at ${job.company_name} was successfully submitted.`,
      '/dashboard/job-seeker/applications'
    );

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Application failed' }, { status: 500 });
  }
}
