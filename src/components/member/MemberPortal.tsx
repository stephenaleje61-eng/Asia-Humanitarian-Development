import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VolunteerApplication, Conversation } from '../../types';
import { getVolunteerApplications, updateUserProfile } from '../../services/db';
import { 
  User, 
  MapPin, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Settings, 
  FileText, 
  ShieldCheck, 
  Save 
} from 'lucide-react';

interface MemberPortalProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({ setActiveTab, openAuthModal }) => {
  const { user, userProfile, isAdmin, refreshProfile } = useAuth();
  
  const [tab, setTab] = useState<'profile' | 'applications' | 'settings'>('profile');
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Profile Edit State
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setCountry(userProfile.country || '');
      setBio(userProfile.bio || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      setLoadingApps(true);
      getVolunteerApplications(user.uid)
        .then(apps => setApplications(apps))
        .catch(err => console.warn('Could not fetch member apps:', err))
        .finally(() => setLoadingApps(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#142B45] text-[#C9A45C] flex items-center justify-center mx-auto text-2xl font-serif">
          亞
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#142B45]">
          Member Authentication Required
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Please sign in to access your personal member profile, monitor volunteer applications, and communicate securely with our humanitarian coordinators.
        </p>
        <button
          onClick={openAuthModal}
          className="px-6 py-3 rounded text-xs font-bold uppercase tracking-wider bg-[#142B45] text-white hover:bg-[#1E3E63] transition-colors shadow-sm"
        >
          Sign In / Create Member Account
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    if (!displayName.trim()) {
      setSaveError('Display name is required.');
      return;
    }
    setSavingProfile(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        country: country.trim() || 'International',
        bio: bio.trim(),
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaveError(error?.message || 'Unable to update your profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Banner Card */}
      <div className="bg-[#142B45] text-white p-6 sm:p-8 rounded border border-[#C9A45C]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#C9A45C] text-[#142B45] font-serif text-2xl font-bold flex items-center justify-center border-2 border-white/20">
            {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-white">
                {userProfile?.displayName || 'Registered Member'}
              </h1>
              {isAdmin && (
                <span className="text-[10px] font-mono uppercase bg-[#C9A45C] text-[#142B45] px-1.5 py-0.5 rounded font-bold">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 mt-0.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>{userProfile?.email}</span>
              <span>·</span>
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userProfile?.country || 'International'}</span>
            </p>
          </div>
        </div>

        {/* Action Button: Jump to Private Chat with Admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('member-chat')}
            className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-all flex items-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Private Chat with Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-300 gap-6">
        <button
          onClick={() => setTab('profile')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'profile'
              ? 'border-[#142B45] text-[#142B45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setTab('applications')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'applications'
              ? 'border-[#142B45] text-[#142B45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setTab('settings')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
            tab === 'settings'
              ? 'border-[#142B45] text-[#142B45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Security & Communication</span>
        </button>
      </div>

      {/* Sub-Tab 1: Profile View & Edit */}
      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#142B45]">
                  Personal Profile Information
                </h3>
                <p className="text-xs text-stone-500">
                  Visible to humanitarian administrators handling your applications and inquiries.
                </p>
              </div>

              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully in permanent records.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Country / Territory
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Indonesia, Vietnam, Japan"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Registered Email (Immutable Identity)
                </label>
                <input
                  type="email"
                  disabled
                  value={userProfile?.email || ''}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded bg-stone-100 text-stone-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bio / Humanitarian Statement
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your interest in Asian community development, professional qualifications, or language proficiencies..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#142B45] text-white hover:bg-[#1E3E63] disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#F8F6F0] p-6 rounded border border-stone-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#142B45]">
                Account Verification Status
              </h4>
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authenticated Member Session</span>
              </div>
              <div className="text-[11px] text-stone-500 space-y-1">
                <p>Member Since: {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Active'}</p>
                <p>Data Privacy: GDPR & Asian Data Protection Compliant</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Volunteer Applications */}
      {tab === 'applications' && (
        <div className="bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#142B45]">
                Your Submitted Volunteer Applications
              </h3>
              <p className="text-xs text-stone-500">
                Review your application history and current evaluation standing.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('get-involved')}
              className="text-xs font-semibold text-[#142B45] hover:text-[#C9A45C]"
            >
              + Submit New Application
            </button>
          </div>

          {loadingApps ? (
            <div className="py-8 text-center text-xs text-stone-400">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">
                You have not submitted any volunteer applications yet.
              </p>
              <button
                onClick={() => setActiveTab('get-involved')}
                className="px-4 py-2 text-xs font-semibold rounded bg-[#142B45] text-white hover:bg-[#1E3E63]"
              >
                Explore Volunteer Opportunities
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {applications.map((app) => (
                <div key={app.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#142B45]">
                      {app.programmeInterest}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    Skills: {app.skills}
                  </p>
                  <div className="text-[11px] text-stone-400 flex items-center gap-3">
                    <span>Applied on: {new Date(app.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>Ref: {app.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Settings */}
      {tab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded border border-stone-200 shadow-xs space-y-4 max-w-2xl">
          <h3 className="font-serif text-lg font-bold text-[#142B45]">
            Security & Communication Preferences
          </h3>
          <p className="text-xs text-stone-500">
            Configure how you receive field announcements and private messages from administrators.
          </p>

          <div className="space-y-3 pt-2 text-xs text-stone-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#142B45]" />
              <span>Receive email notification when an administrator replies to your 1-on-1 private chat</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#142B45]" />
              <span>Receive official quarterly field audit dispatches</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#142B45]" />
              <span>Allow coordinators to contact me for emergency disaster relief mobilization</span>
            </label>
          </div>
        </div>
      )}

    </div>
  );
};
