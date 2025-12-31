import logo from './logo.svg';
import './App.css';
import AssignTaskPage from './pages/assign_task/assign_task';
import ProfilePage from './pages/profile/profile';
import HomePage from './pages/home/home';
import DashboardPage from './pages/dashboard/dashboard';
import HistoryPage from './pages/history/history';
import SettingsPage from './pages/settings/settings';
import Taskbar from './components/taskbar/taskbar';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div class="background">
      <Taskbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/assign-task" element={<AssignTaskPage/>}/>
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
