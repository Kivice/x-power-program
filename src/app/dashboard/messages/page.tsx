import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getConversationsForUser } from '@/lib/db/queries';
import MessagesClient from './MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const conversations = getConversationsForUser(session.userId, session.role);

  return (
    <MessagesClient
      initialConversations={JSON.parse(JSON.stringify(conversations))}
      currentUser={JSON.parse(JSON.stringify(session))}
    />
  );
}
