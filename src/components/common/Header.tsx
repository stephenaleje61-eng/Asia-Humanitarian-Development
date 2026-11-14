import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types';
import { 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  User, 
  MessageSquare, 
  LogIn, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (redirectTab?: string) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openAuthModal, unreadCount = 0 }) => {
  const { user, userProfile, isAdmin, signOut, language, setLanguage, t } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'programmes', label: t.nav.programmes },
    { id: 'impact', label: t.nav.impact },
    { id: 'get-involved', label: t.nav.getInvolved },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#142B45] text-white border-b border-[#C9A45C]/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-sm bg-[#C9A45C] text-[#142B45] font-serif font-bold text-xl flex items-center justify-center shadow-sm border border-[#C9A45C]/40">
              亞
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#C9A45C] transition-colors">
              Asia Humanitarian Development
            </span>
          </button>

          {/* Zone 2: 4-6 Nav Links (Single-Line Typography) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative py-2 whitespace-nowrap shrink-0 transition-colors ${
                    isActive 
                      ? 'text-[#C9A45C] font-semibold' 
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A45C]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Account / Language Utilities */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white rounded border border-stone-700/60 hover:border-[#C9A45C]/60 bg-[#0D1C2E]/60 transition-colors whitespace-nowrap"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#142B45] border border-[#C9A45C]/30 rounded shadow-xl py-1 z-50 divide-y divide-stone-800"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1E3E63] transition-colors ${
                        language === l.code ? 'text-[#C9A45C] font-semibold bg-[#1E3E63]/40' : 'text-stone-300'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[11px] text-stone-400 font-serif">{l.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Private Chat Entry Point */}
            <button
              onClick={() => setActiveTab('member-chat')}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
                activeTab === 'member-chat'
                  ? 'border-[#C9A45C] bg-[#C9A45C] text-[#142B45]'
                  : 'border-[#C9A45C]/40 bg-[#1E3E63]/60 text-[#C9A45C] hover:bg-[#1E3E63]'
              }`}
              title="Open 1-on-1 Private Chat"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Private Chat</span>
              {unreadCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Direct Admin Route or Member Portal */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded border border-[#C9A45C]/40 bg-[#1E3E63]/50 text-white hover:bg-[#1E3E63] text-xs font-medium transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C9A45C] text-[#142B45] flex items-center justify-center font-bold text-xs">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{userProfile?.displayName || user.email}</span>
                  {isAdmin && (
                    <span className="text-[10px] font-mono uppercase bg-[#C9A45C] text-[#142B45] px-1 py-0.2 rounded font-bold">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-stone-300" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-[#142B45] border border-[#C9A45C]/30 rounded shadow-2xl py-1 z-50 text-xs text-stone-200"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-stone-800">
                      <p className="font-semibold text-white truncate">{userProfile?.displayName}</p>
                      <p className="text-[11px] text-stone-400 truncate">{userProfile?.email}</p>
                      <p className="text-[11px] text-[#C9A45C] mt-0.5">{userProfile?.country || 'International'}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('member-portal');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#1E3E63] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#C9A45C]" />
                      <span>{t.nav.portal}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('member-chat');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#1E3E63] flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>1-on-1 Consultation Line</span>
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#1E3E63] flex items-center gap-2 text-[#C9A45C] font-semibold border-t border-stone-800"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
                        <span>{t.nav.admin}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-950/40 text-red-300 border-t border-stone-800 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal()}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-200 hover:text-white rounded border border-stone-700 hover:border-stone-500 transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>{t.nav.signIn}</span>
                </button>
                <button
                  onClick={() => setActiveTab('get-involved')}
                  className="px-4 py-2 text-xs font-semibold text-[#142B45] bg-[#C9A45C] hover:bg-[#E0C17E] rounded transition-colors whitespace-nowrap shadow-sm"
                >
                  Support Our Work
                </button>
              </div>
            )}

            {/* Direct Admin Access Link for convenience */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded border transition-colors ${
                activeTab === 'admin' 
                  ? 'border-[#C9A45C] text-[#C9A45C] bg-[#1E3E63]' 
                  : 'border-stone-700/60 text-stone-400 hover:text-white hover:border-[#C9A45C]/50'
              }`}
              title="Admin Space"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-stone-300 hover:text-white hover:bg-stone-800/50"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1C2E] border-b border-[#C9A45C]/30 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#1E3E63] text-[#C9A45C] font-semibold'
                    : 'text-stone-300 hover:bg-stone-800/40'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-stone-800 space-y-2">
            {/* Mobile Language buttons */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 text-xs rounded border ${
                    language === l.code
                      ? 'border-[#C9A45C] bg-[#C9A45C]/20 text-[#C9A45C] font-bold'
                      : 'border-stone-700 text-stone-400'
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveTab('member-chat');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded bg-[#1E3E63] border border-[#C9A45C]/40 text-[#C9A45C] text-xs font-semibold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Private 1-on-1 Chat</span>
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="space-y-1.5 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('member-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-[#1E3E63] text-white text-xs font-medium flex items-center justify-between"
                >
                  <span>{t.nav.portal} ({userProfile?.displayName})</span>
                  <User className="w-4 h-4 text-[#C9A45C]" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded bg-[#C9A45C]/20 border border-[#C9A45C]/50 text-[#C9A45C] text-xs font-semibold flex items-center justify-between"
                >
                  <span>{t.nav.admin}</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-red-300 hover:bg-red-950/30 text-xs"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-center text-xs font-semibold rounded border border-stone-700 text-white"
                >
                  {t.nav.signIn}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-center text-xs font-semibold rounded bg-[#C9A45C] text-[#142B45]"
                >
                  Admin Portal Access
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
