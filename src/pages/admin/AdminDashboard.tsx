import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, Users, Clock, ArrowRight, CheckCircle2, AlertCircle, Activity, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';

export const AdminDashboard = () => {
  const { cycles, users, submissions } = useStore();
  const navigate = useNavigate();
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  const activeCycles = cycles.filter(c => c.status === 'active');
  const employees = users.filter((u: User) => u.role === 'employee');
  const selectedCycle = cycles.find(c => c.id === selectedCycleId);
  
  // Calculate accurate progress based on orchestration (Self + Peers + Supervisor)
  const totalSubmissionsExpected = activeCycles.reduce((acc) => {
    // For each evaluation, we expect: Evaluatees * (1 Self + ~3 Peers + 1 Supervisor)
    // Using a baseline of 5 expected entities per evaluatee for aggregate intelligence
    return acc + (employees.length * 5); 
  }, 0);
  
  const progress = totalSubmissionsExpected ? (submissions.length / totalSubmissionsExpected) * 100 : 0;

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
      {/* Hero Header with Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-[48px] opacity-60 blur-3xl" />
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent tracking-tight leading-tight">
              Admin Intelligence
            </h1>
            <p className="text-slate-600 font-semibold mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Operational command and strategic performance oversight
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin/create-evaluation')}
            className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-3xl font-black shadow-[0_20px_50px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Zap className="w-5 h-5" />
            Launch New Evaluation
          </button>
        </header>
      </div>

      {/* Glassmorphic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Live Evaluations" 
          value={activeCycles.length} 
          icon={<Clock className="w-6 h-6" />}
          gradient="from-orange-500 to-amber-500"
          bgGradient="from-orange-50 to-amber-50"
        />
        <StatCard 
          label="Workforce" 
          value={employees.length} 
          icon={<Users className="w-6 h-6" />}
          gradient="from-blue-500 to-cyan-500"
          bgGradient="from-blue-50 to-cyan-50"
        />
        <StatCard 
          label="Avg Progress" 
          value={`${progress.toFixed(1)}%`} 
          icon={<TrendingUp className="w-6 h-6" />}
          gradient="from-emerald-500 to-teal-500"
          bgGradient="from-emerald-50 to-teal-50"
        />
        <StatCard 
          label="Pipeline Latency" 
          value="2.1d" 
          icon={<Activity className="w-6 h-6" />}
          gradient="from-pink-500 to-rose-500"
          bgGradient="from-pink-50 to-rose-50"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8 space-y-10">
           <div className="flex items-center justify-between px-2">
             <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                 <Calendar className="w-6 h-6 text-white" />
               </div>
               Deployment Status
             </h2>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">Active Records Only</span>
           </div>

           <div className="grid gap-6">
             {activeCycles.length === 0 ? (
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-slate-100 to-slate-50 rounded-[44px] opacity-50 blur-xl" />
                  <div className="relative text-center py-20 bg-white/80 backdrop-blur-xl border border-dashed border-slate-200 rounded-[40px]">
                    <p className="text-slate-400 font-extrabold uppercase tracking-widest text-xs">No active performance protocols detected.</p>
                  </div>
                </div>
             ) : (
               activeCycles.map(cycle => (
                 <div key={cycle.id} className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-[44px] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                   <button 
                     onClick={() => setSelectedCycleId(cycle.id)}
                     className="relative w-full text-left bg-white/90 backdrop-blur-sm p-10 rounded-[40px] border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_20px_60px_rgba(99,102,241,0.15)] flex justify-between items-center overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
                     <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-4">
                          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {cycle.type}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200" />
                            <span className="text-[9px] font-black uppercase text-emerald-600">Live</span>
                          </div>
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">{cycle.title}</h3>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5" /> {cycle.startDate} — {cycle.endDate}
                       </p>
                     </div>
                     <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-slate-50 to-white rounded-3xl flex items-center justify-center group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-200 border border-slate-100 group-hover:border-transparent">
                       <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                     </div>
                   </button>
                 </div>
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
              action="launched department evaluation" 
              time="1d ago" 
              avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" 
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, gradient, bgGradient }: any) => (
  <div className="relative group overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-[32px] opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-300`} />
    <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-center gap-6">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">{value}</p>
      </div>
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
