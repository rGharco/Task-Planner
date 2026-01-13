import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AssignTaskPage from './pages/assign_task/assign_task';
import ProfilePage from './pages/profile/profile';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import HomePage from './pages/home/home';
import DashboardPage from './pages/dashboard/dashboard';
import HistoryPage from './pages/history/history';
import SettingsPage from './pages/settings/settings';
import ProtectedRoute from './components/protected_route/ProtectedRoute';
import Taskbar from './components/taskbar/taskbar';

function AppContent() {
  const location = useLocation();
  
  // Don't show taskbar on login/register pages
  const hideTaskbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="background">
      {!hideTaskbar && <Taskbar/>}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage/>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>
        } />
        <Route path="/assign-task" element={
          <ProtectedRoute>
            <AssignTaskPage/>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage/>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage/>
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent/>
    </BrowserRouter>
  );
}

export default App;