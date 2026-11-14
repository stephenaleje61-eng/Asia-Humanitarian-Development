import React from 'react';
import { ShieldCheck, Award, Heart, BookOpen, Compass, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const leadership = [
    {
      name: 'Dr. Lin Wei, MD, MPH',
      role: 'Executive Director & Chief Medical Officer',
      background: '20+ years coordinating rural infectious disease response and primary healthcare delivery in Indochina and the Himalayas. Former WHO field consultant.',
      country: 'Singapore & Vietnam',
    },
    {
      name: 'Amina Nurul Huda, MSc',
      role: 'Head of Community Autonomy & Gender Equity',
      background: 'Pioneer of community micro-credit models and indigenous weaving cooperatives in East Nusa Tenggara and Bangladesh.',
      country: 'Indonesia',
    },
    {
      name: 'Eng. Rajeshwar Sharma, PE',
      role: 'Chief Infrastructure & Watershed Engineer',
      background: 'Specialist in non-electric gravity-fed spring systems, earthquake-resilient vernacular architecture, and rural microgrids.',
      country: 'Nepal & India',
    },
    {
      name: 'Sombath Thao, MA',
      role: 'Director of Youth Apprenticeship & Field Logistics',
      background: 'Lifelong advocate for mountain minority youth vocational development, bilingual education, and rapid flood disaster response.',
      country: 'Laos',
    },
  ];

  const milestones = [
    { year: '2014', title: 'Founding Assembly in Singapore', desc: 'Established by an alliance of Asian doctors and engineers responding to remote healthcare gaps in northern Laos and Vietnam.' },
    { year: '2017', title: 'Mekong Watershed Clean Water Initiative', desc: 'Reached 50th continuous gravity water system installation, eliminating waterborne disease across 35 highland hamlets.' },
    { year: '2020', title: 'Emergency Pandemic Rapid Response Taskforce', desc: 'Delivered oxygen concentrators, solar vaccines cold-chains, and food staples to 72 isolated indigenous villages.' },
    { year: '2023', title: 'Independent Financial Audit Rating', desc: 'Achieved verified 88.4% frontline aid allocation ratio, certified by international independent compliance auditors.' },
    { year: '2026', title: 'Trans-Asian 12-Nation Milestone', desc: 'Operating 28 scheduled mobile clinics, 84 water installations, and 42 artisan cooperatives spanning 142,500 beneficiaries.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title & Introduction */}
      <div className="space-y-4 max-w-3xl border-b border-stone-300 pb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold">
          About the Organisation
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45] leading-tight">
          Pioneering Dignified, Community-Owned Humanitarian Progress in Asia
        </h1>
        <p className="text-base text-stone-700 leading-relaxed">
          Asia Humanitarian Development (AHD) is an internationally recognized non-governmental organisation founded to bridge severe development inequities across rural and vulnerable regions of Asia. We believe that sustainable humanitarian progress cannot be gifted from afar—it must be planted, tended, and governed by the communities themselves.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded border border-stone-200 shadow-sm space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#26734D] font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Our Mission</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#142B45]">
            Empowering Vulnerable Communities from Within
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            To provide direct, uncompromised humanitarian assistance, clean gravity water, mobile clinical healthcare, education scholarships, and sustainable livelihoods to Asia’s most remote and underserved populations, honoring their cultural heritage and fostering enduring autonomy.
          </p>
        </div>

        <div className="bg-white p-8 rounded border border-stone-200 shadow-sm space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Our Vision</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#142B45]">
            A Resilient, Self-Sustaining Asian Community
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            An Asia where no child is deprived of education due to geography, where no mother suffers preventable birth complications due to lack of a clinic, and where indigenous communities thrive with clean water, clean energy, and economic self-sufficiency.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="border-b border-stone-300 pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#142B45]">
            Our Core Institutional Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded bg-white border border-stone-200 space-y-2">
            <span className="text-xs font-mono font-bold text-[#C9A45C]">01. COMPASSION & DIGNITY</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every beneficiary is treated as an equal partner, never a passive recipient of charity.
            </p>
          </div>

          <div className="p-5 rounded bg-white border border-stone-200 space-y-2">
            <span className="text-xs font-mono font-bold text-[#26734D]">02. CULTURAL HUMILITY</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              We listen to village elders, adapt to indigenous customs, and work within local languages.
            </p>
          </div>

          <div className="p-5 rounded bg-white border border-stone-200 space-y-2">
            <span className="text-xs font-mono font-bold text-[#142B45]">03. UNCOMPROMISING INTEGRITY</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero tolerance for corruption, complete financial transparency, and verified impact data.
            </p>
          </div>

          <div className="p-5 rounded bg-white border border-stone-200 space-y-2">
            <span className="text-xs font-mono font-bold text-[#C9A45C]">04. ECOLOGICAL HARMONY</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every physical infrastructure project must protect local ecosystems, soil, and waterways.
            </p>
          </div>
        </div>
      </div>

      {/* Transparency & Financial Governance Section */}
      <div className="bg-[#142B45] text-white rounded p-8 sm:p-10 border border-[#C9A45C]/30 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold">
            Audited Financial Governance
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Where Every Contribution Goes
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            We hold ourselves to international standards of accounting and field monitoring. All reports are certified by external auditors and made publicly available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded bg-[#0D1C2E] border border-[#C9A45C]/30 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C9A45C] tabular-nums">
              88.4%
            </div>
            <div className="text-xs font-semibold text-white uppercase">Direct Frontline Aid</div>
            <p className="text-[11px] text-stone-400">
              Medicines, water pipelines, scholarships, tools, and direct disaster relief supplies.
            </p>
          </div>

          <div className="p-5 rounded bg-[#0D1C2E] border border-stone-700 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-300 tabular-nums">
              7.2%
            </div>
            <div className="text-xs font-semibold text-white uppercase">Field Engineering & Logistics</div>
            <p className="text-[11px] text-stone-400">
              Water quality testing, mobile 4WD maintenance, satellite communication in disaster zones.
            </p>
          </div>

          <div className="p-5 rounded bg-[#0D1C2E] border border-stone-700 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-300 tabular-nums">
              4.4%
            </div>
            <div className="text-xs font-semibold text-white uppercase">Administration & Audit</div>
            <p className="text-[11px] text-stone-400">
              Third-party statutory auditing, legal registration in host nations, transparent reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Directorate */}
      <div className="space-y-6">
        <div className="border-b border-stone-300 pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#142B45]">
            Humanitarian Leadership Council
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Field practitioners with deep cultural knowledge and international humanitarian credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader, i) => (
            <div key={i} className="bg-white p-6 rounded border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#142B45] text-[#C9A45C] flex items-center justify-center font-serif text-lg font-bold mb-3">
                  {leader.name.charAt(4) || 'D'}
                </div>
                <h3 className="font-serif font-bold text-base text-[#142B45]">
                  {leader.name}
                </h3>
                <div className="text-xs font-semibold text-[#26734D] mt-0.5">
                  {leader.role}
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {leader.background}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 font-mono">
                Location: {leader.country}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="space-y-6">
        <div className="border-b border-stone-300 pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#142B45]">
            History & Organizational Milestones (2014–2026)
          </h2>
        </div>

        <div className="relative border-l-2 border-[#C9A45C]/50 ml-4 space-y-8 pl-6">
          {milestones.map((m, i) => (
            <div key={i} className="relative group">
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#142B45] border-2 border-[#C9A45C]" />
              <div className="font-mono text-xs font-bold text-[#C9A45C]">{m.year}</div>
              <h3 className="font-serif font-bold text-base text-[#142B45] mt-0.5">{m.title}</h3>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
