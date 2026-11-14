import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProgrammeItem, AnnouncementItem } from '../../types';
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Droplet, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  programmes: ProgrammeItem[];
  announcements: AnnouncementItem[];
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  onSelectProgramme: (prog: ProgrammeItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  programmes,
  announcements,
  setActiveTab,
  openAuthModal,
  onSelectProgramme,
}) => {
  const { user, t } = useAuth();

  const featuredProgrammes = programmes.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#142B45] text-white overflow-hidden border-b border-[#C9A45C]/30">
        <div className="absolute inset-0 bg-asian-lattice opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Mission Narrative & Direct CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Unboxed Kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C9A45C] uppercase font-mono">
                <span>{t.hero.kicker}</span>
                <span aria-hidden="true">·</span>
                <span>EST. 2014</span>
              </div>

              {/* Main Headline with balanced wrap */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {t.hero.title}
              </h1>

              {/* Deck Paragraph */}
              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('programmes')}
                  className="px-6 py-3 rounded text-sm font-bold bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-all shadow-md flex items-center gap-2"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('get-involved')}
                  className="px-6 py-3 rounded text-sm font-semibold border border-stone-400/60 text-white hover:bg-white/10 transition-colors"
                >
                  {t.hero.ctaSecondary}
                </button>

                <button
                  onClick={() => {
                    if (user) {
                      setActiveTab('member-chat');
                    } else {
                      openAuthModal();
                    }
                  }}
                  className="px-5 py-3 rounded text-sm font-semibold bg-[#1E3E63] hover:bg-[#284f7d] text-[#C9A45C] border border-[#C9A45C]/40 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{t.hero.ctaDirectChat}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-stone-700/60 flex flex-wrap items-center gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Independent Audited NGO</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct 88.4% Frontline Aid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Field Documentation</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Documentary Image Asset */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-2 border-[#C9A45C]/40 group">
                <img
                  src="/src/assets/images/asia_ngo_hero_1794424632636.jpg"
                  alt="Humanitarian outreach in rural Asian village"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-[#142B45]/90 backdrop-blur-xs border border-[#C9A45C]/30 text-xs">
                  <p className="font-serif italic text-white font-medium">
                    "Field Medical & Education Mission — Northern Vietnam & Lao Borders"
                  </p>
                  <div className="mt-1 flex items-center justify-between text-stone-300 text-[11px]">
                    <span>Ha Giang Province, 2024</span>
                    <span className="text-[#C9A45C] font-mono">Archive Code: AHD-VN-884</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. STATS STRIP (Tabular Numerals, High Rigor) */}
        <div className="bg-[#0D1C2E] border-t border-[#C9A45C]/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              
              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-4xl font-bold font-serif text-[#C9A45C] tabular-nums">
                  {t.stats.beneficiaries}
                </div>
                <div className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
                  {t.stats.beneficiariesLabel}
                </div>
              </div>

              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-4xl font-bold font-serif text-[#C9A45C] tabular-nums">
                  {t.stats.waterStations}
                </div>
                <div className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
                  {t.stats.waterStationsLabel}
                </div>
              </div>

              <div className="p-4 border-r border-stone-800 last:border-none">
                <div className="text-2xl sm:text-4xl font-bold font-serif text-[#C9A45C] tabular-nums">
                  {t.stats.clinics}
                </div>
                <div className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
                  {t.stats.clinicsLabel}
                </div>
              </div>

              <div className="p-4">
                <div className="text-2xl sm:text-4xl font-bold font-serif text-[#C9A45C] tabular-nums">
                  {t.stats.countries}
                </div>
                <div className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
                  {t.stats.countriesLabel}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE MISSION & CULTURAL IDENTITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[#26734D] font-bold">
              Guiding Philosophy
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] leading-tight">
              Honouring Heritage While Building Generational Self-Reliance
            </h2>
            <p className="text-stone-700 leading-relaxed text-sm">
              True humanitarian aid does not impose external formulas. We operate on the principle of communal sovereignty, drawing inspiration from traditional Asian cooperative assemblies: the <em>Gotong Royong</em> of Indonesia, the <em>Bayanihan</em> of the Philippines, and the village panchayats of South Asia.
            </p>
            <p className="text-stone-700 leading-relaxed text-sm">
              By pairing time-tested community wisdom with modern clean-energy engineering and rigorous medical standards, we ensure infrastructure endures long after our field workers depart.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#142B45] hover:text-[#C9A45C] transition-colors border-b-2 border-[#C9A45C] pb-0.5"
              >
                <span>Read our Founding Charter and Governance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded bg-[#142B45] text-[#C9A45C] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142B45]">
                Dignified Partnership
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Village leadership councils co-design every project. We provide capital and technical guidance; communities provide stewardship and labor.
              </p>
            </div>

            <div className="p-6 rounded bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded bg-[#26734D] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142B45]">
                Ecological Stewardship
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                All engineering uses gravity water systems, solar microgrids, and local bamboo/stone construction to protect fragile Asian watersheds.
              </p>
            </div>

            <div className="p-6 rounded bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded bg-[#C9A45C] text-[#142B45] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142B45]">
                Accountability Without Compromise
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Open-book accounting with independent third-party audits published biannually for complete institutional and individual donor trust.
              </p>
            </div>

            <div className="p-6 rounded bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded bg-[#142B45] text-white flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-serif font-bold text-lg text-[#142B45]">
                Inclusive Outreach
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Prioritizing marginalized indigenous mountain minorities, isolated island communities, and persons with disabilities across all programmes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED PROGRAMMES PREVIEW */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold">
                Field Operations
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] mt-1">
                {t.programmes.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1">
                {t.programmes.subtitle}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('programmes')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#142B45] hover:text-[#C9A45C] transition-colors whitespace-nowrap"
            >
              <span>View All 10 Programmes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProgrammes.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#F8F6F0] rounded border border-stone-200 hover:border-[#C9A45C] transition-all shadow-xs hover:shadow-md flex flex-col overflow-hidden group cursor-pointer"
                onClick={() => onSelectProgramme(prog)}
              >
                {prog.imageUrl && (
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={prog.imageUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#142B45]/90 text-white text-[11px] font-medium rounded">
                      {prog.category}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#142B45] group-hover:text-[#C9A45C] transition-colors line-clamp-2">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 mt-2 leading-relaxed">
                      {prog.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 text-[11px] text-stone-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span className="font-medium text-stone-700">{prog.beneficiaries}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">{prog.regions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ANNOUNCEMENTS & FIELD DISPATCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-stone-300 pb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#142B45] font-bold">
              Transparency & Updates
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
              Latest Field Dispatches & Official Bulletins
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('impact')}
            className="text-xs font-semibold text-[#142B45] hover:text-[#C9A45C]"
          >
            Annual Reports Archive →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div 
              key={ann.id} 
              className="bg-white p-6 rounded border border-stone-200 hover:border-stone-300 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>{ann.category}</span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#142B45] leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>By: {ann.authorName || 'Field Secretariat'}</span>
                <span className="text-[#26734D] font-semibold">Official Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION & DIRECT PRIVATE CONSULTATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-[#142B45] text-white p-8 sm:p-12 border-2 border-[#C9A45C]/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C9A45C] tracking-widest uppercase">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Direct Member-to-Administration Communication</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Connect Directly with Our Humanitarian Coordinators
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed">
              We provide authenticated private one-on-one communication lines between community partners, prospective volunteers, institutional donors, and our central administration team. Inquiries are stored permanently and responded to with total discretion.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (user) {
                    setActiveTab('member-chat');
                  } else {
                    openAuthModal();
                  }
                }}
                className="px-6 py-3 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-all shadow-md"
              >
                Open Private Consultation Line
              </button>

              <button
                onClick={() => setActiveTab('get-involved')}
                className="px-6 py-3 rounded text-xs font-bold uppercase tracking-wider bg-transparent border border-stone-400 text-white hover:bg-white/10 transition-colors"
              >
                Submit Volunteer Application
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
