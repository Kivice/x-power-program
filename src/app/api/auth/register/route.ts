import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/db';
import { getUserByEmail, getJobSeekerProfile, getEmployerProfile } from '@/lib/db/queries';
import { hashPassword, setSessionCookie } from '@/lib/auth';

const seekerRegisterSchema = z.object({
  role: z.literal('job_seeker'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  skills: z.array(z.string()).default([]),
  headline: z.string().optional(),
});

const employerRegisterSchema = z.object({
  role: z.literal('employer'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Please provide a company description'),
  website: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const role = body.role;

    if (role === 'job_seeker') {
      const parsed = seekerRegisterSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
      }
      const data = parsed.data;

      const existing = getUserByEmail(data.email);
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }

      const db = getDatabase();
      const userId = `usr_jsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const profileId = `jsk_prof_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const passHash = hashPassword(data.password);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, 'job_seeker', ?, ?)
      `).run(userId, data.email, passHash, now, now);

      db.prepare(`
        INSERT INTO job_seeker_profiles (id, user_id, full_name, phone, location, headline, skills, profile_completed, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(
        profileId,
        userId,
        data.fullName,
        data.phone || null,
        data.location,
        data.headline || null,
        JSON.stringify(data.skills),
        now,
        now
      );

      await setSessionCookie({
        userId,
        email: data.email,
        role: 'job_seeker',
        profileId,
        name: data.fullName,
      });

      return NextResponse.json({
        success: true,
        user: { userId, email: data.email, role: 'job_seeker', profileId, name: data.fullName },
      });
    } else if (role === 'employer') {
      const parsed = employerRegisterSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
      }
      const data = parsed.data;

      const existing = getUserByEmail(data.email);
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }

      const db = getDatabase();
      const userId = `usr_emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const profileId = `emp_prof_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const passHash = hashPassword(data.password);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, 'employer', ?, ?)
      `).run(userId, data.email, passHash, now, now);

      db.prepare(`
        INSERT INTO employer_profiles (
          id, user_id, company_name, industry, location, description,
          website, contact_email, verification_status, registration_number,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unverified', ?, ?, ?)
      `).run(
        profileId,
        userId,
        data.companyName,
        data.industry,
        data.location,
        data.description,
        data.website || null,
        data.email,
        data.registrationNumber || null,
        now,
        now
      );

      await setSessionCookie({
        userId,
        email: data.email,
        role: 'employer',
        profileId,
        companyName: data.companyName,
      });

      return NextResponse.json({
        success: true,
        user: {
          userId,
          email: data.email,
          role: 'employer',
          profileId,
          companyName: data.companyName,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid registration role' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
