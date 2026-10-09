import { getDatabase } from './index';
import {
  User,
  JobSeekerProfile,
  EmployerProfile,
  Job,
  Application,
  SavedJob,
  Notification,
  Conversation,
  Message,
  Interview,
  Report,
  AuditLog,
  VerificationStatus,
  ApplicationStatus,
  JobStatus,
} from '../types';

// ================= USER & PROFILES =================

export function getUserByEmail(email: string): User | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email) as any;
  return row ? (row as User) : null;
}

export function getUserById(id: string): User | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
  return row ? (row as User) : null;
}

export function getJobSeekerProfile(userId: string): JobSeekerProfile | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM job_seeker_profiles WHERE user_id = ?').get(userId) as any;
  if (!row) return null;
  return {
    ...row,
    skills: JSON.parse(row.skills || '[]'),
    career_interests: JSON.parse(row.career_interests || '[]'),
    profile_completed: Boolean(row.profile_completed),
  };
}

export function getJobSeekerProfileById(id: string): JobSeekerProfile | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM job_seeker_profiles WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    ...row,
    skills: JSON.parse(row.skills || '[]'),
    career_interests: JSON.parse(row.career_interests || '[]'),
    profile_completed: Boolean(row.profile_completed),
  };
}

export function getEmployerProfile(userId: string): EmployerProfile | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM employer_profiles WHERE user_id = ?').get(userId) as any;
  return row ? (row as EmployerProfile) : null;
}

export function getEmployerProfileById(id: string): EmployerProfile | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM employer_profiles WHERE id = ?').get(id) as any;
  return row ? (row as EmployerProfile) : null;
}

export function updateJobSeekerProfile(
  userId: string,
  data: {
    fullName: string;
    phone?: string;
    location: string;
    headline?: string;
    bio?: string;
    education?: string;
    experience?: string;
    skills: string[];
    careerInterests: string[];
    cvFilename?: string;
    cvUrl?: string;
  }
) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const completed =
    data.fullName && data.location && data.skills.length > 0 && data.education ? 1 : 0;

  db.prepare(`
    UPDATE job_seeker_profiles
    SET full_name = ?, phone = ?, location = ?, headline = ?, bio = ?,
        education = ?, experience = ?, skills = ?, career_interests = ?,
        cv_filename = COALESCE(?, cv_filename),
        cv_url = COALESCE(?, cv_url),
        profile_completed = ?, updated_at = ?
    WHERE user_id = ?
  `).run(
    data.fullName,
    data.phone || null,
    data.location,
    data.headline || null,
    data.bio || null,
    data.education || null,
    data.experience || null,
    JSON.stringify(data.skills),
    JSON.stringify(data.careerInterests),
    data.cvFilename || null,
    data.cvUrl || null,
    completed,
    now,
    userId
  );
}

export function updateEmployerProfile(
  userId: string,
  data: {
    companyName: string;
    logoUrl?: string;
    industry: string;
    location: string;
    description: string;
    website?: string;
    contactEmail: string;
    contactPhone?: string;
    registrationNumber?: string;
  }
) {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE employer_profiles
    SET company_name = ?, logo_url = ?, industry = ?, location = ?,
        description = ?, website = ?, contact_email = ?, contact_phone = ?,
        registration_number = ?, updated_at = ?
    WHERE user_id = ?
  `).run(
    data.companyName,
    data.logoUrl || null,
    data.industry,
    data.location,
    data.description,
    data.website || null,
    data.contactEmail,
    data.contactPhone || null,
    data.registrationNumber || null,
    now,
    userId
  );
}

// ================= JOBS =================

export interface JobFilterParams {
  search?: string;
  category?: string;
  location?: string;
  employmentType?: string;
  workplaceType?: string;
  salaryMin?: number;
  employerId?: string;
  status?: JobStatus;
  limit?: number;
  offset?: number;
}

export function getJobs(params: JobFilterParams = {}): { jobs: Job[]; total: number } {
  const db = getDatabase();
  let whereClauses = ['1=1'];
  const args: any[] = [];

  if (params.status) {
    whereClauses.push('j.status = ?');
    args.push(params.status);
  } else {
    // default active
    whereClauses.push("j.status = 'active'");
  }

  if (params.employerId) {
    whereClauses.push('j.employer_id = ?');
    args.push(params.employerId);
  }

  if (params.category && params.category !== 'All') {
    whereClauses.push('LOWER(j.category) = LOWER(?)');
    args.push(params.category);
  }

  if (params.location && params.location !== 'All') {
    whereClauses.push('LOWER(j.location) LIKE ?');
    args.push(`%${params.location.toLowerCase()}%`);
  }

  if (params.employmentType && params.employmentType !== 'All') {
    whereClauses.push('j.employment_type = ?');
    args.push(params.employmentType);
  }

  if (params.workplaceType && params.workplaceType !== 'All') {
    whereClauses.push('j.workplace_type = ?');
    args.push(params.workplaceType);
  }

  if (params.salaryMin && params.salaryMin > 0) {
    whereClauses.push('j.salary_max >= ?');
    args.push(params.salaryMin);
  }

  if (params.search && params.search.trim()) {
    const q = `%${params.search.trim().toLowerCase()}%`;
    whereClauses.push(
      '(LOWER(j.title) LIKE ? OR LOWER(j.category) LIKE ? OR LOWER(ep.company_name) LIKE ? OR LOWER(j.responsibilities) LIKE ? OR LOWER(j.required_skills) LIKE ?)'
    );
    args.push(q, q, q, q, q);
  }

  const whereSql = whereClauses.join(' AND ');

  const countQuery = `
    SELECT COUNT(*) as count
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE ${whereSql}
  `;
  const countRow = db.prepare(countQuery).get(...args) as any;
  const total = countRow?.count || 0;

  const limit = params.limit || 20;
  const offset = params.offset || 0;

  const query = `
    SELECT j.*,
           ep.company_name,
           ep.logo_url as company_logo,
           ep.location as company_location,
           (ep.verification_status = 'verified') as company_verified
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE ${whereSql}
    ORDER BY j.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(query).all(...args, limit, offset) as any[];

  const jobs: Job[] = rows.map((r) => ({
    ...r,
    required_skills: JSON.parse(r.required_skills || '[]'),
    company_verified: Boolean(r.company_verified),
  }));

  return { jobs, total };
}

export function getJobById(id: string): Job | null {
  const db = getDatabase();
  const query = `
    SELECT j.*,
           ep.company_name,
           ep.logo_url as company_logo,
           ep.location as company_location,
           ep.description as company_description,
           (ep.verification_status = 'verified') as company_verified
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE j.id = ?
  `;
  const row = db.prepare(query).get(id) as any;
  if (!row) return null;
  return {
    ...row,
    required_skills: JSON.parse(row.required_skills || '[]'),
    company_verified: Boolean(row.company_verified),
  };
}

export function incrementJobViews(id: string) {
  const db = getDatabase();
  db.prepare('UPDATE jobs SET views_count = views_count + 1 WHERE id = ?').run(id);
}

export function createJob(data: {
  id: string;
  employerId: string;
  title: string;
  category: string;
  employmentType: string;
  workplaceType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  responsibilities: string;
  qualifications: string;
  requiredSkills: string[];
  deadline: string;
}): Job {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO jobs (
      id, employer_id, title, category, employment_type, workplace_type,
      location, salary_min, salary_max, salary_currency, responsibilities,
      qualifications, required_skills, status, deadline, views_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'KES', ?, ?, ?, 'active', ?, 0, ?, ?)
  `).run(
    data.id,
    data.employerId,
    data.title,
    data.category,
    data.employmentType,
    data.workplaceType,
    data.location,
    data.salaryMin,
    data.salaryMax,
    data.responsibilities,
    data.qualifications,
    JSON.stringify(data.requiredSkills),
    data.deadline,
    now,
    now
  );

  return getJobById(data.id)!;
}

export function updateJob(
  id: string,
  data: Partial<{
    title: string;
    category: string;
    employmentType: string;
    workplaceType: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    responsibilities: string;
    qualifications: string;
    requiredSkills: string[];
    deadline: string;
    status: JobStatus;
  }>
) {
  const db = getDatabase();
  const current = getJobById(id);
  if (!current) return null;

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE jobs
    SET title = ?, category = ?, employment_type = ?, workplace_type = ?,
        location = ?, salary_min = ?, salary_max = ?, responsibilities = ?,
        qualifications = ?, required_skills = ?, deadline = ?, status = ?,
        updated_at = ?
    WHERE id = ?
  `).run(
    data.title ?? current.title,
    data.category ?? current.category,
    data.employmentType ?? current.employment_type,
    data.workplaceType ?? current.workplace_type,
    data.location ?? current.location,
    data.salaryMin ?? current.salary_min,
    data.salaryMax ?? current.salary_max,
    data.responsibilities ?? current.responsibilities,
    data.qualifications ?? current.qualifications,
    JSON.stringify(data.requiredSkills ?? current.required_skills),
    data.deadline ?? current.deadline,
    data.status ?? current.status,
    now,
    id
  );

  return getJobById(id);
}

// ================= EMPLOYERS =================

export function getAllEmployers(): EmployerProfile[] {
  const db = getDatabase();
  const rows = db
    .prepare(
      `
    SELECT ep.*, COUNT(j.id) as open_jobs_count
    FROM employer_profiles ep
    LEFT JOIN jobs j ON ep.id = j.employer_id AND j.status = 'active'
    GROUP BY ep.id
    ORDER BY ep.company_name ASC
  `
    )
    .all() as any[];
  return rows;
}

export function requestEmployerVerification(employerId: string, docUrl: string, regNo?: string) {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE employer_profiles
    SET verification_status = 'pending', verification_document = ?,
        registration_number = COALESCE(?, registration_number), updated_at = ?
    WHERE id = ?
  `).run(docUrl, regNo || null, now, employerId);
}

export function updateVerificationStatus(employerId: string, status: VerificationStatus) {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE employer_profiles
    SET verification_status = ?, updated_at = ?
    WHERE id = ?
  `).run(status, now, employerId);
}

// ================= APPLICATIONS =================

export function getApplicationByJobAndSeeker(
  jobId: string,
  seekerId: string
): Application | null {
  const db = getDatabase();
  const row = db
    .prepare('SELECT * FROM applications WHERE job_id = ? AND job_seeker_id = ?')
    .get(jobId, seekerId) as any;
  return row ? (row as Application) : null;
}

export function createApplication(data: {
  id: string;
  jobId: string;
  seekerId: string;
  coverLetter?: string;
  cvUrl?: string;
}): Application {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO applications (id, job_id, job_seeker_id, cover_letter, cv_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'Submitted', ?, ?)
  `).run(data.id, data.jobId, data.seekerId, data.coverLetter || null, data.cvUrl || null, now, now);

  return getApplicationById(data.id)!;
}

export function getApplicationById(id: string): Application | null {
  const db = getDatabase();
  const query = `
    SELECT a.*,
           j.title as job_title,
           j.location as job_location,
           j.salary_min,
           j.salary_max,
           ep.company_name,
           jsp.full_name as candidate_name,
           u.email as candidate_email,
           jsp.headline as candidate_headline,
           jsp.skills as candidate_skills_json,
           jsp.location as candidate_location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN employer_profiles ep ON j.employer_id = ep.id
    JOIN job_seeker_profiles jsp ON a.job_seeker_id = jsp.id
    JOIN users u ON jsp.user_id = u.id
    WHERE a.id = ?
  `;
  const row = db.prepare(query).get(id) as any;
  if (!row) return null;
  return {
    ...row,
    candidate_skills: JSON.parse(row.candidate_skills_json || '[]'),
  };
}

export function getApplicationsBySeeker(seekerId: string): Application[] {
  const db = getDatabase();
  const query = `
    SELECT a.*,
           j.title as job_title,
           j.location as job_location,
           j.salary_min,
           j.salary_max,
           ep.company_name,
           ep.logo_url as company_logo
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE a.job_seeker_id = ?
    ORDER BY a.created_at DESC
  `;
  return db.prepare(query).all(seekerId) as any[];
}

export function getApplicationsByEmployer(employerId: string): Application[] {
  const db = getDatabase();
  const query = `
    SELECT a.*,
           j.title as job_title,
           j.location as job_location,
           jsp.full_name as candidate_name,
           u.email as candidate_email,
           jsp.headline as candidate_headline,
           jsp.skills as candidate_skills_json,
           jsp.location as candidate_location,
           jsp.cv_url as candidate_cv_url
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN job_seeker_profiles jsp ON a.job_seeker_id = jsp.id
    JOIN users u ON jsp.user_id = u.id
    WHERE j.employer_id = ?
    ORDER BY a.created_at DESC
  `;
  const rows = db.prepare(query).all(employerId) as any[];
  return rows.map((r) => ({
    ...r,
    candidate_skills: JSON.parse(r.candidate_skills_json || '[]'),
  }));
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string
) {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE applications
    SET status = ?, notes = COALESCE(?, notes), updated_at = ?
    WHERE id = ?
  `).run(status, notes || null, now, id);

  // Notify candidate
  const app = getApplicationById(id);
  if (app) {
    const seeker = getJobSeekerProfileById(app.job_seeker_id);
    if (seeker) {
      createNotification(
        seeker.user_id,
        `Application Status Update: ${status}`,
        `Your application for ${app.job_title} at ${app.company_name} is now: ${status}.`,
        '/dashboard/job-seeker/applications'
      );
    }
  }
}

// ================= SAVED JOBS =================

export function saveJob(userId: string, jobId: string) {
  const db = getDatabase();
  const id = `save_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR IGNORE INTO saved_jobs (id, user_id, job_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run(id, userId, jobId, now);
}

export function unsaveJob(userId: string, jobId: string) {
  const db = getDatabase();
  db.prepare('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?').run(userId, jobId);
}

export function isJobSaved(userId: string, jobId: string): boolean {
  const db = getDatabase();
  const row = db
    .prepare('SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?')
    .get(userId, jobId);
  return Boolean(row);
}

export function getSavedJobs(userId: string): Job[] {
  const db = getDatabase();
  const query = `
    SELECT j.*,
           ep.company_name,
           ep.logo_url as company_logo,
           ep.location as company_location,
           (ep.verification_status = 'verified') as company_verified
    FROM saved_jobs sj
    JOIN jobs j ON sj.job_id = j.id
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE sj.user_id = ?
    ORDER BY sj.created_at DESC
  `;
  const rows = db.prepare(query).all(userId) as any[];
  return rows.map((r) => ({
    ...r,
    required_skills: JSON.parse(r.required_skills || '[]'),
    company_verified: Boolean(r.company_verified),
  }));
}

// ================= NOTIFICATIONS =================

export function createNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  const db = getDatabase();
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, link, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(id, userId, title, message, link || null, now);
}

export function getNotifications(userId: string): Notification[] {
  const db = getDatabase();
  const rows = db
    .prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 25')
    .all(userId) as any[];
  return rows.map((r) => ({ ...r, read: Boolean(r.read) }));
}

export function markNotificationRead(id: string) {
  const db = getDatabase();
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
}

export function markAllNotificationsRead(userId: string) {
  const db = getDatabase();
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(userId);
}

// ================= CONVERSATIONS & MESSAGING =================

export function getOrCreateConversation(employerId: string, seekerId: string, jobId?: string): Conversation {
  const db = getDatabase();
  let row = db.prepare(
    'SELECT * FROM conversations WHERE employer_id = ? AND job_seeker_id = ?'
  ).get(employerId, seekerId) as any;

  if (!row) {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO conversations (id, employer_id, job_seeker_id, job_id, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, employerId, seekerId, jobId || null, now);
    row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as any;
  }

  return row as Conversation;
}

export function getConversationsForUser(userId: string, role: string): Conversation[] {
  const db = getDatabase();
  let query = '';
  if (role === 'employer') {
    query = `
      SELECT c.*,
             jsp.full_name as seeker_name,
             ep.company_name,
             j.title as job_title,
             (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM conversations c
      JOIN employer_profiles ep ON c.employer_id = ep.id
      JOIN job_seeker_profiles jsp ON c.job_seeker_id = jsp.id
      LEFT JOIN jobs j ON c.job_id = j.id
      WHERE ep.user_id = ?
      ORDER BY c.updated_at DESC
    `;
  } else {
    query = `
      SELECT c.*,
             jsp.full_name as seeker_name,
             ep.company_name,
             j.title as job_title,
             (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM conversations c
      JOIN employer_profiles ep ON c.employer_id = ep.id
      JOIN job_seeker_profiles jsp ON c.job_seeker_id = jsp.id
      LEFT JOIN jobs j ON c.job_id = j.id
      WHERE jsp.user_id = ?
      ORDER BY c.updated_at DESC
    `;
  }
  return db.prepare(query).all(userId) as any[];
}

export function getMessages(conversationId: string): Message[] {
  const db = getDatabase();
  return db
    .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
    .all(conversationId) as any[];
}

export function sendMessage(conversationId: string, senderId: string, content: string): Message {
  const db = getDatabase();
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, conversationId, senderId, content, now);

  db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(now, conversationId);

  return db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as any;
}

// ================= INTERVIEW SCHEDULING =================

export function scheduleInterview(data: {
  applicationId: string;
  scheduledAt: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
}): Interview {
  const db = getDatabase();
  const id = `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO interviews (id, application_id, scheduled_at, meeting_link, location, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)
  `).run(
    id,
    data.applicationId,
    data.scheduledAt,
    data.meetingLink || null,
    data.location || null,
    data.notes || null,
    now
  );

  // Update application status to Interview
  updateApplicationStatus(data.applicationId, 'Interview', `Interview scheduled for ${data.scheduledAt}`);

  return db.prepare('SELECT * FROM interviews WHERE id = ?').get(id) as any;
}

export function getInterviewByApplication(applicationId: string): Interview | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM interviews WHERE application_id = ?').get(applicationId) as any;
  return row ? (row as Interview) : null;
}

// ================= REPORTS & MODERATION =================

export function createReport(data: {
  reporterId: string;
  reportedJobId?: string;
  reportedUserId?: string;
  reason: string;
  details: string;
}): Report {
  const db = getDatabase();
  const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO reports (id, reporter_id, reported_job_id, reported_user_id, reason, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(
    id,
    data.reporterId,
    data.reportedJobId || null,
    data.reportedUserId || null,
    data.reason,
    data.details,
    now
  );

  return db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as any;
}

export function getAllReports(): Report[] {
  const db = getDatabase();
  const query = `
    SELECT r.*,
           u.email as reporter_email,
           j.title as job_title
    FROM reports r
    JOIN users u ON r.reporter_id = u.id
    LEFT JOIN jobs j ON r.reported_job_id = j.id
    ORDER BY r.created_at DESC
  `;
  return db.prepare(query).all() as any[];
}

export function updateReportStatus(reportId: string, status: string) {
  const db = getDatabase();
  db.prepare('UPDATE reports SET status = ? WHERE id = ?').run(status, reportId);
}

// ================= AUDIT LOGS & ADMIN STATS =================

export function logAudit(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: string
) {
  const db = getDatabase();
  const id = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, actorId, action, targetType, targetId, details || null, now);
}

export function getAuditLogs(): AuditLog[] {
  const db = getDatabase();
  const query = `
    SELECT al.*, u.email as actor_email
    FROM audit_logs al
    JOIN users u ON al.actor_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 50
  `;
  return db.prepare(query).all() as any[];
}

export function getAdminStats() {
  const db = getDatabase();
  const totalSeekers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'job_seeker'").get() as any).c;
  const totalEmployers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'employer'").get() as any).c;
  const totalJobs = (db.prepare("SELECT COUNT(*) as c FROM jobs").get() as any).c;
  const activeJobs = (db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'active'").get() as any).c;
  const totalApplications = (db.prepare("SELECT COUNT(*) as c FROM applications").get() as any).c;
  const pendingVerifications = (db.prepare("SELECT COUNT(*) as c FROM employer_profiles WHERE verification_status = 'pending'").get() as any).c;
  const pendingReports = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE status = 'pending'").get() as any).c;

  return {
    totalSeekers,
    totalEmployers,
    totalJobs,
    activeJobs,
    totalApplications,
    pendingVerifications,
    pendingReports,
  };
}
