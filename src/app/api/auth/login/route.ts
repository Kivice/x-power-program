import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail, getJobSeekerProfile, getEmployerProfile } from '@/lib/db/queries';
import { verifyPassword, setSessionCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
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
        id: user.id,
        email: user.email,
        role: user.role,
        profileId,
        name,
        companyName,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
