import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, CheckCircle2, Clock, X, Users, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';

export const EvaluationStatus = () => {
  const { cycles, users, submissions, competencyFrameworks } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'active' | 'history'>('active');
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);
  
  const [viewingSubmission, setViewingSubmission] = useState<{
    id: string;
    evaluatorName: string;
    date: string;
    scores: { questionId: string; score: number }[];
  } | null>(null);

  // Calculate statistics for each cycle
  const getCycleStats = (cycleId: string) => {
    const employees = users.filter(u => u.role === 'employee' && u.status === 'active');
    const cycleSubmissions = submissions.filter(s => s.cycleId === cycleId);
    
    // Count employees who have completed their self-evaluation
    const completedCount = employees.filter(emp => 
      cycleSubmissions.some(s => s.evaluatorId === emp.id && s.evaluateeId === emp.id && s.status === 'submitted')
    ).length;

    const totalEmployees = employees.length;
    const pendingCount = totalEmployees - completedCount;
    const completionRate = totalEmployees > 0 ? (completedCount / totalEmployees) * 100 : 0;

    return {
      totalEmployees,
      completedCount,
      pendingCount,
      completionRate
    };
  };

  // Get employee evaluation status overview
  const getEmployeeStatus = (userId: string, cycleId: string) => {
    const selfSubmission = submissions.find(s => s.evaluatorId === userId && s.evaluateeId === userId && s.cycleId === cycleId);
    
    // Calculate completion of all assigned evaluations to this user
    const allAssigned = submissions.filter(s => s.evaluateeId === userId && s.cycleId === cycleId);
    const completedAssigned = allAssigned.filter(s => s.status === 'submitted');
    const totalAssigned = allAssigned.length;
    
    // Average score from all submitted evaluations
    const allScores = completedAssigned.flatMap(s => s.scores.map(sc => sc.score));
    const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null;

    return {
      status: selfSubmission?.status === 'submitted' ? 'completed' : 'pending',
      submittedAt: selfSubmission?.submittedAt,
      score: avgScore,
      progress: {
        completed: completedAssigned.length,
        total: totalAssigned
      }
    };
  };

  // Get detailed breakdown for selected employee
  const getDetailedBreakdown = (userId: string, cycleId: string) => {
    const allSubmissions = submissions.filter(s => s.evaluateeId === userId && s.cycleId === cycleId);
    return {
      self: allSubmissions.find(s => s.type === 'self'),
      peers: allSubmissions.filter(s => s.type === 'peer'),
      supervisors: allSubmissions.filter(s => s.type === 'supervisor'),
      subordinates: allSubmissions.filter(s => s.type === 'subordinate')
    };
  };

  // Get question text
  const getQuestionText = (questionId: string) => {
    for (const framework of competencyFrameworks) {
      const question = framework.questions.find(q => q.id === questionId);
      if (question) return question.text;
    }
    return 'Question not found';
  };

  // Filter cycles
  const filteredCycles = cycles.filter(cycle => {
    // Mode filtering
    if (viewMode === 'active') {
       if (cycle.status === 'completed') return false;
    } else {
       if (cycle.status !== 'completed') return false;
    }

    if (selectedCycle !== 'all' && cycle.id !== selectedCycle) return false;
    if (searchTerm && !cycle.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Filter employees
  const employees = users.filter(u => u.role === 'employee' && u.status === 'active');
  const filteredEmployees = employees.filter(emp => {
    if (searchTerm && !emp.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter !== 'all' && selectedCycle !== 'all') {
      const empStatus = getEmployeeStatus(emp.id, selectedCycle);
      if (statusFilter === 'completed' && empStatus.status !== 'completed') return false;
      if (statusFilter === 'pending' && empStatus.status !== 'pending') return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-[44px] opacity-20 blur-xl" />
          <header className="relative p-8 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent tracking-tight leading-tight">
                  Evaluation Stats
                </h1>
                <p className="text-slate-600 font-semibold mt-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Track evaluation progress and completion across all cycles
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="bg-slate-100/50 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/50">
                <button
                  onClick={() => {
                    setViewMode('active');
                    setSelectedCycle('all');
                  }}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    viewMode === 'active'
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  Active Cycles
                </button>
                <button
                  onClick={() => {
                    setViewMode('history');
                    setSelectedCycle('all');
                  }}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    viewMode === 'history'
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  History
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees or cycles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
          
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
          >
            <option value="all">All Cycles</option>
            {/* Show all cycles in the dropdown, but filter by viewMode in the list logic if needed? 
                Actually, usually user wants to filter by visual context. 
                Let's simplify: Show filteredCycles in dropdown or all? 
                Existing showed all. Let's show filteredCycles to be consistent with the View Mode.
            */}
            {filteredCycles.map(cycle => (
              <option key={cycle.id} value={cycle.id}>{cycle.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
            disabled={selectedCycle === 'all'}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Validation Message if no cycles found in current mode */}
        {filteredCycles.length === 0 && selectedCycle === 'all' && (
           <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/40">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               {viewMode === 'active' ? (
                 <TrendingUp className="w-8 h-8 text-slate-400" />
               ) : (
                 <CheckCircle2 className="w-8 h-8 text-slate-400" />
               )}
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2">
               {viewMode === 'active' ? 'No Active Cycles' : 'No History Found'}
             </h3>
             <p className="text-slate-500 font-medium">
               {viewMode === 'active' 
                 ? 'There are currently no active or upcoming evaluation cycles.' 
                 : 'No completed evaluation cycles found in the history.'}
             </p>
           </div>
        )}

        {/* Cycle Overview Cards */}
        {selectedCycle === 'all' && filteredCycles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCycles.map((cycle) => {
              const stats = getCycleStats(cycle.id);
              return (
                <div key={cycle.id} className="relative group cursor-pointer" onClick={() => setSelectedCycle(cycle.id)}>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-[28px] opacity-20 group-hover:opacity-40 blur-lg transition-opacity" />
                  <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-[24px] border border-slate-200/50 shadow-lg hover:shadow-xl transition-all space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{cycle.title}</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        cycle.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : cycle.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cycle.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-600">Completion Rate</span>
                        <span className="text-sm font-black text-blue-600">{stats.completionRate.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-500">Total</div>
                        <div className="text-lg font-black text-slate-900">{stats.totalEmployees}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-green-600">Completed</div>
                        <div className="text-lg font-black text-green-600">{stats.completedCount}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-orange-600">Pending</div>
                        <div className="text-lg font-black text-orange-600">{stats.pendingCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Employee Status Table */}
        {/* Employee Status Table */}
        {selectedCycle !== 'all' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Back Button - Now isolated from opacity/blur effects */}
             <button 
               onClick={() => {
                 setSelectedCycle('all');
                 setSelectedEmployee(null);
               }}
               className="mb-6 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer w-fit z-50 relative"
             >
               ← Back to Cycle Overview
             </button>

            <div className="relative">
              {/* Decorative Overlay - Now contained within the table wrapper only */}
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-[44px] opacity-20 blur-xl pointer-events-none" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-[40px] border border-slate-200/50 overflow-hidden shadow-lg">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Employee Progress
                </h2>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                  {cycles.find(c => c.id === selectedCycle)?.title}
                </span>
              </div>
              
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                    <th className="text-left p-4 text-xs font-bold text-slate-600">Employee</th>
                    <th className="text-left p-4 text-xs font-bold text-slate-600">Department</th>
                    <th className="text-left p-4 text-xs font-bold text-slate-600">Self Evaluation</th>
                    <th className="text-left p-4 text-xs font-bold text-slate-600">All Evaluations</th>
                    <th className="text-left p-4 text-xs font-bold text-slate-600">Avg Score</th>
                    <th className="text-left p-4 text-xs font-bold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => {
                    const empStatus = getEmployeeStatus(employee.id, selectedCycle);
                    return (
                      <tr 
                        key={employee.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={employee.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{employee.name}</p>
                              <p className="text-xs text-slate-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-slate-600">{employee.department}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            empStatus.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {empStatus.status === 'completed' ? (
                              <><CheckCircle2 className="w-3 h-3" /> Submitted</>
                            ) : (
                              <><Clock className="w-3 h-3" /> Pending</>
                            )}
                          </span>
                          {empStatus.submittedAt && (
                            <div className="text-[10px] font-medium text-slate-400 mt-1 ml-1">
                              {new Date(empStatus.submittedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                         <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(empStatus.progress.completed / empStatus.progress.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-600">
                              {empStatus.progress.completed}/{empStatus.progress.total}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-bold text-blue-600">
                            {empStatus.score !== null ? `${empStatus.score.toFixed(1)}/5` : '-'}
                          </span>
                        </td>
                         <td className="p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmployee({ id: employee.id, name: employee.name });
                            }}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-bold text-slate-400">No employees found matching your filters</p>
                </div>
              )}
            </div>
            </div>
          </div>
        )}

        {/* Detailed Status Modal */}
        {selectedEmployee && selectedCycle !== 'all' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedEmployee(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-blue-600 group"
                  >
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Evaluation Details</h2>
                    <p className="text-slate-500 font-semibold">{selectedEmployee.name} • {cycles.find(c => c.id === selectedCycle)?.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-8">
                {(() => {
                  const details = getDetailedBreakdown(selectedEmployee.id, selectedCycle);
                  const sections = [
                    { title: 'Self Evaluation', items: details.self ? [details.self] : [], color: 'blue' },
                    { title: 'Peer Evaluations', items: details.peers, color: 'blue' },
                    { title: 'Supervisor Evaluations', items: details.supervisors, color: 'orange' },
                    { title: 'Subordinate Evaluations', items: details.subordinates, color: 'green' }
                  ];

                  return sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                      <h3 className={`text-lg font-black text-${section.color}-900 flex items-center gap-2`}>
                        <span className={`w-2 h-6 bg-${section.color}-500 rounded-full`}></span>
                        {section.title}
                      </h3>
                      
                      {section.items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.items.map((submission) => {
                            const evaluator = users.find(u => u.id === submission.evaluatorId);
                             const avgScore = submission.scores.length > 0 
                                ? submission.scores.reduce((a, b) => a + b.score, 0) / submission.scores.length 
                                : null;

                            return (
                              <div key={submission.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <img src={evaluator?.avatar} alt="" className="w-10 h-10 rounded-xl" />
                                    <div>
                                      <p className="font-bold text-slate-900">{evaluator?.name || 'Unknown'}</p>
                                      <p className="text-xs text-slate-500 capitalize">{evaluator?.role}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {submission.status === 'submitted' ? (
                                      <>
                                        <div className="text-sm font-black text-blue-600">{avgScore?.toFixed(1) || '-'} / 5</div>
                                        <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">Submitted</div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="text-sm font-black text-slate-300">-</div>
                                        <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block mt-1">Pending</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {submission.status === 'submitted' && (
                                  <button
                                    onClick={() => setViewingSubmission({
                                      id: submission.id,
                                      evaluatorName: evaluator?.name || 'Unknown',
                                      date: submission.submittedAt || '',
                                      scores: submission.scores
                                    })}
                                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors text-center"
                                  >
                                    View Submission Content
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-sm pl-4">No evaluations assigned for this category.</p>
                      )}
                    </div>
                  ));
                })()}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-6 py-3 font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Submission Content Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setViewingSubmission(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-blue-600 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Submission Details</h3>
                  <p className="text-slate-500 font-bold text-sm">
                    Evaluated by <span className="text-blue-600">{viewingSubmission.evaluatorName}</span> • {new Date(viewingSubmission.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
                    <p className="text-2xl font-black text-blue-600 leading-none">
                      {(viewingSubmission.scores.reduce((a, b) => a + b.score, 0) / (viewingSubmission.scores.length || 1)).toFixed(1)} <span className="text-sm text-slate-400 font-bold">/ 5</span>
                    </p>
                 </div>
                <button 
                  onClick={() => setViewingSubmission(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {viewingSubmission.scores.map((score, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    {getQuestionText(score.questionId)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Score Provided</span>
                    <span className="text-lg font-black text-blue-600">{score.score} / 5</span>
                  </div>
                </div>
              ))}
              {viewingSubmission.scores.length === 0 && (
                 <p className="text-center text-slate-400 font-bold italic py-8">No scores recorded for this submission.</p>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setViewingSubmission(null)}
                className="w-full py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100 uppercase tracking-wider text-[11px]"
              >
                ← Back to Evaluation Summary
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
