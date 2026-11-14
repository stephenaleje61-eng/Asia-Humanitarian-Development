import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, setActiveTab }) => {
  const { t } = useAuth();

  return (
    <footer className="bg-[#0D1C2E] text-stone-300 border-t border-[#C9A45C]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Identity & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#C9A45C] text-[#142B45] font-serif font-bold text-lg flex items-center justify-center border border-[#C9A45C]/50">
                亞
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                Asia Humanitarian Development
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="pt-2">
              <div className="p-3 rounded bg-[#142B45] border border-[#C9A45C]/30 text-xs">
                <span className="font-semibold text-[#C9A45C] block mb-1">Financial Accountability</span>
                <p className="text-[11px] text-stone-300">
                  {t.footer.transparencyNote}
                </p>
              </div>
            </div>
          </div>

          {/* Col 2: Humanitarian Programmes */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-4 text-[#C9A45C]">
              Humanitarian Pillars
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setActiveTab('programmes')} className="hover:text-white transition-colors text-left">
                  Education & Scholarship Support
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('programmes')} className="hover:text-white transition-colors text-left">
                  Mobile Healthcare & Medical Assistance
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('programmes')} className="hover:text-white transition-colors text-left">
                  Clean Gravity Water & Environment
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('programmes')} className="hover:text-white transition-colors text-left">
                  Women’s Empowerment & Artisan Guilds
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('programmes')} className="hover:text-white transition-colors text-left">
                  Disaster Relief & Emergency Assistance
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('programmes')} className="hover:text-white transition-colors text-left">
                  Youth Vocational Training & Food Security
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Secretariat & Secretariats */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-4 text-[#C9A45C]">
              Field Secretariats
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-200 block">Central Secretariat</span>
                  <span>78 Shenton Way, #18-02, Singapore 079120</span>
                </div>
              </div>
              <div className="text-[11px] text-stone-400 pl-6 space-y-1">
                <p>• <strong className="text-stone-300">Indochina Bureau:</strong> Hanoi & Bangkok</p>
                <p>• <strong className="text-stone-300">South Asia Bureau:</strong> Dhaka & Kathmandu</p>
                <p>• <strong className="text-stone-300">Archipelago Operations:</strong> Manila & Jakarta</p>
              </div>
            </div>
          </div>

          {/* Col 4: Official Inquiries & Confidential Consultation */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-4 text-[#C9A45C]">
              Official Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A45C]" />
                <a href="mailto:secretariat@asian-humanitarian.org" className="hover:text-[#C9A45C] transition-colors">
                  secretariat@asian-humanitarian.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>+65 6789 2400 (Mon–Fri 08:00–18:00 SGT)</span>
              </div>
              
              <div className="pt-3">
                <button
                  onClick={() => setActiveTab('contact')}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-[#142B45] hover:bg-[#1E3E63] text-white border border-[#C9A45C]/40 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Contact Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9A45C]" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar: Legal, Trust credentials & copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>© 2014–2026 Asia Humanitarian Development. {t.footer.rightsReserved}</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors">
              {t.footer.privacyPolicy}
            </button>
            <button onClick={onOpenTerms} className="hover:text-white transition-colors">
              {t.footer.terms}
            </button>
            <button onClick={() => setActiveTab('admin')} className="text-[#C9A45C] hover:underline font-mono">
              Admin Gateway
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
