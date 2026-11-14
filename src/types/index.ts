export type UserRole = 'member' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  country: string;
  bio?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCountry?: string;
  userPhotoURL?: string;
  subject?: string;
  lastMessage?: string;
  lastSenderId?: string;
  lastSenderName?: string;
  unreadForAdmin: number;
  unreadForUser: number;
  archived: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'member' | 'admin';
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  read: boolean;
  createdAt: string;
}

export interface VolunteerApplication {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  country: string;
  phone?: string;
  programmeInterest: string;
  skills: string;
  availability?: string;
  motivation: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'archived';
  createdAt: string;
}

export interface PartnershipRequest {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  country: string;
  partnershipType: string;
  proposal: string;
  status: 'pending' | 'reviewed' | 'contacted';
  createdAt: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  country?: string;
  subject: string;
  message: string;
  status: 'unread' | 'replied' | 'archived';
  createdAt: string;
}

export interface ProgrammeItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  beneficiaries: string;
  regions: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  authorName?: string;
  createdAt: string;
}

export type SupportedLanguage = 
  | 'en' // English
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'hi' // Hindi
  | 'id' // Indonesian
  | 'th' // Thai
  | 'vi' // Vietnamese
  | 'ar'; // Arabic
