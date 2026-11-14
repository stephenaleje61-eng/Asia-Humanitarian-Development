import React from 'react';
import { ProgrammeItem } from '../../types';
import { Modal } from './Modal';
import { Users, MapPin, CheckCircle2, HeartHandshake, ArrowRight } from 'lucide-react';

interface ProgrammeDetailModalProps {
  programme: ProgrammeItem | null;
  onClose: () => void;
  onSupport: (prog: ProgrammeItem) => void;
  onVolunteer: (prog: ProgrammeItem) => void;
}

export const ProgrammeDetailModal: React.FC<ProgrammeDetailModalProps> = ({
  programme,
  onClose,
  onSupport,
  onVolunteer,
}) => {
  if (!programme) return null;

  return (
    <Modal isOpen={!!programme} onClose={onClose} title={programme.title} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {programme.imageUrl && (
          <div className="h-60 w-full rounded overflow-hidden relative border border-stone-200">
            <img
              src={programme.imageUrl}
              alt={programme.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#142B45]/90 text-white text-xs font-semibold rounded">
              {programme.category}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F8F6F0] p-3 rounded border border-stone-200">
            <div>
              <span className="font-semibold text-stone-500 block">Beneficiaries Reached:</span>
              <span className="font-bold text-[#142B45] text-sm">{programme.beneficiaries}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Operational Regions:</span>
              <span className="font-bold text-[#142B45]">{programme.regions}</span>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-[#142B45] mb-1">
              Executive Summary
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              {programme.summary}
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-[#142B45] mb-1">
              Field Implementation & Community Ownership
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {programme.description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onVolunteer(programme);
            }}
            className="px-4 py-2 rounded text-xs font-semibold border border-stone-300 text-stone-700 hover:bg-stone-50"
          >
            Apply to Volunteer in this Programme
          </button>

          <button
            onClick={() => {
              onClose();
              onSupport(programme);
            }}
            className="px-5 py-2 rounded text-xs font-bold bg-[#C9A45C] text-[#142B45] hover:bg-[#E0C17E] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Support This Initiative</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
