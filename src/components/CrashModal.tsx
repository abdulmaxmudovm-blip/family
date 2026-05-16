/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Trash2, User } from 'lucide-react';
import { FamilyMember } from '../types';

interface CrashModalProps {
  members: FamilyMember[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const CrashModal: React.FC<CrashModalProps> = ({ members, onClose, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border-4 border-red-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-wide">A'zoni O'chirish (Crash)</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {members.length === 0 ? (
            <p className="text-center text-gray-500 py-8">O'chirish uchun a'zolar yo'q.</p>
          ) : (
            <div className="space-y-3">
              {members.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100 group hover:border-red-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{member.firstName} {member.lastName}</p>
                      <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">{member.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`${member.firstName}ni o'chirib tashlamoqchimisiz?`)) {
                        onDelete(member.id);
                        // If it was the last one, might as well close
                        if (members.length === 1) {
                          onClose();
                        }
                      }
                    }}
                    className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm active:scale-90 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-gray-300 transition-all"
          >
            Yopish
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
