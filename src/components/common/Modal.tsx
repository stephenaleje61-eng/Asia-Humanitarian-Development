import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`relative w-full ${maxWidth} bg-[#F8F6F0] text-[#142B45] rounded-md shadow-2xl border border-[#C9A45C]/40 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#142B45] text-white">
          <h3 className="font-serif text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-[#C9A45C]">✦</span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-300 hover:text-white hover:bg-stone-800/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
