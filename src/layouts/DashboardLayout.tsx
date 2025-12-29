import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'employee' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, type }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isTabActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar - Elegant Light Theme */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 h-20 border-b border-slate-100/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Strategy Dropdown - Light Theme */}
            <div className="relative">
              <button 
                onClick={() => setIsStrategyOpen(!isStrategyOpen)}
                className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all border border-slate-200/50 group"
              >
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Strategy</span>
                <span className="text-sm font-bold text-indigo-600">2024/2027</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isStrategyOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isStrategyOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="px-5 py-2 text-xs font-black text-slate-400 uppercase tracking-widest">Select Strategy</p>
                  <button className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 font-bold text-indigo-600 flex items-center justify-between">
                    Strategy 2024/2027
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  </button>
                  <button className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 text-slate-500 font-medium">Strategy 2021/2023</button>
                </div>
              )}
            </div>
          </div>

          {/* User Profile Info - Light Theme */}
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{currentUser?.department}</p>
            </div>
            <div className="flex items-center gap-2 group relative">
               <div className="relative">
                  <img src={currentUser?.avatar} alt="Profile" className="w-11 h-11 rounded-2xl border-2 border-white shadow-md group-hover:shadow-indigo-100 transition-all duration-300 object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div className="absolute top-full right-0 pt-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl py-3 w-48 overflow-hidden">
                     <div className="px-5 py-3 border-b border-slate-50 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.email}</p>
                     </div>
                     <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-bold transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Primary Navigation Tabs - Light Theme */}
      <div className="bg-white/50 border-b border-slate-100/60 sticky top-20 z-40">
        <div className="max-w-[1400px] mx-auto px-8 flex gap-10">
          {type === 'employee' ? (
            <>
              <TabLink to="/employee/dashboard" active={isTabActive('/employee/dashboard')}>Dashboard</TabLink>
              <TabLink to="/employee/history" active={isTabActive('/employee/history')}>Evaluation History</TabLink>
            </>
          ) : (
            <>
              <TabLink to="/admin/dashboard" active={isTabActive('/admin/dashboard')}>Admin Console</TabLink>
              <TabLink to="/admin/create-evaluation" active={isTabActive('/admin/create-evaluation')}>Evaluation Management</TabLink>
              <TabLink to="/admin/status" active={isTabActive('/admin/status')}>Evaluation Status</TabLink>
              <TabLink to="/admin/frameworks" active={isTabActive('/admin/frameworks')}>Competency Frameworks</TabLink>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="py-10 px-8 max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
};

const TabLink = ({ to, children, active }: { to: string, children: React.ReactNode, active: boolean }) => (
  <Link 
    to={to} 
    className={`py-4 text-sm font-bold border-b-2 transition-all ${
      active 
        ? 'border-blue-600 text-blue-600' 
        : 'border-transparent text-slate-500 hover:text-slate-700'
    }`}
  >
    {children}
  </Link>
);
