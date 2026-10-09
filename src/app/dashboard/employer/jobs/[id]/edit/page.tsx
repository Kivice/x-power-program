import { notFound, redirect } from 'next/navigation';
import { getJobById, getEmployerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';
import EditJobForm from './EditJobForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session || (session.role !== 'employer' && session.role !== 'admin')) {
    redirect('/auth/login');
  }

  const job = getJobById(id);
  if (!job) {
    notFound();
  }

  if (session.role === 'employer') {
    const employer = getEmployerProfile(session.userId);
    if (!employer || employer.id !== job.employer_id) {
      redirect('/dashboard/employer');
    }
  }

  return <EditJobForm job={job} />;
}
