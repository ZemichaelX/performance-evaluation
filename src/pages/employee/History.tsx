import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, User, Users, UserCheck, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const EvaluationHistory = () => {
  const { currentUser, submissions, cycles } = useStore();
  const [activeTab, setActiveTab] = useState<'self' | 'peer' | 'supervisor'>('self');

  const mySubmissions = submissions.filter(s => s.evaluateeId === currentUser?.id && s.type === activeTab);
  
  const groupedByCycle = cycles.reduce((acc: any, cycle) => {
    const cycleSubmissions = mySubmissions.filter(s => s.cycleId === cycle.id);
    if (cycleSubmissions.length > 0) {
      acc.push({ ...cycle, items: cycleSubmissions });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Evaluation History</h1>
          <p className="text-slate-500 font-semibold tracking-tight">Access your full performance architecture and historical feedback.</p>
        </div>

        <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
          <TabButton 
            active={activeTab === 'self'} 
            onClick={() => setActiveTab('self')} 
            icon={<User className="w-4 h-4" />} 
            label="Self" 
          />
          <TabButton 
            active={activeTab === 'peer'} 
            onClick={() => setActiveTab('peer')} 
            icon={<Users className="w-4 h-4" />} 
            label="Peers" 
          />
          <TabButton 
            active={activeTab === 'supervisor'} 
            onClick={() => setActiveTab('supervisor')} 
            icon={<UserCheck className="w-4 h-4" />} 
            label="Supervisor" 
          />
        </div>
      </header>

      <div className="space-y-16">
        {groupedByCycle.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Historical Records Void</h3>
            <p className="text-slate-400 font-semibold mt-2">No {activeTab} evaluations were found in the historical database.</p>
          </div>
        ) : (
          groupedByCycle.map((group: any) => (
            <div key={group.id} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                 <div className="h-0.5 flex-1 bg-slate-50"></div>
                 <div className="flex items-center gap-3">
                   <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-[0.2em]">{group.title}</h2>
                   <span className="text-[12px] font-extrabold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg uppercase">
                     {group.type}
                   </span>
                 </div>
                 <div className="h-0.5 flex-1 bg-slate-50"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {group.items.map((sub: any) => (
                  <div key={sub.id} className="bg-white p-8 rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                            Authenticated Record
                          </span>
                        </div>
                        <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Evaluation Feedback</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">
                          Processed on {sub.submittedAt ? format(new Date(sub.submittedAt), 'MMMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50/50 rounded-2xl text-center min-w-[80px]">
                        <p className="text-xs text-indigo-400 uppercase font-extrabold tracking-widest mb-1">Score</p>
                        <p className="text-2xl font-extrabold text-indigo-600 tracking-tighter">
                          {(sub.scores.reduce((a: any, b: any) => a + b.score, 0) / sub.scores.length).toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Competency Assessment</p>
                        <div className="grid gap-4">
                          {sub.scores.map((score: any, idx: number) => {
                            const framework = useStore.getState().competencyFrameworks.find(f => f.questions.some(q => q.id === score.questionId));
                            const question = framework?.questions.find(q => q.id === score.questionId);
                            
                            return (
                              <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                  <span className="text-[11px] text-slate-700 font-bold leading-tight">
                                    {question?.text || `Metric Identifier ${idx + 1}`}
                                  </span>
                                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase shrink-0">
                                    {question?.category || 'Strategic'}
                                  </span>
                                </div>
                                <div className="flex gap-1.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <div 
                                      key={s} 
                                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                        s <= score.score 
                                          ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]' 
                                          : 'bg-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Qualitative Findings */}
                      {sub.improvementAreas && (
                        <div className="pt-6 border-t border-slate-50 space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4. Priority Improvement Areas</p>
                          <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100/50 text-slate-600 font-bold text-xs leading-relaxed italic">
                            "{sub.improvementAreas}"
                          </div>
                        </div>
                      )}

                      {sub.nextGoals && (
                        <div className="pt-6 border-t border-slate-50 space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5. Goals For Next Review</p>
                          <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50 text-slate-600 font-bold text-xs leading-relaxed italic">
                            "{sub.nextGoals}"
                          </div>
                        </div>
                      )}

                      {sub.employeeComments && (
                        <div className="pt-6 border-t border-slate-50 space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">6. Employee Comments</p>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-600 font-bold text-xs leading-relaxed">
                            {sub.employeeComments}
                          </div>
                        </div>
                      )}

                      {sub.signatures && (
                        <div className="pt-6 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">7. Authentication Signatures</p>
                          <div className="grid grid-cols-2 gap-3">
                            {sub.signatures.employee && (
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Employee</p>
                                <p className="text-[11px] font-black text-slate-900 border-b border-slate-200 pb-1 italic font-serif">{sub.signatures.employee}</p>
                              </div>
                            )}
                            {sub.signatures.supervisor && (
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Supervisor</p>
                                <p className="text-[11px] font-black text-slate-900 border-b border-slate-200 pb-1 italic font-serif">{sub.signatures.supervisor}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
      active 
        ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' 
        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
    }`}
  >
    {icon}
    {label}
  </button>
);
