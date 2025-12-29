import { useState, useRef, useEffect } from 'react';
import { Bell, Zap, Clock, ChevronRight, CheckCircle2, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, submissions, cycles } = useStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCycle = cycles.find(c => c.status === 'active');
  
  // Pending Reviews (Peer, Subordinate, Supervisor)
  const pendingReviews = submissions.filter(s => 
    s.evaluatorId === currentUser?.id && 
    s.cycleId === activeCycle?.id && 
    s.status === 'pending'
  );

  // Self Evaluation Availability
  const mySubmissions = submissions.filter(s => s.evaluateeId === currentUser?.id && s.cycleId === activeCycle?.id);
  const selfSubmitted = mySubmissions.some(s => s.type === 'self');
  const showSelfEval = activeCycle && !selfSubmitted && currentUser?.role !== 'admin';

  const totalNotifications = pendingReviews.length + (showSelfEval ? 1 : 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (type: string, submissionId?: string) => {
    setIsOpen(false);
    if (type === 'self') {
      navigate('/employee/dashboard?action=self');
    } else if (submissionId) {
      navigate(`/employee/dashboard?action=evaluate&submissionId=${submissionId}`);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
      >
        <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
        {totalNotifications > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
            {totalNotifications > 0 && (
              <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{totalNotifications} New</span>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
            {totalNotifications === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-semibold">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {/* Admin Notifications */}
                {currentUser.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => { setIsOpen(false); navigate('/admin/status?employeeId=emp1&cycleId=cycle-2025-annual'); }}
                      className="w-full text-left p-4 hover:bg-slate-50 transition-colors group flex gap-4"
                    >
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-0.5">Self-Audit Finalized</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                          <span className="text-slate-900 font-bold">Abebe Kebede</span> has submitted their self-evaluation.
                        </p>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                          View Audit <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setIsOpen(false); navigate('/admin/status?employeeId=emp2&cycleId=cycle-2025-annual'); }}
                      className="w-full text-left p-4 hover:bg-slate-50 transition-colors group flex gap-4"
                    >
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-0.5">Peer Reviews Committed</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                          <span className="text-slate-900 font-bold">Bethlehem Tadesse</span> completed all peer assessments.
                        </p>
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-1">
                          Inspect Records <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  </>
                )}

                {/* Employee Notifications */}
                {currentUser.role !== 'admin' && (
                  <>
                    {/* Self Evaluation Notification */}
                    {showSelfEval && (
                      <button 
                        onClick={() => handleAction('self')}
                        className="w-full text-left p-4 hover:bg-slate-50 transition-colors group flex gap-4"
                      >
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm mb-0.5">Annual Evaluation Open</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">Self-evaluation for {activeCycle?.title} is now available.</p>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                            Start Now <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Pending Reviews Notifications */}
                    {pendingReviews.map(review => (
                      <button 
                        key={review.id}
                        onClick={() => handleAction('evaluate', review.id)}
                        className="w-full text-left p-4 hover:bg-slate-50 transition-colors group flex gap-4"
                      >
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl h-fit group-hover:scale-110 transition-transform">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm mb-0.5">Action Required</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                            Complete {review.type} review for <span className="text-slate-900 font-bold">Concept ID #{review.evaluateeId.slice(-4)}</span>
                          </p>
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                            Review Now <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
