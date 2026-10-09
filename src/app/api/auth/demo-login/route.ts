import { NextResponse } from 'next/server';
import { getUserByEmail, getJobSeekerProfile, getEmployerProfile } from '@/lib/db/queries';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    let email = 'admin@xpower.co.ke';

    if (role === 'job_seeker') {
      email = 'amina.mwangi@example.com';
    } else if (role === 'employer') {
      email = 'recruitment@safaricom.co.ke';
    } else if (role === 'admin') {
      email = 'admin@xpower.co.ke';
    } else {
      return NextResponse.json({ error: 'Invalid demo role' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Demo user not found in database' }, { status: 404 });
    }

    let profileId: string | undefined;
    let name: string | undefined;
    let companyName: string | undefined;

    if (user.role === 'job_seeker') {
      const profile = getJobSeekerProfile(user.id);
      profileId = profile?.id;
      name = profile?.full_name;
    } else if (user.role === 'employer') {
      const profile = getEmployerProfile(user.id);
      profileId = profile?.id;
      companyName = profile?.company_name;
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      profileId,
      name,
      companyName,
    });

    return NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        profileId,
        name,
        companyName,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Demo login failed' }, { status: 500 });
  }
}
