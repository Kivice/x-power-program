import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getEmployerProfile, getApplicationsByEmployer } from '@/lib/db/queries';
import ApplicationsReviewClient from './ApplicationsReviewClient';

export const dynamic = 'force-dynamic';

export default async function EmployerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== 'employer' && session.role !== 'admin')) {
    redirect('/auth/login');
  }

  const employer = getEmployerProfile(session.userId);
  if (!employer) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  let applications = getApplicationsByEmployer(employer.id);

  if (params.jobId) {
    applications = applications.filter((a) => a.job_id === params.jobId);
  }

  return <ApplicationsReviewClient initialApplications={JSON.parse(JSON.stringify(applications))} />;
}
