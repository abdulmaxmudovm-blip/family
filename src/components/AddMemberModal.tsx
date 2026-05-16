/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Calendar, Users, Briefcase } from 'lucide-react';
import { FamilyMember, FamilyRole } from '../types';

interface AddMemberModalProps {
  onClose: () => void;
  onAdd: (member: FamilyMember) => void;
  members: FamilyMember[];
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onAdd, members }) => {
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    firstName: '',
    lastName: '',
    birthDate: '',
    role: FamilyRole.BOLA,
    bio: '',
    generation: 0,
    parentId: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      alert("Iltimos, ism, familiya va tug'ilgan sanani kiriting!");
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      birthDate: formData.birthDate || '',
      role: formData.role as FamilyRole,
      bio: formData.bio || '',
      generation: formData.generation || 0,
      parentId: formData.parentId
    };

    onAdd(newMember);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-natural-base rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border-4 border-natural-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-natural-dark p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-natural-sage" />
            <h2 className="text-xl font-bold tracking-wide">Yangi Shajara A'zosi</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Ism</label>
              <input
                required
                type="text"
                placeholder="Masalan: Sardor"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Familiya</label>
              <input
                required
                type="text"
                placeholder="Masalan: Alimov"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Tug'ilgan sana</label>
              <input
                required
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Oila roli</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as FamilyRole })}
                className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
              >
                {Object.values(FamilyRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Avlod darajasi</label>
              <select
                value={formData.generation}
                onChange={(e) => setFormData({ ...formData, generation: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
              >
                {[3, 2, 1, 0, -1, -2, -3].map(g => (
                  <option key={g} value={g}>
                    {g > 0 ? `${g}-Ajdod (Teparoqda)` : g < 0 ? `${Math.abs(g)}-Avlod (Pastaroqda)` : 'Asosiy'}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Ajdodi (Kimmning farzandi?)</label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
              >
                <option value="">Noma'lum / Asosiy</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Ma'lumotlar / Hayoti</label>
            <textarea
              placeholder="Inson haqida qisqacha ma'lumot yozing..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm resize-none h-24"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-natural-sage text-white rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-natural-dark transition-all shadow-lg active:scale-[0.98]"
          >
            Boshlash / Qo'shish
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
