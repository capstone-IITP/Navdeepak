import { Routes, Route } from 'react-router-dom';
import Portfolio from './Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
    </Routes>
  );
}

export default App;
