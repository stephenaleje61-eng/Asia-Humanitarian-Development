import React from 'react';
import { Modal } from './Modal';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface LegalModalsProps {
  privacyOpen: boolean;
  termsOpen: boolean;
  onClosePrivacy: () => void;
  onCloseTerms: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  privacyOpen,
  termsOpen,
  onClosePrivacy,
  onCloseTerms,
}) => {
  return (
    <>
      {/* Privacy Policy Modal */}
      <Modal isOpen={privacyOpen} onClose={onClosePrivacy} title="Institutional Privacy Policy" maxWidth="max-w-2xl">
        <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
          <div className="p-3 bg-stone-100 rounded border border-stone-200">
            <span className="font-semibold text-[#142B45] block mb-0.5">Commitment to Data Dignity & Discretion</span>
            <p className="text-[11px] text-stone-600">
              Asia Humanitarian Development operates under strict confidentiality protocols to protect vulnerable beneficiaries, whistleblowers, volunteers, and institutional partners.
            </p>
          </div>

          <h4 className="font-serif font-bold text-sm text-[#142B45] pt-1">1. Information Collection & Use</h4>
          <p>
            We collect personal information solely for coordinating humanitarian assistance, processing voluntary contributions, verifying professional qualifications of field applicants, and facilitating secure one-on-one communication. We do not sell, rent, or monetize any member data.
          </p>

          <h4 className="font-serif font-bold text-sm text-[#142B45] pt-1">2. Private One-on-One Messaging Security</h4>
          <p>
            Private messages exchanged between members and our administration team are stored in access-restricted database partitions protected by Attribute-Based Access Control (ABAC) rules. Only authorized coordinators and the authenticated conversation owner can access message histories.
          </p>

          <h4 className="font-serif font-bold text-sm text-[#142B45] pt-1">3. Field Beneficiary Protection</h4>
          <p>
            Photographs and documentary field records depicting community members are collected with informed communal consent (FPIC) and adhere to international humanitarian safeguarding guidelines.
          </p>
        </div>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal isOpen={termsOpen} onClose={onCloseTerms} title="Terms of Cooperation & Service" maxWidth="max-w-2xl">
        <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
          <h4 className="font-serif font-bold text-sm text-[#142B45]">1. Humanitarian Charter & Neutrality</h4>
          <p>
            All users, volunteers, and partners agree to operate within the universal principles of humanitarian neutrality, impartiality, and non-discrimination on grounds of race, gender, religion, or nationality.
          </p>

          <h4 className="font-serif font-bold text-sm text-[#142B45]">2. Financial Transparency & Anti-Corruption</h4>
          <p>
            Asia Humanitarian Development enforces a strict Zero-Bribery and Anti-Corruption compliance code. Donations and grants must be routed through official certified multi-currency accounts.
          </p>

          <h4 className="font-serif font-bold text-sm text-[#142B45]">3. Volunteer Code of Conduct</h4>
          <p>
            Volunteers deployed to field sites agree to abide by local laws, respect cultural customs, and adhere to environmental protection standards.
          </p>
        </div>
      </Modal>
    </>
  );
};
