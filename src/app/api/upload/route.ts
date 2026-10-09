import { NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs';
import { getSession } from '@/lib/auth';
import { updateJobSeekerProfile, getJobSeekerProfile, updateEmployerProfile, getEmployerProfile } from '@/lib/db/queries';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = formData.get('type') as string | null; // 'cv' | 'logo' | 'verification'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name).toLowerCase();

    if (uploadType === 'cv') {
      if (ext !== '.pdf') {
        return NextResponse.json({ error: 'CV must be in PDF format (.pdf)' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must not exceed 5MB' }, { status: 400 });
      }

      const safeName = `cv_${session.userId}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${safeName}`;

      const seeker = getJobSeekerProfile(session.userId);
      if (seeker) {
        updateJobSeekerProfile(session.userId, {
          fullName: seeker.full_name,
          location: seeker.location,
          headline: seeker.headline,
          bio: seeker.bio,
          education: seeker.education,
          experience: seeker.experience,
          skills: seeker.skills,
          careerInterests: seeker.career_interests,
          cvFilename: file.name,
          cvUrl: fileUrl,
        });
      }

      return NextResponse.json({
        success: true,
        filename: file.name,
        url: fileUrl,
      });
    } else {
      // Image or Verification doc
      const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];
      if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: 'Invalid file type. Allowed: PNG, JPG, WEBP, PDF' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must not exceed 5MB' }, { status: 400 });
      }

      const safeName = `doc_${session.userId}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${safeName}`;

      return NextResponse.json({
        success: true,
        filename: file.name,
        url: fileUrl,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
