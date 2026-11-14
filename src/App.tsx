/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgrammeItem, AnnouncementItem } from './types';
import { getProgrammes, getAnnouncements, subscribeToConversations } from './services/db';
import { MessageSquare } from 'lucide-react';

// Navigation & Common
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { LegalModals } from './components/common/LegalModals';
import { ProgrammeDetailModal } from './components/common/ProgrammeDetailModal';

// Pages
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ProgrammesPage } from './components/pages/ProgrammesPage';
import { ImpactPage } from './components/pages/ImpactPage';
import { GetInvolvedPage } from './components/pages/GetInvolvedPage';
import { ContactPage } from './components/pages/ContactPage';
import { MemberPortal } from './components/member/MemberPortal';
import { MemberChatView } from './components/chat/MemberChatView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const VALID_TABS = new Set([
  'home',
  'about',
  'programmes',
  'impact',
  'get-involved',
  'contact',
  'member-portal',
  'member-chat',
  'admin',
]);

const MainAppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [programmes, setProgrammes] = useState<ProgrammeItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [postAuthTab, setPostAuthTab] = useState<string | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeItem | null>(null);
  const [initialSupportProgramme, setInitialSupportProgramme] = useState<string | undefined>(undefined);

  // Sync tab with URL hash/pathname
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (path === '/admin' || hash === 'admin') {
        setActiveTab('admin');
      } else if (hash && VALID_TABS.has(hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('home');
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    window.location.hash = newTab === 'home' ? '' : newTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (redirectTab?: string) => {
    setPostAuthTab(redirectTab || null);
    setAuthModalOpen(true);
  };

  // Fetch initial public content
  useEffect(() => {
    Promise.all([getProgrammes(), getAnnouncements()])
      .then(([progs, anns]) => {
        setProgrammes(progs);
        setAnnouncements(anns);
      })
      .catch((err) => {
        console.warn('Initial data fetch notice:', err);
      });
  }, []);

  // Live unread counter for signed-in user's private chat channel
  useEffect(() => {
    if (authLoading || !user) {
      setUnreadCount(0);
      return;
    }

    const unsubscribe = subscribeToConversations(
      false,
      user.uid,
      (convs) => {
        const total = convs.reduce((sum, c) => sum + (c.unreadForUser || 0), 0);
        setUnreadCount(total);
      },
      (err) => {
        console.warn('Unread badge listener notice:', err.message);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  // Admin section has its own dedicated interface
  if (activeTab === 'admin') {
    return (
      <AdminDashboard
        onBackToSite={() => handleTabChange('home')}
        openAuthModal={() => openAuthModal('admin')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#142B45]">
      
      {/* Universal Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        openAuthModal={(redirectTab) => openAuthModal(redirectTab)}
        unreadCount={unreadCount}
      />

      {/* Main Page Body Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            programmes={programmes}
            announcements={announcements}
            setActiveTab={handleTabChange}
            openAuthModal={() => openAuthModal('member-chat')}
            onSelectProgramme={(prog) => setSelectedProgramme(prog)}
          />
        )}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'programmes' && (
          <ProgrammesPage
            programmes={programmes}
            setActiveTab={handleTabChange}
            onSupportProgramme={(prog) => {
              setInitialSupportProgramme(prog.title);
              handleTabChange('get-involved');
            }}
          />
        )}

        {activeTab === 'impact' && <ImpactPage />}

        {activeTab === 'get-involved' && (
          <GetInvolvedPage
            initialSupportProgramme={initialSupportProgramme}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            setActiveTab={handleTabChange}
            openAuthModal={() => openAuthModal('member-chat')}
          />
        )}

        {activeTab === 'member-portal' && (
          <MemberPortal
            setActiveTab={handleTabChange}
            openAuthModal={() => openAuthModal('member-portal')}
          />
        )}

        {activeTab === 'member-chat' && (
          <MemberChatView
            openAuthModal={() => openAuthModal('member-chat')}
            onOpenAdmin={() => handleTabChange('admin')}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
        setActiveTab={handleTabChange}
      />

      {/* Persistent Quick-Access Floating Consultation Chat Button */}
      {activeTab !== 'member-chat' && (
        <button
          onClick={() => handleTabChange('member-chat')}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#142B45] text-white border-2 border-[#C9A45C] shadow-xl hover:bg-[#1E3E63] transition-all"
          title="Open Private 1-on-1 Chat"
        >
          <MessageSquare className="w-4 h-4 text-[#C9A45C]" />
          <span className="text-xs font-bold tracking-wide">Private Chat</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPostAuthTab(null);
        }}
        onSuccess={() => {
          if (postAuthTab) {
            handleTabChange(postAuthTab);
            setPostAuthTab(null);
          }
        }}
      />

      <LegalModals
        privacyOpen={privacyOpen}
        termsOpen={termsOpen}
        onClosePrivacy={() => setPrivacyOpen(false)}
        onCloseTerms={() => setTermsOpen(false)}
      />

      <ProgrammeDetailModal
        programme={selectedProgramme}
        onClose={() => setSelectedProgramme(null)}
        onSupport={(prog) => {
          setInitialSupportProgramme(prog.title);
          handleTabChange('get-involved');
        }}
        onVolunteer={(prog) => {
          setInitialSupportProgramme(prog.title);
          handleTabChange('get-involved');
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
