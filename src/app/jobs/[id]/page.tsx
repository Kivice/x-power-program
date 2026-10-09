import { notFound } from 'next/navigation';
import { getJobById, getJobSeekerProfile, getApplicationByJobAndSeeker, isJobSaved } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';
import { calculateJobMatch } from '@/lib/matching';
import JobDetailView from './JobDetailView';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const session = await getSession();
  let seekerProfile = null;
  let existingApplication = null;
  let initialSaved = false;

  if (session && session.role === 'job_seeker') {
    seekerProfile = getJobSeekerProfile(session.userId);
    if (seekerProfile) {
      existingApplication = getApplicationByJobAndSeeker(job.id, seekerProfile.id);
    }
    initialSaved = isJobSaved(session.userId, job.id);
  }

  const match = calculateJobMatch(job, seekerProfile);

  return (
    <JobDetailView
      job={job}
      profile={seekerProfile}
      match={match}
      existingApplication={existingApplication}
      initialSaved={initialSaved}
    />
  );
}
