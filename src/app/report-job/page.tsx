import { Suspense } from 'react';
import { getJobs } from '@/lib/db/queries';
import ReportJobClient from './ReportJobClient';

export default function ReportJobPage() {
  const { jobs } = getJobs({ limit: 50 });

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-slate-500">
          Loading reporting form...
        </div>
      }
    >
      <ReportJobClient jobs={jobs} />
    </Suspense>
  );
}
