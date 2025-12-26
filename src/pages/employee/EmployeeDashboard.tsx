import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Flag, Target, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { SelfEvaluationModal } from '../../components/SelfEvaluationModal';

export const EmployeeDashboard = () => {
  const { currentUser, getEmployeeKPIs, cycles, submissions } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const kpis = getEmployeeKPIs(currentUser?.id || '');
  const activeCycle = cycles.find(c => c.status === 'active');

  const mySelfEval = submissions.find(s => s.evaluateeId === currentUser?.id && s.cycleId === activeCycle?.id && s.type === 'self');
  const isSelfEvalSubmitted = !!mySelfEval;

  // KPI Calculations
  const ownKPIs = kpis.filter(k => k.type === 'own');
  const sharedKPIs = kpis.filter(k => k.type === 'shared');
  
  const totalScore = kpis.reduce((acc, k) => acc + (k.score * k.weight / 100), 0);
  const convertedScore = totalScore * 0.75; // Out of 75

  const ownScore = ownKPIs.reduce((acc, k) => acc + (k.score * k.weight / 100), 0);
  const sharedScore = sharedKPIs.reduce((acc, k) => acc + (k.score * k.weight / 100), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Welcome & Context */}
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Hello, {currentUser?.name.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Here is your performance overview for the Current Strategy Cycle (2023-2026)</p>
      </header>
      
      {/* 2. Evaluation Timeline */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Evaluation Timeline (2025)
          </h2>
          <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
            Active Cycle: {activeCycle?.title}
          </span>
        </div>
        
        {/* CSS Timeline Visualization */}
        <div className="relative pt-8 pb-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 rounded-full -translate-y-1/2"></div>
          {/* Progress Bar (Mock at 60%) */}
          <div className="absolute top-1/2 left-0 w-[60%] h-1 bg-blue-500 rounded-full -translate-y-1/2"></div>
          
          <div className="relative flex justify-between z-10 text-sm">
            <TimelinePoint label="Strategy Start" date="Jan 2023" completed />
            <TimelinePoint label="2024 Review" date="Dec 2024" completed />
            <TimelinePoint label="Mid-Year 2025" date="July 2025" active />
            <TimelinePoint label="Annual 2025" date="Dec 2025" upcoming />
            <TimelinePoint label="Strategy End" date="Dec 2026" upcoming />
          </div>
        </div>
      </section>

      {/* 3. KPI Performance Section */}
      <section className="grid md:grid-cols-12 gap-6">
        {/* Main Score Card */}
        <div className="md:col-span-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700"></div>
          
          <h3 className="text-blue-100 font-medium mb-1">Total KPI Score</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-bold">{totalScore.toFixed(0)}</span>
            <span className="text-blue-200 mb-2 font-medium">/ 100</span>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-blue-100">Converted Contribution</span>
              <span className="text-2xl font-bold">{convertedScore.toFixed(1)} <span className="text-sm font-normal text-blue-200">/ 75</span></span>
            </div>
            <p className="text-xs text-blue-200 mt-2 opacity-80">
              *Your final KPI score accounts for 75% of your total evaluation.
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="md:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Performance Breakdown
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Own KPIs */}
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-700">Own KPIs (55%)</span>
                <span className="text-indigo-600 font-bold">{ownScore.toFixed(1)} pts</span>
              </div>
              <div className="space-y-3">
                {ownKPIs.map(kpi => (
                  <KPIMiniCard key={kpi.id} kpi={kpi} />
                ))}
              </div>
            </div>

            {/* Shared KPIs */}
            <div className="space-y-4">
               <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-700">Shared KPIs (45%)</span>
                <span className="text-indigo-600 font-bold">{sharedScore.toFixed(1)} pts</span>
              </div>
              <div className="space-y-3">
                {sharedKPIs.map(kpi => (
                  <KPIMiniCard key={kpi.id} kpi={kpi} shared />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Competency Status (Mid-Section) */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <Flag className="w-5 h-5 text-orange-500" />
          Competency Evaluation Status
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <StatusCard 
            title="Self Evaluation" 
            status={isSelfEvalSubmitted ? 'completed' : 'pending'} 
            description={isSelfEvalSubmitted ? "Submitted on " + format(new Date(mySelfEval?.submittedAt || ''), 'MMM d') : "Due by July 15th"}
            cta={!isSelfEvalSubmitted ? "Complete Now" : "View Submission"}
            onClick={() => !isSelfEvalSubmitted && setIsModalOpen(true)}
          />
          <StatusCard 
            title="Peer Review" 
            status="in-progress" 
            description="2 of 3 colleagues submitted"
          />
          <StatusCard 
            title="Supervisor Review" 
            status="upcoming" 
            description="Pending Self Eval"
          />
        </div>
      </section>

      {/* 5. Perf Insight (Bottom) */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 items-start">
        <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
        <div>
          <h4 className="font-medium text-slate-900">Performance Insight</h4>
          <p className="text-sm text-slate-600 mt-1">
            Your lowest performance area is <span className="font-semibold text-slate-800">Results Orientation (2.7/5)</span>, 
            mainly influenced by shared KPIs from the Sales & Marketing department.
          </p>
        </div>
      </section>

      <SelfEvaluationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cycleId={activeCycle?.id || ''}
      />
    </div>
  );
};

const TimelinePoint = ({ label, date, completed, active }: any) => (
  <div className="flex flex-col items-center gap-2 group cursor-default">
    <div className={`w-4 h-4 rounded-full border-2 z-10 transition-all ${
      completed ? 'bg-blue-500 border-blue-500' :
      active ? 'bg-white border-blue-500 ring-4 ring-blue-100' :
      'bg-slate-100 border-slate-300'
    }`}></div>
    <div className="text-center">
      <p className={`text-xs font-semibold ${active ? 'text-blue-600' : 'text-slate-600'}`}>{label}</p>
      <p className="text-[10px] text-slate-400">{date}</p>
    </div>
  </div>
);

const KPIMiniCard = ({ kpi, shared }: { kpi: any, shared?: boolean }) => (
  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all">
    <div className="flex justify-between items-start mb-1">
      <p className="text-sm font-medium text-slate-800 line-clamp-1" title={kpi.title}>{kpi.title}</p>
      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
        kpi.score >= 80 ? 'bg-green-100 text-green-700' :
        kpi.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>{kpi.score}%</span>
    </div>
    {shared && <p className="text-[10px] text-slate-400 mb-1">{kpi.department}</p>}
    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
      <div className="bg-slate-800 h-full rounded-full" style={{ width: `${kpi.score}%` }}></div>
    </div>
  </div>
);

const StatusCard = ({ title, status, description, cta, onClick }: any) => {
  const isPending = status === 'pending';
  const isDone = status === 'completed';
  
  return (
    <div className={`p-5 rounded-xl border transition-all ${
      isPending ? 'bg-orange-50/50 border-orange-200 hover:shadow-md cursor-pointer' : 
      'bg-white border-slate-200 opacity-80'
    }`} onClick={isPending ? onClick : undefined}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-slate-900">{title}</h4>
        {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
         isPending ? <AlertCircle className="w-5 h-5 text-orange-500" /> :
         <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
      </div>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      {cta && (
        <button className="w-full py-2 bg-white border border-orange-200 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-50 transition-colors">
          {cta}
        </button>
      )}
    </div>
  );
};
