export type UserRole = 'job_seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface JobSeekerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  location: string;
  headline?: string;
  bio?: string;
  education?: string;
  experience?: string;
  skills: string[]; // JSON parsed array
  career_interests: string[]; // JSON parsed array
  cv_filename?: string;
  cv_url?: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  logo_url?: string;
  industry: string;
  location: string;
  description: string;
  website?: string;
  contact_email: string;
  contact_phone?: string;
  verification_status: VerificationStatus;
  verification_document?: string;
  registration_number?: string;
  created_at: string;
  updated_at: string;
}

export type JobStatus = 'active' | 'paused' | 'closed';
export type WorkplaceType = 'On-site' | 'Hybrid' | 'Remote';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  category: string;
  employment_type: EmploymentType;
  workplace_type: WorkplaceType;
  location: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  responsibilities: string;
  qualifications: string;
  required_skills: string[]; // parsed array
  status: JobStatus;
  deadline: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  // Join fields
  company_name?: string;
  company_logo?: string;
  company_location?: string;
  company_verified?: boolean;
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Rejected'
  | 'Hired';

export interface Application {
  id: string;
  job_id: string;
  job_seeker_id: string;
  cover_letter?: string;
  cv_url?: string;
  status: ApplicationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  job_title?: string;
  company_name?: string;
  company_logo?: string;
  job_location?: string;
  salary_min?: number;
  salary_max?: number;
  candidate_name?: string;
  candidate_email?: string;
  candidate_headline?: string;
  candidate_skills?: string[];
  candidate_location?: string;
  interview_scheduled_at?: string;
  interview_meeting_link?: string;
  interview_location?: string;
  interview_notes?: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  // Joined fields
  job?: Job;
}

export interface Conversation {
  id: string;
  job_id?: string;
  employer_id: string;
  job_seeker_id: string;
  updated_at: string;
  // Joins
  company_name?: string;
  seeker_name?: string;
  job_title?: string;
  last_message?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  scheduled_at: string;
  meeting_link?: string;
  location?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_job_id?: string;
  reported_user_id?: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  // Joined fields
  reporter_email?: string;
  job_title?: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details?: string;
  created_at: string;
  actor_email?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  profileId?: string;
  name?: string;
  companyName?: string;
}
