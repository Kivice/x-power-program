import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Kenya Data Protection Act, 2019 Compliant
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: October 2026 &bull; X Power Program (Kenya) Limited
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. Statutory Commitment & Scope
            </h2>
            <p>
              X Power Program operates as a registered data controller and processor in the Republic of Kenya. We adhere strictly to the provisions of the <strong>Kenya Data Protection Act, 2019</strong> and regulations issued by the Office of the Data Protection Commissioner (ODPC). This policy explains our handling of personal data for both Job Seekers and Employers.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              2. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>
                <strong>Job Seeker Personal Data:</strong> Legal full name, email address, Kenyan telephone number, residence/county location, educational history, professional background, skills, and Curriculum Vitae (PDF format).
              </li>
              <li>
                <strong>Employer / Corporate Data:</strong> Company name, registered physical location, KRA PIN or Business Registration number, authorized recruiter contact information, and business certificates.
              </li>
              <li>
                <strong>Usage & Technical Data:</strong> Session cookies, IP addresses, application interaction history, and audit log entries.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              3. Protection & Non-Public Access of CV Documents
            </h2>
            <p>
              In strict adherence to candidate confidentiality, <strong>Curriculum Vitae (CV) documents uploaded to X Power Program are not publicly indexable or browseable by default</strong>. A candidate&apos;s CV is only accessible to an employer when the job seeker explicitly submits an application for that employer&apos;s active vacancy.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              4. Principles of Data Processing
            </h2>
            <p>
              Under Section 25 of the Data Protection Act, 2019, your personal data is:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Lawfulness & Fairness:</strong> Processed only with transparent legal basis and explicit user consent.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Purpose Limitation:</strong> Collected strictly for employment matching, recruitment, and verification.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Data Minimization:</strong> Restricted to what is strictly relevant for evaluating job fitness.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Security & Cryptography:</strong> Passwords hashed using bcrypt, sessions encrypted with JWTs over TLS.
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              5. Rights of Data Subjects
            </h2>
            <p className="mb-2">
              As a Kenyan data subject, you hold statutory rights including:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>The right to be informed of how your personal data is being processed.</li>
              <li>The right to access and download your personal profile and application records.</li>
              <li>The right to rectify false or misleading data in your profile at any time.</li>
              <li>The right to request deletion of your account and related records.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              6. Data Protection Officer (DPO) Contact
            </h2>
            <p>
              To exercise your statutory rights or raise any privacy concerns, contact our Data Protection Officer at:
              <br />
              <strong>Email:</strong> privacy@xpower.co.ke | <strong>Physical Address:</strong> The Mirage Towers, Westlands, Nairobi, Kenya.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
