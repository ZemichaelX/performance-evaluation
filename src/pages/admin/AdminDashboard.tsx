import React from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Calendar, Users, FileText, ArrowRight, BarChart3, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { cycles, users, submissions } = useStore();
  const navigate = useNavigate();

  const activeCycles = cycles.filter(c => c.status === 'active');
  const upcomingCycles = cycles.filter(c => c.status === 'upcoming');
  const employees = users.filter(u => u.role === 'employee');
  
  // Calculate completion rate for active cycle
  const totalExpected = activeCycles.length * employees.length; // Simplistic
  const totalSubmitted = submissions.length;
  const progress = totalExpected ? (totalSubmitted / totalExpected) * 100 : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-500 mt-1">Manage cycles, track progress, and review analytics.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-cycle')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Create New Cycle
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard label="Active Cycles" value={activeCycles.length} icon={<Clock className="text-orange-500" />} />
        <StatCard label="Total Employees" value={employees.length} icon={<Users className="text-blue-500" />} />
        <StatCard label="Pending Reviews" value={totalExpected - totalSubmitted} icon={<FileText className="text-pink-500" />} />
        <StatCard label="Avg Completion" value={`${progress.toFixed(0)}%`} icon={<BarChart3 className="text-green-500" />} />
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Active Cycles List */}
        <section className="md:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Active Evaluation Cycles
          </h2>
          
          <div className="space-y-4">
            {activeCycles.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No active evaluation cycles.</p>
                <button className="text-indigo-600 font-medium mt-2 hover:underline" onClick={() => navigate('/admin/create-cycle')}>Launch one now</button>
              </div>
            )}
            
            {activeCycles.map(cycle => (
              <div key={cycle.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-slate-900">{cycle.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase tracking-wide">Active</span>
                    </div>
                    <p className="text-sm text-slate-500">{cycle.startDate} — {cycle.endDate}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100">
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Type</p>
                      <p className="text-sm font-medium capitalize">{cycle.type}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Weights</p>
                      <p className="text-sm font-medium">{cycle.weights.own}/{cycle.weights.shared} Split</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Competencies</p>
                      <div className="flex gap-1">
                        {cycle.competencies.behavioral && <div className="w-2 h-2 rounded-full bg-blue-400" title="Behavioral"></div>}
                        {cycle.competencies.technical && <div className="w-2 h-2 rounded-full bg-indigo-400" title="Technical"></div>}
                        {cycle.competencies.leadership && <div className="w-2 h-2 rounded-full bg-purple-400" title="Leadership"></div>}
                      </div>
                   </div>
                </div>

                <div className="mt-2 bg-slate-100 rounded-full h-2 w-full overflow-hidden">
                   {/* Fake progress for demo */}
                   <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full w-[35%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Progress</span>
                  <span>35% Completed</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar / Recent Activity */}
        <aside className="md:col-span-4 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="space-y-6 relative">
                <ActivityItem 
                  user="Alex Johnson" 
                  action="submitted self-evaluation" 
                  time="2 hours ago" 
                  avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
                <ActivityItem 
                  user="Sarah Connor" 
                  action="created 'Annual Review 2025'" 
                  time="5 hours ago" 
                  avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
                 <ActivityItem 
                  user="Mike Chen" 
                  action="completed peer review for Alex" 
                  time="1 day ago" 
                  avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ user, action, time, avatar }: any) => (
  <div className="flex gap-3">
    <img src={avatar} alt={user} className="w-8 h-8 rounded-full border border-slate-200" />
    <div>
      <p className="text-sm text-slate-800">
        <span className="font-semibold">{user}</span> {action}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">{time}</p>
    </div>
  </div>
);
