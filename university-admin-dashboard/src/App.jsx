import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ManageUsers from './pages/ManageUsers';
import ManageVacancies from './pages/ManageVacancies';
import Profile from './pages/AdminProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="vacancies" element={<ManageVacancies />} />
          
           {/* Profile is part of the layout route so it shares the sidebar */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;