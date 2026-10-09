import { ApplicationStatus } from '@/lib/types';
import { Clock, Eye, Star, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  switch (status) {
    case 'Submitted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <Clock className="w-3 h-3" />
          Submitted
        </span>
      );
    case 'Under Review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
        >
          <Eye className="w-3 h-3" />
          Under Review
        </span>
      );
    case 'Shortlisted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}
        >
          <Star className="w-3 h-3" />
          Shortlisted
        </span>
      );
    case 'Interview':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
        >
          <Calendar className="w-3 h-3" />
          Interview
        </span>
      );
    case 'Hired':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-green-100 text-green-800 border border-green-300 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3" />
          Hired
        </span>
      );
    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
        >
          <XCircle className="w-3 h-3" />
          Not Selected
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-slate-100 text-slate-700 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}
