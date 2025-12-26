import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { CompetencyQuestion } from '../types';

interface SelfEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleId: string;
}

const MOCK_QUESTIONS: CompetencyQuestion[] = [
  { id: 'q1', category: 'behavioral', text: 'Demonstrates effective teamwork and collaboration.' },
  { id: 'q2', category: 'behavioral', text: 'Takes initiative to solve problems independently.' },
  { id: 'q3', category: 'technical', text: 'Demonstrates deep knowledge of required technologies.' },
  { id: 'q4', category: 'technical', text: 'Delivers high-quality code with minimal bugs.' },
];

export const SelfEvaluationModal: React.FC<SelfEvaluationModalProps> = ({ isOpen, onClose, cycleId }) => {
  const { submitEvaluation, currentUser } = useStore();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleScoreChange = (qId: string, value: number) => {
    setScores(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    if (Object.keys(scores).length < MOCK_QUESTIONS.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      submitEvaluation({
        id: `sub-${Date.now()}`,
        evaluatorId: currentUser?.id || '',
        evaluateeId: currentUser?.id || '',
        cycleId,
        type: 'self',
        status: 'submitted',
        scores: Object.entries(scores).map(([k, v]) => ({ questionId: k, score: v }))
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const getCategoryQuestions = (cat: string) => MOCK_QUESTIONS.filter(q => q.category === cat);
  const categories = Array.from(new Set(MOCK_QUESTIONS.map(q => q.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Self Competency Evaluation</h2>
            <p className="text-sm text-slate-500">Rate your performance on a scale of 1-5.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 text-sm border border-blue-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Once submitted, this form becomes <strong>read-only</strong>. Please review your ratings carefully.</p>
          </div>

          {categories.map(cat => (
            <div key={cat} className="space-y-4">
              <h3 className="font-bold text-lg capitalize text-slate-800 border-b border-slate-100 pb-2">
                {cat} Competencies
              </h3>
              {getCategoryQuestions(cat).map(q => (
                <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-800 font-medium mb-3">{q.text}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleScoreChange(q.id, rating)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                          scores[q.id] === rating 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-100' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                <Save className="w-4 h-4" /> Submit Evaluation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
