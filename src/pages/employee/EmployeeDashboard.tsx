import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Target, TrendingUp, Clock, Activity, ArrowRight, Sparkles, Zap, ChevronDown, ChevronUp, AlertCircle, User, Calendar } from 'lucide-react';
import { EvaluationModal } from '../../components/EvaluationModal';

export const EmployeeDashboard = () => {
  const { currentUser, getEmployeeObjectives, getObjectKPIs, cycles, submissions } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isObjectivesExpanded, setIsObjectivesExpanded] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<{type: 'self' | 'peer' | 'supervisor' | 'subordinate', evaluateeId?: string} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const activeCycle = cycles.find(c => c.status === 'active');
  const myObjectives = currentUser && activeCycle ? getEmployeeObjectives(currentUser.id, activeCycle.id) : [];
  
  const mySubmissions = submissions.filter(s => s.evaluateeId === currentUser?.id && s.cycleId === activeCycle?.id);
  const selfSubmitted = mySubmissions.some(s => s.type === 'self');
  
  const pendingReviews = submissions.filter(s => s.evaluatorId === currentUser?.id && s.cycleId === activeCycle?.id && s.status === 'pending');
  const { users } = useStore();

  const handleStartEvaluation = (submission: any) => {
    setActiveEvaluation({ type: submission.type, evaluateeId: submission.evaluateeId });
    setIsModalOpen(true);
  };
  
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown User';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    const submissionId = params.get('submissionId');

    if (action === 'self' && !isModalOpen) {
      if (!selfSubmitted) {
         setActiveEvaluation({ type: 'self' });
         setIsModalOpen(true);
      }
    } else if (action === 'evaluate' && submissionId && !isModalOpen) {
      const submission = pendingReviews.find(s => s.id === submissionId);
      if (submission) {
        handleStartEvaluation(submission);
      }
    }
    
    // Clean up URL if we successfully acted
    if (action) {
       navigate('/employee/dashboard', { replace: true });
    }
  }, [location.search, pendingReviews, isModalOpen, selfSubmitted, navigate]);


  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header with Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-[48px] opacity-60 blur-3xl" />
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent tracking-tighter leading-tight">
              Strategize Architecture
            </h1>
            <p className="text-slate-600 font-semibold mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Reviewing: <span className="text-slate-900 font-black">{activeCycle?.title}</span>
            </p>
          </div>
          <div className="flex gap-4">
             {!selfSubmitted && (
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="relative group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-3xl font-black shadow-[0_20px_50px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                 <Zap className="w-5 h-5" />
                 Start Self-Evaluation
               </button>
             )}
          </div>
        </header>
      </div>

      {pendingReviews.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-100/50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Action Required</h2>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-full shadow-sm">{pendingReviews.length} Pending</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingReviews.map(review => (
              <div key={review.id} className="group relative bg-white border border-slate-200 p-6 rounded-[28px] hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{getUserName(review.evaluateeId)}</h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{review.type} Review</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100/50">
                    Due Soon
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Calendar className="w-4 h-4" />
                    <span>Cycle: {activeCycle?.title}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleStartEvaluation(review)}
                    className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Zap className="w-4 h-4 group-hover/btn:fill-current" />
                    Start Evaluation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Current Evaluation" 
          value={selfSubmitted ? "Submitted" : "Pending Action"} 
          icon={<Clock className="w-6 h-6" />}
          gradient="from-orange-500 to-amber-500"
          bgGradient="from-orange-50 to-amber-50"
        />
        <StatCard 
          label="KPI Score (out of 100%)" 
          value="86.0%" 
          subValue="64.5 / 75%"
          icon={<Target className="w-6 h-6" />}
          gradient="from-blue-600 to-purple-600"
          bgGradient="from-blue-50 to-purple-50"
        />
        <StatCard 
          label="Performance Score" 
          value="4.3" 
          icon={<Sparkles className="w-6 h-6" />}
          gradient="from-pink-500 to-rose-500"
          bgGradient="from-pink-50 to-rose-50"
        />
      </div>

          {/* Strategic Objectives - Enhanced Cards */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-[56px] opacity-20 blur-2xl" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-[48px] p-10 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
              <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent flex items-center gap-4 mb-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Strategic Objectives
              </h2>
              <button 
                onClick={() => setIsObjectivesExpanded(!isObjectivesExpanded)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label={isObjectivesExpanded ? "Collapse objectives" : "Expand objectives"}
              >
                {isObjectivesExpanded ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
              </button>
              </div>
              
              {!isObjectivesExpanded && (
                <div className="flex items-center gap-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                     <span className="text-sm font-bold text-slate-600">{myObjectives.length} Objectives</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200"></div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                     <span className="text-sm font-bold text-slate-600">
                        {Math.round(myObjectives.reduce((acc, obj) => {
                          const kpis = getObjectKPIs(obj.id);
                          return acc + (kpis.reduce((kAcc, k) => kAcc + k.score, 0) / kpis.length);
                        }, 0) / (myObjectives.length || 1))}% Avg. Achievement
                     </span>
                  </div>
                </div>
              )}
              
              {isObjectivesExpanded && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                {myObjectives.map(obj => (
                  <div 
                    key={obj.id} 
                    className="relative group p-8 bg-gradient-to-br from-slate-50/80 to-white/80 backdrop-blur-sm border border-slate-200/50 rounded-[32px] hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-[32px] transition-all duration-500" />
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                              obj.type === 'own' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
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
                            className="flex items-center justify-between p-5 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group/kpi"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-900">{kpi.title}</p>
                              <p className="text-xs text-slate-500 font-semibold mt-1">{kpi.description}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs text-slate-500 font-semibold mb-1">Achievement</p>
                                <p className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{kpi.score}%</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500 font-semibold mb-1">Weight</p>
                                <p className="text-lg font-black text-slate-900">{kpi.weight}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100/50">
                        <span className="text-xs font-bold text-blue-600">Sum Aggregate Alignment</span>
                        <span className="text-sm font-black text-blue-700">
                          KPI Sum: {getObjectKPIs(obj.id).reduce((acc, k) => acc + k.weight, 0)}% / Objective Total: {obj.weight}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-8">


          {/* Critical Path - Enhanced */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-[44px] opacity-30 blur-xl" />
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                Critical Path
              </h3>
              <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-purple-200 before:to-pink-200">
                <StatusItem 
                  label="Self Evaluation" 
                  status={selfSubmitted ? "completed" : "active"} 
                  onClick={() => setIsModalOpen(true)}
                />
                <StatusItem 
                  label="Peer Feedback" 
                  status="completed" 
                  onClick={() => navigate('/employee/history')}
                />
                <StatusItem 
                  label="Subordinate Feedback" 
                  status="pending" 
                  onClick={() => navigate('/employee/history')}
                />
                <StatusItem 
                  label="Supervisor Review" 
                  status="pending" 
                  onClick={() => navigate('/employee/history')}
                />
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
            onClose={() => {
              setIsModalOpen(false);
              setActiveEvaluation(null);
            }} 
            cycleId={activeCycle.id}
            type={activeEvaluation?.type || 'self'}
            evaluateeId={activeEvaluation?.evaluateeId}
          />
        </>
      )}
    </div>
  );
};

const StatCard = ({ label, value, subValue, icon, gradient, bgGradient }: any) => (
  <div className="relative group overflow-hidden h-full">
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-[32px] opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-300`} />
    <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex items-center gap-6 h-full">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 text-white flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-semibold mb-1 truncate">{label}</p>
        <p className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent tracking-tight leading-tight">{value}</p>
        {subValue && <p className="text-xs font-bold text-slate-400 mt-1 truncate">{subValue}</p>}
      </div>
    </div>
  </div>
);

const StatusItem = ({ label, status, onClick }: { label: string, status: 'completed' | 'active' | 'pending' | 'locked', onClick?: () => void }) => {
  const active = status === 'active';
  const completed = status === 'completed';
  const locked = status === 'locked';

  return (
    <div 
      onClick={!locked ? onClick : undefined}
      className={`flex items-center gap-6 pl-1 group transition-all ${!locked ? 'hover:translate-x-1 cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
    >
      <div className={`w-5 h-5 rounded-full border-4 relative z-10 transition-all shadow-lg ${
        completed ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-100 shadow-emerald-200' : 
        active ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-100 shadow-blue-200' : 
        'bg-white border-slate-200 shadow-slate-100'
      }`}>
        {active && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse" />
          </>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-black transition-colors ${locked ? 'text-slate-400' : 'text-slate-900'}`}>{label}</p>
        <p className={`text-xs font-semibold transition-colors ${
          completed ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-slate-400'
        }`}>
          {status === 'completed' ? 'Completed' : status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Locked'}
        </p>
      </div>
      {!locked && !completed && (
        <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
      )}
    </div>
  );
};
