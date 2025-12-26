import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, User, Users, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export const EvaluationHistory = () => {
  const { currentUser, submissions } = useStore();
  const [activeTab, setActiveTab] = useState<'self' | 'peer' | 'supervisor'>('self');

  // Filter submissions
  const mySubmissions = submissions.filter(s => s.evaluateeId === currentUser?.id);
  const displayedSubmissions = mySubmissions.filter(s => s.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Evaluation History</h1>
        <p className="text-slate-500 mt-1">Review your past performance records and feedback.</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <TabButton 
          active={activeTab === 'self'} 
          onClick={() => setActiveTab('self')} 
          icon={<User className="w-4 h-4" />} 
          label="Self Evaluations" 
        />
        <TabButton 
          active={activeTab === 'peer'} 
          onClick={() => setActiveTab('peer')} 
          icon={<Users className="w-4 h-4" />} 
          label="Peer Reviews" 
        />
        <TabButton 
          active={activeTab === 'supervisor'} 
          onClick={() => setActiveTab('supervisor')} 
          icon={<UserCheck className="w-4 h-4" />} 
          label="Supervisor Reviews" 
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {displayedSubmissions.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No Records Found</h3>
            <p className="text-slate-500">You haven't received any {activeTab} evaluations yet.</p>
          </div>
        ) : (
          displayedSubmissions.map(sub => (
            <div key={sub.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-xs font-bold tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">
                       Submitted
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-2">Evaluation Record</h3>
                    <p className="text-sm text-slate-500">
                      Submitted on {sub.submittedAt ? format(new Date(sub.submittedAt), 'PPP') : 'N/A'}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400">Total Score</p>
                    <p className="text-2xl font-bold text-indigo-600">
                        {(sub.scores.reduce((a, b) => a + b.score, 0) / sub.scores.length).toFixed(1)} <span className="text-sm text-slate-400 font-normal">/ 5</span>
                    </p>
                </div>
              </div>

              {/* Read-only Question View */}
              <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {sub.scores.map((score, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-100">
                          <span className="text-sm text-slate-700 font-medium">Question {idx + 1}</span>
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
                              {score.score}
                          </span>
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
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {icon}
    {label}
  </button>
);
