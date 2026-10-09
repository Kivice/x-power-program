'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
            Support & Inquiries
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Get in Touch with Our Nairobi Team
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Have questions about employer verification, candidate profiles, or platform partnerships? We&apos;re here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              <h2 className="text-xl font-bold mb-4">Kenyan Headquarters</h2>
              <p className="text-slate-300 text-xs leading-relaxed mb-8">
                Our support and verification specialists are available Monday through Friday, 8:00 AM – 5:00 PM EAT.
              </p>

              <div className="space-y-5 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Nairobi Office:</strong>
                    The Mirage Towers, 7th Floor, Chiromo Road, Westlands, Nairobi, Kenya
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Direct Email:</strong>
                    support@xpower.co.ke
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Telephone:</strong>
                    +254 700 890 000 / +254 20 440 1200
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Business Hours:</strong>
                    Mon – Fri: 8:00 AM – 5:00 PM (EAT)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400">
              Official registration licensed under the Business Registration Service (BRS), Republic of Kenya.
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                  Thank you for reaching out. A member of our support team will respond to {email} within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Kamau"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.kamau@example.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Employer Verification Process, Bug Report..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message Details *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your question or request..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition flex items-center gap-2 shadow-md shadow-cyan-600/20"
                  >
                    <Send className="w-4 h-4" />
                    Submit Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
