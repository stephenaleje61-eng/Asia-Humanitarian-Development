import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitVolunteerApplication, submitPartnershipRequest, submitContactEnquiry } from '../../services/db';
import { 
  Heart, 
  HandHeart, 
  Briefcase, 
  CheckCircle2, 
  Send
} from 'lucide-react';

interface GetInvolvedPageProps {
  initialSupportProgramme?: string;
  setActiveTab: (tab: string) => void;
}

const VOLUNTEER_PROGRAMME_OPTIONS = [
  'Education and Scholarship Support',
  'Healthcare and Medical Assistance',
  'Clean Gravity Water & Environment',
  'Women’s Empowerment & Artisan Guilds',
  'Youth Vocational Training',
  'Disaster Relief Logistics',
  'Community Infrastructure Engineering',
];

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ 
  initialSupportProgramme,
  setActiveTab
}) => {
  const { user, userProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'volunteer' | 'partner' | 'donate'>('volunteer');

  // Volunteer form state
  const [volFullName, setVolFullName] = useState(userProfile?.displayName || '');
  const [volEmail, setVolEmail] = useState(userProfile?.email || '');
  const [volCountry, setVolCountry] = useState(userProfile?.country || '');
  const [volPhone, setVolPhone] = useState('');
  const [volProgramme, setVolProgramme] = useState(initialSupportProgramme || 'Healthcare and Medical Assistance');
  const [volSkills, setVolSkills] = useState('');
  const [volAvailability, setVolAvailability] = useState('Full-time Field (3+ months)');
  const [volMotivation, setVolMotivation] = useState('');
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSuccessId, setVolSuccessId] = useState<string | null>(null);
  const [volError, setVolError] = useState<string | null>(null);

  // Partner form state
  const [partOrg, setPartOrg] = useState('');
  const [partPerson, setPartPerson] = useState(userProfile?.displayName || '');
  const [partEmail, setPartEmail] = useState(userProfile?.email || '');
  const [partCountry, setPartCountry] = useState(userProfile?.country || '');
  const [partType, setPartType] = useState('Academic / Research Institution');
  const [partProposal, setPartProposal] = useState('');
  const [partSubmitting, setPartSubmitting] = useState(false);
  const [partSuccessId, setPartSuccessId] = useState<string | null>(null);
  const [partError, setPartError] = useState<string | null>(null);

  // Donation pledge state
  const [donationAmount, setDonationAmount] = useState<number>(250);
  const [donationFrequency, setDonationFrequency] = useState<'once' | 'monthly'>('once');
  const [donationCategory, setDonationCategory] = useState('Clean Water Infrastructure & Gravity Wells');
  const [pledgeName, setPledgeName] = useState(userProfile?.displayName || '');
  const [pledgeEmail, setPledgeEmail] = useState(userProfile?.email || '');
  const [pledgeCountry, setPledgeCountry] = useState(userProfile?.country || '');
  const [pledgeSubmitting, setPledgeSubmitting] = useState(false);
  const [pledgeRefId, setPledgeRefId] = useState<string | null>(null);
  const [pledgeError, setPledgeError] = useState<string | null>(null);

  // Sync profile fields once authenticated user profile resolves
  useEffect(() => {
    if (userProfile) {
      setVolFullName((prev) => prev || userProfile.displayName || '');
      setVolEmail((prev) => prev || userProfile.email || '');
      setVolCountry((prev) => prev || userProfile.country || '');
      setPartPerson((prev) => prev || userProfile.displayName || '');
      setPartEmail((prev) => prev || userProfile.email || '');
      setPartCountry((prev) => prev || userProfile.country || '');
      setPledgeName((prev) => prev || userProfile.displayName || '');
      setPledgeEmail((prev) => prev || userProfile.email || '');
      setPledgeCountry((prev) => prev || userProfile.country || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (initialSupportProgramme) {
      setVolProgramme(initialSupportProgramme);
    }
  }, [initialSupportProgramme]);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volFullName || !volEmail || !volCountry || !volSkills || !volMotivation) {
      setVolError('Please fill in all required fields.');
      return;
    }
    setVolSubmitting(true);
    setVolError(null);
    try {
      const id = await submitVolunteerApplication({
        fullName: volFullName,
        email: volEmail,
        country: volCountry,
        phone: volPhone,
        programmeInterest: volProgramme,
        skills: volSkills,
        availability: volAvailability,
        motivation: volMotivation,
      }, user?.uid);
      setVolSuccessId(id);
    } catch (err: any) {
      setVolError(err.message || 'Failed to submit application. Please retry.');
    } finally {
      setVolSubmitting(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partOrg || !partPerson || !partEmail || !partCountry || !partProposal) {
      setPartError('Please fill in all required fields.');
      return;
    }
    setPartSubmitting(true);
    setPartError(null);
    try {
      const id = await submitPartnershipRequest({
        organizationName: partOrg,
        contactPerson: partPerson,
        email: partEmail,
        country: partCountry,
        partnershipType: partType,
        proposal: partProposal,
      });
      setPartSuccessId(id);
    } catch (err: any) {
      setPartError(err.message || 'Failed to submit partnership request. Please retry.');
    } finally {
      setPartSubmitting(false);
    }
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim() || !pledgeEmail.trim()) {
      setPledgeError('Please provide your full name and official email for wire transfer verification.');
      return;
    }
    setPledgeSubmitting(true);
    setPledgeError(null);
    try {
      const freqLabel = donationFrequency === 'monthly' ? 'Monthly Recurring' : 'One-Time Contribution';
      const id = await submitContactEnquiry({
        name: pledgeName.trim(),
        email: pledgeEmail.trim(),
        country: pledgeCountry.trim() || 'International',
        subject: `Support Pledge: $${donationAmount} USD (${freqLabel})`,
        message: `Programme Allocation: ${donationCategory}\nAmount: $${donationAmount} USD (${freqLabel})\nEstimated Direct Field Aid (88.4%): $${(donationAmount * 0.884).toFixed(2)}\nField Engineering & Logistics (7.2%): $${(donationAmount * 0.072).toFixed(2)}\nStatutory Audit & Admin (4.4%): $${(donationAmount * 0.044).toFixed(2)}`,
      });
      setPledgeRefId(id);
    } catch (err: any) {
      setPledgeError(err?.message || 'Unable to register pledge. Please try again.');
    } finally {
      setPledgeSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="max-w-3xl space-y-4 border-b border-stone-300 pb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold">
          Global Community Action
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45] leading-tight">
          Join Our Trans-Asian Humanitarian Network
        </h1>
        <p className="text-base text-stone-700 leading-relaxed">
          Whether you are a medical professional, hydraulic engineer, educator, or institutional partner, your involvement directly accelerates sustainable progress across our 12 operational Asian regions.
        </p>
      </div>

      {/* Sub Tabs: Volunteer, Partner, Donate */}
      <div className="flex border-b border-stone-300 gap-4 sm:gap-8">
        <button
          onClick={() => setActiveSubTab('volunteer')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'volunteer'
              ? 'border-[#142B45] text-[#142B45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <HandHeart className="w-4 h-4 text-[#C9A45C]" />
          <span>Become a Volunteer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('partner')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'partner'
              ? 'border-[#142B45] text-[#142B45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#26734D]" />
          <span>Become a Development Partner</span>
        </button>

        <button
          onClick={() => setActiveSubTab('donate')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'donate'
              ? 'border-[#142B45] text-[#142B45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Direct Programme Support & Pledges</span>
        </button>
      </div>

      {/* TAB 1: VOLUNTEER APPLICATION */}
      {activeSubTab === 'volunteer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs">
            {volSuccessId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#142B45]">
                  Volunteer Application Received
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for dedicating your talents. Your application has been permanently registered in our central database under application reference:
                </p>
                <div className="p-3 bg-stone-100 rounded text-xs font-mono font-bold text-[#142B45] inline-block">
                  {volSuccessId}
                </div>
                <p className="text-xs text-stone-500">
                  Our Field Personnel Committee will review your qualifications and contact you within 5 business days. You can also view this application in your Member Portal.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => { setVolSuccessId(null); }}
                    className="px-4 py-2 rounded text-xs font-semibold border border-stone-300 hover:bg-stone-50"
                  >
                    Submit Another
                  </button>
                  <button
                    onClick={() => setActiveTab('member-portal')}
                    className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white hover:bg-[#1E3E63]"
                  >
                    View in Member Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-5">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#142B45]">
                    Humanitarian Volunteer Application
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Field assignments in Indochina, the Himalayas, and Archipelago corridors.
                  </p>
                </div>

                {volError && (
                  <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                    {volError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={volFullName}
                      onChange={(e) => setVolFullName(e.target.value)}
                      placeholder="e.g. Maya Chen"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                      placeholder="maya@example.org"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      required
                      value={volCountry}
                      onChange={(e) => setVolCountry(e.target.value)}
                      placeholder="e.g. Singapore, Japan, Thailand"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Programme of Interest *
                    </label>
                    <select
                      value={volProgramme}
                      onChange={(e) => setVolProgramme(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    >
                      {initialSupportProgramme && !VOLUNTEER_PROGRAMME_OPTIONS.includes(initialSupportProgramme) && (
                        <option value={initialSupportProgramme}>{initialSupportProgramme}</option>
                      )}
                      {VOLUNTEER_PROGRAMME_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Field Availability *
                    </label>
                    <select
                      value={volAvailability}
                      onChange={(e) => setVolAvailability(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    >
                      <option>Full-time Field (3+ months)</option>
                      <option>Short-term Medical/Engineering Mission (2–4 weeks)</option>
                      <option>Remote Consultative Specialist (Part-time)</option>
                      <option>Disaster Emergency Standby Roster</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Specialized Professional Skills & Credentials *
                  </label>
                  <input
                    type="text"
                    required
                    value={volSkills}
                    onChange={(e) => setVolSkills(e.target.value)}
                    placeholder="e.g. Registered Nurse, Solar Microgrid Technician, Bilingual Khmer/English, GIS Mapping"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Motivation & Humanitarian Experience Statement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={volMotivation}
                    onChange={(e) => setVolMotivation(e.target.value)}
                    placeholder="Describe your background, reasons for applying, and how you approach working with local Asian communities..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={volSubmitting}
                    className="w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-wider bg-[#142B45] text-white hover:bg-[#1E3E63] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#C9A45C]" />
                    <span>{volSubmitting ? 'Registering Application...' : 'Submit Official Volunteer Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Volunteer Guidelines sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8F6F0] p-6 rounded border border-stone-200 space-y-4">
              <h4 className="font-serif font-bold text-base text-[#142B45]">
                Volunteer Deployment Standards
              </h4>
              <ul className="text-xs text-stone-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#26734D] shrink-0 mt-0.5" />
                  <span><strong>Cultural Respect:</strong> Volunteers receive pre-deployment orientation regarding local customs, dress, and community protocols.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#26734D] shrink-0 mt-0.5" />
                  <span><strong>Field Health & Safety:</strong> Comprehensive medical insurance, prophylactic vaccines, and evacuation protocols provided.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#26734D] shrink-0 mt-0.5" />
                  <span><strong>Stipend Coverage:</strong> Lodging and meals in village base camps are fully supported by the organisation.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#142B45] text-white p-6 rounded border border-[#C9A45C]/30 space-y-3">
              <span className="text-xs font-mono uppercase text-[#C9A45C] font-bold">Confidential Consultation</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Have specific questions about medical licenses, field durations, or family deployments? Consult directly with our administration team.
              </p>
              <button
                onClick={() => setActiveTab('member-chat')}
                className="w-full py-2 px-3 rounded text-xs font-semibold bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-colors"
              >
                Direct Message Administration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARTNERSHIP REQUEST */}
      {activeSubTab === 'partner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs">
            {partSuccessId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#142B45]">
                  Partnership Proposal Logged
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Your institutional proposal has been filed with our Directorate of International Cooperation under reference:
                </p>
                <div className="p-3 bg-stone-100 rounded text-xs font-mono font-bold text-[#142B45] inline-block">
                  {partSuccessId}
                </div>
                <p className="text-xs text-stone-500">
                  Our Partnerships Director will reach out to your designated contact person with our institutional memorandum framework.
                </p>
                <button
                  onClick={() => setPartSuccessId(null)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-5">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#142B45]">
                    Institutional Partnership Proposal
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    For corporate CSR initiatives, universities, international development agencies, and foundations.
                  </p>
                </div>

                {partError && (
                  <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                    {partError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Organization / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      value={partOrg}
                      onChange={(e) => setPartOrg(e.target.value)}
                      placeholder="e.g. Kyoto University Environmental Lab"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Contact Person & Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={partPerson}
                      onChange={(e) => setPartPerson(e.target.value)}
                      placeholder="e.g. Dr. Kenji Sato, Lead Researcher"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Official Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={partEmail}
                      onChange={(e) => setPartEmail(e.target.value)}
                      placeholder="partnerships@institution.edu"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Headquarters Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={partCountry}
                      onChange={(e) => setPartCountry(e.target.value)}
                      placeholder="e.g. Japan, Germany, Singapore"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Partnership Category *
                  </label>
                  <select
                    value={partType}
                    onChange={(e) => setPartType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  >
                    <option>Academic / Research Institution</option>
                    <option>Corporate CSR / Social Responsibility Program</option>
                    <option>Philanthropic Foundation Grant</option>
                    <option>Multilateral / Bilateral Development Agency</option>
                    <option>Local Asian Civil Society Organization (CSO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Partnership Scope & Cooperation Proposal *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={partProposal}
                    onChange={(e) => setPartProposal(e.target.value)}
                    placeholder="Outline your proposed cooperation, target country, technology/capital match, and timelines..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={partSubmitting}
                    className="w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-wider bg-[#26734D] text-white hover:bg-[#1A5437] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-[#C9A45C]" />
                    <span>{partSubmitting ? 'Transmitting Proposal...' : 'Submit Institutional Proposal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#F8F6F0] p-6 rounded border border-stone-200 space-y-3">
              <h4 className="font-serif font-bold text-base text-[#142B45]">
                Partnership Principles
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We welcome collaboration with institutions that share our commitment to long-term community autonomy, anti-corruption, and open-access data sharing.
              </p>
              <div className="p-3 bg-white rounded border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <p>• <strong>Zero Greenwashing:</strong> Joint initiatives must produce measurable on-the-ground outcomes.</p>
                <p>• <strong>Biannual Reviews:</strong> Co-published performance and social impact indicators.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DONATION PLEDGE & TRANSPARENT CONTRIBUTIONS */}
      {activeSubTab === 'donate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#142B45]">
                Direct Humanitarian Support Pledge
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                88.4% of every dollar goes directly to verified frontline field programmes.
              </p>
            </div>

            {pledgeRefId ? (
              <div className="p-6 rounded bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-emerald-900">
                  Humanitarian Pledge Registered
                </h4>
                <div className="p-2.5 bg-white rounded border border-emerald-200 text-xs font-mono font-bold text-[#142B45] inline-block">
                  Ref: {pledgeRefId}
                </div>
                <p className="text-xs text-emerald-800">
                  Your pledge of <strong>${donationAmount} USD</strong> ({donationFrequency === 'monthly' ? 'Monthly' : 'One-time'}) towards <strong>{donationCategory}</strong> has been stored in our Secretariat records. Our Finance Secretariat will send verified wire remittance instructions to <strong>{pledgeEmail}</strong>.
                </p>
                <button
                  onClick={() => setPledgeRefId(null)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white"
                >
                  Make Another Pledge
                </button>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-5">
                {pledgeError && (
                  <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                    {pledgeError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Donor / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={pledgeName}
                      onChange={(e) => setPledgeName(e.target.value)}
                      placeholder="e.g. Elena Takahashi"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Receipt Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={pledgeEmail}
                      onChange={(e) => setPledgeEmail(e.target.value)}
                      placeholder="donor@example.org"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('once')}
                    className={`py-2 text-xs font-semibold rounded border transition-colors ${
                      donationFrequency === 'once'
                        ? 'bg-[#142B45] text-white border-[#142B45]'
                        : 'border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    One-Time Contribution
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('monthly')}
                    className={`py-2 text-xs font-semibold rounded border transition-colors ${
                      donationFrequency === 'monthly'
                        ? 'bg-[#142B45] text-white border-[#142B45]'
                        : 'border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    Monthly Sustaining Support
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Select Contribution Amount (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationAmount(amt)}
                        className={`py-2 text-xs font-mono font-bold rounded border transition-colors ${
                          donationAmount === amt
                            ? 'bg-[#142B45] text-[#C9A45C] border-[#142B45]'
                            : 'border-stone-300 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Designated Programme
                  </label>
                  <select
                    value={donationCategory}
                    onChange={(e) => setDonationCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  >
                    <option>Clean Water Infrastructure & Gravity Wells</option>
                    <option>Mobile Rural Medical Clinics & Pediatric Care</option>
                    <option>Secondary Education & Minority Scholarships</option>
                    <option>Indigenous Women’s Artisan Weaving Cooperative</option>
                    <option>Rapid Disaster Emergency Relief Fund</option>
                  </select>
                </div>

                <div className="p-4 rounded bg-[#F8F6F0] border border-stone-200 text-xs text-stone-600 space-y-2">
                  <span className="font-semibold text-[#142B45] block">Impact Breakdown for ${donationAmount} USD:</span>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1">
                    <span>Direct Field Aid (88.4%):</span>
                    <span className="font-mono font-bold text-emerald-800">${(donationAmount * 0.884).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1">
                    <span>Field Engineering & Logistics (7.2%):</span>
                    <span className="font-mono">${(donationAmount * 0.072).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statutory Audit & Administration (4.4%):</span>
                    <span className="font-mono">${(donationAmount * 0.044).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pledgeSubmitting}
                  className="w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-rose-700" />
                  <span>{pledgeSubmitting ? 'Recording Pledge...' : 'Register Programme Support Pledge'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-[#142B45] text-white p-6 rounded border border-[#C9A45C]/30 space-y-4">
            <h4 className="font-serif font-bold text-base text-white">
              Official Wire & Bank Remittance
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              In accordance with our strict anti-fraud policy, all high-value corporate donations and institutional contributions are processed directly via authorized multi-currency bank accounts with official tax-deductible receipts issued.
            </p>
            <div className="p-3 bg-[#0D1C2E] rounded border border-stone-700 text-xs font-mono space-y-1 text-stone-300">
              <p>Account Name: Asia Humanitarian Development</p>
              <p>Bank: DBS Bank Ltd (Singapore HQ)</p>
              <p>SWIFT Code: DBSSSGSG</p>
              <p>Audit Ref: SG-NGO-2014-9981</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
