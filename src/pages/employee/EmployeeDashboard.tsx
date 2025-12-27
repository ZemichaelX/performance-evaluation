import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Target, TrendingUp, Clock, Activity, ArrowRight } from 'lucide-react';
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance <span className="text-indigo-600">Architecture</span></h1>
          <p className="text-slate-500 font-semibold mt-1">Reviewing: <span className="text-slate-900 font-bold">{activeCycle?.title}</span></p>
        </div>
        <div className="flex gap-4">
           {!selfSubmitted && (
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3"
             >
               Start Self-Evaluation
             </button>
           )}
           <button 
             onClick={() => setIsPeerSelectionOpen(true)}
             className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all"
           >
             Nominate Peers
           </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            <StatCard label="Pipeline Status" value={selfSubmitted ? "Submitted" : "Pending Action"} icon={<Clock className="text-orange-500" />} />
            <StatCard label="KPI Alignment" value="94.2%" icon={<Target className="text-indigo-500" />} />
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.02)]">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              Strategic Objectives
            </h2>
            
            <div className="space-y-6">
              {myObjectives.map(obj => (
                <div key={obj.id} className="p-8 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:border-indigo-100 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${obj.type === 'own' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                          {obj.type}
                        </span>
                        <span className="text-xs font-bold text-slate-400">Weight: {obj.weight}%</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{obj.title}</h3>
                      <p className="text-slate-500 font-semibold mt-1 text-sm">{obj.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {getObjectKPIs(obj.id).map(kpi => (
                      <div key={kpi.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl hover:border-indigo-50 transition-all">
                        <div>
                          <p className="text-sm font-black text-slate-900">{kpi.title}</p>
                          <p className="text-xs text-slate-400 font-bold mt-0.5">{kpi.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Target</p>
                          <p className="text-sm font-black text-indigo-600">85%+</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 blur-3xl rounded-full" />
             <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-4">Performance Score</h3>
             <div className="text-6xl font-black tracking-tighter mb-2">4.8</div>
             <p className="text-slate-400 text-sm font-bold">Top 5% of Department</p>
             <div className="w-full h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
                <div className="bg-indigo-400 h-full w-[96%] rounded-full shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
               <Activity className="w-5 h-5 text-indigo-600" />
               Critical Path
             </h3>
             <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
               <StatusItem label="Self Evaluation" status={selfSubmitted ? "completed" : "active"} />
               <StatusItem label="Peer Nomination" status="pending" />
               <StatusItem label="Final Review" status="locked" />
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

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const StatusItem = ({ label, status }: { label: string, status: 'completed' | 'active' | 'pending' | 'locked' }) => {
  const active = status === 'active';
  const completed = status === 'completed';
  const locked = status === 'locked';

  return (
    <div className={`flex items-center gap-6 pl-1 group transition-all`}>
      <div className={`w-4 h-4 rounded-full border-4 relative z-10 transition-all ${
        completed ? 'bg-green-500 border-green-100' : 
        active ? 'bg-indigo-600 border-indigo-100' : 
        'bg-white border-slate-100'
      }`}>
        {active && <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-20" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-black transition-colors ${locked ? 'text-slate-300' : 'text-slate-900'}`}>{label}</p>
        <p className={`text-xs font-black uppercase tracking-widest transition-colors ${
          completed ? 'text-green-500' : active ? 'text-indigo-600' : 'text-slate-400'
        }`}>
          {status}
        </p>
      </div>
      {!locked && !completed && <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />}
    </div>
  );
};
