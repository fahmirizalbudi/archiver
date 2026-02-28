import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Uploads from './pages/Uploads';
import Categories from './pages/Categories';
import Settings from './pages/Settings';

const AppContent = () => {
  const location = useLocation();
  
  // Simple title mapper based on path
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/documents': return 'Document Repository';
      case '/categories': return 'Categories';
      case '/uploads': return 'Quick Upload';
      case '/archive': return 'Long-term Archive';
      case '/settings': return 'Settings';
      case '/security': return 'Access Control';
      default: return 'Archiver';
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden bg-white font-sans text-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-surface overflow-hidden">
        <Header pageTitle={getPageTitle(location.pathname)} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/uploads" element={<Uploads />} />
          <Route path="/settings" element={<Settings />} />
          {/* Fallback views for demo */}
          <Route path="/security" element={<div className="p-8 text-gray-400">Access Control View (In Development)</div>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
