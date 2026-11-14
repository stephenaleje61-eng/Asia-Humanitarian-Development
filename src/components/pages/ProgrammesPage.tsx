import React, { useState } from 'react';
import { ProgrammeItem } from '../../types';
import { 
  Users, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  Compass,
  Filter
} from 'lucide-react';

interface ProgrammesPageProps {
  programmes: ProgrammeItem[];
  setActiveTab: (tab: string) => void;
  onSupportProgramme: (prog: ProgrammeItem) => void;
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({
  programmes,
  setActiveTab,
  onSupportProgramme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Education & Learning',
    'Healthcare & Medicine',
    'Poverty Reduction',
    'Environment & Water',
    'Women Empowerment',
    'Youth Development',
    'Food Security',
    'Disaster Assistance',
    'Community Development',
    'Social Inclusion',
  ];

  const filteredProgrammes = selectedCategory === 'All'
    ? programmes
    : programmes.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title & Header */}
      <div className="max-w-3xl space-y-4 border-b border-stone-300 pb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-bold">
          Humanitarian Portfolio
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45] leading-tight">
          Ten Dedicated Programmes Serving Communities Across Asia
        </h1>
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
          Each programme is designed alongside local community elders and civil society organizations. We ensure solutions are culturally respectful, ecologically restorative, and economically self-sustaining.
        </p>
      </div>

      {/* Interactive Category Filter Tabs (Compliant with Frontend Design constitution) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/70 rounded-md">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#142B45] text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-black hover:bg-stone-300/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Programme Cards List */}
      <div className="space-y-8">
        {filteredProgrammes.map((prog, index) => {
          const isExpanded = expandedId === prog.id;
          return (
            <div
              key={prog.id}
              className="bg-white rounded border border-stone-200 shadow-xs hover:border-[#C9A45C]/60 transition-all overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-start">
                
                {/* Visual Thumbnail */}
                <div className="lg:col-span-4">
                  <div className="rounded overflow-hidden border border-stone-200 relative aspect-4/3 bg-stone-100">
                    {prog.imageUrl ? (
                      <img
                        src={prog.imageUrl}
                        alt={prog.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-xs">
                        Field Photo Documentation
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#142B45]/90 text-white text-[11px] font-medium rounded">
                      {prog.category}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span className="font-semibold text-[#142B45]">Direct Reach:</span>
                      <span>{prog.beneficiaries}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#26734D]" />
                      <span className="font-semibold text-[#142B45]">Field Regions:</span>
                      <span className="truncate">{prog.regions}</span>
                    </div>
                  </div>
                </div>

                {/* Content & Action */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                      <span>PROGRAMME 0{index + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">Active Field Operation</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#142B45]">
                      {prog.title}
                    </h2>
                    <p className="text-sm text-stone-700 leading-relaxed font-medium">
                      {prog.summary}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed pt-1">
                      {prog.description}
                    </p>
                  </div>

                  {/* Highlights & CTAs */}
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>UN SDG Aligned</span>
                      </span>
                      <span>·</span>
                      <span>Community Assembly Monitored</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onSupportProgramme(prog)}
                        className="px-4 py-2 rounded text-xs font-bold bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Support Programme</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('get-involved')}
                        className="px-4 py-2 rounded text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        Volunteer Here
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
