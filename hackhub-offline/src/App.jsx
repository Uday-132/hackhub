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
import Search from './pages/Search';
import Profile from './pages/Profile';
import EditProfile from './pages/settings/EditProfile';
import Notifications from './pages/settings/Notifications';
import PrivacySecurity from './pages/settings/PrivacySecurity';

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
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/edit-profile" element={<EditProfile />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/privacy" element={<PrivacySecurity />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-event" element={<AddEvent />} />
            <Route path="/admin/edit-event/:id" element={<AddEvent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
