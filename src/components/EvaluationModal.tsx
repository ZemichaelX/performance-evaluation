import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleId: string;
  type?: 'self' | 'peer' | 'supervisor';
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

  const allQuestions = competencyFrameworks.flatMap(f => f.questions);
  const displayQuestions = allQuestions.length > 0 ? allQuestions : [
    { id: 'q1', category: 'Behavioral', text: 'Demonstrates effective teamwork and collaboration.' },
    { id: 'q2', category: 'Behavioral', text: 'Communicates complex ideas clearly and concisely.' },
    { id: 'q3', category: 'Technical', text: 'Demonstrates deep knowledge of required technologies.' },
    { id: 'q4', category: 'Technical', text: 'Consistently delivers high-quality work with precision.' },
  ];

  useEffect(() => {
    if (isOpen) {
      setScores({});
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScoreChange = (qId: string, value: number) => {
    setScores(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(scores).length < displayQuestions.length) {
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
        scores: Object.entries(scores).map(([k, v]) => ({ questionId: k, score: v }))
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1200);
  };

  const categories = Array.from(new Set(displayQuestions.map(q => q.category)));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
              {type} <span className="text-indigo-600">Evaluation</span>
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Rate performance benchmarks (1-5)</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex gap-4 text-indigo-900 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Your responses are encrypted and stored as immutable performance data. Review meticulously.</p>
            </div>

            {categories.map(cat => (
              <div key={cat} className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-100" />
                  {cat} Competencies
                  <div className="h-px flex-1 bg-slate-100" />
                </h3>
                {displayQuestions.filter(q => q.category === cat).map(q => (
                  <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group">
                    <p className="text-slate-900 font-extrabold text-lg mb-6 leading-relaxed">{q.text}</p>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleScoreChange(q.id, rating)}
                          className={`flex-1 py-4 rounded-2xl font-black transition-all transform active:scale-95 ${
                            scores[q.id] === rating 
                              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 ring-4 ring-indigo-50' 
                              : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
              disabled={isSubmitting || Object.keys(scores).length < displayQuestions.length}
              className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
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
