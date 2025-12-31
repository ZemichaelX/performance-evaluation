import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleId: string;
  type?: 'self' | 'peer' | 'supervisor' | 'subordinate';
  evaluateeId?: string;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ 
  isOpen, 
  onClose, 
  cycleId, 
  type = 'self',
  evaluateeId 
}) => {
  const { submitEvaluation, currentUser, competencyFrameworks } = useStore();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [improvementAreas, setImprovementAreas] = useState('');
  const [nextGoals, setNextGoals] = useState('');
  const [employeeComments, setEmployeeComments] = useState('');
  const [signatures, setSignatures] = useState({ employee: '', supervisor: '', ceo: '', date: new Date().toISOString().split('T')[0] });

  const allQuestions = competencyFrameworks.flatMap(f => f.questions);

  useEffect(() => {
    if (isOpen) {
      setScores({});
      setImprovementAreas('');
      setNextGoals('');
      setEmployeeComments('');
      setSignatures({ employee: '', supervisor: '', ceo: '', date: new Date().toISOString().split('T')[0] });
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScoreChange = (qId: string, value: number) => {
    setScores(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(scores).length < allQuestions.length) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitEvaluation({
        id: `sub-${Date.now()}`,
        evaluatorId: currentUser?.id || '',
        evaluateeId: evaluateeId || currentUser?.id || '',
        cycleId,
        type,
        status: 'submitted',
        scores: Object.entries(scores).map(([k, v]) => ({ questionId: k, score: v })),
        improvementAreas,
        nextGoals,
        employeeComments,
        signatures
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1200);
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100 transform -rotate-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                {type} <span className="text-blue-600">Audit</span>
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Industrial Performance Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="flex-1 overflow-y-auto p-10 space-y-16 custom-scrollbar">
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4 text-blue-900 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Your responses are encrypted and stored as immutable performance data. Review meticulously against industrial benchmarks.</p>
            </div>

            <div className="space-y-6">
              {allQuestions.map((q, qIdx) => (
                <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group shadow-sm">
                  <p className="text-slate-900 font-extrabold text-sm mb-6 leading-relaxed flex gap-4">
                     <span className="text-blue-300">#{qIdx + 1}</span>
                     {q.text}
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      {v: 5, l: 'Exceptional'},
                      {v: 4, l: 'Effective'},
                      {v: 3, l: 'Encouraging'},
                      {v: 2, l: 'Satisfactory'},
                      {v: 1, l: 'Low'}
                    ].map(rating => (
                      <button
                        key={rating.v}
                        onClick={() => handleScoreChange(q.id, rating.v)}
                        className={`group/btn relative py-6 rounded-2xl font-black transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
                          scores[q.id] === rating.v 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 ring-4 ring-blue-50' 
                            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-blue-300 hover:text-blue-600'
                        }`}
                      >
                        <span className="text-xl">{rating.v}</span>
                        <span className={`text-[8px] uppercase tracking-tighter ${scores[q.id] === rating.v ? 'text-blue-100' : 'text-slate-400 group-hover/btn:text-blue-400'}`}>{rating.l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-100" />

            {/* Qualitative Sections */}
            <div className="space-y-10 pt-4">
              <section className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">4. Summary of Priority Improvement Areas</h4>
                <textarea 
                  value={improvementAreas}
                  onChange={e => setImprovementAreas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300 min-h-[160px]"
                  placeholder="Identify specific competencies requiring immediate optimization..."
                />
              </section>

              <section className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">5. Goals For Next Review Period</h4>
                <textarea 
                  value={nextGoals}
                  onChange={e => setNextGoals(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300 min-h-[160px]"
                  placeholder="Outline agreed-upon milestones and performance indicators for the following cycle..."
                />
              </section>

              <section className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">6. Employee Comments</h4>
                <textarea 
                  value={employeeComments}
                  onChange={e => setEmployeeComments(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all placeholder:text-slate-300 min-h-[160px]"
                  placeholder="Additional context or shared perspectives on this audit..."
                />
              </section>

              <section className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">7. Signatures</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Digital Sign-off</p>
                      <input 
                        type="text"
                        value={signatures.employee}
                        onChange={e => setSignatures({...signatures, employee: e.target.value})}
                        className="w-full bg-transparent border-none text-slate-900 font-black text-lg p-0 focus:ring-0 placeholder:text-slate-200 italic font-serif"
                        placeholder="Print Full Name..."
                      />
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supervisor Digital Sign-off</p>
                      <input 
                        type="text"
                        value={signatures.supervisor}
                        onChange={e => setSignatures({...signatures, supervisor: e.target.value})}
                        className="w-full bg-transparent border-none text-slate-900 font-black text-lg p-0 focus:ring-0 placeholder:text-slate-200 italic font-serif"
                        placeholder="Print Full Name..."
                      />
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3 md:col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Closure Date</p>
                      <input 
                        type="date"
                        value={signatures.date}
                        onChange={e => setSignatures({...signatures, date: e.target.value})}
                        className="w-full bg-transparent border-none text-slate-900 font-black text-sm p-0 focus:ring-0"
                      />
                   </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
             <div className="w-24 h-24 bg-green-100 rounded-[32px] flex items-center justify-center mb-8 shadow-lg shadow-green-100">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
             </div>
             <h3 className="text-3xl font-black text-slate-900 mb-4">Submission Successful</h3>
             <p className="text-slate-400 font-bold max-w-xs leading-relaxed uppercase tracking-wider text-xs">Your performance metrics have been securely committed to the architecture.</p>
          </div>
        )}

        {!isSuccess && (
          <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all text-sm"
            >
              Discard
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(scores).length < allQuestions.length}
              className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-100 flex items-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Commit Evaluation
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
