import { Job, JobSeekerProfile } from './types';

export interface MatchResult {
  score: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
  locationMatch: boolean;
  interestMatch: boolean;
  explanation: string;
}

export function calculateJobMatch(job: Job, profile: JobSeekerProfile | null): MatchResult {
  if (!profile) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: job.required_skills || [],
      locationMatch: false,
      interestMatch: false,
      explanation: 'Log in and complete your profile to view your skill match score.',
    };
  }

  const candidateSkills = (profile.skills || []).map((s) => s.trim().toLowerCase());
  const jobSkills = (job.required_skills || []).map((s) => s.trim().toLowerCase());

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jobSkills.forEach((reqSkill) => {
    const isMatched = candidateSkills.some(
      (cSkill) => cSkill.includes(reqSkill) || reqSkill.includes(cSkill)
    );
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // Calculate skill weight (70% max)
  const skillRatio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 1;
  const skillScore = Math.round(skillRatio * 70);

  // Location compatibility (15% max)
  const isRemote = job.workplace_type === 'Remote';
  const locationMatch =
    isRemote ||
    (profile.location &&
      job.location.toLowerCase().includes(profile.location.toLowerCase())) ||
    (profile.location && profile.location.toLowerCase().includes(job.location.toLowerCase()));
  const locationScore = locationMatch ? 15 : 0;

  // Career interest overlap (15% max)
  const candidateInterests = (profile.career_interests || []).map((i) => i.toLowerCase());
  const interestMatch = candidateInterests.some(
    (ci) =>
      job.category.toLowerCase().includes(ci) ||
      ci.includes(job.category.toLowerCase()) ||
      job.title.toLowerCase().includes(ci)
  );
  const interestScore = interestMatch ? 15 : 0;

  const totalScore = Math.min(100, Math.max(10, skillScore + locationScore + interestScore));

  let explanation = '';
  if (matchedSkills.length === jobSkills.length && jobSkills.length > 0) {
    explanation = `Outstanding match! You have all ${matchedSkills.length} required skills.`;
  } else if (matchedSkills.length > 0) {
    explanation = `Strong match: ${matchedSkills.length} of ${jobSkills.length} required skills matched (${matchedSkills.slice(0, 3).join(', ')}).`;
  } else {
    explanation = `Explore this opportunity: Expand your skills in ${jobSkills.slice(0, 2).join(', ')} to boost alignment.`;
  }

  if (locationMatch && !isRemote) {
    explanation += ` Located right in ${job.location}.`;
  } else if (isRemote) {
    explanation += ' Remote workplace available.';
  }

  return {
    score: totalScore,
    matchedSkills,
    missingSkills,
    locationMatch: !!locationMatch,
    interestMatch,
    explanation,
  };
}
