import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut
} from 'firebase/auth';
import { auth, checkIsAdmin } from '../firebase';
import { UserProfile, SupportedLanguage } from '../types';
import { getUserProfile, saveUserProfile } from '../services/db';
import { translations, TranslationDictionary } from '../i18n/translations';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Load language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('asia_ngo_lang') as SupportedLanguage;
    if (saved && translations[saved]) {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('asia_ngo_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = translations[language] || translations.en;

  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setUserProfile(null);
      setIsAdmin(false);
      return;
    }

    const currentAuthUser = auth.currentUser;
    const isEmailAdmin = checkIsAdmin(currentAuthUser.email) && currentAuthUser.emailVerified;
    
    try {
      let profile = await getUserProfile(currentAuthUser.uid);
      if (!profile) {
        const now = new Date().toISOString();
        profile = {
          uid: currentAuthUser.uid,
          displayName: currentAuthUser.displayName || (isEmailAdmin ? 'Humanitarian Director' : 'Community Member'),
          email: currentAuthUser.email || `${currentAuthUser.uid.substring(0, 8)}@member.asia-ngo.org`,
          country: isEmailAdmin ? 'Singapore (HQ)' : 'International',
          role: isEmailAdmin ? 'admin' : 'member',
          photoURL: currentAuthUser.photoURL || '',
          bio: isEmailAdmin 
            ? 'Executive Director & Field Operations Coordinator at Asia Humanitarian Development.' 
            : 'Humanitarian advocate and community member.',
          createdAt: now,
          updatedAt: now,
        };
        await saveUserProfile(profile);
      }

      setUserProfile(profile);
      setIsAdmin(isEmailAdmin || profile.role === 'admin');
    } catch (err) {
      console.error('Profile sync error:', err);
      const now = new Date().toISOString();
      const fallback: UserProfile = {
        uid: currentAuthUser.uid,
        displayName: currentAuthUser.displayName || (isEmailAdmin ? 'Humanitarian Director' : 'Community Member'),
        email: currentAuthUser.email || 'member@asia-ngo.org',
        country: isEmailAdmin ? 'Singapore (HQ)' : 'International',
        role: isEmailAdmin ? 'admin' : 'member',
        photoURL: currentAuthUser.photoURL || '',
        createdAt: now,
        updatedAt: now,
      };
      setUserProfile(fallback);
      setIsAdmin(isEmailAdmin);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshProfile();
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      await refreshProfile();
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        language,
        setLanguage,
        t,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
