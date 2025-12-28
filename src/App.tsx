import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EvaluationHistory } from './pages/employee/History';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateEvaluation } from './pages/admin/CreateEvaluation';
import { Management } from './pages/admin/Management';
import { DashboardLayout } from './layouts/DashboardLayout';

function App() {
  const { currentUser } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Employee Routes */}
        <Route path="/employee/*" element={
          currentUser?.role === 'employee' ? (
            <DashboardLayout type="employee">
              <Routes>
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="history" element={<EvaluationHistory />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          // For demo purposes, we might allow non-admin to see admin login or similar,
          // but strictly here we check role.
          // Note: The user asked for localhost:port/admin to be the admin side.
          currentUser?.role === 'admin' ? (
            <DashboardLayout type="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="create-evaluation" element={<CreateEvaluation />} />
                <Route path="management" element={<Management />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardLayout>
          ) : (
            // If accessing /admin but not logged in, go to login. 
            // Real apps might have separate admin login, but we'll share for now.
             <Navigate to="/login" />
          )
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
