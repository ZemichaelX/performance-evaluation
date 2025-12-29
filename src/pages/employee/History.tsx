import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { User, Users, UserCheck, ChevronRight, ArrowLeft, BarChart3, Clock } from 'lucide-react';

export const EvaluationHistory = () => {
  const { currentUser, submissions, cycles, users } = useStore();
  const [viewState, setViewState] = useState<'cycles' | 'evaluators' | 'details'>('cycles');
  const [selectedCycle, setSelectedCycle] = useState<any | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  // 1. Get all submissions for current user across ALL types
  const myAllSubmissions = submissions.filter(s => s.evaluateeId === currentUser?.id);

  // 2. Group by Cycle for the Top Level View
  const cyclesWithData = cycles.reduce((acc: any[], cycle) => {
    const cycleSubmissions = myAllSubmissions.filter(s => s.cycleId === cycle.id);
    if (cycleSubmissions.length > 0) {
      acc.push({ ...cycle, items: cycleSubmissions });
    }
    return acc;
  }, []);

  const handleCycleClick = (cycle: any) => {
    setSelectedCycle(cycle);
    setViewState('evaluators');
  };

  const handleSubmissionClick = (submission: any) => {
    setSelectedSubmission(submission);
    setViewState('details');
  };

  const handleBack = () => {
    if (viewState === 'details') {
      setViewState('evaluators');
      setSelectedSubmission(null);
    } else if (viewState === 'evaluators') {
      setViewState('cycles');
      setSelectedCycle(null);
    }
  };

  const getEvaluatorName = (evaluatorId: string, type: string) => {
    if (type === 'self') return 'Self Evaluation';
    const evaluator = users.find(u => u.id === evaluatorId);
    return evaluator ? evaluator.name : 'Unknown Evaluator';
  };

  const calculateAverage = (scores: any[]) => {
    if (!scores || scores.length === 0) return 0;
    return (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1);
  };

  const getQuestionText = (qId: string) => {
    const framework = useStore.getState().competencyFrameworks.find(f => f.questions.some(q => q.id === qId));
    return framework?.questions.find(q => q.id === qId)?.text || 'Question text unavailable';
  };

  // Render Level 1: Cycle Cards
  if (viewState === 'cycles') {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Evaluation Records</h1>
           <p className="text-slate-500 font-semibold tracking-tight">Select a cycle to view detailed feedback from all sources.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cyclesWithData.map((cycle) => {
             // Smart Cycle Overview Stats
             const avgScore = (cycle.items.reduce((acc: number, item: any) => acc + Number(calculateAverage(item.scores)), 0) / cycle.items.length).toFixed(1);
             const uniqueSources = new Set(cycle.items.map((i: any) => i.type)).size;

             return (
              <button 
                key={cycle.id}
                onClick={() => handleCycleClick(cycle)}
                className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:border-blue-100 hover:shadow-[0_40px_80px_-12px_rgba(56,56,236,0.2)] hover:-translate-y-2 transition-all duration-500 group text-left relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
                  <ChevronRight className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider mb-4 inline-block ${
                       cycle.type === 'annual' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {cycle.type}
                    </span>
                    <h3 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2 pr-8">{cycle.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(cycle.startDate).getFullYear()} Cycle
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t-2 border-slate-50 pt-8">
                   <div className="text-center px-4 border-r-2 border-slate-50 w-1/3">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Feedback Sources</p>
                      <p className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
                        <Users className="w-5 h-5 text-slate-300" /> {uniqueSources}
                      </p>
                   </div>
                   <div className="text-center px-4 border-r-2 border-slate-50 w-1/3">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Total Reports</p>
                      <p className="text-2xl font-black text-slate-900">{cycle.items.length}</p>
                   </div>
                   <div className="text-center px-4 w-1/3">
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1.5">Avg Rating</p>
                      <p className="text-2xl font-black text-blue-600">{avgScore}</p>
                   </div>
                </div>
              </button>
             );
          })}
        </div>
      </div>
    );
  }

  // Render Level 2: Evaluator List (Grouped Tables)
  if (viewState === 'evaluators' && selectedCycle) {
    // Categorize submissions for the list
    const selfEval = selectedCycle.items.filter((s: any) => s.type === 'self');
    const peerEvals = selectedCycle.items.filter((s: any) => s.type === 'peer');
    const supervisorEvals = selectedCycle.items.filter((s: any) => s.type === 'supervisor');
    const subordinateEvals = selectedCycle.items.filter((s: any) => s.type === 'subordinate');

    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cycles
        </button>

        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-200/60 pb-8">
           <div>
             <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider mb-2 inline-block ${
                 selectedCycle.type === 'annual' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
             }`}>
                {selectedCycle.type}
             </span>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedCycle.title}</h2>
           </div>
           
           <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Reports</p>
                <p className="text-lg font-black text-slate-900">{selectedCycle.items.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Avg Score</p>
                <p className="text-lg font-black text-blue-600">
                  {(selectedCycle.items.reduce((acc: number, item: any) => acc + Number(calculateAverage(item.scores)), 0) / selectedCycle.items.length).toFixed(1)}
                </p>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           {/* Self Section */}
           {selfEval.length > 0 && (
             <SectionTable title="Self Evaluation" items={selfEval} onSelect={handleSubmissionClick} icon={<User className="w-4 h-4 text-blue-600" />} />
           )}
           
           {/* Supervisor Section */}
           {supervisorEvals.length > 0 && (
             <SectionTable title="Supervisor Reviews" items={supervisorEvals} onSelect={handleSubmissionClick} icon={<UserCheck className="w-4 h-4 text-blue-600" />} />
           )}

           {/* Peers Section */}
           {peerEvals.length > 0 && (
             <SectionTable title="Peer Reviews" items={peerEvals} onSelect={handleSubmissionClick} icon={<Users className="w-4 h-4 text-blue-600" />} />
           )}
           
           {/* Subordinates Section */}
           {subordinateEvals.length > 0 && (
             <SectionTable title="Subordinate Reviews" items={subordinateEvals} onSelect={handleSubmissionClick} icon={<Users className="w-4 h-4 text-blue-600" />} />
           )}
        </div>
      </div>
    );
  }

  // Render Level 3: Details View (Reusing the modal content as a full view)
  if (viewState === 'details' && selectedSubmission) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
         <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to List
        </button>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center bg-slate-50/50 gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-100">
                   <span className="text-2xl font-black">{calculateAverage(selectedSubmission.scores)}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{getEvaluatorName(selectedSubmission.evaluatorId, selectedSubmission.type)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                      {selectedSubmission.type}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">
                      Evaluated on {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 md:p-12 space-y-12">
                {/* Scores Grid */}
                <div>
                  <h4 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Performance Metrics
                  </h4>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
                    {selectedSubmission.scores.map((score: any, idx: number) => (
                      <div key={idx} className="space-y-5">
                         <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-slate-700 leading-snug pr-4">
                              {getQuestionText(score.questionId)}
                            </p>
                            <span className="text-lg font-black text-slate-900">{score.score}</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${(score.score / 5) * 100}%` }}
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualitative Sections */}
                <div className="grid md:grid-cols-2 gap-8">
                    {selectedSubmission.improvementAreas && (
                      <div className="bg-amber-50 p-8 rounded-[24px] border border-amber-100/50">
                        <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">Priority Improvement Areas</h4>
                        <p className="text-slate-700 text-sm font-bold leading-relaxed italic">
                          "{selectedSubmission.improvementAreas}"
                        </p>
                      </div>
                    )}

                    {selectedSubmission.nextGoals && (
                      <div className="bg-blue-50 p-8 rounded-[24px] border border-blue-100/50">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Goals for Next Cycle</h4>
                        <p className="text-slate-700 text-sm font-bold leading-relaxed italic">
                          "{selectedSubmission.nextGoals}"
                        </p>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return null;
};

// Helper used for each section table
const SectionTable = ({ title, items, onSelect, icon }: any) => {
  const { users } = useStore();
  
  const getName = (id: string, type: string) => {
    if (type === 'self') return 'Self Evaluation';
    return users.find((u:any) => u.id === id)?.name || 'Unknown';
  };

  const calculateAv = (scores: any[]) => (scores.reduce((a: number, b: any) => a + b.score, 0) / scores.length).toFixed(1);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">{icon}</div>
          <h4 className="text-xs font-black text-black uppercase tracking-widest">{title}</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest w-1/3">Evaluator</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelect(item)}
                  className="group odd:bg-white even:bg-[#ECECFF] hover:brightness-95 transition-all cursor-pointer border-b border-slate-50/50 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {item.type === 'self' ? 'ME' : getName(item.evaluatorId, item.type).charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{getName(item.evaluatorId, item.type)}</p>
                        <p className="text-[10px] font-bold text-slate-400 capitalize bg-white/50 px-1 rounded inline-block mt-0.5">{item.type} Review</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white border border-slate-100 shadow-sm ${
                        item.status === 'submitted' ? 'text-green-600' : 'text-amber-600'
                     }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'submitted' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        {item.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-slate-900">{calculateAv(item.scores)}</span>
                    <span className="text-[10px] font-bold text-slate-300 ml-1">/ 5.0</span>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};
