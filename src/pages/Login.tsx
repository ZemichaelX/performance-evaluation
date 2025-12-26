import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Lock } from 'lucide-react';

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Performance Evaluation
        </h1>
        <p className="text-slate-500">Evaluation Management System</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex gap-4 mb-8 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedRole('employee')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedrole === 'employee'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Employee Portal
          </button>
          <button
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedrole === 'admin'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin Portal
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-400" />
            Select Demo User
          </h2>
          
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
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          Secure Evaluation Environment
        </div>
      </div>
    </div>
  );
};
