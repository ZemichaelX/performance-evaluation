import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ChevronRight, ChevronLeft, Check, AlertCircle, User, Calendar, Target, Scale, ListChecks, Users, Sliders } from 'lucide-react';

export const CreateCycle = () => {
  const navigate = useNavigate();
  const { users, kpis, createCycle } = useStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'annual',
    startDate: '2025-07-08',
    endDate: '2026-07-07',
    weights: { own: 55, shared: 45 },
    competencies: {
      behavioral: true,
      technical: true,
      leadership: false
    },
    evaluators: {
      peers: [] as string[],
      supervisor: ''
    }
  });

  const selectedEmployee = users.find(u => u.id === formData.employeeId);
  const employeeKPIs = selectedEmployee ? kpis[selectedEmployee.id] || [] : [];
  
  const handleNext = () => {
    if (step === 4) {
      const sum = formData.weights.own + formData.weights.shared;
      if (sum !== 100) {
        alert("Weights must sum to 100%");
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    createCycle({
      id: `cycle-${Date.now()}`,
      title: `${formData.type === 'annual' ? 'Annual' : 'Semi-Annual'} Review - ${selectedEmployee?.name}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type as 'annual' | 'semi-annual',
      status: 'active',
      weights: formData.weights,
      competencies: formData.competencies
    });
    navigate('/admin/dashboard');
  };

  const steps = [
    { title: 'Select Employee', icon: User },
    { title: 'Type & Period', icon: Calendar },
    { title: 'Review KPIs', icon: Target },
    { title: 'Set Weights', icon: Scale },
    { title: 'Competencies', icon: ListChecks },
    { title: 'Evaluators', icon: Users },
    { title: 'Confirm', icon: Sliders },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header & Stepper */}
      <div className="mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Create Evaluation Cycle</h1>
        
        {/* Stepper UI */}
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
          {steps.map((s, i) => {
            const isCompleted = step > i + 1;
            const isCurrent = step === i + 1;
            return (
              <div key={i} className={`flex flex-col items-center gap-2 bg-slate-50 px-2 group ${isCurrent ? 'scale-110' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isCurrent ? 'bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50' :
                  'bg-white border-slate-300 text-slate-300'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
        {/* Step 1: Select Employee */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Select Employee to Evaluate</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {users.filter(u => u.role === 'employee').map(User => (
                <div 
                  key={User.id}
                  onClick={() => setFormData({...formData, employeeId: User.id})}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                    formData.employeeId === User.id 
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <img src={User.avatar} alt={User.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{User.name}</h3>
                    <p className="text-sm text-slate-500">{User.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Define Type */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Evaluation Type & Period</h2>
            
            <div className="flex gap-4">
               {['annual', 'semi-annual'].map(type => (
                 <button
                   key={type}
                   onClick={() => setFormData({...formData, type})}
                   className={`flex-1 p-4 rounded-xl border capitalize font-medium transition-all ${
                     formData.type === type 
                       ? 'bg-indigo-600 text-white border-indigo-600' 
                       : 'bg-white text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                   {type} Evaluation
                 </button>
               ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input 
                   type="date" 
                   value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                   className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold">Note:</span> Evaluation period automatically aligns with the strategy annual breakdown logic.
            </p>
          </div>
        )}

        {/* Step 3: Fetch KPIs */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Relevant KPIs Fetched</h2>
            <p className="text-slate-500">System automatically retrieved KPIs for <span className="font-medium text-slate-900">{selectedEmployee?.name}</span> based on the selected period.</p>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Own KPIs</h3>
              {employeeKPIs.filter(k => k.type === 'own').map(kpi => (
                <div key={kpi.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="font-medium text-slate-800">{kpi.title}</p>
                  <p className="text-xs text-slate-500">{kpi.description}</p>
                </div>
              ))}

              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide pt-2">Shared KPIs</h3>
              {employeeKPIs.filter(k => k.type === 'shared').map(kpi => (
                <div key={kpi.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-slate-800">{kpi.title}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{kpi.department}</span>
                  </div>
                  <p className="text-xs text-slate-500">{kpi.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Weights */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Define KPI Weights</h2>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Adjusting the split between Own and Shared KPIs. Total must equal 100%.
            </div>

            <div className="flex items-center gap-8 justify-center py-8">
              <div className="text-center">
                <label className="block text-sm font-medium text-slate-700 mb-2">Own KPIs</label>
                <input 
                  type="number" 
                  value={formData.weights.own}
                  onChange={e => setFormData({...formData, weights: {...formData.weights, own: parseInt(e.target.value)}})}
                  className="text-3xl font-bold w-24 text-center border-b-2 border-indigo-500 focus:outline-none"
                />
                <span className="text-xl text-slate-400">%</span>
              </div>
              <span className="text-2xl text-slate-300 font-light">+</span>
              <div className="text-center">
                <label className="block text-sm font-medium text-slate-700 mb-2">Shared KPIs</label>
                <input 
                  type="number" 
                  value={formData.weights.shared}
                  onChange={e => setFormData({...formData, weights: {...formData.weights, shared: parseInt(e.target.value)}})}
                  className="text-3xl font-bold w-24 text-center border-b-2 border-blue-500 focus:outline-none"
                />
                <span className="text-xl text-slate-400">%</span>
              </div>
              <span className="text-2xl text-slate-300 font-light">=</span>
              <div className={`text-center transition-colors ${formData.weights.own + formData.weights.shared === 100 ? 'text-green-600' : 'text-red-600'}`}>
                <p className="text-4xl font-bold">{formData.weights.own + formData.weights.shared}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Competencies */}
        {step === 5 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Configure Competency Framework</h2>
                <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input 
                            type="checkbox" 
                            checked={formData.competencies.behavioral}
                            onChange={e => setFormData({...formData, competencies: {...formData.competencies, behavioral: e.target.checked}})}
                            className="w-5 h-5 text-indigo-600 rounded"
                        />
                        <div>
                            <span className="font-semibold block text-slate-900">Behavioral Competencies</span>
                            <span className="text-sm text-slate-500">Core values, teamwork, communication</span>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input 
                            type="checkbox" 
                            checked={formData.competencies.technical}
                             onChange={e => setFormData({...formData, competencies: {...formData.competencies, technical: e.target.checked}})}
                            className="w-5 h-5 text-indigo-600 rounded"
                        />
                         <div>
                            <span className="font-semibold block text-slate-900">Technical Competencies</span>
                            <span className="text-sm text-slate-500">Role-specific skills and expertise</span>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50">
                        <input 
                            type="checkbox" 
                            checked={formData.competencies.leadership}
                             onChange={e => setFormData({...formData, competencies: {...formData.competencies, leadership: e.target.checked}})}
                            className="w-5 h-5 text-indigo-600 rounded"
                        />
                         <div>
                            <span className="font-semibold block text-slate-900">Leadership Competencies</span>
                            <span className="text-sm text-slate-500">Management, strategy, personnel development</span>
                        </div>
                    </label>
                </div>
            </div>
        )}

        {/* Step 6: Evaluators */}
        {step === 6 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Assign Evaluators</h2>
                
                <div>
                    <label className="block font-medium text-slate-700 mb-2">Supervisor (Main Evaluator)</label>
                    <select 
                        className="w-full p-3 border rounded-lg bg-white"
                        onChange={e => setFormData({...formData, evaluators: {...formData.evaluators, supervisor: e.target.value}})}
                    >
                        <option value="">Select Supervisor...</option>
                        {users.filter(u => u.role !== 'employee').map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-slate-700 mb-2">Peer Evaluators</label>
                    <div className="grid md:grid-cols-2 gap-2">
                         {users.filter(u => u.role === 'employee' && u.id !== formData.employeeId).map(u => (
                            <label key={u.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                <input type="checkbox" className="rounded text-indigo-600" />
                                <span className="text-sm">{u.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Step 7: Confirm */}
        {step === 7 && (
            <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Ready to Launch?</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    You are about to launch a <span className="font-bold">{formData.type}</span> evaluation for <span className="font-bold">{selectedEmployee?.name}</span>. 
                    Notifications will be sent to the employee and assigned evaluators immediately.
                </p>
                
                <div className="bg-slate-50 p-6 rounded-xl text-left max-w-md mx-auto space-y-2 text-sm border border-slate-200">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Weights:</span>
                        <span className="font-medium">{formData.weights.own}/{formData.weights.shared} (Own/Shared)</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-slate-500">Period:</span>
                         <span className="font-medium">{formData.startDate} to {formData.endDate}</span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex justify-between">
        <button 
          onClick={handleBack} 
          disabled={step === 1}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            step === 1 ? 'opacity-0' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Back
        </button>

        {step < 7 ? (
           <button 
             onClick={handleNext}
             disabled={!formData.employeeId}
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200"
           >
             Continue <ChevronRight className="w-4 h-4" />
           </button>
        ) : (
            <button 
             onClick={handleSubmit} 
             className="px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 animate-pulse"
           >
             Launch Evaluation <Check className="w-4 h-4" />
           </button>
        )}
      </div>
    </div>
  );
};
