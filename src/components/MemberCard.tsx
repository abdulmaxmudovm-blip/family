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
      whileHover={{ y: -8, scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="w-44 h-44 bg-white border-4 border-natural-sage rounded-full shadow-xl flex flex-col items-center justify-center p-6 cursor-pointer relative group transition-all hover:border-natural-dark"
    >
      <div className="absolute inset-0 rounded-full bg-natural-sage/5 group-hover:bg-natural-sage/10 transition-colors" />
      
      <div className="text-[9px] text-natural-sage font-black uppercase tracking-[0.2em] mb-1 z-10">
        {member.role}
      </div>
      <h3 className="text-base font-black text-natural-dark leading-tight mb-1 z-10 text-center px-2">
        {member.firstName} <br /> {member.lastName}
      </h3>
      <div className="text-[10px] font-bold text-natural-sage/60 z-10">
         {member.birthDate.split('-')[0]} {age !== null ? `• ${age} y` : ''}
      </div>
      
      {/* Decorative pulse ring */}
      <div className="absolute inset-[-6px] border-2 border-natural-sage/30 rounded-full scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
    </motion.div>
  );
});
