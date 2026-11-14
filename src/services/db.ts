import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  UserProfile, 
  Conversation, 
  ChatMessage, 
  VolunteerApplication, 
  PartnershipRequest, 
  ContactEnquiry, 
  ProgrammeItem, 
  AnnouncementItem 
} from '../types';

// Helper to remove any undefined/null keys before writing to Firestore
function cleanData<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined && val !== null) {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

// Initial 10 Humanitarian Programmes Data
export const INITIAL_PROGRAMMES: ProgrammeItem[] = [
  {
    id: 'prog-education',
    title: 'Himalayan & Mekong Education & Scholarship Support',
    slug: 'education-scholarship',
    category: 'Education & Learning',
    summary: 'Bridging the rural literacy divide with full secondary scholarships, teacher lodging, and solar-powered digital libraries in remote montane villages.',
    description: 'Providing comprehensive scholarship stipends, school uniforms, nutritious mid-day meals, and bilingual learning kits to 32,000 children across Nepal, Laos, and Northern Vietnam. We partner directly with village elder councils to construct earthquake-resilient classrooms and ensure zero female dropout rates.',
    beneficiaries: '32,400 Students & 480 Teachers',
    regions: 'Nepal (Solukhumbu), Laos (Luang Namtha), Vietnam (Ha Giang)',
    imageUrl: '/src/assets/images/asia_ngo_hero_1794424632636.jpg',
    active: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'prog-healthcare',
    title: 'Mobile Rural Medical Clinics & Pediatric Care',
    slug: 'healthcare-medical-assistance',
    category: 'Healthcare & Medicine',
    summary: 'Deploying four-wheel-drive mobile clinics, trained midwives, and preventative screening outposts to underserved island and mountain communities.',
    description: 'Providing comprehensive maternal healthcare, pediatric vaccinations, cataract screenings, dental relief, and essential medicines. Over 45,000 rural residents who live more than six hours away from the nearest district hospital now receive scheduled monthly medical examinations.',
    beneficiaries: '45,200 Patients Treated Annually',
    regions: 'Cambodia (Battambang), Indonesia (East Nusa Tenggara), Philippines (Palawan)',
    imageUrl: '/src/assets/images/programme_medical_1794424633845.jpg',
    active: true,
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'prog-poverty',
    title: 'Sustainable Livelihoods & Micro-Enterprise Grants',
    slug: 'poverty-reduction',
    category: 'Poverty Reduction',
    summary: 'Offering interest-free revolving micro-capital grants, livestock breed improvement, and financial literacy workshops to lift ultra-poor families into resilience.',
    description: 'Through zero-interest revolving community funds, smallholders and home-based artisans establish diversified revenue streams. Over 94% of supported households graduate past the national poverty threshold within 18 months, creating self-reliant village credit unions.',
    beneficiaries: '8,600 Families & 42 Village Cooperatives',
    regions: 'Bangladesh (Kurigram), India (Odisha), Myanmar (Shan State)',
    imageUrl: '/src/assets/images/programme_empowerment_1794424634315.jpg',
    active: true,
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: 'prog-environment',
    title: 'Clean Gravity Water Systems & Watershed Restoration',
    slug: 'environmental-protection',
    category: 'Environment & Water',
    summary: 'Constructing robust gravity-fed mountain spring catchments, biological sand filters, and native reforestation buffers for permanent water security.',
    description: 'Eliminating waterborne parasites through 84 community-managed clean water installations. We combine infrastructure with indigenous agroforestry planting, securing aquifer recharge zones while stopping soil erosion along terraced agricultural slopes.',
    beneficiaries: '28,000 Villagers & 1,200 Hectares Restored',
    regions: 'Vietnam (Lao Cai), Indonesia (Sumatra), Thailand (Mae Hong Son)',
    imageUrl: '/src/assets/images/programme_water_1794424634538.jpg',
    active: true,
    createdAt: new Date('2024-04-12').toISOString(),
  },
  {
    id: 'prog-women',
    title: 'Women’s Artisan Guilds & Indigenous Weaving Cooperatives',
    slug: 'womens-empowerment',
    category: 'Women Empowerment',
    summary: 'Revitalizing traditional textile heritage while equipping indigenous women artisans with financial ownership, clean energy workspaces, and export access.',
    description: 'Supporting 1,800 indigenous women weavers with ergonomic loom facilities, non-toxic natural dye gardens, child-care cooperatives, and collective bank accounts. Women leaders directly manage the cooperative treasuries, funding village healthcare and emergency relief.',
    beneficiaries: '1,850 Artisans & 7,400 Family Members',
    regions: 'Indonesia (Lombok), Laos (Luang Prabang), India (Assam)',
    imageUrl: '/src/assets/images/programme_empowerment_1794424634315.jpg',
    active: true,
    createdAt: new Date('2024-05-18').toISOString(),
  },
  {
    id: 'prog-youth',
    title: 'Youth Technical & Vocational Skills Institute',
    slug: 'youth-development',
    category: 'Youth Development',
    summary: 'Providing accredited vocational apprenticeships in solar installation, organic horticulture, digital literacy, and sustainable building crafts.',
    description: 'Equipping rural youths with practical vocational skills to curb dangerous migrant labor vulnerability. Graduates receive toolkits and mentoring to launch localized cooperative repair shops and clean-energy maintenance services.',
    beneficiaries: '3,200 Youth Trainees',
    regions: 'Philippines (Mindanao), Cambodia (Siem Reap), Sri Lanka (Jaffna)',
    imageUrl: '/src/assets/images/asia_ngo_hero_1794424632636.jpg',
    active: true,
    createdAt: new Date('2024-06-20').toISOString(),
  },
  {
    id: 'prog-food',
    title: 'Community Seed Banks & Climate-Resilient Agriculture',
    slug: 'food-security',
    category: 'Food Security',
    summary: 'Preserving drought-resistant heirloom seeds, introducing drip irrigation, and constructing rodent-proof communal grain reserves.',
    description: 'Protecting smallholders from catastrophic harvest shocks through drought-hardy rice varieties, bio-fertilizer training, and collective food storage facilities that guarantee year-round caloric sufficiency for vulnerable agrarian households.',
    beneficiaries: '14,500 Smallholder Farmers',
    regions: 'Thailand (Isan), India (Bihar), Bangladesh (Satkhira)',
    imageUrl: '/src/assets/images/programme_water_1794424634538.jpg',
    active: true,
    createdAt: new Date('2024-07-08').toISOString(),
  },
  {
    id: 'prog-disaster',
    title: 'Rapid Typhoon, Flood & Earthquake Relief Logistics',
    slug: 'disaster-relief',
    category: 'Disaster Assistance',
    summary: 'Pre-positioning emergency water purification kits, high-nutrition rations, and satellite-connected assessment teams across disaster-prone corridors.',
    description: 'Maintaining emergency rapid-response teams capable of reaching isolated disaster zones within 24 hours. Following initial relief, we remain on the ground for up to two years to rebuild permanent disaster-resilient housing and community infrastructure.',
    beneficiaries: '68,000 Crisis Victims Supported',
    regions: 'Philippines (Visayas), Bangladesh (Chittagong), Indonesia (Sulawesi)',
    imageUrl: '/src/assets/images/programme_medical_1794424633845.jpg',
    active: true,
    createdAt: new Date('2024-08-14').toISOString(),
  },
  {
    id: 'prog-community',
    title: 'Integrated Village Autonomy & Infrastructure Assemblies',
    slug: 'community-development',
    category: 'Community Development',
    summary: 'Facilitating village-led development councils that democratically plan and build communal footbridges, gathering halls, and solar mini-grids.',
    description: 'We believe genuine aid respects local agency. Communities determine their own priority infrastructure through open public ballots. We provide engineering blueprints, quality materials, and matching construction capital, while villagers contribute communal labor.',
    beneficiaries: '54 Village Councils Empowered',
    regions: 'Nepal (Karnali), Laos (Attapeu), Cambodia (Preah Vihear)',
    imageUrl: '/src/assets/images/asia_ngo_hero_1794424632636.jpg',
    active: true,
    createdAt: new Date('2024-09-02').toISOString(),
  },
  {
    id: 'prog-inclusion',
    title: 'Disability Access, Ethnic Minority Rights & Social Inclusion',
    slug: 'social-inclusion',
    category: 'Social Inclusion',
    summary: 'Ensuring persons with disabilities and isolated indigenous ethnic minorities receive assistive devices, mother-tongue education, and full civic representation.',
    description: 'Combating structural marginalization by delivering custom all-terrain wheelchairs, hearing aids, Braille educational material, and human rights legal counseling. We work closely with disability advocates to make schools and health centers barrier-free.',
    beneficiaries: '5,100 Persons with Disabilities & Minority Families',
    regions: 'Vietnam (Tay Nguyen), Nepal (Terai), Indonesia (Papua)',
    imageUrl: '/src/assets/images/programme_medical_1794424633845.jpg',
    active: true,
    createdAt: new Date('2024-10-11').toISOString(),
  },
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-2024-01',
    title: 'Completion of 12 New Gravity-Fed Clean Water Catchments in Ha Giang',
    content: 'Our engineering corps in partnership with the Ha Giang Provincial Council has successfully brought safe potable water directly to 3,400 ethnic Hmong and Tay villagers, eliminating an average 3-hour daily water walk for women and children.',
    category: 'Field Milestone',
    published: true,
    authorName: 'Dr. Lin Wei (Chief Medical Officer)',
    createdAt: new Date('2024-10-28').toISOString(),
  },
  {
    id: 'ann-2024-02',
    title: 'Annual Humanitarian Transparency & Financial Audit Report Published',
    content: 'The 2024 Annual Independent Financial Audit has confirmed that 88.4% of total budget expenditures went directly to frontline humanitarian and community operations. The full certified documentation is open for public review.',
    category: 'Governance & Transparency',
    published: true,
    authorName: 'Executive Director Office',
    createdAt: new Date('2024-11-04').toISOString(),
  },
  {
    id: 'ann-2024-03',
    title: 'Emergency Medical Deployment Following Monsoon Flooding in South Asia',
    content: 'Three emergency mobile health teams equipped with water purification units and acute oral rehydration supplies have been dispatched to assist flooded agrarian communities. 12,000 water treatment sachets delivered.',
    category: 'Disaster Relief',
    published: true,
    authorName: 'Emergency Response Taskforce',
    createdAt: new Date('2024-11-10').toISOString(),
  },
];

// --- Programme Database Operations ---
export async function getProgrammes(): Promise<ProgrammeItem[]> {
  const path = 'programmes';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return INITIAL_PROGRAMMES;
    }
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProgrammeItem));
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return list;
  } catch (error) {
    console.warn('Notice fetching programmes from Firestore, using baseline records:', error);
    return INITIAL_PROGRAMMES;
  }
}

export async function saveProgramme(prog: ProgrammeItem): Promise<void> {
  const path = 'programmes';
  try {
    const payload = cleanData({
      id: prog.id.slice(0, 128),
      title: prog.title.slice(0, 150),
      slug: prog.slug.slice(0, 100),
      category: prog.category.slice(0, 80),
      summary: prog.summary.slice(0, 500),
      description: (prog.description || prog.summary).slice(0, 5000),
      beneficiaries: (prog.beneficiaries || '').slice(0, 100),
      regions: (prog.regions || '').slice(0, 200),
      imageUrl: prog.imageUrl ? prog.imageUrl.slice(0, 1000) : undefined,
      active: Boolean(prog.active),
      createdAt: prog.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, path, prog.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${prog.id}`);
  }
}

// --- Announcements ---
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const path = 'announcements';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return INITIAL_ANNOUNCEMENTS;
    }
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AnnouncementItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.warn('Notice fetching announcements from Firestore, using baseline records:', error);
    return INITIAL_ANNOUNCEMENTS;
  }
}

export async function createAnnouncement(item: Omit<AnnouncementItem, 'id'>): Promise<string> {
  const path = 'announcements';
  const id = `ann-${Date.now()}`;
  try {
    const payload = cleanData({
      id,
      title: item.title.slice(0, 200),
      content: item.content.slice(0, 6000),
      category: item.category.slice(0, 80),
      published: Boolean(item.published),
      authorName: item.authorName ? item.authorName.slice(0, 100) : undefined,
      createdAt: item.createdAt || new Date().toISOString()
    });
    await setDoc(doc(db, path, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    return id;
  }
}

// Seed initial baseline programmes & announcements into Firestore when admin opens dashboard
export async function seedInitialContentIfEmpty(): Promise<void> {
  try {
    const progSnap = await getDocs(collection(db, 'programmes'));
    if (progSnap.empty) {
      await Promise.all(INITIAL_PROGRAMMES.map(p => saveProgramme(p)));
    }
    const annSnap = await getDocs(collection(db, 'announcements'));
    if (annSnap.empty) {
      await Promise.all(
        INITIAL_ANNOUNCEMENTS.map(a =>
          setDoc(doc(db, 'announcements', a.id), cleanData(a))
        )
      );
    }
  } catch (error) {
    console.warn('Seed check notice:', error);
  }
}

// --- Volunteer Applications ---
export async function submitVolunteerApplication(app: Omit<VolunteerApplication, 'id' | 'status' | 'createdAt'>, userId?: string): Promise<string> {
  const path = 'volunteer_applications';
  const id = `vol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload = cleanData({
    id,
    userId: userId || 'anonymous-applicant',
    fullName: app.fullName.slice(0, 100),
    email: app.email.slice(0, 120),
    country: app.country.slice(0, 80),
    phone: (app.phone || 'Not provided').slice(0, 40),
    programmeInterest: app.programmeInterest.slice(0, 100),
    skills: app.skills.slice(0, 500),
    availability: (app.availability || 'Full-time Field').slice(0, 100),
    motivation: app.motivation.slice(0, 2000),
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  try {
    await setDoc(doc(db, path, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    return id;
  }
}

export async function getVolunteerApplications(userId?: string): Promise<VolunteerApplication[]> {
  const path = 'volunteer_applications';
  try {
    const q = userId 
      ? query(collection(db, path), where('userId', '==', userId))
      : query(collection(db, path));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as VolunteerApplication));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateVolunteerStatus(id: string, status: VolunteerApplication['status']): Promise<void> {
  const path = 'volunteer_applications';
  try {
    await updateDoc(doc(db, path, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

// --- Partnership Requests ---
export async function submitPartnershipRequest(req: Omit<PartnershipRequest, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const path = 'partnership_requests';
  const id = `part-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload = cleanData({
    id,
    organizationName: req.organizationName.slice(0, 150),
    contactPerson: req.contactPerson.slice(0, 100),
    email: req.email.slice(0, 120),
    country: req.country.slice(0, 80),
    partnershipType: req.partnershipType.slice(0, 80),
    proposal: req.proposal.slice(0, 3000),
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  try {
    await setDoc(doc(db, path, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    return id;
  }
}

export async function getPartnershipRequests(): Promise<PartnershipRequest[]> {
  const path = 'partnership_requests';
  try {
    const snap = await getDocs(collection(db, path));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PartnershipRequest));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updatePartnershipStatus(id: string, status: PartnershipRequest['status']): Promise<void> {
  const path = 'partnership_requests';
  try {
    await updateDoc(doc(db, path, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

// --- Contact Enquiries ---
export async function submitContactEnquiry(enq: Omit<ContactEnquiry, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const path = 'contact_enquiries';
  const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload = cleanData({
    id,
    name: enq.name.slice(0, 100),
    email: enq.email.slice(0, 120),
    country: (enq.country || 'International').slice(0, 80),
    subject: enq.subject.slice(0, 150),
    message: enq.message.slice(0, 3000),
    status: 'unread',
    createdAt: new Date().toISOString()
  });
  try {
    await setDoc(doc(db, path, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    return id;
  }
}

export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const path = 'contact_enquiries';
  try {
    const snap = await getDocs(collection(db, path));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactEnquiry));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateEnquiryStatus(id: string, status: ContactEnquiry['status']): Promise<void> {
  const path = 'contact_enquiries';
  try {
    await updateDoc(doc(db, path, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

// --- User Profiles ---
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = 'users';
  try {
    const snap = await getDoc(doc(db, path, uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${path}/${uid}`);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = 'users';
  try {
    const payload = cleanData({
      id: profile.uid.slice(0, 128),
      uid: profile.uid.slice(0, 128),
      displayName: (profile.displayName || 'Member').slice(0, 100),
      email: (profile.email || 'member@asia-ngo.org').slice(0, 120),
      country: (profile.country || 'International').slice(0, 80),
      role: profile.role || 'member',
      bio: (profile.bio || '').slice(0, 500),
      photoURL: (profile.photoURL || '').slice(0, 1000),
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await setDoc(doc(db, path, profile.uid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${profile.uid}`);
  }
}

export async function updateUserProfile(
  uid: string,
  updates: { displayName: string; country: string; bio: string; photoURL?: string }
): Promise<void> {
  const path = 'users';
  try {
    const payload = cleanData({
      displayName: (updates.displayName || 'Member').slice(0, 100),
      country: (updates.country || 'International').slice(0, 80),
      bio: (updates.bio || '').slice(0, 500),
      photoURL: updates.photoURL !== undefined ? updates.photoURL.slice(0, 1000) : undefined,
      updatedAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, path, uid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${uid}`);
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, path));
    const list = snap.docs.map(d => d.data() as UserProfile);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// --- Private Conversations & Real-Time Messages (The Key Core Feature) ---
export async function getOrCreateConversation(user: {
  uid: string;
  displayName: string;
  email: string;
  country?: string;
  photoURL?: string;
}): Promise<Conversation> {
  const path = 'conversations';
  const convId = `conv-${user.uid}`.slice(0, 128);
  const ref = doc(db, path, convId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Conversation;
    }

    const now = new Date().toISOString();
    const newConv: Conversation = {
      id: convId,
      userId: user.uid.slice(0, 128),
      userName: (user.displayName || 'Member').slice(0, 100),
      userEmail: user.email.slice(0, 120),
      userCountry: (user.country || 'International').slice(0, 80),
      userPhotoURL: (user.photoURL || '').slice(0, 1000),
      subject: 'Private Humanitarian Consultation',
      lastMessage: 'Conversation opened with Humanitarian Administration.',
      lastSenderId: user.uid.slice(0, 128),
      lastSenderName: (user.displayName || 'Member').slice(0, 100),
      unreadForAdmin: 0,
      unreadForUser: 0,
      archived: false,
      blocked: false,
      createdAt: now,
      updatedAt: now,
    };

    const payload = cleanData(newConv);
    await setDoc(ref, payload);
    return newConv;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${convId}`);
    throw error;
  }
}

export function subscribeToConversation(
  conversationId: string,
  callback: (conversation: Conversation | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `conversations/${conversationId}`;
  try {
    return onSnapshot(
      doc(db, 'conversations', conversationId),
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() } as Conversation);
        } else {
          callback(null);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch (wrappedErr) {
          if (onError) onError(wrappedErr as Error);
          else throw wrappedErr;
        }
      }
    );
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (wrappedErr) {
      if (onError) onError(wrappedErr as Error);
      else throw wrappedErr;
    }
    return () => {};
  }
}

export function subscribeToConversations(
  isAdmin: boolean,
  userId: string | undefined,
  callback: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'conversations';
  try {
    const q = isAdmin
      ? query(collection(db, path))
      : query(collection(db, path), where('userId', '==', userId || 'none'));

    return onSnapshot(
      q,
      (snapshot) => {
        const convs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Conversation));
        convs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        callback(convs);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (wrappedErr) {
          if (onError) onError(wrappedErr as Error);
          else throw wrappedErr;
        }
      }
    );
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (wrappedErr) {
      if (onError) onError(wrappedErr as Error);
      else throw wrappedErr;
    }
    return () => {};
  }
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `conversations/${conversationId}/messages`;
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
        msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        callback(msgs);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (wrappedErr) {
          if (onError) onError(wrappedErr as Error);
          else throw wrappedErr;
        }
      }
    );
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (wrappedErr) {
      if (onError) onError(wrappedErr as Error);
      else throw wrappedErr;
    }
    return () => {};
  }
}

export async function sendMessage(
  conversationId: string,
  message: {
    senderId: string;
    senderName: string;
    senderRole: 'member' | 'admin';
    text: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentType?: string;
  }
): Promise<void> {
  const msgPath = `conversations/${conversationId}/messages`;
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const msgPayload = cleanData({
    id: messageId,
    conversationId: conversationId.slice(0, 128),
    senderId: message.senderId.slice(0, 128),
    senderName: (message.senderName || 'User').slice(0, 100),
    senderRole: message.senderRole,
    text: message.text.slice(0, 3000),
    attachmentUrl: message.attachmentUrl ? message.attachmentUrl.slice(0, 800000) : undefined,
    attachmentName: message.attachmentName ? message.attachmentName.slice(0, 200) : undefined,
    attachmentType: message.attachmentType ? message.attachmentType.slice(0, 50) : undefined,
    read: false,
    createdAt: now,
  });

  try {
    await setDoc(doc(db, msgPath, messageId), msgPayload);

    const isSenderAdmin = message.senderRole === 'admin';
    const convRef = doc(db, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);
    if (convSnap.exists()) {
      const data = convSnap.data() as Conversation;
      await updateDoc(convRef, cleanData({
        lastMessage: message.text.substring(0, 150),
        lastSenderId: message.senderId.slice(0, 128),
        lastSenderName: (message.senderName || 'User').slice(0, 100),
        unreadForAdmin: isSenderAdmin ? 0 : (data.unreadForAdmin || 0) + 1,
        unreadForUser: isSenderAdmin ? (data.unreadForUser || 0) + 1 : 0,
        updatedAt: now,
      }));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${msgPath}/${messageId}`);
  }
}

export async function markConversationAsRead(conversationId: string, byRole: 'member' | 'admin'): Promise<void> {
  const convRef = doc(db, 'conversations', conversationId);
  try {
    if (byRole === 'admin') {
      await updateDoc(convRef, { unreadForAdmin: 0 });
    } else {
      await updateDoc(convRef, { unreadForUser: 0 });
    }
  } catch (error) {
    console.warn('Notice updating conversation read status:', error);
  }
}

export async function toggleArchiveConversation(conversationId: string, archived: boolean): Promise<void> {
  const convRef = doc(db, 'conversations', conversationId);
  try {
    await updateDoc(convRef, { archived });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `conversations/${conversationId}`);
  }
}

export async function toggleBlockUserConversation(conversationId: string, blocked: boolean): Promise<void> {
  const convRef = doc(db, 'conversations', conversationId);
  try {
    await updateDoc(convRef, { blocked });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `conversations/${conversationId}`);
  }
}
