import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitContactEnquiry } from '../../services/db';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface ContactPageProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ setActiveTab, openAuthModal }) => {
  const { user, userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setName((prev) => prev || userProfile.displayName || '');
      setEmail((prev) => prev || userProfile.email || '');
      setCountry((prev) => prev || userProfile.country || '');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError('Please provide all required fields.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const id = await submitContactEnquiry({
        name,
        email,
        country: country || undefined,
        subject,
        message,
      });
      setSuccessId(id);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error submitting enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="max-w-3xl space-y-4 border-b border-stone-300 pb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold">
          Secretariat Communications
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45] leading-tight">
          Contact Our Humanitarian Offices & Coordination Hubs
        </h1>
        <p className="text-base text-stone-700 leading-relaxed">
          For general enquiries, field cooperation, media inquiries, or official diplomatic consultations, reach out through our official channels or initiate a private encrypted message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs">
          {successId ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#142B45]">
                Enquiry Dispatched
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Your communication has been registered with our Secretariat Office under reference:
              </p>
              <div className="p-3 bg-stone-100 rounded text-xs font-mono font-bold text-[#142B45] inline-block">
                {successId}
              </div>
              <p className="text-xs text-stone-500">
                A duty coordinator will review your request and reply to your email within 24 to 48 hours.
              </p>
              <button
                onClick={() => setSuccessId(null)}
                className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white hover:bg-[#1E3E63]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#142B45]">
                  Official Enquiry Dispatch Form
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Submissions are logged directly into our administration queue.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Tanaka"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Country / Territory
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Singapore, Thailand, India"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Health Project Consultation"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Enquiry Message Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide the details of your inquiry or consultation request..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-wider bg-[#142B45] text-white hover:bg-[#1E3E63] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C9A45C]" />
                  <span>{submitting ? 'Transmitting to Secretariat...' : 'Submit Official Enquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact Info & 1-on-1 Chat Prompt */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct 1-on-1 Chat Highlight Box */}
          <div className="bg-[#142B45] text-white p-6 rounded border border-[#C9A45C]/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A45C] uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Consultation</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Prefer Private 1-on-1 Messaging?
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              If you have registered an account, you can start a private, two-way encrypted dialogue directly with our project coordinators without waiting for email dispatches.
            </p>
            <button
              onClick={() => {
                if (user) {
                  setActiveTab('member-chat');
                } else {
                  openAuthModal();
                }
              }}
              className="w-full py-2.5 px-3 rounded text-xs font-bold bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Private 1-on-1 Chat</span>
            </button>
          </div>

          {/* Regional Bureau Addresses */}
          <div className="bg-white p-6 rounded border border-stone-200 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              Regional Secretariats & Contact Points
            </h4>
            
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Central Headquarters (Singapore)</strong>
                  <span>78 Shenton Way, #18-02, Singapore 079120</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Headquarters Telephone</strong>
                  <span>+65 6789 2400 (Mon–Fri 08:30–17:30 SGT)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Official Secretariat Email</strong>
                  <span>secretariat@asian-humanitarian.org</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block">Emergency Response Duty Officer</strong>
                  <span>duty.officer@asian-humanitarian.org (24/7 Monitored)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
