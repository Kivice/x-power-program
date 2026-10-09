import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateVerificationStatus, getEmployerProfileById, createNotification, logAudit } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

const updateSchema = z.object({
  employerId: z.string(),
  status: z.enum(['verified', 'rejected', 'pending', 'unverified']),
});

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { employerId, status } = parsed.data;
    updateVerificationStatus(employerId, status);

    const emp = getEmployerProfileById(employerId);
    if (emp) {
      createNotification(
        emp.user_id,
        `Employer Verification ${status === 'verified' ? 'Approved' : 'Updated'}`,
        status === 'verified'
          ? 'Congratulations! Your employer profile is now verified with an official badge on X Power Program.'
          : `Your employer verification status is now: ${status}.`,
        '/dashboard/employer/verification'
      );
    }

    logAudit(
      session.userId,
      `EMPLOYER_VERIFICATION_${status.toUpperCase()}`,
      'employer_profile',
      employerId,
      `Admin updated verification to ${status}`
    );

    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}
