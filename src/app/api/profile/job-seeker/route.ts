import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getJobSeekerProfile, updateJobSeekerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).default([]),
  careerInterests: z.array(z.string()).default([]),
  cvFilename: z.string().optional(),
  cvUrl: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'job_seeker') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = getJobSeekerProfile(session.userId);
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'job_seeker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    updateJobSeekerProfile(session.userId, parsed.data);
    const updated = getJobSeekerProfile(session.userId);

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Profile update failed' }, { status: 500 });
  }
}
