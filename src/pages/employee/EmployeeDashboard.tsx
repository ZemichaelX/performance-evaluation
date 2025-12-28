import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Target, TrendingUp, Clock, Activity, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { EvaluationModal } from '../../components/EvaluationModal';

export const EmployeeDashboard = () => {
  const { currentUser, getEmployeeObjectives, getObjectKPIs, cycles, submissions } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCycle = cycles.find(c => c.status === 'active');
  const myObjectives = currentUser && activeCycle ? getEmployeeObjectives(currentUser.id, activeCycle.id) : [];
  
  const mySubmissions = submissions.filter(s => s.evaluateeId === currentUser?.id && s.cycleId === activeCycle?.id);
  const selfSubmitted = mySubmissions.some(s => s.type === 'self');

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header with Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-[48px] opacity-60 blur-3xl" />
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent tracking-tight leading-tight">
              Performance Architecture
            </h1>
            <p className="text-slate-600 font-semibold mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Reviewing: <span className="text-slate-900 font-black">{activeCycle?.title}</span>
            </p>
          </div>
          <div className="flex gap-4">
             {!selfSubmitted && (
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-3xl font-black shadow-[0_20px_50px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                 <Zap className="w-5 h-5" />
                 Start Self-Evaluation
               </button>
             )}
          </div>
        </header>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 space-y-10">
          <div className="flex gap-4">
        <StatCard 
          label="Pipeline Status" 
          value={selfSubmitted ? "Submitted" : "Pending Action"} 
          icon={<Clock className="w-6 h-6" />}
          gradient="from-orange-500 to-amber-500"
          bgGradient="from-orange-50 to-amber-50"
        />
        <StatCard 
          label="KPI Alignment" 
          value="86.0%" 
          icon={<Target className="w-6 h-6" />}
          gradient="from-indigo-600 to-purple-600"
          bgGradient="from-indigo-50 to-purple-50"
        />
      </div>

          {/* Strategic Objectives - Enhanced Cards */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-[56px] opacity-20 blur-2xl" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-[48px] p-10 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
              <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Strategic Objectives
              </h2>
              
              <div className="space-y-6">
                {myObjectives.map(obj => (
                  <div 
                    key={obj.id} 
                    className="relative group p-8 bg-gradient-to-br from-slate-50/80 to-white/80 backdrop-blur-sm border border-slate-200/50 rounded-[32px] hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-[32px] transition-all duration-500" />
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                              obj.type === 'own' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            }`}>
                              {obj.type === 'own' ? 'Personal' : 'Shared'}
                            </span>
                            <span className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-bold text-slate-600 border border-slate-200/50">
                              Weight: {obj.weight}%
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{obj.title}</h3>
                          <p className="text-slate-600 font-semibold mt-2 text-sm">{obj.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 mb-6">
                        {getObjectKPIs(obj.id).map(kpi => (
                          <div 
                            key={kpi.id} 
                            className="flex items-center justify-between p-5 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group/kpi"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-900">{kpi.title}</p>
                              <p className="text-xs text-slate-500 font-semibold mt-1">{kpi.description}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs text-slate-500 font-semibold mb-1">Achievement</p>
                                <p className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{kpi.score}%</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500 font-semibold mb-1">Weight</p>
                                <p className="text-lg font-black text-slate-900">{kpi.weight}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50">
                        <span className="text-xs font-bold text-indigo-600">Sum Aggregate Alignment</span>
                        <span className="text-sm font-black text-indigo-700">
                          KPI Sum: {getObjectKPIs(obj.id).reduce((acc, k) => acc + k.weight, 0)}% / Objective Total: {obj.weight}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-8">
          {/* Performance Score - Premium Dark Card */}
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-[40px]" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-30 blur-3xl rounded-full group-hover:opacity-50 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-600 opacity-20 blur-3xl rounded-full" />
            
            <div className="relative p-8 text-white">
              <h3 className="text-sm font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Performance Score
              </h3>
              <div className="text-7xl font-black tracking-tighter mb-2 bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent">4.3</div>
              <p className="text-slate-300 text-sm font-bold">Top 14% of Department</p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-8 overflow-hidden backdrop-blur-sm">
                 <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 h-full w-[86%] rounded-full shadow-[0_0_20px_rgba(129,140,248,0.6)]" />
              </div>
            </div>
          </div>

          {/* Critical Path - Enhanced */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-[44px] opacity-30 blur-xl" />
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                Critical Path
              </h3>
              <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-200 before:via-purple-200 before:to-pink-200">
                <StatusItem label="Self Evaluation" status={selfSubmitted ? "completed" : "active"} />
                <StatusItem label="Peer Feedback" status="pending" />
                <StatusItem label="Final Review" status="locked" />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {activeCycle && (
        <>
          <EvaluationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            cycleId={activeCycle.id}
          />
        </>
      )}
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
        <p className="text-slate-500 text-sm font-semibold mb-1">{label}</p>
        <p className="text-3xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">{value}</p>
      </div>
    </div>
  </div>
);

const StatusItem = ({ label, status }: { label: string, status: 'completed' | 'active' | 'pending' | 'locked' }) => {
  const active = status === 'active';
  const completed = status === 'completed';
  const locked = status === 'locked';

  return (
    <div className={`flex items-center gap-6 pl-1 group transition-all cursor-pointer ${!locked ? 'hover:translate-x-1' : ''}`}>
      <div className={`w-5 h-5 rounded-full border-4 relative z-10 transition-all shadow-lg ${
        completed ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-100 shadow-emerald-200' : 
        active ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-100 shadow-indigo-200' : 
        'bg-white border-slate-200 shadow-slate-100'
      }`}>
        {active && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-ping opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full animate-pulse" />
          </>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-black transition-colors ${locked ? 'text-slate-400' : 'text-slate-900'}`}>{label}</p>
        <p className={`text-xs font-semibold transition-colors ${
          completed ? 'text-emerald-600' : active ? 'text-indigo-600' : 'text-slate-400'
        }`}>
          {status === 'completed' ? 'Completed' : status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Locked'}
        </p>
      </div>
      {!locked && !completed && (
        <ArrowRight className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
      )}
    </div>
  );
};
