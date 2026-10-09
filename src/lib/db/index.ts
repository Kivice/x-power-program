import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'xpower.db');
  dbInstance = new DatabaseSync(dbPath);

  // Configure pragmas
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA foreign_keys = ON;');

  initSchema(dbInstance);
  seedInitialData(dbInstance);

  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('job_seeker', 'employer', 'admin')),
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS job_seeker_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      location TEXT NOT NULL,
      headline TEXT,
      bio TEXT,
      education TEXT,
      experience TEXT,
      skills TEXT NOT NULL DEFAULT '[]',
      career_interests TEXT NOT NULL DEFAULT '[]',
      cv_filename TEXT,
      cv_url TEXT,
      profile_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS employer_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      company_name TEXT NOT NULL,
      logo_url TEXT,
      industry TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      website TEXT,
      contact_email TEXT NOT NULL,
      contact_phone TEXT,
      verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK(verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
      verification_document TEXT,
      registration_number TEXT,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      employer_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      employment_type TEXT NOT NULL,
      workplace_type TEXT NOT NULL,
      location TEXT NOT NULL,
      salary_min INTEGER NOT NULL,
      salary_max INTEGER NOT NULL,
      salary_currency TEXT NOT NULL DEFAULT 'KES',
      responsibilities TEXT NOT NULL,
      qualifications TEXT NOT NULL,
      required_skills TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'paused', 'closed')),
      deadline TEXT NOT NULL,
      views_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (employer_id) REFERENCES employer_profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      job_seeker_id TEXT NOT NULL,
      cover_letter TEXT,
      cv_url TEXT,
      status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired')),
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      UNIQUE(job_id, job_seeker_id),
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (job_seeker_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS saved_jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      job_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      UNIQUE(user_id, job_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      employer_id TEXT NOT NULL,
      job_seeker_id TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      UNIQUE(employer_id, job_seeker_id, job_id),
      FOREIGN KEY (employer_id) REFERENCES employer_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (job_seeker_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      read_at TEXT,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      scheduled_at TEXT NOT NULL,
      meeting_link TEXT,
      location TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reported_job_id TEXT,
      reported_user_id TEXT,
      reason TEXT NOT NULL,
      details TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'investigating', 'resolved', 'dismissed')),
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reported_job_id) REFERENCES jobs(id) ON DELETE SET NULL,
      FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
      FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
    CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
    CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
    CREATE INDEX IF NOT EXISTS idx_applications_seeker ON applications(job_seeker_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
  `);
}

function seedInitialData(db: DatabaseSync) {
  // Check if admin already exists
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@xpower.co.ke');
  if (existingAdmin) return;

  const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);
  const now = new Date().toISOString();

  // 1. Admin
  const adminId = 'usr_admin_001';
  db.prepare(`
    INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, 'admin@xpower.co.ke', defaultPasswordHash, 'admin', now, now);

  // 2. Employers
  const employers = [
    {
      userId: 'usr_emp_safaricom',
      email: 'recruitment@safaricom.co.ke',
      companyId: 'emp_prof_safaricom',
      name: 'Safaricom PLC',
      industry: 'Telecommunications & FinTech',
      location: 'Nairobi, Kenya',
      description: 'Safaricom is the leading provider of converged communication solutions in Kenya and the pioneer of M-PESA mobile money transfer service.',
      website: 'https://safaricom.co.ke',
      verificationStatus: 'verified',
      regNo: 'CPR/2012/84930',
      logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=160&auto=format&fit=crop&q=80',
    },
    {
      userId: 'usr_emp_twiga',
      email: 'careers@twigafoods.com',
      companyId: 'emp_prof_twiga',
      name: 'Twiga Foods',
      industry: 'AgriTech & Supply Chain',
      location: 'Nairobi, Kenya',
      description: 'Twiga is a B2B e-commerce platform that simplifies the supply chain between fresh food producers, FMCG manufacturers, and retailers.',
      website: 'https://twigafoods.com',
      verificationStatus: 'verified',
      regNo: 'CPR/2014/99312',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=160&auto=format&fit=crop&q=80',
    },
    {
      userId: 'usr_emp_mkopa',
      email: 'talent@m-kopa.com',
      companyId: 'emp_prof_mkopa',
      name: 'M-KOPA Solar',
      industry: 'CleanTech & IoT',
      location: 'Nairobi, Kenya',
      description: 'M-KOPA is a connected asset financing platform that provides underbanked customers across Africa with life-changing goods and digital financial services.',
      website: 'https://m-kopa.com',
      verificationStatus: 'verified',
      regNo: 'CPR/2011/55120',
      logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=160&auto=format&fit=crop&q=80',
    },
    {
      userId: 'usr_emp_equity',
      email: 'careers@equitybank.co.ke',
      companyId: 'emp_prof_equity',
      name: 'Equity Group Holdings',
      industry: 'Banking & Financial Services',
      location: 'Nairobi, Kenya',
      description: 'Equity Bank is one of the largest financial service conglomerates in East and Central Africa, dedicated to championing social-economic transformation.',
      website: 'https://equitygroupholdings.com',
      verificationStatus: 'pending',
      regNo: 'CPR/2005/11293',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=160&auto=format&fit=crop&q=80',
    },
  ];

  for (const emp of employers) {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, 'employer', ?, ?)
    `).run(emp.userId, emp.email, defaultPasswordHash, now, now);

    db.prepare(`
      INSERT INTO employer_profiles (id, user_id, company_name, logo_url, industry, location, description, website, contact_email, verification_status, registration_number, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      emp.companyId,
      emp.userId,
      emp.name,
      emp.logo,
      emp.industry,
      emp.location,
      emp.description,
      emp.website,
      emp.email,
      emp.verificationStatus,
      emp.regNo,
      now,
      now
    );
  }

  // 3. Job Seekers
  const jobSeekers = [
    {
      userId: 'usr_jsk_amina',
      email: 'amina.mwangi@example.com',
      profileId: 'jsk_prof_amina',
      name: 'Amina Mwangi',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      headline: 'Full-Stack Software Engineer (TypeScript, React, Node.js)',
      bio: 'Versatile software engineer with 4+ years experience designing scalable fintech systems, microservices, and mobile-friendly web portals.',
      education: 'BSc Computer Science, University of Nairobi (2020)',
      experience: 'Software Engineer at PayKenya (2021-Present) building payment rails handling 20,000+ daily transactions.',
      skills: JSON.stringify(['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS']),
      interests: JSON.stringify(['Software Engineering', 'FinTech', 'Cloud Infrastructure']),
    },
    {
      userId: 'usr_jsk_kevin',
      email: 'kevin.otieno@example.com',
      profileId: 'jsk_prof_kevin',
      name: 'Kevin Otieno',
      phone: '+254 722 987 654',
      location: 'Mombasa, Kenya',
      headline: 'Data Analyst & Business Intelligence Specialist',
      bio: 'Analytical problem solver with strong background in Python, SQL, PowerBI, and market supply chain optimization in East Africa.',
      education: 'BSc Statistics & Applied Economics, Kenyatta University (2021)',
      experience: 'Junior Data Analyst at Coast Logistics (2022-Present).',
      skills: JSON.stringify(['Python', 'SQL', 'Power BI', 'Data Visualization', 'Pandas', 'Excel Modeling']),
      interests: JSON.stringify(['Data Science', 'AgriTech', 'Logistics']),
    },
    {
      userId: 'usr_jsk_faith',
      email: 'faith.chebet@example.com',
      profileId: 'jsk_prof_faith',
      name: 'Faith Chebet',
      phone: '+254 733 112 233',
      location: 'Eldoret, Kenya',
      headline: 'Renewable Energy & IoT Systems Engineer',
      bio: 'Field engineer passionate about solar energy distribution, hardware-software telemetry, and expanding off-grid power access across rural Kenya.',
      education: 'BEng Electrical & Electronics Engineering, Moi University (2022)',
      experience: 'Field Field Support Technician at Rift Clean Energy (2023-Present).',
      skills: JSON.stringify(['IoT Telemetry', 'Solar PV Systems', 'Embedded C', 'Hardware Troubleshooting', 'System Diagnostics']),
      interests: JSON.stringify(['CleanTech', 'IoT', 'Hardware Engineering']),
    },
  ];

  for (const seeker of jobSeekers) {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, 'job_seeker', ?, ?)
    `).run(seeker.userId, seeker.email, defaultPasswordHash, now, now);

    db.prepare(`
      INSERT INTO job_seeker_profiles (id, user_id, full_name, phone, location, headline, bio, education, experience, skills, career_interests, cv_filename, cv_url, profile_completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(
      seeker.profileId,
      seeker.userId,
      seeker.name,
      seeker.phone,
      seeker.location,
      seeker.headline,
      seeker.bio,
      seeker.education,
      seeker.experience,
      seeker.skills,
      seeker.interests,
      `${seeker.name.toLowerCase().replace(/\s+/g, '_')}_cv.pdf`,
      `/resumes/${seeker.name.toLowerCase().replace(/\s+/g, '_')}_cv.pdf`,
      now,
      now
    );
  }

  // 4. Jobs
  const jobs = [
    {
      id: 'job_saf_001',
      employerId: 'emp_prof_safaricom',
      title: 'Senior Full-Stack Engineer (FinTech & M-PESA)',
      category: 'Software Engineering',
      employmentType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Nairobi, Kenya',
      salaryMin: 220000,
      salaryMax: 350000,
      responsibilities: `* Architect, build, and optimize high-throughput financial transaction processing services.\n* Collaborate with product managers, QA, and security specialists to deploy mission-critical updates.\n* Implement resilient APIs integrating with national banking partners and merchant networks.\n* Mentor junior developers and lead code reviews for code quality and maintainability.`,
      qualifications: `* 4+ years of professional full-stack development experience.\n* Strong proficiency in TypeScript, Node.js, and modern frontend frameworks (React/Next.js).\n* Experience with relational databases (PostgreSQL/MySQL) and message queues (Kafka/RabbitMQ).\n* Demonstrated understanding of cryptographic security and PCI-DSS compliance is a strong plus.`,
      skills: JSON.stringify(['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Microservices']),
      deadline: '2026-11-30',
      views: 142,
    },
    {
      id: 'job_saf_002',
      employerId: 'emp_prof_safaricom',
      title: 'Cloud DevOps & Infrastructure Lead',
      category: 'DevOps & Cloud',
      employmentType: 'Full-time',
      workplaceType: 'On-site',
      location: 'Nairobi, Kenya',
      salaryMin: 280000,
      salaryMax: 420000,
      responsibilities: `* Oversee Kubernetes clusters and multi-region AWS/Azure infrastructure deployments.\n* Design and enforce CI/CD deployment pipelines with zero-downtime blue/green rollouts.\n* Monitor system health, performance metrics, and incident response runbooks.\n* Manage infrastructure-as-code using Terraform.`,
      qualifications: `* 5+ years experience in DevOps, Site Reliability Engineering, or Cloud Architecture.\n* Certified in AWS or Azure solutions architecture.\n* Hands-on mastery of Docker, Kubernetes, Terraform, and Prometheus/Grafana.`,
      skills: JSON.stringify(['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Prometheus']),
      deadline: '2026-12-15',
      views: 98,
    },
    {
      id: 'job_twi_001',
      employerId: 'emp_prof_twiga',
      title: 'Agricultural Supply Chain Data Analyst',
      category: 'Data Science & Analytics',
      employmentType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Nairobi, Kenya',
      salaryMin: 140000,
      salaryMax: 200000,
      responsibilities: `* Analyze supply-demand forecasting models for fresh farm produce across Central Kenya.\n* Build dynamic Power BI and Python dashboards for vendor procurement teams.\n* Monitor logistics route efficiency and fleet fuel consumption.\n* Identify inventory loss bottlenecks and deliver actionable weekly KPI recommendations.`,
      qualifications: `* Degree in Statistics, Data Science, Economics, or related quantitative discipline.\n* 2+ years working with SQL and Python (Pandas, NumPy, Matplotlib).\n* Practical experience with BI dashboards (Power BI / Tableau / Metabase).\n* Excellent communication skills to bridge technical insights with operational field teams.`,
      skills: JSON.stringify(['Python', 'SQL', 'Power BI', 'Data Visualization', 'Pandas', 'Excel Modeling']),
      deadline: '2026-11-20',
      views: 185,
    },
    {
      id: 'job_twi_002',
      employerId: 'emp_prof_twiga',
      title: 'Regional Logistics Coordinator',
      category: 'Operations & Logistics',
      employmentType: 'Full-time',
      workplaceType: 'On-site',
      location: 'Nakuru, Kenya',
      salaryMin: 95000,
      salaryMax: 140000,
      responsibilities: `* Direct last-mile delivery operations connecting farmer hubs to retail distribution depots.\n* Manage dispatch drivers, loading schedules, and temperature-controlled storage checks.\n* Resolve vendor fulfillment escalations rapidly.\n* Ensure statutory compliance with local transport and health safety standards.`,
      qualifications: `* Diploma or Degree in Supply Chain Management or Business Administration.\n* 3+ years operational experience in FMCG or perishable commodities distribution.\n* Valid Kenyan driving license and clean background record.`,
      skills: JSON.stringify(['Fleet Management', 'Supply Chain', 'Inventory Control', 'Vendor Relations']),
      deadline: '2026-11-10',
      views: 74,
    },
    {
      id: 'job_mko_001',
      employerId: 'emp_prof_mkopa',
      title: 'Solar IoT Telemetry Systems Specialist',
      category: 'Hardware & IoT',
      employmentType: 'Full-time',
      workplaceType: 'Hybrid',
      location: 'Nairobi, Kenya',
      salaryMin: 180000,
      salaryMax: 260000,
      responsibilities: `* Develop embedded firmware and remote telemetry software for off-grid smart solar home units.\n* Optimize cellular GSM/GPRS data transmission for low-bandwidth rural environments.\n* Diagnose field battery degradation and device lockout telemetry in real-time.\n* Test next-generation hardware prototypes in lab and field test sites.`,
      qualifications: `* Degree in Electrical Engineering, Computer Engineering, or Mechatronics.\n* 3+ years firmware development in Embedded C/C++ or Rust.\n* Familiarity with IoT communication protocols (MQTT, CoAP) and cellular modems.`,
      skills: JSON.stringify(['IoT Telemetry', 'Embedded C', 'Solar PV Systems', 'MQTT', 'Hardware Troubleshooting']),
      deadline: '2026-12-05',
      views: 112,
    },
    {
      id: 'job_equ_001',
      employerId: 'emp_prof_equity',
      title: 'Cybersecurity Threat Intelligence Analyst',
      category: 'Cybersecurity',
      employmentType: 'Full-time',
      workplaceType: 'On-site',
      location: 'Nairobi, Kenya',
      salaryMin: 200000,
      salaryMax: 320000,
      responsibilities: `* Monitor Security Operations Center (SOC) alerts across all retail banking platforms.\n* Conduct vulnerability assessments and simulated penetration testing.\n* Investigate phishing, fraud attempts, and unauthorized API intrusion vectors.\n* Prepare regulatory incident reports for the Central Bank of Kenya (CBK).`,
      qualifications: `* Certified Information Systems Security Professional (CISSP) or CEH.\n* 3+ years experience in cybersecurity within financial or telecommunications sectors.\n* Hands-on experience with SIEM platforms (Splunk, QRadar, or Microsoft Sentinel).`,
      skills: JSON.stringify(['SIEM', 'Penetration Testing', 'Network Security', 'Incident Response', 'Compliance']),
      deadline: '2026-11-25',
      views: 130,
    },
    {
      id: 'job_equ_002',
      employerId: 'emp_prof_equity',
      title: 'UI/UX Product Designer (Mobile Banking)',
      category: 'Design & Creative',
      employmentType: 'Contract',
      workplaceType: 'Remote',
      location: 'Nairobi, Kenya',
      salaryMin: 150000,
      salaryMax: 230000,
      responsibilities: `* Craft intuitive user journeys for SME banking and micro-lending mobile apps.\n* Produce high-fidelity Figma prototypes, design tokens, and comprehensive component libraries.\n* Run user interviews and usability tests with diverse cohorts across Kenya and Rwanda.\n* Work closely with React Native developers to inspect UI implementation accuracy.`,
      qualifications: `* 3+ years experience designing mobile consumer or fintech experiences.\n* Standout portfolio demonstrating UX problem solving, wireframing, and polished visual craft.\n* Mastery of Figma, design systems, and responsive design paradigms.`,
      skills: JSON.stringify(['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Wireframing']),
      deadline: '2026-11-18',
      views: 164,
    },
  ];

  for (const job of jobs) {
    db.prepare(`
      INSERT INTO jobs (id, employer_id, title, category, employment_type, workplace_type, location, salary_min, salary_max, salary_currency, responsibilities, qualifications, required_skills, status, deadline, views_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'KES', ?, ?, ?, 'active', ?, ?, ?, ?)
    `).run(
      job.id,
      job.employerId,
      job.title,
      job.category,
      job.employmentType,
      job.workplaceType,
      job.location,
      job.salaryMin,
      job.salaryMax,
      job.responsibilities,
      job.qualifications,
      job.skills,
      job.deadline,
      job.views,
      now,
      now
    );
  }

  // 5. Initial Sample Applications
  const sampleApps = [
    {
      id: 'app_001',
      jobId: 'job_saf_001',
      seekerId: 'jsk_prof_amina',
      coverLetter: 'Dear Safaricom Hiring Team, having engineered high-volume payment services and fintech APIs for the past 4 years in Nairobi, I am thrilled to apply for the Senior Full-Stack Engineer position. I look forward to contributing to M-PESA reliability and developer excellence.',
      cvUrl: '/resumes/amina_mwangi_cv.pdf',
      status: 'Shortlisted',
      notes: 'Strong candidate with deep TypeScript and FinTech API experience. Invited for technical round.',
    },
    {
      id: 'app_002',
      jobId: 'job_twi_001',
      seekerId: 'jsk_prof_kevin',
      coverLetter: 'Dear Twiga Team, my background in agricultural metrics, Python data pipelines, and interactive Power BI dashboards makes me a great fit for your supply chain analytics goals. Excited to help optimize food distribution in East Africa.',
      cvUrl: '/resumes/kevin_otieno_cv.pdf',
      status: 'Under Review',
      notes: 'Solid SQL and Python background. Reviewing academic portfolio.',
    },
    {
      id: 'app_003',
      jobId: 'job_mko_001',
      seekerId: 'jsk_prof_faith',
      coverLetter: 'Dear M-KOPA Recruiter, I have extensive field and firmware diagnostics experience in solar home systems across the Rift Valley. I would love to bring my embedded systems knowledge to your IoT telemetry engineering team.',
      cvUrl: '/resumes/faith_chebet_cv.pdf',
      status: 'Interview',
      notes: 'Initial interview scheduled for next Tuesday at 10:00 AM.',
    },
  ];

  for (const app of sampleApps) {
    db.prepare(`
      INSERT INTO applications (id, job_id, job_seeker_id, cover_letter, cv_url, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(app.id, app.jobId, app.seekerId, app.coverLetter, app.cvUrl, app.status, app.notes, now, now);
  }

  // 6. Sample Notifications
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, link, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(
    'notif_001',
    'usr_jsk_amina',
    'Application Shortlisted!',
    'Your application for Senior Full-Stack Engineer at Safaricom PLC has been shortlisted.',
    '/dashboard/job-seeker/applications',
    now
  );

  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, link, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run(
    'notif_002',
    'usr_jsk_faith',
    'Interview Invitation',
    'M-KOPA Solar has scheduled an interview for Solar IoT Telemetry Systems Specialist.',
    '/dashboard/job-seeker/applications',
    now
  );

  // 7. Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'audit_001',
    adminId,
    'SYSTEM_INITIALIZED',
    'platform',
    'xpower',
    'System seeded with initial Kenyan enterprises and job seeker benchmarks.',
    now
  );

  // 8. Saved Job
  db.prepare(`
    INSERT INTO saved_jobs (id, user_id, job_id, created_at)
    VALUES (?, ?, ?, ?)
  `).run('save_001', 'usr_jsk_amina', 'job_saf_002', now);
}
