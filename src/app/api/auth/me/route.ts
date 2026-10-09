import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getJobSeekerProfile, getEmployerProfile, getNotifications } from '@/lib/db/queries';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  let profile = null;
  if (session.role === 'job_seeker') {
    profile = getJobSeekerProfile(session.userId);
  } else if (session.role === 'employer') {
    profile = getEmployerProfile(session.userId);
  }

  const notifications = getNotifications(session.userId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({
    authenticated: true,
    user: {
      ...session,
      profile,
      unreadCount,
    },
  });
}
