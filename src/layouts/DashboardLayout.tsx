import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { NotificationDropdown } from '../components/NotificationDropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: 'employee' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, type }) => {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

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
            {/* Strategize Brand Logo */}
            <Link to="/" className="group">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tighter">
                Strategize<span className="text-blue-500">.</span>
              </span>
            </Link>
          </div>

          {/* User Profile Info - Light Theme */}
          <div className="flex items-center gap-6">
            <NotificationDropdown />
            
            <div className="h-8 w-px bg-slate-200"></div>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 font-bold tracking-widest">{currentUser?.email}</p>
            </div>
            <div className="flex items-center gap-2 group relative">
               <div className="relative">
                  <img src={currentUser?.avatar} alt="Profile" className="w-11 h-11 rounded-2xl border-2 border-white shadow-md group-hover:shadow-blue-100 transition-all duration-300 object-cover" />
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
      <div className="bg-white border-b border-slate-100/60 sticky top-20 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 flex gap-10">
          {type === 'employee' ? (
            <>
              <TabLink to="/employee/dashboard" active={isTabActive('/employee/dashboard')}>Dashboard</TabLink>
              <TabLink to="/employee/history" active={isTabActive('/employee/history')}>History</TabLink>
            </>
          ) : (
            <>
              <TabLink to="/admin/dashboard" active={isTabActive('/admin/dashboard')}>Dashboard</TabLink>
              <TabLink to="/admin/create-evaluation" active={isTabActive('/admin/create-evaluation')}>Add Evaluation</TabLink>
              <TabLink to="/admin/status" active={isTabActive('/admin/status')}>Evaluation Stats</TabLink>
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
