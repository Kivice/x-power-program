import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getConversationsForUser,
  getMessages,
  sendMessage,
  getOrCreateConversation,
  getEmployerProfile,
  getJobSeekerProfile,
  createNotification,
} from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const messages = getMessages(conversationId);
      return NextResponse.json({ messages });
    }

    const conversations = getConversationsForUser(session.userId, session.role);
    return NextResponse.json({ conversations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

const sendMsgSchema = z.object({
  conversationId: z.string().optional(),
  recipientSeekerId: z.string().optional(),
  recipientEmployerId: z.string().optional(),
  jobId: z.string().optional(),
  content: z.string().min(1, 'Message cannot be empty'),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = sendMsgSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    let conversationId = parsed.data.conversationId;

    if (!conversationId) {
      if (session.role === 'employer' && parsed.data.recipientSeekerId) {
        const emp = getEmployerProfile(session.userId);
        if (!emp) return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
        const conv = getOrCreateConversation(emp.id, parsed.data.recipientSeekerId, parsed.data.jobId);
        conversationId = conv.id;
      } else if (session.role === 'job_seeker' && parsed.data.recipientEmployerId) {
        const seeker = getJobSeekerProfile(session.userId);
        if (!seeker) return NextResponse.json({ error: 'Seeker profile not found' }, { status: 404 });
        const conv = getOrCreateConversation(parsed.data.recipientEmployerId, seeker.id, parsed.data.jobId);
        conversationId = conv.id;
      } else {
        return NextResponse.json({ error: 'Missing conversation recipient information' }, { status: 400 });
      }
    }

    const message = sendMessage(conversationId, session.userId, parsed.data.content);

    return NextResponse.json({ success: true, message, conversationId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send message' }, { status: 500 });
  }
}
