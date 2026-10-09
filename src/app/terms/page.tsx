import { ShieldCheck, Scale } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold mb-3">
            <Scale className="w-3.5 h-3.5" />
            Terms of Service
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Platform Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Governing the use of X Power Program in Kenya & East Africa
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing X Power Program, you agree to be bound by these Terms of Service and all applicable laws and regulations of Kenya.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              2. Absolute Prohibition of Candidate Recruitment Fees
            </h2>
            <p className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-medium">
              Under Kenyan labour regulations and X Power Program terms, <strong>no employer or recruiter is permitted to charge job seekers any application fee, interview fee, medical test levy, or placement deposit</strong>. Any listing or user attempting to solicit money from candidates will be immediately suspended and reported to law enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              3. Employer Obligations
            </h2>
            <p>
              Employers must publish only genuine, funded vacancies with accurate compensation estimates in Kenyan Shillings. Submitting falsified certificates of incorporation will result in permanent entity blacklisting and legal referral.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              4. Job Seeker Obligations
            </h2>
            <p>
              Job seekers warrant that all stated qualifications, education credentials, and work histories in their profile and CV are truthful and accurate.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              5. Dispute Resolution & Jurisdiction
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any legal proceedings shall be subject to the exclusive jurisdiction of the Kenyan courts located in Nairobi.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
