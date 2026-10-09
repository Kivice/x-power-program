import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  getConversationsForUser,
  getOrCreateConversation,
  getEmployerProfile,
} from '@/lib/db/queries';
import MessagesClient from './MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ seekerId?: string; jobId?: string; conversationId?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  let targetConvId = params.conversationId;

  if (params.seekerId && session.role === 'employer') {
    const emp = getEmployerProfile(session.userId);
    if (emp) {
      const conv = getOrCreateConversation(emp.id, params.seekerId, params.jobId);
      targetConvId = conv.id;
    }
  }

  const conversations = getConversationsForUser(session.userId, session.role);

  return (
    <MessagesClient
      initialConversations={JSON.parse(JSON.stringify(conversations))}
      currentUser={JSON.parse(JSON.stringify(session))}
      initialSelectedId={targetConvId}
    />
  );
}
