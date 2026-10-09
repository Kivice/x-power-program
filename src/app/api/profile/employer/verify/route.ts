import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getEmployerProfile, requestEmployerVerification, logAudit } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const verifySchema = z.object({
  registrationNumber: z.string().min(3, 'Registration number or Tax PIN is required'),
  documentUrl: z.string().min(3, 'Certificate of incorporation or business permit document required'),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employer = getEmployerProfile(session.userId);
    if (!employer) {
      return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    requestEmployerVerification(employer.id, parsed.data.documentUrl, parsed.data.registrationNumber);

    logAudit(
      session.userId,
      'VERIFICATION_REQUESTED',
      'employer_profile',
      employer.id,
      `Submitted registration ${parsed.data.registrationNumber}`
    );

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted. Our compliance team will review within 24 hours.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Verification request failed' }, { status: 500 });
  }
}
