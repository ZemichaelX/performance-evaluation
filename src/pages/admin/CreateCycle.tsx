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
  const { users, deployEvaluationCycle, objectives, getObjectKPIs, competencyFrameworks, addCompetencyFramework } = useStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: 'Q1 Performance Review 2024',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    type: 'quarterly',
    evaluateeIds: [] as string[],
    assignments: {} as Record<string, { peerIds: string[], supervisorIds: string[] }>,
    questionCollections: [
      { 
        id: 'qc-1', 
        name: 'Behavioral Competencies', 
        frameworkId: 'fw-behavioral',
        customQuestions: [] as { id: string, text: string, category: string }[],
        overrides: {} as Record<string, string>
      },
      { 
        id: 'qc-2', 
        name: 'Technical Competencies', 
        frameworkId: 'fw-technical',
        customQuestions: [] as { id: string, text: string, category: string }[],
        overrides: {} as Record<string, string>
      },
      { 
        id: 'qc-3', 
        name: 'Leadership Competencies', 
        frameworkId: 'fw-leadership',
        customQuestions: [] as { id: string, text: string, category: string }[],
        overrides: {} as Record<string, string>
      }
    ],
    validations: {
        minPeers: 3,
        requireSupervisor: true
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEvaluatee, setExpandedEvaluatee] = useState<string | null>(null);
  
  // Question Orchestration UX States
  const [expandedQCIds, setExpandedQCIds] = useState<string[]>([]);
  const [frameworkSearch, setFrameworkSearch] = useState('');

  const toggleQCExpansion = (id: string) => {
    setExpandedQCIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFrameworks = competencyFrameworks.filter(f => 
    f.name.toLowerCase().includes(frameworkSearch.toLowerCase()) ||
    f.description?.toLowerCase().includes(frameworkSearch.toLowerCase())
  );

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
    const finalFrameworkIds: string[] = [];
    
    // Process each collection to determine its final framework identity
    formData.questionCollections.forEach(qc => {
      const framework = competencyFrameworks.find(f => f.id === qc.frameworkId);
      const hasOverrides = Object.keys(qc.overrides).length > 0;
      const hasCustom = qc.customQuestions.length > 0;
      
      if (hasOverrides || hasCustom) {
        // Create a unique Virtual Framework for this specific collection
        const virtualFrameworkId = `custom-fw-${Date.now()}-${qc.id}`;
        
        // Merge framework questions (with potential overrides)
        const frameworkQuestions = framework 
          ? framework.questions.map(q => ({
              ...q,
              text: qc.overrides[q.id] || q.text
            }))
          : [];

        // Combine with ad-hoc custom questions
        addCompetencyFramework({
          id: virtualFrameworkId,
          name: qc.name,
          description: `Customized performance protocol for ${formData.title}`,
          questions: [
            ...frameworkQuestions,
            ...qc.customQuestions.map(q => ({
              id: q.id,
              category: q.category,
              text: q.text
            }))
          ]
        });
        
        finalFrameworkIds.push(virtualFrameworkId);
      } else if (qc.frameworkId) {
        // Use the standard template framework as-is
        finalFrameworkIds.push(qc.frameworkId);
      }
    });

    deployEvaluationCycle({
      id: `cycle-${Date.now()}`,
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type as any,
      status: 'active',
      weights: { own: 60, shared: 40 },
      competencies: { behavioral: true, technical: true, leadership: false },
      customCompetencyFrameworkIds: finalFrameworkIds
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
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[24px] border border-slate-100">
           {[1, 2, 3, 4, 5].map(s => (
             <div key={s} className="flex items-center gap-4">
               <div 
                 className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black transition-all duration-500 ${
                   step === s 
                     ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
                     : step > s 
                       ? 'bg-green-500 text-white' 
                       : 'bg-white text-slate-300 border border-slate-100'
                 }`}
               >
                 {step > s ? <Check className="w-4 h-4" /> : s}
               </div>
               {s < 5 && (
                 <div className={`w-6 h-[1.5px] rounded-full transition-colors duration-500 ${step > s ? 'bg-green-200' : 'bg-slate-200'}`} />
               )}
             </div>
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
                                          <span className="text-slate-900 font-black">{kpi.weight}%</span>
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  Question Orchestration
                </h2>
                <div className="flex gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {formData.questionCollections.length} ACTIVE SUITES
                  </span>
                </div>
              </div>

              <div className="max-w-3xl mx-auto space-y-10">
                {/* Framework Library - Search & Quick Add */}
                <section className="bg-indigo-600 p-8 rounded-[40px] shadow-2xl shadow-indigo-100 text-white space-y-6">
                  <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div>
                      <h3 className="font-black text-xl tracking-tight">Framework Library</h3>
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">Industrial Competency Suites</p>
                    </div>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                      <input 
                        type="text"
                        placeholder="Search suite..."
                        value={frameworkSearch}
                        onChange={e => setFrameworkSearch(e.target.value)}
                        className="bg-indigo-700/50 border-none rounded-2xl pl-10 pr-4 py-2 text-xs font-bold placeholder:text-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none w-full sm:w-48 transition-all focus:sm:w-64 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredFrameworks.map(f => {
                      const isAdded = formData.questionCollections.some(qc => qc.frameworkId === f.id);
                      return (
                        <button 
                          key={f.id}
                          onClick={() => {
                            if (isAdded) {
                              setFormData(prev => ({
                                ...prev,
                                questionCollections: prev.questionCollections.filter(qc => qc.frameworkId !== f.id)
                              }));
                            } else {
                              const newId = `qc-${Date.now()}-${f.id}`;
                              setFormData(prev => ({
                                ...prev,
                                questionCollections: [
                                  ...prev.questionCollections,
                                  { id: newId, name: f.name, frameworkId: f.id, customQuestions: [] as { id: string, text: string, category: string }[], overrides: {} as Record<string, string> }
                                ]
                              }));
                              // Expand new collection immediately
                              setExpandedQCIds(prev => [...prev, newId]);
                            }
                          }}
                          className={`p-4 rounded-[28px] border text-left transition-all group relative overflow-hidden ${
                            isAdded 
                              ? 'bg-white text-indigo-600 border-white shadow-lg translate-y-[-2px]' 
                              : 'bg-indigo-700/40 border-indigo-500/30 text-indigo-100 hover:bg-indigo-700/60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 relative z-10">
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isAdded ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-800 text-indigo-400 group-hover:bg-indigo-700'}`}>
                               {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                             </div>
                          </div>
                          <p className="font-black text-[11px] leading-tight transition-colors relative z-10">{f.name}</p>
                          <p className={`text-[9px] font-bold mt-1 uppercase tracking-tighter relative z-10 ${isAdded ? 'text-indigo-400' : 'text-indigo-300/50'}`}>{f.questions.length} Metrics</p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 space-y-8">
                   <h3 className="font-black text-slate-900 flex justify-between items-center">
                     Active Orchestration
                     <button 
                       onClick={() => {
                          const newId = `qc-${Date.now()}`;
                          setFormData(prev => ({ 
                              ...prev, 
                              questionCollections: [
                                ...prev.questionCollections, 
                                { id: newId, name: 'Untitled Collection', frameworkId: '', customQuestions: [] as { id: string, text: string, category: string }[], overrides: {} as Record<string, string> }
                              ] 
                          }));
                          setExpandedQCIds(prev => [...prev, newId]);
                       }}
                       className="text-indigo-600 text-[10px] uppercase font-black flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md active:scale-95"
                     >
                        <Plus className="w-4 h-4" /> New Ad-hoc Collection
                     </button>
                   </h3>
                   
                   <div className="space-y-4">
                      {formData.questionCollections.map((qc, idx) => {
                        const framework = competencyFrameworks.find(f => f.id === qc.frameworkId);
                        const isExpanded = expandedQCIds.includes(qc.id);
                        
                        return (
                          <div key={qc.id} className={`bg-white rounded-[32px] border transition-all overflow-hidden ${isExpanded ? 'border-indigo-200 ring-4 ring-indigo-50/50 shadow-xl' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                             <div className="p-6">
                               <div className="flex gap-4 items-start">
                                 <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                      <input 
                                        type="text"
                                        value={qc.name}
                                        onChange={e => {
                                            const copy = [...formData.questionCollections];
                                            copy[idx].name = e.target.value;
                                            setFormData({...formData, questionCollections: copy});
                                        }}
                                        className="font-black text-slate-900 border-none p-0 focus:ring-0 text-sm bg-transparent w-full"
                                        placeholder="Suite Name"
                                      />
                                      {framework && (
                                        <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0">Industrial Suite</span>
                                      )}
                                    </div>
                                    <select 
                                      value={qc.frameworkId}
                                      onChange={e => {
                                          const copy = [...formData.questionCollections];
                                          copy[idx].frameworkId = e.target.value;
                                          setFormData({...formData, questionCollections: copy});
                                      }}
                                      className="w-full bg-slate-50 text-[11px] font-bold text-slate-500 rounded-xl border-none px-4 py-2.5 cursor-pointer focus:ring-2 focus:ring-slate-100 transition-all"
                                    >
                                       <option value="">Select Protocol Template</option>
                                       {competencyFrameworks.map(cf => <option key={cf.id} value={cf.id}>{cf.name}</option>)}
                                    </select>
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <button 
                                     onClick={() => setFormData(prev => ({ 
                                         ...prev, 
                                         questionCollections: prev.questionCollections.filter(item => item.id !== qc.id) 
                                     }))}
                                     className="text-slate-200 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all shrink-0"
                                   >
                                     <Trash2 className="w-5 h-5" />
                                   </button>
                                 </div>
                               </div>

                               <div className="pt-4 mt-2 border-t border-slate-50">
                                 <button 
                                   onClick={() => toggleQCExpansion(qc.id)}
                                   className="w-full flex justify-between items-center group/btn"
                                 >
                                   <div className="flex items-center gap-3">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Benchmarks</p>
                                     <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50">
                                       { (framework?.questions.length || 0) + qc.customQuestions.length } PROTOCOLS
                                     </span>
                                   </div>
                                   <ChevronDown className={`w-5 h-5 text-slate-300 group-hover/btn:text-indigo-500 transition-all duration-500 ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`} />
                                 </button>

                                 <AnimatePresence>
                                   {isExpanded && (
                                     <motion.div 
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: 'auto', opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       className="overflow-hidden"
                                     >
                                       <div className="pt-6 space-y-4">
                                          {/* Framework Questions */}
                                          <div className="grid gap-2">
                                            {framework?.questions.map((q, qIdx) => {
                                              const currentText = qc.overrides[q.id] || q.text;
                                              const isModified = !!qc.overrides[q.id];

                                              return (
                                                <div key={q.id} className={`p-4 rounded-2xl text-[11px] font-bold flex gap-4 border transition-all group/item ${isModified ? 'bg-amber-50/30 border-amber-100 hover:border-amber-200' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-sm'}`}>
                                                  <span className={`font-serif italic text-xs transition-colors ${isModified ? 'text-amber-500' : 'text-indigo-300'}`}>#{qIdx + 1}</span>
                                                  <div className="flex-1 space-y-2">
                                                    <textarea 
                                                      value={currentText}
                                                      onChange={e => {
                                                        const copy = [...formData.questionCollections];
                                                        copy[idx].overrides = { ...copy[idx].overrides, [q.id]: e.target.value };
                                                        setFormData({...formData, questionCollections: copy});
                                                      }}
                                                      className="w-full bg-transparent border-none p-0 text-[11px] font-bold text-slate-700 focus:ring-0 resize-none leading-relaxed placeholder:text-slate-300 min-h-[40px]"
                                                      placeholder="Standard benchmark text..."
                                                    />
                                                    <div className="flex justify-between items-center">
                                                      <span className={`text-[8px] uppercase tracking-widest transition-colors ${isModified ? 'text-amber-600 font-black' : 'text-slate-400'}`}>
                                                        {isModified ? 'CUSTOMIZED PROTOCOL' : q.category}
                                                      </span>
                                                      {isModified && (
                                                        <button 
                                                          onClick={() => {
                                                            const copy = [...formData.questionCollections];
                                                            const { [q.id]: _, ...remaining } = copy[idx].overrides;
                                                            copy[idx].overrides = remaining;
                                                            setFormData({...formData, questionCollections: copy});
                                                          }}
                                                          className="text-[8px] font-black uppercase text-amber-600 hover:underline flex items-center gap-1"
                                                        >
                                                           Reset to Template
                                                        </button>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>

                                          {/* Custom Questions Header */}
                                          <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                            <div className="relative flex justify-center">
                                              <button 
                                                onClick={() => {
                                                    const copy = [...formData.questionCollections];
                                                    copy[idx].customQuestions = [
                                                      ...copy[idx].customQuestions,
                                                      { id: `custom-${Date.now()}`, text: '', category: 'New Ad-hoc' }
                                                    ];
                                                    setFormData({...formData, questionCollections: copy});
                                                }}
                                                className="bg-white px-4 text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] border border-slate-100 rounded-full py-1.5 shadow-sm hover:shadow-md transition-all active:scale-95"
                                              >
                                                + Add Ad-hoc Benchmark
                                              </button>
                                            </div>
                                          </div>

                                          {/* Custom Questions List */}
                                          <div className="grid gap-3">
                                            {qc.customQuestions.map((q, qIdx) => (
                                              <div key={q.id} className="p-5 bg-purple-50/10 rounded-3xl flex gap-4 border border-purple-100 shadow-sm animate-in slide-in-from-left-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                                   <Plus className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                  <textarea 
                                                    value={q.text}
                                                    onChange={e => {
                                                      const copy = [...formData.questionCollections];
                                                      copy[idx].customQuestions[qIdx].text = e.target.value;
                                                      setFormData({...formData, questionCollections: copy});
                                                    }}
                                                    className="w-full bg-transparent border-none p-0 text-[11px] font-bold text-slate-700 focus:ring-0 placeholder:text-slate-300 min-h-[50px] resize-none"
                                                    placeholder="Describe custom performance criteria..."
                                                  />
                                                  <div className="flex justify-between items-center bg-white/50 p-2 rounded-xl border border-purple-50">
                                                    <input 
                                                      value={q.category}
                                                      onChange={e => {
                                                        const copy = [...formData.questionCollections];
                                                        copy[idx].customQuestions[qIdx].category = e.target.value;
                                                        setFormData({...formData, questionCollections: copy});
                                                      }}
                                                      className="text-[8px] font-black uppercase text-purple-600 bg-purple-100/50 px-2 py-1 rounded-md border-none focus:ring-0 max-w-[100px]"
                                                    />
                                                    <button 
                                                      onClick={() => {
                                                        const copy = [...formData.questionCollections];
                                                        copy[idx].customQuestions = copy[idx].customQuestions.filter(item => item.id !== q.id);
                                                        setFormData({...formData, questionCollections: copy});
                                                      }}
                                                      className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                               </div>
                             </div>
                          </div>
                        );
                      })}
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
