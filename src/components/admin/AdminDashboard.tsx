import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Conversation, 
  ChatMessage, 
  VolunteerApplication, 
  PartnershipRequest, 
  ContactEnquiry, 
  ProgrammeItem, 
  AnnouncementItem,
  UserProfile 
} from '../../types';
import { 
  subscribeToConversations, 
  subscribeToMessages, 
  sendMessage, 
  markConversationAsRead, 
  toggleArchiveConversation, 
  toggleBlockUserConversation,
  getVolunteerApplications,
  updateVolunteerStatus,
  getPartnershipRequests,
  updatePartnershipStatus,
  getContactEnquiries,
  updateEnquiryStatus,
  getProgrammes,
  saveProgramme,
  getAnnouncements,
  createAnnouncement,
  seedInitialContentIfEmpty,
  getAllUsers,
  getOrCreateConversation
} from '../../services/db';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  HelpCircle, 
  Search, 
  Send, 
  Paperclip, 
  Archive, 
  Ban, 
  Clock, 
  Plus, 
  Edit3, 
  ArrowLeft,
  X,
  MapPin,
  Mail,
  UserCheck,
  AlertCircle,
  LogOut,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
  openAuthModal: () => void;
}

const MAX_ATTACHMENT_BYTES = 500 * 1024; // 500 KB limit for base64 Firestore safety

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { user, userProfile, isAdmin, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<
    'overview' | 'chat' | 'members' | 'volunteers' | 'partnerships' | 'enquiries' | 'programmes' | 'announcements'
  >('chat');

  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Chat system state (3-panel)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; url: string; type: string } | null>(null);

  // New message modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [targetName, setTargetName] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetCountry, setTargetCountry] = useState('Southeast Asia');

  // Management datasets
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipRequest[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [programmesList, setProgrammesList] = useState<ProgrammeItem[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Modal for announcements
  const [showNewAnnModal, setShowNewAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('Field Milestone');
  const [annContent, setAnnContent] = useState('');
  const [annSubmitting, setAnnSubmitting] = useState(false);

  // Modal for creating/editing programmes
  const [editingProgramme, setEditingProgramme] = useState<Partial<ProgrammeItem> | null>(null);
  const [progSaving, setProgSaving] = useState(false);

  const seededRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || null;

  // Seed initial baseline content once when authenticated admin accesses console
  useEffect(() => {
    if (!isAdmin || !user || seededRef.current) return;
    seededRef.current = true;
    seedInitialContentIfEmpty().then(async () => {
      const [progs, anns] = await Promise.all([getProgrammes(), getAnnouncements()]);
      setProgrammesList(progs);
      setAnnouncementsList(anns);
    }).catch(console.warn);
  }, [isAdmin, user]);

  // Subscribe to all conversations in real time when authorized
  useEffect(() => {
    if (!isAdmin || !user) return;

    const unsubscribe = subscribeToConversations(
      true,
      undefined,
      (allConvs) => {
        setConversations(allConvs);
        setSelectedConversationId((prev) => {
          if (prev && allConvs.some((c) => c.id === prev)) return prev;
          return allConvs.length > 0 ? allConvs[0].id : null;
        });
      },
      (err) => {
        console.error('Admin conversations listener error:', err);
        setChatError(err.message || 'Unable to sync conversations stream.');
      }
    );

    return () => unsubscribe();
  }, [isAdmin, user]);

  // Subscribe to messages of selected conversation
  useEffect(() => {
    if (!selectedConversationId || !isAdmin || !user) return;

    const unsubscribe = subscribeToMessages(
      selectedConversationId,
      (msgs) => {
        setMessages(msgs);
      },
      (err) => {
        console.error('Admin messages listener error:', err);
        setChatError(err.message || 'Unable to sync message history.');
      }
    );

    return () => unsubscribe();
  }, [selectedConversationId, isAdmin, user]);

  // Auto-mark conversation read for admin when opened or new messages arrive
  useEffect(() => {
    if (selectedConversation && selectedConversation.unreadForAdmin > 0 && isAdmin) {
      markConversationAsRead(selectedConversation.id, 'admin').catch(console.warn);
    }
  }, [selectedConversation?.id, selectedConversation?.unreadForAdmin, isAdmin]);

  // Load secondary management collections
  useEffect(() => {
    if (!isAdmin || !user) return;

    getVolunteerApplications().then(setVolunteers).catch(console.warn);
    getPartnershipRequests().then(setPartnerships).catch(console.warn);
    getContactEnquiries().then(setEnquiries).catch(console.warn);
    getProgrammes().then(setProgrammesList).catch(console.warn);
    getAnnouncements().then(setAnnouncementsList).catch(console.warn);
    getAllUsers().then(setUsersList).catch(console.warn);
  }, [isAdmin, user, activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDirectorSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Google authentication did not complete. Please verify your popup permissions.');
    } finally {
      setSigningIn(false);
    }
  };

  // Quick action: start or open chat with member, applicant, partner, or enquiry contact
  const handleOpenChatWithContact = async (person: {
    userId?: string;
    name: string;
    email: string;
    country?: string;
    photoURL?: string;
  }) => {
    try {
      setChatError(null);
      const matchedMember = usersList.find(
        (u) => u.email.toLowerCase() === person.email.trim().toLowerCase()
      );
      const validUid =
        person.userId && person.userId !== 'anonymous-applicant'
          ? person.userId
          : matchedMember?.uid
            ? matchedMember.uid
            : 'usr-' + person.email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

      const conv = await getOrCreateConversation({
        uid: validUid,
        displayName: matchedMember?.displayName || person.name,
        email: person.email,
        country: matchedMember?.country || person.country || 'International',
        photoURL: matchedMember?.photoURL || person.photoURL,
      });
      setSelectedConversationId(conv.id);
      setActiveTab('chat');
    } catch (err: any) {
      console.error('Failed to open chat with contact:', err);
      setChatError(err?.message || 'Unable to open consultation channel.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#0D1C2E] text-stone-300 text-xs">
        Verifying Directorate security clearance...
      </div>
    );
  }

  // Admin access gate if not authorized
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#0D1C2E]">
        <div className="max-w-md w-full bg-[#142B45] text-white p-8 rounded-lg border border-[#C9A45C]/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#0D1C2E] border-2 border-[#C9A45C] text-[#C9A45C] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Executive Administration Gateway
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              This space provides access to private one-on-one communication channels, field applications, and strategic governance.
            </p>
          </div>

          <div className="p-3 bg-[#0D1C2E] rounded border border-stone-700 text-xs text-stone-300 font-mono text-left space-y-1">
            <p className="text-[#C9A45C] font-semibold">Authorized Credentials:</p>
            <p>Director: johnlsacc23332@gmail.com</p>
            <p className="text-stone-400">Current Session: {user ? user.email : 'Guest'}</p>
          </div>

          {user && !isAdmin && (
            <div className="p-3 rounded bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                The signed-in account (<strong>{user.email}</strong>) does not have Directorate clearance. Please sign in with the authorized Google account.
              </span>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded bg-red-950/70 border border-red-600/60 text-red-200 text-xs text-left">
              {authError}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleDirectorSignIn}
              disabled={signingIn}
              className="w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{signingIn ? 'Verifying Google Credentials...' : 'Sign In with Director Google Account'}</span>
            </button>

            {user && (
              <button
                onClick={signOut}
                className="w-full py-2 px-4 rounded text-xs font-semibold border border-stone-600 text-stone-200 hover:bg-stone-800/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Current Account</span>
              </button>
            )}

            <button
              onClick={onBackToSite}
              className="w-full py-2.5 px-4 rounded text-xs font-semibold border border-stone-600 text-stone-300 hover:text-white hover:bg-stone-800/40 transition-colors"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Message Sending
  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!chatInput.trim() && !attachment) || !selectedConversation || !user) return;

    const textToSend = chatInput.trim() || (attachment ? `Attached: ${attachment.name}` : '');
    const currentAttachment = attachment;
    const prevInput = chatInput;
    
    setChatInput('');
    setAttachment(null);
    setChatError(null);
    setSendingMsg(true);

    try {
      await sendMessage(selectedConversation.id, {
        senderId: user.uid,
        senderName: userProfile?.displayName || 'Humanitarian Directorate',
        senderRole: 'admin',
        text: textToSend,
        attachmentUrl: currentAttachment?.url,
        attachmentName: currentAttachment?.name,
        attachmentType: currentAttachment?.type,
      });
    } catch (err: any) {
      console.error('Error sending admin message:', err);
      setChatInput(prevInput);
      setAttachment(currentAttachment);
      setChatError(err?.message || 'Failed to deliver message. Please try again.');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setChatError(null);

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setChatError(`Attachment "${file.name}" exceeds the 500 KB maximum size limit.`);
      return;
    }

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.length > 800000) {
        setChatError(`Encoded attachment "${file.name}" is too large to send.`);
        return;
      }
      setAttachment({
        name: file.name,
        url: result,
        type: isImg ? 'image' : 'document',
      });
    };
    reader.onerror = () => {
      setChatError('Unable to read the selected attachment file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProgrammeModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgramme?.title || !editingProgramme?.category || !editingProgramme?.summary) return;
    setProgSaving(true);
    try {
      const slug =
        editingProgramme.slug ||
        editingProgramme.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 80);

      await saveProgramme({
        id: editingProgramme.id || `prog-${Date.now()}`,
        title: editingProgramme.title,
        slug: slug || `prog-${Date.now()}`,
        category: editingProgramme.category,
        summary: editingProgramme.summary,
        description: editingProgramme.description || editingProgramme.summary,
        beneficiaries: editingProgramme.beneficiaries || 'Community Impact Ongoing',
        regions: editingProgramme.regions || 'Southeast & South Asia',
        imageUrl: editingProgramme.imageUrl || '/src/assets/images/asia_ngo_hero_1794424632636.jpg',
        active: editingProgramme.active !== false,
        createdAt: editingProgramme.createdAt || new Date().toISOString(),
      });
      setProgrammesList(await getProgrammes());
      setEditingProgramme(null);
    } catch (err) {
      console.error('Error saving programme:', err);
    } finally {
      setProgSaving(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!showArchived && c.archived) return false;
    if (showArchived && !c.archived) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.userName.toLowerCase().includes(q) ||
      c.userEmail.toLowerCase().includes(q) ||
      (c.userCountry && c.userCountry.toLowerCase().includes(q)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadForAdmin || 0), 0);

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#142B45] flex flex-col">
      
      {/* Top Admin Header Bar */}
      <div className="bg-[#0D1C2E] text-white border-b border-[#C9A45C]/30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#C9A45C] text-[#142B45] font-serif font-bold text-base flex items-center justify-center">
              亞
            </div>
            <span className="font-serif font-bold text-base tracking-tight text-white hidden sm:inline">
              Asia NGO Central Secretariat · Administration Console
            </span>
            <span className="text-[10px] font-mono uppercase bg-[#C9A45C] text-[#142B45] px-1.5 py-0.5 rounded font-bold">
              Secure
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-xs font-semibold block text-white">{userProfile?.displayName}</span>
            <span className="text-[10px] text-stone-400 font-mono">ID: {user?.email}</span>
          </div>
          <button
            onClick={onBackToSite}
            className="px-3 py-1.5 rounded text-xs font-semibold border border-stone-700 text-stone-300 hover:text-white hover:border-[#C9A45C] transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs Bar */}
      <div className="bg-[#142B45] text-white px-6 border-b border-stone-800 flex overflow-x-auto gap-2 py-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>1-on-1 Private Chat</span>
          {totalUnreadMessages > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
              {totalUnreadMessages}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Overview Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'members'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Members ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'volunteers'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Volunteer Apps ({volunteers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('partnerships')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'partnerships'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Partnerships ({partnerships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'programmes'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Programmes Registry</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-[#C9A45C] text-[#142B45] font-bold shadow-xs'
              : 'text-stone-300 hover:bg-[#1E3E63]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Announcements & Bulletins</span>
        </button>
      </div>

      {/* 1. CHAT TAB: 3-PANEL REAL-TIME COMMUNICATION ENGINE */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-112px)] overflow-hidden">
          
          {/* PANEL 1: LEFT CONVERSATION LIST */}
          <div className="w-full lg:w-80 bg-white border-r border-stone-300 flex flex-col shrink-0">
            <div className="p-3 border-b border-stone-200 space-y-2 bg-[#F8F6F0]">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search member, email, country..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-white"
                  />
                </div>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="p-1.5 rounded bg-[#142B45] text-[#C9A45C] hover:bg-[#1E3E63] transition-colors"
                  title="Direct Message Any User or Inquirer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span className="font-mono">{filteredConversations.length} Channels</span>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`hover:underline flex items-center gap-1 ${showArchived ? 'text-[#C9A45C] font-bold' : ''}`}
                >
                  <Archive className="w-3 h-3" />
                  <span>{showArchived ? 'Show Active' : 'Show Archived'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                  <p>No conversations found.</p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="px-3 py-1.5 bg-[#142B45] text-white rounded text-xs"
                  >
                    + Direct Message Contact
                  </button>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConversation?.id === conv.id;
                  const hasUnread = conv.unreadForAdmin > 0;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`p-3.5 cursor-pointer transition-colors relative flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#142B45] text-white'
                          : 'hover:bg-stone-50 bg-white'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isSelected ? 'bg-[#C9A45C] text-[#142B45]' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {conv.userName ? conv.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                          conv.blocked ? 'bg-red-500' : 'bg-emerald-500'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#142B45]'}`}>
                            {conv.userName}
                          </h4>
                          <span className={`text-[10px] font-mono shrink-0 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] mt-0.5 truncate">
                          <span className={`truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                            {conv.lastMessage || 'New communication opened.'}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[10px]">
                          <span className={`${isSelected ? 'text-[#C9A45C]' : 'text-stone-400'} truncate`}>
                            {conv.userCountry || conv.userEmail}
                          </span>
                          {hasUnread && (
                            <span className="bg-red-500 text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
                              {conv.unreadForAdmin}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* PANEL 2: CENTRE ACTIVE CONVERSATION & REAL-TIME MESSAGING */}
          <div className="flex-1 bg-[#F8F6F0] flex flex-col min-w-0 h-full border-r border-stone-300">
            {selectedConversation ? (
              <>
                <div className="bg-white px-6 py-3 border-b border-stone-200 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#142B45] text-[#C9A45C] font-bold text-sm flex items-center justify-center">
                      {selectedConversation.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#142B45] flex items-center gap-2">
                        <span>{selectedConversation.userName}</span>
                        {selectedConversation.blocked && (
                          <span className="text-[10px] bg-red-100 text-red-800 font-mono px-1 rounded uppercase">Blocked</span>
                        )}
                        {selectedConversation.archived && (
                          <span className="text-[10px] bg-stone-200 text-stone-700 font-mono px-1 rounded uppercase">Archived</span>
                        )}
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        {selectedConversation.userEmail} · {selectedConversation.userCountry || 'International'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleArchiveConversation(selectedConversation.id, !selectedConversation.archived)}
                      className="px-2.5 py-1 text-xs rounded border border-stone-300 hover:bg-stone-100 transition-colors flex items-center gap-1"
                      title="Archive or Unarchive"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{selectedConversation.archived ? 'Unarchive' : 'Archive'}</span>
                    </button>

                    <button
                      onClick={() => toggleBlockUserConversation(selectedConversation.id, !selectedConversation.blocked)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
                        selectedConversation.blocked
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'border-stone-300 hover:bg-stone-100'
                      }`}
                      title="Restrict or Block Account"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{selectedConversation.blocked ? 'Unblock' : 'Block'}</span>
                    </button>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white/50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-stone-400">
                      <MessageSquare className="w-8 h-8 text-[#C9A45C]" />
                      <p className="text-xs">No previous message history. Type a message below to begin.</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isAdminMsg = m.senderRole === 'admin';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-stone-500">
                            <span className="font-semibold text-stone-700">
                              {isAdminMsg ? 'Humanitarian Directorate' : m.senderName}
                            </span>
                            <span>·</span>
                            <span className="font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div
                            className={`max-w-[75%] rounded-lg px-4 py-3 text-xs leading-relaxed shadow-xs ${
                              isAdminMsg
                                ? 'bg-[#142B45] text-white rounded-tr-none'
                                : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                            }`}
                          >
                            {m.attachmentUrl && (
                              <div className="mb-2 p-2 rounded bg-black/10 border border-white/20">
                                {m.attachmentType === 'image' ? (
                                  <img
                                    src={m.attachmentUrl}
                                    alt={m.attachmentName || 'Attachment'}
                                    className="max-h-48 rounded object-cover w-full"
                                  />
                                ) : (
                                  <a
                                    href={m.attachmentUrl}
                                    download={m.attachmentName || 'document'}
                                    className="flex items-center gap-2 text-xs hover:underline"
                                  >
                                    <FileText className="w-4 h-4 text-[#C9A45C] shrink-0" />
                                    <span className="font-semibold truncate">{m.attachmentName || 'Document'}</span>
                                    <Download className="w-3.5 h-3.5 shrink-0 ml-auto opacity-80" />
                                  </a>
                                )}
                              </div>
                            )}

                            <p className="whitespace-pre-wrap">{m.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat error bar */}
                {chatError && (
                  <div className="px-6 py-2 bg-red-50 border-t border-red-200 flex items-center justify-between text-xs text-red-700">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{chatError}</span>
                    </div>
                    <button type="button" onClick={() => setChatError(null)} className="p-1 text-red-400 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Attachment pending bar */}
                {attachment && (
                  <div className="px-6 py-2 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#C9A45C]" />
                      <span className="font-medium truncate">{attachment.name}</span>
                    </div>
                    <button type="button" onClick={() => setAttachment(null)} className="p-1 text-stone-400 hover:text-stone-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Message input */}
                <form onSubmit={handleAdminSendMessage} className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded text-stone-500 hover:text-[#142B45] hover:bg-stone-100 transition-colors"
                    title="Attach Official File (max 500 KB)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type official response to this member..."
                    className="flex-1 px-4 py-2.5 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0]"
                  />

                  <button
                    type="submit"
                    disabled={sendingMsg || (!chatInput.trim() && !attachment)}
                    className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#142B45] text-white hover:bg-[#1E3E63] disabled:opacity-40 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span>{sendingMsg ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Select a conversation on the left panel or start a new channel.
              </div>
            )}
          </div>

          {/* PANEL 3: RIGHT USER PROFILE DOSSIER */}
          <div className="w-full lg:w-80 bg-white p-6 border-l border-stone-300 flex flex-col shrink-0 overflow-y-auto space-y-6">
            {selectedConversation ? (
              <>
                <div className="text-center pb-4 border-b border-stone-200 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#142B45] text-[#C9A45C] font-serif text-2xl font-bold flex items-center justify-center mx-auto border-2 border-[#C9A45C]">
                    {selectedConversation.userName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#142B45]">
                    {selectedConversation.userName}
                  </h3>
                  <span className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    selectedConversation.userId.startsWith('usr-')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedConversation.userId.startsWith('usr-') ? 'Email Contact' : 'Verified Member'}
                  </span>
                  <p className="text-xs text-stone-500 font-mono">
                    UID: {selectedConversation.userId.substring(0, 14)}...
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                    Profile Data
                  </h4>

                  <div className="flex items-center gap-2 text-stone-700">
                    <Mail className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span className="truncate">{selectedConversation.userEmail}</span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-[#26734D]" />
                    <span>{selectedConversation.userCountry || 'Unspecified'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Channel Opened: {new Date(selectedConversation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                    Connected Volunteer Records
                  </h4>
                  {volunteers.filter(v => v.userId === selectedConversation.userId || v.email === selectedConversation.userEmail).length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No volunteer submissions on record.</p>
                  ) : (
                    volunteers
                      .filter(v => v.userId === selectedConversation.userId || v.email === selectedConversation.userEmail)
                      .map((v) => (
                        <div key={v.id} className="p-2.5 rounded bg-stone-50 border border-stone-200 text-xs space-y-1">
                          <div className="flex justify-between font-semibold text-[#142B45]">
                            <span>{v.programmeInterest}</span>
                            <span className="text-[10px] uppercase font-mono">{v.status}</span>
                          </div>
                          <p className="text-[11px] text-stone-500">Skills: {v.skills}</p>
                        </div>
                      ))
                  )}
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-bold">
                    Quick Templates
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setChatInput('Thank you for contacting Asia Humanitarian Development. Your inquiry has been forwarded to our field coordinator in that district.')}
                      className="w-full text-left p-2 rounded bg-stone-100 hover:bg-stone-200 text-[11px] text-stone-700 transition-colors"
                    >
                      "Forwarded to Field Coordinator"
                    </button>
                    <button
                      onClick={() => setChatInput('We have verified your credentials. Our medical deployment coordinator will schedule a video briefing with you this week.')}
                      className="w-full text-left p-2 rounded bg-stone-100 hover:bg-stone-200 text-[11px] text-stone-700 transition-colors"
                    >
                      "Volunteer Briefing Scheduled"
                    </button>
                    <button
                      onClick={() => setChatInput('We have received your institutional partnership proposal and are reviewing the memorandum of understanding with legal counsel.')}
                      className="w-full text-left p-2 rounded bg-stone-100 hover:bg-stone-200 text-[11px] text-stone-700 transition-colors"
                    >
                      "Partnership Under Legal Review"
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-xs text-stone-400">
                User profile details appear here when conversation is selected.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. OVERVIEW ANALYTICS TAB */}
      {activeTab === 'overview' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Administrative Master Overview
            </h2>
            <p className="text-xs text-stone-500">Real-time statistics across all Firestore collections.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded border border-stone-200 shadow-xs">
              <span className="text-xs font-mono text-stone-500 uppercase">Registered Members</span>
              <div className="text-3xl font-serif font-bold text-[#142B45] mt-1 tabular-nums">
                {usersList.length}
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-stone-200 shadow-xs">
              <span className="text-xs font-mono text-stone-500 uppercase">Active Conversations</span>
              <div className="text-3xl font-serif font-bold text-[#142B45] mt-1 tabular-nums">
                {conversations.filter((c) => !c.archived).length}
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-stone-200 shadow-xs">
              <span className="text-xs font-mono text-stone-500 uppercase">Unread Messages</span>
              <div className="text-3xl font-serif font-bold text-red-600 mt-1 tabular-nums">
                {totalUnreadMessages}
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-stone-200 shadow-xs">
              <span className="text-xs font-mono text-stone-500 uppercase">Volunteer Apps</span>
              <div className="text-3xl font-serif font-bold text-[#26734D] mt-1 tabular-nums">
                {volunteers.length}
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-stone-200 shadow-xs">
              <span className="text-xs font-mono text-stone-500 uppercase">Partnerships</span>
              <div className="text-3xl font-serif font-bold text-[#C9A45C] mt-1 tabular-nums">
                {partnerships.length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded border border-stone-200 space-y-3">
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                Recent Inquiries & Contact Dispatches
              </h3>
              {enquiries.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4">No inquiries recorded yet.</p>
              ) : (
                <div className="divide-y divide-stone-100 text-xs">
                  {enquiries.slice(0, 5).map((enq) => (
                    <div key={enq.id} className="py-2.5 flex justify-between items-center gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-stone-800 block truncate">{enq.name} ({enq.subject})</span>
                        <span className="text-[11px] text-stone-500">{enq.email}</span>
                      </div>
                      <button
                        onClick={() => handleOpenChatWithContact({ name: enq.name, email: enq.email, country: enq.country })}
                        className="px-2 py-1 text-[11px] rounded bg-[#142B45] text-white hover:bg-[#1E3E63] shrink-0"
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded border border-stone-200 space-y-3">
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                Field Programmes Status
              </h3>
              <div className="divide-y divide-stone-100 text-xs">
                {programmesList.slice(0, 5).map((p) => (
                  <div key={p.id} className="py-2.5 flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-stone-800 block truncate">{p.title}</span>
                      <span className="text-[11px] text-stone-500">{p.regions}</span>
                    </div>
                    <span className={`text-[10px] font-semibold shrink-0 ${p.active ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {p.active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGISTERED MEMBERS DIRECTORY */}
      {activeTab === 'members' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Registered Member Accounts
            </h2>
            <p className="text-xs text-stone-500">
              Verified community members registered via Google OAuth. Open a private 1-on-1 channel directly with any member.
            </p>
          </div>

          <div className="bg-white rounded border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#142B45] text-white">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">Country / Region</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3">Private Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-stone-400">
                        No registered member accounts found yet.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.uid} className="hover:bg-stone-50">
                        <td className="p-3">
                          <div className="font-semibold text-stone-900">{u.displayName}</div>
                          <div className="text-[11px] text-stone-500">{u.email}</div>
                        </td>
                        <td className="p-3 text-stone-600">{u.country || 'International'}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            u.role === 'admin' ? 'bg-[#142B45] text-[#C9A45C]' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-stone-500 font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleOpenChatWithContact({
                                userId: u.uid,
                                name: u.displayName,
                                email: u.email,
                                country: u.country,
                                photoURL: u.photoURL,
                              })
                            }
                            className="px-2.5 py-1 text-[11px] rounded bg-[#142B45] text-[#C9A45C] hover:bg-[#1E3E63] font-semibold"
                          >
                            Open 1-on-1 Chat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. VOLUNTEER APPLICATIONS MANAGEMENT */}
      {activeTab === 'volunteers' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Volunteer Candidate Submissions
            </h2>
            <p className="text-xs text-stone-500">Review qualifications, assign status, and communicate directly.</p>
          </div>

          <div className="bg-white rounded border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#142B45] text-white">
                  <tr>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Programme Interest</th>
                    <th className="p-3">Skills</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {volunteers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-stone-400">
                        No volunteer applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    volunteers.map((v) => (
                      <tr key={v.id} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-stone-900">
                          <div>{v.fullName}</div>
                          <div className="text-[11px] text-stone-500">{v.email}</div>
                        </td>
                        <td className="p-3 text-stone-600">{v.country}</td>
                        <td className="p-3 text-stone-800 font-medium">{v.programmeInterest}</td>
                        <td className="p-3 text-stone-600 max-w-xs truncate">{v.skills}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            v.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            v.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            v.status === 'archived' ? 'bg-stone-200 text-stone-600' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-3 space-x-1 whitespace-nowrap">
                          <button
                            onClick={async () => {
                              await updateVolunteerStatus(v.id, 'accepted');
                              setVolunteers(volunteers.map(item => item.id === v.id ? { ...item, status: 'accepted' } : item));
                            }}
                            className="px-2 py-1 text-[11px] rounded bg-emerald-700 text-white hover:bg-emerald-800"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              await updateVolunteerStatus(v.id, 'reviewed');
                              setVolunteers(volunteers.map(item => item.id === v.id ? { ...item, status: 'reviewed' } : item));
                            }}
                            className="px-2 py-1 text-[11px] rounded bg-stone-200 text-stone-800 hover:bg-stone-300"
                          >
                            Review
                          </button>
                          <button
                            onClick={() =>
                              handleOpenChatWithContact({
                                userId: v.userId !== 'anonymous-applicant' ? v.userId : undefined,
                                name: v.fullName,
                                email: v.email,
                                country: v.country,
                              })
                            }
                            className="px-2 py-1 text-[11px] rounded bg-[#142B45] text-[#C9A45C] hover:bg-[#1E3E63]"
                            title="Open Private 1-on-1 Chat"
                          >
                            Chat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. PARTNERSHIP REQUESTS MANAGEMENT */}
      {activeTab === 'partnerships' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Institutional Partnership Proposals
            </h2>
            <p className="text-xs text-stone-500">Corporate CSR, Universities, and International Development Grants.</p>
          </div>

          {partnerships.length === 0 ? (
            <div className="bg-white p-8 rounded border border-stone-200 text-center text-xs text-stone-400">
              No institutional partnership proposals submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerships.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded border border-stone-200 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#142B45]">{p.organizationName}</h3>
                      <p className="text-xs text-stone-500">{p.contactPerson} · {p.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        p.status === 'contacted' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500">
                    {p.partnershipType} · {p.country}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed bg-[#F8F6F0] p-3 rounded border border-stone-200">
                    {p.proposal}
                  </p>
                  <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={async () => {
                          await updatePartnershipStatus(p.id, 'reviewed');
                          setPartnerships(partnerships.map(item => item.id === p.id ? { ...item, status: 'reviewed' } : item));
                        }}
                        className="px-2 py-1 text-[11px] rounded bg-stone-200 text-stone-800 hover:bg-stone-300"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={async () => {
                          await updatePartnershipStatus(p.id, 'contacted');
                          setPartnerships(partnerships.map(item => item.id === p.id ? { ...item, status: 'contacted' } : item));
                        }}
                        className="px-2 py-1 text-[11px] rounded bg-emerald-700 text-white hover:bg-emerald-800"
                      >
                        Mark Contacted
                      </button>
                    </div>
                    <button
                      onClick={() => handleOpenChatWithContact({ name: p.contactPerson, email: p.email, country: p.country })}
                      className="px-2.5 py-1 text-xs rounded bg-[#142B45] text-white hover:bg-[#1E3E63] font-sans"
                    >
                      Open 1-on-1 Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. CONTACT ENQUIRIES MANAGEMENT */}
      {activeTab === 'enquiries' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Public Enquiries & Support Pledges Log
            </h2>
            <p className="text-xs text-stone-500">Incoming inquiries and programme pledges submitted through public forms.</p>
          </div>

          {enquiries.length === 0 ? (
            <div className="bg-white p-8 rounded border border-stone-200 text-center text-xs text-stone-400">
              No public enquiries logged yet.
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((e) => (
                <div key={e.id} className="bg-white p-6 rounded border border-stone-200 space-y-2 shadow-xs">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-sm text-[#142B45]">{e.subject}</h3>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          e.status === 'replied' ? 'bg-emerald-100 text-emerald-800' :
                          e.status === 'archived' ? 'bg-stone-200 text-stone-600' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {e.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">From: {e.name} ({e.email}) · {e.country || 'International'}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={async () => {
                          await updateEnquiryStatus(e.id, 'replied');
                          setEnquiries(enquiries.map(item => item.id === e.id ? { ...item, status: 'replied' } : item));
                        }}
                        className="px-2 py-1 text-[11px] rounded bg-emerald-700 text-white hover:bg-emerald-800"
                      >
                        Mark Replied
                      </button>
                      <button
                        onClick={async () => {
                          await updateEnquiryStatus(e.id, 'archived');
                          setEnquiries(enquiries.map(item => item.id === e.id ? { ...item, status: 'archived' } : item));
                        }}
                        className="px-2 py-1 text-[11px] rounded bg-stone-200 text-stone-800 hover:bg-stone-300"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => handleOpenChatWithContact({ name: e.name, email: e.email, country: e.country })}
                        className="px-2.5 py-1 text-xs rounded bg-[#142B45] text-[#C9A45C] hover:bg-[#1E3E63]"
                      >
                        Reply in Private Chat
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed pt-1 whitespace-pre-line">
                    {e.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. PROGRAMMES REGISTRY */}
      {activeTab === 'programmes' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#142B45]">
                Humanitarian Programmes Registry
              </h2>
              <p className="text-xs text-stone-500">Manage publicly visible field programme records.</p>
            </div>
            <button
              onClick={() =>
                setEditingProgramme({
                  title: '',
                  category: 'Community Development',
                  summary: '',
                  description: '',
                  beneficiaries: '',
                  regions: '',
                  active: true,
                })
              }
              className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white hover:bg-[#1E3E63] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Add Programme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmesList.map((prog) => (
              <div key={prog.id} className="bg-white p-6 rounded border border-stone-200 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#26734D] uppercase font-bold">{prog.category}</span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      prog.active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {prog.active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#142B45] mt-1">{prog.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-3">{prog.summary}</p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="truncate pr-2">Reach: {prog.beneficiaries}</span>
                  <button
                    onClick={() => setEditingProgramme(prog)}
                    className="px-2 py-1 rounded border border-stone-300 text-[#142B45] hover:bg-stone-100 flex items-center gap-1 shrink-0"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#142B45]">
                Announcements & Field Bulletins
              </h2>
              <p className="text-xs text-stone-500">Publish news, audit certificates, and emergency relief updates.</p>
            </div>
            <button
              onClick={() => setShowNewAnnModal(true)}
              className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white hover:bg-[#1E3E63] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Publish Bulletin</span>
            </button>
          </div>

          <div className="space-y-4">
            {announcementsList.map((ann) => (
              <div key={ann.id} className="bg-white p-6 rounded border border-stone-200 space-y-2 shadow-xs">
                <div className="flex justify-between text-xs text-stone-500 font-mono">
                  <span>{ann.category}</span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#142B45]">{ann.title}</h3>
                <p className="text-xs text-stone-700 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: START NEW CHAT CHANNEL */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 border border-stone-300">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-base text-[#142B45]">Initiate Direct Member Consultation</h3>
              <button onClick={() => setShowNewChatModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <p className="text-xs text-stone-600">
              Enter the recipient's details to open a dedicated 1-on-1 private messaging channel.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1">Contact Full Name *</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Official Email Address *</label>
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="maya@example.org"
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Country / Territory</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                placeholder="e.g. Vietnam, Cambodia, Japan"
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowNewChatModal(false)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
              <button
                onClick={async () => {
                  if (!targetName || !targetEmail) return;
                  const matchingUser = usersList.find(
                    (u) => u.email.toLowerCase() === targetEmail.trim().toLowerCase()
                  );
                  await handleOpenChatWithContact({
                    userId: matchingUser?.uid,
                    name: targetName,
                    email: targetEmail,
                    country: targetCountry,
                  });
                  setShowNewChatModal(false);
                  setTargetName('');
                  setTargetEmail('');
                }}
                className="px-4 py-1.5 text-xs font-bold rounded bg-[#142B45] text-white"
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW ANNOUNCEMENT */}
      {showNewAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4 border border-stone-300">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-base text-[#142B45]">Publish Field Announcement</h3>
              <button onClick={() => setShowNewAnnModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Title *</label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Typhoon Relief Taskforce Deployed"
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Category *</label>
              <input
                type="text"
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Content *</label>
              <textarea
                rows={4}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Official statement and details..."
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowNewAnnModal(false)} className="px-3 py-1.5 text-xs border rounded">Cancel</button>
              <button
                disabled={annSubmitting || !annTitle || !annContent}
                onClick={async () => {
                  if (!annTitle || !annContent) return;
                  setAnnSubmitting(true);
                  try {
                    await createAnnouncement({
                      title: annTitle,
                      category: annCategory,
                      content: annContent,
                      published: true,
                      authorName: userProfile?.displayName || 'Humanitarian Directorate',
                      createdAt: new Date().toISOString(),
                    });
                    setAnnouncementsList(await getAnnouncements());
                    setShowNewAnnModal(false);
                    setAnnTitle('');
                    setAnnContent('');
                  } finally {
                    setAnnSubmitting(false);
                  }
                }}
                className="px-4 py-1.5 text-xs font-bold rounded bg-[#142B45] text-white disabled:opacity-50"
              >
                {annSubmitting ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PROGRAMME */}
      {editingProgramme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form onSubmit={handleSaveProgrammeModal} className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4 border border-stone-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                {editingProgramme.id ? 'Edit Humanitarian Programme' : 'Register New Humanitarian Programme'}
              </h3>
              <button type="button" onClick={() => setEditingProgramme(null)}><X className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Programme Title *</label>
              <input
                type="text"
                required
                value={editingProgramme.title || ''}
                onChange={(e) => setEditingProgramme({ ...editingProgramme, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={editingProgramme.category || ''}
                  onChange={(e) => setEditingProgramme({ ...editingProgramme, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Beneficiaries Reached</label>
                <input
                  type="text"
                  value={editingProgramme.beneficiaries || ''}
                  onChange={(e) => setEditingProgramme({ ...editingProgramme, beneficiaries: e.target.value })}
                  placeholder="e.g. 12,000 Villagers"
                  className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Operational Regions</label>
              <input
                type="text"
                value={editingProgramme.regions || ''}
                onChange={(e) => setEditingProgramme({ ...editingProgramme, regions: e.target.value })}
                placeholder="e.g. Nepal, Laos, Northern Vietnam"
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Executive Summary *</label>
              <textarea
                rows={2}
                required
                value={editingProgramme.summary || ''}
                onChange={(e) => setEditingProgramme({ ...editingProgramme, summary: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Full Field Description</label>
              <textarea
                rows={3}
                value={editingProgramme.description || ''}
                onChange={(e) => setEditingProgramme({ ...editingProgramme, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded bg-[#F8F6F0]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={editingProgramme.active !== false}
                onChange={(e) => setEditingProgramme({ ...editingProgramme, active: e.target.checked })}
              />
              <span>Programme Active & Publicly Visible</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingProgramme(null)} className="px-3 py-1.5 text-xs border rounded">
                Cancel
              </button>
              <button
                type="submit"
                disabled={progSaving}
                className="px-4 py-1.5 text-xs font-bold rounded bg-[#142B45] text-white disabled:opacity-50"
              >
                {progSaving ? 'Saving...' : 'Save Programme'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
