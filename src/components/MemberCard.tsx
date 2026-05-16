/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Users } from 'lucide-react';
import { FamilyMember } from '../types';
import { calculateAge } from '../lib/dateUtils';

interface MemberCardProps {
  member: FamilyMember;
  onClick: (member: FamilyMember) => void;
}

export const MemberCard = React.memo(({ member, onClick }: MemberCardProps) => {
  const age = calculateAge(member.birthDate);

  return (
    <motion.div
      layoutId={member.id}
      onClick={() => onClick(member)}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-48 p-4 bg-white border-2 border-natural-dark rounded-xl shadow-sm text-center cursor-pointer relative group transition-shadow hover:shadow-md"
    >
      <div className="text-[10px] text-natural-sage font-bold uppercase tracking-widest mb-1.5 opacity-80">
        {member.role}
      </div>
      <h3 className="text-lg font-bold text-natural-dark leading-tight mb-1">
        {member.firstName} <br /> {member.lastName}
      </h3>
      <div className="text-[9px] opacity-60 italic text-gray-500 tracking-tight">
         {member.birthDate.split('-')[0]} {age !== null ? `(${age} yosh)` : ''}
      </div>
      
      {/* Decorative dot */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-natural-sage rounded-full border-2 border-white shadow-sm scale-0 group-hover:scale-100 transition-transform" />
    </motion.div>
  );
});
