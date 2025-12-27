import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, FileText, CheckCircle2, Sliders, Layout, Settings } from 'lucide-react';
import type { CompetencyQuestion } from '../../types';

export const Management = () => {
  const { competencyFrameworks, addCompetencyFramework } = useStore();
  const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
  const [newFramework, setNewFramework] = useState({
    name: '',
    description: '',
    questions: [] as CompetencyQuestion[]
  });

  const handleCreateFramework = () => {
    if (newFramework.name && newFramework.questions.length > 0) {
      addCompetencyFramework({
        ...newFramework,
        id: `cf-${Date.now()}`
      });
      setIsFrameworkModalOpen(false);
      setNewFramework({ name: '', description: '', questions: [] });
    }
  };

  const addQuestion = () => {
    setNewFramework({
      ...newFramework,
      questions: [
        ...newFramework.questions,
        { id: `q-${Date.now()}`, category: 'General', text: '' }
      ]
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System <span className="text-indigo-600">Control</span></h1>
          <p className="text-slate-500 font-semibold tracking-tight">Architectural parameter configuration and competency orchestration.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white border border-slate-200 text-slate-600 p-4 rounded-2xl hover:bg-slate-50 transition-all">
             <Settings className="w-6 h-6" />
           </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
        <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Layout className="w-6 h-6 text-indigo-600" />
              </div>
              Competency Frameworks
            </h3>
            <button 
              onClick={() => setIsFrameworkModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Plus className="w-4 h-4" /> New Framework
            </button>
          </div>

          <div className="space-y-4">
            {competencyFrameworks.map(cf => (
              <div key={cf.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{cf.name}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1">{cf.description}</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                    {cf.questions.length} Benchmarks
                  </span>
                </div>
                <div className="flex gap-2">
                   <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Edit Framework</button>
                   <span className="text-slate-200">•</span>
                   <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Deactivate</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Sliders className="w-6 h-6 text-orange-600" />
            </div>
            Evaluation Protocol Library
          </h3>
          
          <div className="grid gap-6">
            <ProtocolCard 
              type="Self Audit" 
              description="Standardized self-reflection metrics for performance alignment."
            />
            <ProtocolCard 
              type="Peer Review" 
              description="Collaborative feedback loops for multi-dimensional assessment."
            />
            <ProtocolCard 
              type="Supervisor Audit" 
              description="Leadership-level performance verification and strategic goal audit."
            />
          </div>
        </section>
      </div>

      {isFrameworkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Define Competency <span className="text-indigo-600">Framework</span></h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">Create immutable performance benchmarks.</p>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Framework Identifier</label>
                 <input 
                   type="text" 
                   value={newFramework.name} 
                   onChange={e => setNewFramework({...newFramework, name: e.target.value})}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                   placeholder="e.g., Technical Engineering Core" 
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Strategic Description</label>
                 <textarea 
                   value={newFramework.description} 
                   onChange={e => setNewFramework({...newFramework, description: e.target.value})}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                   placeholder="Purpose and scope of this framework..." 
                   rows={3} 
                 />
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Performance Benchmarks</label>
                   <button 
                     onClick={addQuestion}
                     className="text-indigo-600 font-black text-xs hover:text-indigo-700 transition-colors uppercase tracking-widest flex items-center gap-2"
                   >
                     <Plus className="w-3 h-3" /> Add Benchmark
                   </button>
                 </div>
                 
                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {newFramework.questions.map((q, idx) => (
                     <div key={q.id} className="flex gap-4 animate-in slide-in-from-right-4 duration-300">
                       <input 
                         type="text" 
                         value={q.text} 
                         onChange={e => {
                           const qCopy = [...newFramework.questions];
                           qCopy[idx].text = e.target.value;
                           setNewFramework({...newFramework, questions: qCopy});
                         }}
                         className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 font-bold text-slate-700" 
                         placeholder={`Benchmark Priority ${idx + 1}`} 
                       />
                       <button 
                         onClick={() => setNewFramework({
                           ...newFramework, 
                           questions: newFramework.questions.filter(item => item.id !== q.id)
                         })}
                         className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="flex gap-4 pt-6">
                 <button 
                   onClick={() => setIsFrameworkModalOpen(false)}
                   className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-xs hover:bg-slate-50 rounded-2xl transition-all"
                 >
                   Discard
                 </button>
                 <button 
                   onClick={handleCreateFramework}
                   className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                 >
                   Commit Framework
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProtocolCard = ({ type, description }: any) => (
  <div className="flex items-center justify-between p-8 bg-slate-50 border border-slate-100 rounded-[32px] group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
        <FileText className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div>
        <h4 className="font-black text-slate-900 text-lg leading-tight">{type} Protocol</h4>
        <p className="text-xs font-bold text-slate-400 mt-1 max-w-[200px] leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-3">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
        <CheckCircle2 className="w-3 h-3" /> System Active
      </span>
      <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4">Configure</button>
    </div>
  </div>
);
