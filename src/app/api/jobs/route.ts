import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getJobs, createJob, getEmployerProfile } from '@/lib/db/queries';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const employmentType = searchParams.get('employmentType') || undefined;
    const workplaceType = searchParams.get('workplaceType') || undefined;
    const salaryMin = searchParams.get('salaryMin')
      ? parseInt(searchParams.get('salaryMin')!, 10)
      : undefined;
    const employerId = searchParams.get('employerId') || undefined;
    const status = (searchParams.get('status') as any) || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 30;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const result = getJobs({
      search,
      category,
      location,
      employmentType,
      workplaceType,
      salaryMin,
      employerId,
      status,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch jobs' }, { status: 500 });
  }
}

const jobCreateSchema = z.object({
  title: z.string().min(3, 'Job title is required'),
  category: z.string().min(2, 'Category is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  workplaceType: z.enum(['On-site', 'Hybrid', 'Remote']),
  location: z.string().min(2, 'Location is required'),
  salaryMin: z.number().min(0, 'Salary minimum must be positive'),
  salaryMax: z.number().min(0, 'Salary maximum must be positive'),
  responsibilities: z.string().min(10, 'Responsibilities are required'),
  qualifications: z.string().min(10, 'Qualifications are required'),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  deadline: z.string().min(4, 'Valid deadline required'),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'employer' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized. Employer account required.' }, { status: 403 });
    }

    const employer = getEmployerProfile(session.userId);
    if (!employer) {
      return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = jobCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newJob = createJob({
      id: jobId,
      employerId: employer.id,
      title: data.title,
      category: data.category,
      employmentType: data.employmentType,
      workplaceType: data.workplaceType,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      responsibilities: data.responsibilities,
      qualifications: data.qualifications,
      requiredSkills: data.requiredSkills,
      deadline: data.deadline,
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create job' }, { status: 500 });
  }
}
