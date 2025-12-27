import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Calendar, Users, BarChart3, Clock, ArrowRight, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';

export const AdminDashboard = () => {
  const { cycles, users, submissions } = useStore();
  const navigate = useNavigate();
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  const activeCycles = cycles.filter(c => c.status === 'active');
  const employees = users.filter((u: User) => u.role === 'employee');
  const selectedCycle = cycles.find(c => c.id === selectedCycleId);
  
  const totalExpected = activeCycles.length * employees.length;
  const progress = totalExpected ? (submissions.length / totalExpected) * 100 : 0;

  if (selectedCycleId && selectedCycle) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedCycleId(null)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Intelligence Dashboard
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{selectedCycle.title}</h1>
            <p className="text-slate-500 font-semibold tracking-tight">Real-time engagement telemetry and audit logs.</p>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Export Analytics
          </button>
        </header>

        <div className="bg-white border border-slate-100 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-wider text-slate-400">Collaborator Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Self Audit</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Peer Reviews</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Supervisor</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map(emp => {
                const sub = submissions.filter(s => s.evaluateeId === emp.id && s.cycleId === selectedCycle.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={emp.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{emp.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{emp.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {sub.some(s => s.type === 'self') ? (
                        <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" /> Finalized
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-300 font-black text-xs uppercase tracking-widest">
                          <Clock className="w-4 h-4" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full transition-all duration-1000" 
                            style={{ width: `${(sub.filter(s => s.type === 'peer').length / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase">
                          {sub.filter(s => s.type === 'peer').length}/4
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {sub.some(s => s.type === 'supervisor') ? (
                         <div className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest">
                           <CheckCircle2 className="w-4 h-4" /> Audited
                         </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-300 font-black text-xs uppercase tracking-widest">
                          <AlertCircle className="w-4 h-4" /> Awaiting
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 underline-offset-4 hover:underline">
                        Nudge Entity
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-indigo-600">Intelligence</span></h1>
          <p className="text-slate-500 font-semibold tracking-tight mt-1">Operational command and strategic performance oversight.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-cycle')}
          className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 transform active:scale-95"
        >
          <Plus className="w-6 h-6" /> Launch New Cycle
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Live Cycles" value={activeCycles.length} icon={<Clock className="text-orange-500" />} />
        <StatCard label="Workforce" value={employees.length} icon={<Users className="text-blue-500" />} />
        <StatCard label="Avg Progress" value={`${progress.toFixed(1)}%`} icon={<BarChart3 className="text-green-500" />} />
        <StatCard label="Pipeline Latency" value="2.1d" icon={<Activity className="text-pink-500" />} />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8 space-y-10">
           <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                 <Calendar className="w-6 h-6 text-slate-400" />
               </div>
               Deployment Status
             </h2>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Active Records Only</span>
           </div>

           <div className="grid gap-6">
             {activeCycles.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[40px]">
                  <p className="text-slate-400 font-extrabold uppercase tracking-widest text-xs">No active performance protocols detected.</p>
                </div>
             ) : (
               activeCycles.map(cycle => (
                 <button 
                   key={cycle.id} 
                   onClick={() => setSelectedCycleId(cycle.id)}
                   className="w-full text-left bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.03)] flex justify-between items-center group relative overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700" />
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-4">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {cycle.type}
                        </span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{cycle.title}</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-3 h-3" /> {cycle.startDate} — {cycle.endDate}
                     </p>
                   </div>
                   <div className="relative z-10 w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-100">
                     <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                   </div>
                 </button>
               ))
             )}
           </div>
        </section>

        <aside className="lg:col-span-4 space-y-10">
          <h2 className="text-2xl font-black text-slate-900 px-2">Operational Event Stream</h2>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10 relative">
            <div className="absolute left-10 top-16 bottom-16 w-px bg-slate-50" />
            
            <ActivityItem 
              user="Alex Rivera" 
              action="finalized self-audit" 
              time="2h ago" 
              avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
            />
            <ActivityItem 
              user="Sarah Chen" 
              action="committed peer reviews" 
              time="5h ago" 
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
            />
            <ActivityItem 
              user="Marcus Thorne" 
              action="launched department cycle" 
              time="1d ago" 
              avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" 
            />
          </div>

          <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 blur-3xl rounded-full" />
            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-6">System Health</h3>
            <div className="space-y-6">
              <HealthMetric label="API Response" value="124ms" />
              <HealthMetric label="Sync Status" value="Live" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex items-center gap-6 group hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
        className: `w-7 h-7 ${(icon as React.ReactElement<{ className?: string }>).props.className || ''}` 
      })}
    </div>
    <div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ user, action, time, avatar }: any) => (
  <div className="flex gap-6 relative z-10 transition-all hover:translate-x-1 group">
    <img src={avatar} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-4 ring-white" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 leading-tight">
        <span className="font-black text-indigo-600">{user}</span> {action}
      </p>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1.5">{time}</p>
    </div>
  </div>
);

const HealthMetric = ({ label, value }: any) => (
  <div className="flex items-center justify-between">
    <p className="text-sm font-bold text-slate-400">{label}</p>
    <div className="flex items-center gap-3">
      <span className="text-sm font-black text-white">{value}</span>
      <div className="w-2 h-2 bg-green-500 rounded-full" />
    </div>
  </div>
);
