import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  ChevronRight, 
  Check, 
  Calendar, 
  Target, 
  Users, 
  UserCheck, 
  ListChecks, 
  Plus, 
  Trash2, 
  ChevronDown,
  ShieldCheck,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreateCycle = () => {
  const navigate = useNavigate();
  const { users, deployEvaluationCycle, objectives, getObjectKPIs, competencyFrameworks } = useStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: 'Q1 Performance Review 2024',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    type: 'quarterly',
    evaluateeIds: [] as string[],
    assignments: {} as Record<string, { peerIds: string[], supervisorIds: string[] }>,
    questionCollections: [
      { id: 'qc-1', name: 'Behavioral Metrics', frameworkId: competencyFrameworks[0]?.id || '' },
      { id: 'qc-2', name: 'Technical Proficiency', frameworkId: '' }
    ],
    validations: {
        minPeers: 3,
        requireSupervisor: true
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEvaluatee, setExpandedEvaluatee] = useState<string | null>(null);

  const employees = users.filter(u => u.role === 'employee');
  const filteredEmployees = employees.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => step < 5 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const toggleEvaluatee = (id: string) => {
    setFormData(prev => {
        const isSelected = prev.evaluateeIds.includes(id);
        const newIds = isSelected 
            ? prev.evaluateeIds.filter(eId => eId !== id)
            : [...prev.evaluateeIds, id];
        
        // Initialize assignments if adding
        const newAssignments = { ...prev.assignments };
        if (!isSelected && !newAssignments[id]) {
            newAssignments[id] = { peerIds: [], supervisorIds: [] };
        }
        
        return { ...prev, evaluateeIds: newIds, assignments: newAssignments };
    });
  };

  const updateAssignment = (evaluateeId: string, role: 'peer' | 'supervisor', assignedUserId: string) => {
    setFormData(prev => {
        const current = prev.assignments[evaluateeId] || { peerIds: [], supervisorIds: [] };
        const key = role === 'peer' ? 'peerIds' : 'supervisorIds';
        const isAssigned = current[key].includes(assignedUserId);
        
        const newList = isAssigned
            ? current[key].filter(id => id !== assignedUserId)
            : [...current[key], assignedUserId];
            
        return {
            ...prev,
            assignments: {
                ...prev.assignments,
                [evaluateeId]: { ...current, [key]: newList }
            }
        };
    });
  };

  const handlePublish = () => {
    deployEvaluationCycle({
      id: `cycle-${Date.now()}`,
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type as any,
      status: 'active',
      weights: { own: 60, shared: 40 }, // Defaulting for simplicity in this flow
      competencies: { behavioral: true, technical: true, leadership: false },
      customCompetencyFrameworkIds: formData.questionCollections.map(qc => qc.frameworkId).filter(id => !!id)
    }, formData.assignments);
    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Industrial <span className="text-indigo-600">Evaluation Creator</span></h1>
          <p className="text-slate-500 font-semibold tracking-tight">Strategic deployment of multi-dimensional performance audit protocols.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
           {[1, 2, 3, 4, 5].map(s => (
             <div 
               key={s} 
               className={`h-2 rounded-full transition-all duration-500 ${
                 step === s ? 'w-8 bg-indigo-600' : step > s ? 'w-4 bg-indigo-200' : 'w-2 bg-slate-200'
               }`} 
             />
           ))}
        </div>
      </header>

      <div className="bg-white border border-slate-100 rounded-[48px] p-12 shadow-[0_8px_40px_rgba(0,0,0,0.02)] relative min-h-[600px] flex flex-col">
        {/* Step Content */}
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Target className="w-6 h-6" />
                  </div>
                  Scope Selection
                </h2>
                <div className="relative group w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search employees..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(u => {
                  const isSelected = formData.evaluateeIds.includes(u.id);
                  return (
                    <button 
                      key={u.id} 
                      onClick={() => toggleEvaluatee(u.id)}
                      className={`p-6 rounded-3xl border-2 flex items-center gap-5 transition-all text-left ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' 
                          : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg'
                      }`}
                    >
                      <img src={u.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className={`font-black text-sm tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{u.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{u.department}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Users className="w-6 h-6" />
                </div>
                Evaluator Orchestration
              </h2>

              <div className="space-y-4">
                {formData.evaluateeIds.map(eId => {
                  const evaluatee = users.find(u => u.id === eId);
                  const assignment = formData.assignments[eId] || { peerIds: [], supervisorIds: [] };
                  const isExpanded = expandedEvaluatee === eId;

                  return (
                    <div key={eId} className={`border rounded-[32px] overflow-hidden transition-all ${isExpanded ? 'border-indigo-200 ring-4 ring-indigo-50/50' : 'border-slate-100'}`}>
                      <button 
                        onClick={() => setExpandedEvaluatee(isExpanded ? null : eId)}
                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img src={evaluatee?.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          <div className="text-left">
                            <p className="font-black text-slate-900">{evaluatee?.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">Configure Evaluators</p>
                          </div>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="flex -space-x-2">
                             {assignment.peerIds.map(pId => (
                               <img key={pId} src={users.find(u => u.id === pId)?.avatar} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                             ))}
                          </div>
                          <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                            {assignment.peerIds.length} Peers / {assignment.supervisorIds.length} Sup
                          </span>
                          <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                          >
                            <div className="p-8 bg-slate-50/50 border-t border-slate-100 grid md:grid-cols-2 gap-10">
                              <section className="space-y-4 text-left">
                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                   <Users className="w-3 h-3" /> Assign Peers
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {users.filter(u => u.id !== eId && u.role === 'employee').length === 0 ? (
                                    <p className="col-span-2 text-[10px] font-bold text-slate-400 italic">No eligible peers found.</p>
                                  ) : (
                                    users.filter(u => u.id !== eId && u.role === 'employee').map(u => {
                                      const selected = assignment.peerIds.includes(u.id);
                                      return (
                                        <button 
                                          key={u.id}
                                          onClick={() => updateAssignment(eId, 'peer', u.id)}
                                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                            selected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 hover:border-indigo-200'
                                          }`}
                                        >
                                          <img src={u.avatar} className="w-6 h-6 rounded-lg object-cover" />
                                          <span className="text-[11px] font-black truncate">{u.name}</span>
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              </section>
                              
                              <section className="space-y-4 text-left">
                                <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                                   <UserCheck className="w-3 h-3" /> Assign Supervisor
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {users.filter(u => u.role === 'admin' || u.role === 'manager').length === 0 ? (
                                    <p className="col-span-2 text-[10px] font-bold text-slate-400 italic">No supervisors available.</p>
                                  ) : (
                                    users.filter(u => u.role === 'admin' || u.role === 'manager').map(u => {
                                      const selected = assignment.supervisorIds.includes(u.id);
                                      return (
                                        <button 
                                          key={u.id}
                                          onClick={() => updateAssignment(eId, 'supervisor', u.id)}
                                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                                            selected ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-slate-100 hover:border-orange-200'
                                          }`}
                                        >
                                          <img src={u.avatar} className="w-6 h-6 rounded-lg object-cover" />
                                          <span className="text-[11px] font-black truncate">{u.name}</span>
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              </section>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ListChecks className="w-6 h-6" />
                </div>
                KPI Audit Verification
              </h2>

              <div className="space-y-4">
                 {formData.evaluateeIds.map(eId => {
                    const evaluatee = users.find(u => u.id === eId);
                    const myObjectives = objectives.filter(o => o.userId === eId);
                    const isExpanded = expandedEvaluatee === eId;

                    return (
                      <div key={eId} className={`border rounded-[32px] overflow-hidden transition-all ${isExpanded ? 'border-blue-200 ring-4 ring-blue-50/50' : 'border-slate-100'}`}>
                        <button 
                          onClick={() => setExpandedEvaluatee(isExpanded ? null : eId)}
                          className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                             <img src={evaluatee?.avatar} className="w-10 h-10 rounded-xl" />
                             <div>
                               <p className="font-black text-slate-900">{evaluatee?.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{myObjectives.length} Strategic Objectives</p>
                             </div>
                          </div>
                          <ChevronDown className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                              <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6">
                                {myObjectives.map(obj => (
                                  <div key={obj.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                      <h5 className="font-black text-sm text-slate-900 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${obj.type === 'own' ? 'bg-indigo-500' : 'bg-blue-500'}`} />
                                        {obj.title}
                                      </h5>
                                      <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded-md text-slate-500">Weight: {obj.weight}%</span>
                                    </div>
                                    <div className="grid gap-2">
                                      {getObjectKPIs(obj.id).map(kpi => (
                                        <div key={kpi.id} className="text-xs text-slate-400 font-bold flex justify-between border-b border-slate-50 py-2">
                                          <span>{kpi.title}</span>
                                          <span className="text-slate-900 font-black">{kpi.target}% Target</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                 })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                Question Collection Management
              </h2>

              <div className="grid lg:grid-cols-2 gap-10">
                <section className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 space-y-8">
                   <h3 className="font-black text-slate-900 flex justify-between items-center">
                     Metric Collections
                     <button 
                       onClick={() => setFormData(prev => ({ 
                           ...prev, 
                           questionCollections: [...prev.questionCollections, { id: `qc-${Date.now()}`, name: 'New Collection', frameworkId: '' }] 
                       }))}
                       className="text-indigo-600 text-[10px] uppercase font-black flex items-center gap-2"
                     >
                        <Plus className="w-4 h-4" /> Add Type
                     </button>
                   </h3>
                   <div className="space-y-4">
                      {formData.questionCollections.map((qc, idx) => (
                        <div key={qc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-4">
                           <div className="flex-1 space-y-3">
                              <input 
                                type="text"
                                value={qc.name}
                                onChange={e => {
                                    const copy = [...formData.questionCollections];
                                    copy[idx].name = e.target.value;
                                    setFormData({...formData, questionCollections: copy});
                                }}
                                className="w-full font-black text-slate-900 border-none p-0 focus:ring-0 text-sm"
                                placeholder="Collection Name"
                              />
                              <select 
                                value={qc.frameworkId}
                                onChange={e => {
                                    const copy = [...formData.questionCollections];
                                    copy[idx].frameworkId = e.target.value;
                                    setFormData({...formData, questionCollections: copy});
                                }}
                                className="w-full bg-slate-50 text-[11px] font-bold text-slate-500 rounded-lg border-slate-100 px-3 py-2 cursor-pointer"
                              >
                                 <option value="">Select Framework (Competency)</option>
                                 {competencyFrameworks.map(cf => <option key={cf.id} value={cf.id}>{cf.name}</option>)}
                              </select>
                           </div>
                           <button 
                             onClick={() => setFormData(prev => ({ 
                                 ...prev, 
                                 questionCollections: prev.questionCollections.filter(item => item.id !== qc.id) 
                             }))}
                             className="text-slate-200 hover:text-red-500 transition-colors"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 space-y-8">
                   <h3 className="font-black text-slate-900">Validation Thresholds</h3>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-slate-700">Minimum Peer Evaluators</p>
                            <p className="text-[11px] font-bold text-slate-400">Total requirements per evaluatee</p>
                         </div>
                         <input 
                            type="number" 
                            value={formData.validations.minPeers}
                            onChange={e => setFormData({...formData, validations: {...formData.validations, minPeers: parseInt(e.target.value)}})}
                            className="w-16 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center font-black" 
                         />
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-slate-700">Supervisor Mandatory</p>
                            <p className="text-[11px] font-bold text-slate-400">Force hierarchical review</p>
                         </div>
                         <button 
                            onClick={() => setFormData({...formData, validations: {...formData.validations, requireSupervisor: !formData.validations.requireSupervisor}})}
                            className={`w-14 h-8 rounded-full transition-all relative ${formData.validations.requireSupervisor ? 'bg-indigo-600' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.validations.requireSupervisor ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>
                   </div>
                </section>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10 text-center py-10 animate-in zoom-in-95 duration-500">
               <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center mx-auto text-white shadow-2xl shadow-indigo-200 mb-10 transform rotate-12 scale-110">
                  <Check className="w-16 h-16" />
               </div>
               <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Ready <span className="text-indigo-600">for Release</span></h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-3">{formData.evaluateeIds.length} Evaluation cycles prepared for deployment.</p>
               </div>
               
               <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Orchestration Stats</p>
                     <div className="space-y-3">
                        <p className="text-sm font-black flex justify-between"><span>Audit Scope</span> <span className="text-indigo-600">{formData.evaluateeIds.length} Entities</span></p>
                        <p className="text-sm font-black flex justify-between"><span>Metric Types</span> <span className="text-indigo-600">{formData.questionCollections.length} Collections</span></p>
                        <p className="text-sm font-black flex justify-between"><span>Validations</span> <span className="text-green-500">System Passed</span></p>
                     </div>
                  </div>
                  <div className="p-6 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col justify-center text-white">
                     <p className="text-xs font-black opacity-60 uppercase mb-2">Cycle Start</p>
                     <p className="text-2xl font-black tracking-tight">{formData.title}</p>
                     <p className="text-xs font-bold mt-2 opacity-60 flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> {formData.startDate} — {formData.endDate}
                     </p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="mt-16 pt-12 border-t border-slate-50 flex justify-between items-center gap-6">
          <button 
            onClick={handleBack} 
            disabled={step === 1} 
            className="px-8 py-4 font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all flex items-center gap-2"
          >
            <ChevronRight className="w-5 h-5 rotate-180" /> Backward
          </button>
          <div className="flex gap-4">
             <button 
               onClick={() => navigate('/admin/dashboard')}
               className="px-8 py-4 font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
             >
               Discard Command
             </button>
             <button 
               onClick={step === 5 ? handlePublish : handleNext} 
               className="px-12 py-5 bg-indigo-600 text-white font-black rounded-[24px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-4 transform active:scale-95 group"
             >
                {step === 5 ? (
                  <>Publish To Entities <ShieldCheck className="w-6 h-6" /></>
                ) : (
                  <>Proceed Orchestration <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" /></>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
