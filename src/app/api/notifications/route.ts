import { NextResponse } from 'next/server';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ notifications: [] });
  }

  const notifications = getNotifications(session.userId);
  return NextResponse.json({ notifications });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.all) {
    markAllNotificationsRead(session.userId);
  } else if (body.id) {
    markNotificationRead(body.id);
  }

  const notifications = getNotifications(session.userId);
  return NextResponse.json({ success: true, notifications });
}
