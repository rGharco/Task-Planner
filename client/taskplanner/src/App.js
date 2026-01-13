import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AssignTaskPage from './pages/assign_task/assign_task';
import ProfilePage from './pages/profile/profile';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import ProtectedRoute from './components/protected_route/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        
        {/* Protected routes - require login */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        } />
        <Route path="/assign-task" element={
          <ProtectedRoute>
            <AssignTaskPage/>
          </ProtectedRoute>
        } />
        
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;