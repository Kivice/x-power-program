import { NextResponse } from 'next/server';
import { saveJob, unsaveJob, isJobSaved } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Please log in to save jobs.' }, { status: 401 });
    }

    saveJob(session.userId, jobId);
    return NextResponse.json({ success: true, saved: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save job' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    unsaveJob(session.userId, jobId);
    return NextResponse.json({ success: true, saved: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to unsave job' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ saved: false });
    }

    const saved = isJobSaved(session.userId, jobId);
    return NextResponse.json({ saved });
  } catch {
    return NextResponse.json({ saved: false });
  }
}
