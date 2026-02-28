import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Uploads from './pages/Uploads';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import { authService } from './services/authService';
import type { User } from 'firebase/auth';

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthPage = location.pathname.startsWith('/auth');

  if (!user && !isAuthPage) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/documents': return 'Document Repository';
      case '/categories': return 'Categories';
      case '/uploads': return 'Quick Upload';
      case '/settings': return 'System Settings';
      default: return 'Archiver';
    }
  };

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="w-full h-screen flex overflow-hidden bg-white font-sans text-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-surface overflow-hidden">
        <Header pageTitle={getPageTitle(location.pathname)} />
        <div className="flex-1 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

/**
 * Main Application component.
 * @returns The root application structure with routing and authentication context.
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
