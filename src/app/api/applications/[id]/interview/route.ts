import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getApplicationById,
  scheduleInterview,
  getEmployerProfile,
  getJobById,
  getJobSeekerProfileById,
  createNotification,
} from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const interviewSchema = z.object({
  scheduledAt: z.string().min(4, 'Valid date and time required'),
  meetingLink: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    const session = await getSession();
    if (!session || (session.role !== 'employer' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const application = getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (session.role === 'employer') {
      const employer = getEmployerProfile(session.userId);
      const job = getJobById(application.job_id);
      if (!employer || !job || job.employer_id !== employer.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const body = await req.json();
    const parsed = interviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const interview = scheduleInterview({
      applicationId,
      scheduledAt: parsed.data.scheduledAt,
      meetingLink: parsed.data.meetingLink,
      location: parsed.data.location,
      notes: parsed.data.notes,
    });

    const seeker = getJobSeekerProfileById(application.job_seeker_id);
    if (seeker) {
      createNotification(
        seeker.user_id,
        'Interview Scheduled!',
        `Interview scheduled for ${parsed.data.scheduledAt} for position ${application.job_title}. Check your applications tab.`,
        '/dashboard/job-seeker/applications'
      );
    }

    return NextResponse.json({ success: true, interview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Scheduling failed' }, { status: 500 });
  }
}
