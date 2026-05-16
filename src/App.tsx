/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, TreeDeciduous, Info, Users, ArrowUp, ArrowDown, Trash2, Save, Upload } from 'lucide-react';
import { FamilyMember, FamilyRole } from './types';
import { MemberCard } from './components/MemberCard';
import { MemberProfile } from './components/MemberProfile';
import { AddMemberModal } from './components/AddMemberModal';
import { CrashModal } from './components/CrashModal';

// Initial dummy data to show the capabilities
const INITIAL_MEMBERS: FamilyMember[] = [];

export default function App() {
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('shajara_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAddingInModal, setIsAddingInModal] = useState(false);
  const [isCrashingModalOpen, setIsCrashingModalOpen] = useState(false);
  const [maxGenerations, setMaxGenerations] = useState(7);
  const [maxChildren, setMaxChildren] = useState(6);

  useEffect(() => {
    localStorage.setItem('shajara_members', JSON.stringify(members));
  }, [members]);

  const generations = useMemo(() => {
    // 1. First, filter by generation range relative to 0
    // Example: If maxGenerations is 5, we show -2, -1, 0, 1, 2
    const offset = Math.floor(maxGenerations / 2);
    const minGen = -offset;
    const maxGen = maxGenerations % 2 === 0 ? offset - 1 : offset;
    
    let filteredMembers = members.filter(m => m.generation >= minGen && m.generation <= maxGen);

    // 2. Filter children per parent based on maxChildren
    // Group by parentId to count
    const parentChildrenCount: { [key: string]: number } = {};
    
    filteredMembers = filteredMembers.filter(m => {
      if (!m.parentId) return true; // Top-level members always show
      
      const count = parentChildrenCount[m.parentId] || 0;
      if (count < maxChildren) {
        parentChildrenCount[m.parentId] = count + 1;
        return true;
      }
      return false;
    });

    // 3. Group the remaining members into generation layers
    const groups: { [key: number]: FamilyMember[] } = {};
    filteredMembers.forEach(m => {
      if (!groups[m.generation]) groups[m.generation] = [];
      groups[m.generation].push(m);
    });

    // Sort generations descending (Ajdodlar tepada)
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [members, maxGenerations, maxChildren]);

  const handleUpdateMember = (updated: FamilyMember) => {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    setSelectedMember(updated);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => {
      const filtered = prev.filter(m => m.id !== id);
      return filtered;
    });
    if (selectedMember?.id === id) {
      setSelectedMember(null);
    }
  };

  const onAddMemberFinal = (newMember: FamilyMember) => {
    setMembers(prev => [...prev, newMember]);
    setIsAddingInModal(false);
  };

  const handleSave = () => {
    if (members.length === 0) {
      alert("Saqlash uchun ma'lumot yo'q!");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `shajara_malumotlari_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedMembers = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedMembers)) {
          if (window.confirm("Mavjud barcha ma'lumotlar o'chiriladi va yangi shajara yuklanadi. Rozimisiz?")) {
            setMembers(importedMembers);
          }
        } else {
          alert("Noto'g'ri fayl formati!");
        }
      } catch (err) {
        alert("Faylni o'qishda xatolik yuz berdi!");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="relative min-h-screen bg-natural-base flex flex-col font-shrikhand selection:bg-natural-taupe selection:text-natural-dark border-8 border-natural-border overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSIjNUE1QTQwIiBmaWxsLW9wYWNpdHk9IjAuNCI+PHBhdGggZD0iTTAgMGgxMHYxMEgwem0xMCAxMGgxMHYxMEgxMHoiLz48L2c+PC9zdmc+")` }}
      />

      {/* Header */}
      <header className="relative z-20 min-h-[5rem] py-4 bg-natural-dark flex flex-wrap items-center justify-between px-8 text-white shrink-0 shadow-lg gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-natural-sage rounded-full flex items-center justify-center">
            <TreeDeciduous className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mening Shajaram</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-[10px] uppercase font-bold opacity-60">Avlodlar:</span>
            <select 
              value={maxGenerations} 
              onChange={(e) => setMaxGenerations(Number(e.target.value))}
              className="bg-transparent text-sm font-bold outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <option key={n} value={n} className="text-natural-dark">{n} ta</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-[10px] uppercase font-bold opacity-60">Farzandlar:</span>
            <select 
              value={maxChildren} 
              onChange={(e) => setMaxChildren(Number(e.target.value))}
              className="bg-transparent text-sm font-bold outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n} className="text-natural-dark">{n} ta</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              title="Shajarani saqlash (JSON)"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white border border-white/20 active:scale-95"
            >
              <Save className="w-5 h-5" />
            </button>
            <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white border border-white/20 active:scale-95 cursor-pointer">
              <Upload className="w-5 h-5" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <div className="h-8 w-px bg-white/10 mx-1" />
            <button 
              onClick={() => setIsAddingInModal(true)}
              className="flex items-center gap-2 bg-natural-sage px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Qo'shish
            </button>
            <button 
              onClick={() => setIsCrashingModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-md active:scale-95 text-white"
            >
              <Trash2 className="w-4 h-4" />
              Crash
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-12 scrollbar-hide">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-24">
            {generations.map(([gen, genMembers], idx) => (
              <div key={gen} className="relative w-full flex flex-col items-center">
                <div className="mb-6 text-center">
                   <h2 className="text-natural-dark text-[10px] uppercase tracking-[0.3em] font-black border-b border-natural-taupe pb-1 px-4 inline-block">
                    {Number(gen) > 0 ? `${Math.abs(Number(gen))}-Avlod (Ajdod)` : 
                     Number(gen) < 0 ? `${Math.abs(Number(gen))}-Avlod (Avlod)` : 
                     'Markaziy Avlod'}
                  </h2>
                </div>
                
                <div className="flex flex-wrap justify-center gap-10">
                  {genMembers.map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      onClick={setSelectedMember} 
                    />
                  ))}
                </div>

                {/* Connector line between generations */}
                {idx < generations.length - 1 && (
                  <div className="w-0.5 h-16 bg-natural-taupe mt-12 mb-[-3rem]" />
                )}
              </div>
            ))}

            {/* Empty State */}
            {members.length === 0 && (
              <div className="text-center py-24 px-12 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-natural-border shadow-2xl max-w-md mx-auto">
                <Users className="w-16 h-16 text-natural-sage mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-serif font-bold text-natural-dark mb-2">Shajara Bo'sh</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-8 leading-relaxed">
                  Oila tarixingizni yozishni boshlang. Birinchi bo'lib o'z ismingizni kiriting.
                </p>
                <button
                  onClick={() => setIsAddingInModal(true)}
                  className="w-full py-4 bg-natural-sage text-white rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-natural-dark transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                >
                  <Plus className="w-6 h-6" />
                  Ism Yozish (Boshlash)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 h-12 bg-[#F5F2EA] border-t border-natural-border flex items-center px-8 text-[10px] text-gray-400 uppercase tracking-[0.2em] justify-between shrink-0">
        <div>&copy; 2026 Shajara - 5 Avlod Tarixi</div>
        <div className="flex items-center gap-4">
          <span>Tizim holati: Faol</span>
        </div>
      </footer>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberProfile 
            member={selectedMember} 
            members={members}
            onClose={() => setSelectedMember(null)}
            onUpdate={handleUpdateMember}
            onDelete={handleDeleteMember}
          />
        )}
      </AnimatePresence>
      {/* Add Member Modal */}
      <AnimatePresence>
        {isAddingInModal && (
          <AddMemberModal 
            onClose={() => setIsAddingInModal(false)}
            onAdd={onAddMemberFinal}
            members={members}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCrashingModalOpen && (
          <CrashModal 
            members={members}
            onClose={() => setIsCrashingModalOpen(false)}
            onDelete={handleDeleteMember}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

