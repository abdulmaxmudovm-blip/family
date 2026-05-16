/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Save, Trash2, Heart } from 'lucide-react';
import { FamilyMember, FamilyRole } from '../types';
import { calculateAge, formatDate } from '../lib/dateUtils';

interface MemberProfileProps {
  member: FamilyMember;
  members: FamilyMember[];
  onClose: () => void;
  onUpdate: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export const MemberProfile: React.FC<MemberProfileProps> = ({ member, members, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<FamilyMember>(member);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const age = calculateAge(formData.birthDate);

  const otherMembers = members.filter(m => m.id !== member.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        layoutId={member.id}
        className="bg-natural-sidebar rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-natural-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 bg-natural-dark flex items-center justify-between px-8 text-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">Profil Tafsilotlari</h2>
            <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Shaxsiy ma'lumotlar va yosh hisobi</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Ism</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Familiya</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Tug'ilgan sana</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Oila roli</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as FamilyRole })}
                    className="w-full px-4 py-2.5 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm appearance-none"
                  >
                    {Object.values(FamilyRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Ajdodi (Otasi/Onasi)</label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                    className="w-full px-4 py-2.5 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
                  >
                    <option value="">Hech kim</option>
                    {otherMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.role})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Avlod darajasi</label>
                  <select
                    value={formData.generation}
                    onChange={(e) => setFormData({ ...formData, generation: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm"
                  >
                    {[3, 2, 1, 0, -1, -2, -3].map(g => (
                      <option key={g} value={g}>
                        {g > 0 ? `${g}-Ajdod` : g < 0 ? `${Math.abs(g)}-Avlod` : 'Asosiy'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-natural-sage uppercase tracking-widest">Hayoti haqida qisqacha...</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-natural-border rounded-lg focus:outline-none focus:ring-1 focus:ring-natural-dark text-sm resize-none"
                  placeholder="Inson haqida ma'lumot yozing..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-natural-dark text-white py-3 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-natural-taupe text-natural-dark rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-opacity-80 transition-all"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-natural-dark mb-1">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-natural-sage font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <Heart className="w-3 h-3 fill-current" />
                    {formData.role}
                  </p>
                </div>
                <div className="w-20 h-20 bg-natural-border rounded-2xl flex items-center justify-center shadow-inner">
                  <User className="w-10 h-10 text-natural-sage" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-natural-base p-5 rounded-xl border border-natural-border shadow-sm">
                  <p className="text-[10px] font-bold text-natural-sage uppercase tracking-widest mb-1.5">Tug'ilgan sana</p>
                  <p className="text-natural-dark text-lg font-bold">{formatDate(formData.birthDate)}</p>
                </div>
                <div className="bg-natural-base p-5 rounded-xl border border-natural-border shadow-sm">
                  <p className="text-[10px] font-bold text-natural-sage uppercase tracking-widest mb-1.5">Hozirgi yoshi</p>
                  <p className="text-natural-dark text-lg font-bold">{age !== null ? `${age} yosh` : 'Noma\'lum'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-natural-sage uppercase tracking-widest border-b border-natural-taupe pb-1">Hayot yo'li va ma'lumotlar</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap italic opacity-80">
                  {formData.bio || "Ushbu inson haqida hali ma'lumot qo'shilmagan."}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-2 bg-natural-dark text-white py-3 px-6 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-opacity-90 transition-all shadow-md"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Haqiqatan ham o'chirib tashlamoqchimisiz? (Crash)")) {
                      onDelete(formData.id);
                      onClose();
                    }
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Crash
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
