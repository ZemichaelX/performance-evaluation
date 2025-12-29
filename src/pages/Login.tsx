import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { users, login } = useStore();
  const [selectedrole, setSelectedRole] = useState<'employee' | 'admin'>('employee');

  const handleLogin = (email: string) => {
    login(email);
    if (selectedrole === 'employee') {
      navigate('/employee/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  // Filter users by role for the simple "Click to Login" demo
  const demoUsers = users.filter(u => u.role === selectedrole);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 tracking-tighter">
          Strategize<span className="text-blue-500">.</span>
        </h1>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="flex gap-4 mb-10 bg-slate-100 p-1.5 rounded-[20px]">
          <button
            onClick={() => setSelectedRole('employee')}
            className={`flex-1 py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              selectedrole === 'employee'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              selectedrole === 'admin'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-400" />
            Select Demo Persona
          </h2>
          
          {selectedrole === 'employee' ? (
            <>
              {/* Persona 1: Self Evaluation */}
              <button
                onClick={() => handleLogin('alex@company.com')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex items-center gap-4 bg-white hover:bg-blue-50/30"
              >
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Alex" className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">SELF</div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Abebe Kebede</p>
                  <p className="text-xs text-slate-500 font-medium">Evaluatee (Me)</p>
                </div>
              </button>

              {/* Persona 2: Subordinate Evaluator */}
              <button
                onClick={() => handleLogin('david@company.com')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group flex items-center gap-4 bg-white hover:bg-purple-50/30"
              >
                <div className="relative">
                   <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="David" className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
                   <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">SUB</div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Abrham Kebede</p>
                  <p className="text-xs text-slate-500 font-medium">Evaluating Abebe (Subordinate)</p>
                </div>
              </button>

              {/* Persona 3: Peer Evaluator */}
              <button
                onClick={() => handleLogin('jessica@company.com')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex items-center gap-4 bg-white hover:bg-blue-50/30"
              >
                <div className="relative">
                   <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Jessica" className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
                   <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">PEER</div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Bethlehem Tadesse</p>
                  <p className="text-xs text-slate-500 font-medium">Evaluating Abebe (Peer)</p>
                </div>
              </button>

              {/* Persona 4: Supervisor Evaluator */}
              <button
                onClick={() => handleLogin('robert@company.com')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all group flex items-center gap-4 bg-white hover:bg-rose-50/30"
              >
                <div className="relative">
                   <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Robert" className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
                   <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">SUP</div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Yosef Tesfaye</p>
                  <p className="text-xs text-slate-500 font-medium">Evaluating Abebe (Supervisor)</p>
                </div>
              </button>
            </>
          ) : (
            <>
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.email)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex items-center gap-4 bg-slate-50 hover:bg-white"
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.department}</p>
                  </div>
                </button>
              ))}
              
              {demoUsers.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">
                  No demo users found for this role.
                </p>
              )}
            </>
          )}

        </div>


      </div>
    </div>
  );
};
