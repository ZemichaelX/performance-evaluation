import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, History, Settings, Users, FileText } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'employee' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, type }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Performance Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
            {type === 'admin' ? 'Admin Console' : 'Employee Portal'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {type === 'employee' ? (
            <>
              <NavItem to="/employee/dashboard" icon={<LayoutDashboard />} label="Overview" active />
              <NavItem to="/employee/history" icon={<History />} label="Evaluation History" />
              <NavItem to="/employee/profile" icon={<Settings />} label="My Profile" />
            </>
          ) : (
             <>
              <NavItem to="/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" active />
              <NavItem to="/admin/evaluations" icon={<FileText />} label="Evaluations" />
              <NavItem to="/admin/employees" icon={<Users />} label="Employees" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={currentUser?.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-600" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.department}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active?: boolean }) => (
  <a href={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
    active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
  }`}>
    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    {label}
  </a>
);
