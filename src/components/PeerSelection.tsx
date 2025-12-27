import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, CheckCircle2 } from 'lucide-react';
import type { User } from '../types';

interface PeerSelectionProps {
  cycleId: string;
}

export const PeerSelection: React.FC<PeerSelectionProps> = ({ }) => {
  const { users, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeers, setSelectedPeers] = useState<User[]>([]);

  const colleagues = users.filter(u => 
    u.id !== currentUser?.id && 
    u.role !== 'admin' &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const togglePeer = (user: User) => {
    if (selectedPeers.find(p => p.id === user.id)) {
      setSelectedPeers(selectedPeers.filter(p => p.id !== user.id));
    } else if (selectedPeers.length < 4) {
      setSelectedPeers([...selectedPeers, user]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Peer Selection</h3>
          <p className="text-sm text-slate-500 font-medium">Select up to 4 colleagues to provide feedback on your performance.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
          <span className="text-sm font-black text-indigo-600">{selectedPeers.length}/4 Selected</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {colleagues.map(user => {
          const isSelected = selectedPeers.find(p => p.id === user.id);
          return (
            <button
              key={user.id}
              onClick={() => togglePeer(user)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-4 text-left group ${
                isSelected 
                  ? 'bg-indigo-50 border-indigo-200' 
                  : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'
              }`}
            >
              <img src={user.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 font-bold uppercase truncate">{user.department}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-indigo-300'
              }`}>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
        <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
        <button 
          disabled={selectedPeers.length === 0}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          Confirm Nominees
        </button>
      </div>
    </div>
  );
};
