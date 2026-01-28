import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AdminDashboard from './pages/admin/Dashboard';
import AddEvent from './pages/admin/AddEvent';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-event" element={<AddEvent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
