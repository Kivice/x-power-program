import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getEmployerProfile, updateEmployerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const employerUpdateSchema = z.object({
  companyName: z.string().min(2, 'Company name required'),
  logoUrl: z.string().optional(),
  industry: z.string().min(2, 'Industry required'),
  location: z.string().min(2, 'Location required'),
  description: z.string().min(10, 'Description required'),
  website: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'employer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = getEmployerProfile(session.userId);
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = employerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    updateEmployerProfile(session.userId, parsed.data);
    const updated = getEmployerProfile(session.userId);

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Profile update failed' }, { status: 500 });
  }
}
