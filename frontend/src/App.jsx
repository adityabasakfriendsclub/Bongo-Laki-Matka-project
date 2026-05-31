import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FreeTipsPage from './pages/FreeTipsPage';
import PattiListPage from './pages/PattiListPage';
import OldResultsPage from './pages/OldResultsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #1a0800 0%, #100500 100%)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #ffc107, transparent)' }} />
      </div>

      {/* Hide header on admin page */}
      <Routes>
        <Route path="/admin" element={null} />
        <Route path="*" element={<Header />} />
      </Routes>

      <main className="relative z-10">
        <Routes>
          <Route path="/"            element={<Navigate to="/home" replace />} />
          <Route path="/home"        element={<HomePage />} />
          <Route path="/free-tips"   element={<FreeTipsPage />} />
          <Route path="/patti-list"  element={<PattiListPage />} />
          <Route path="/old-results" element={<OldResultsPage />} />
          <Route path="/admin"       element={<AdminPage />} />
          {/* catch-all */}
          <Route path="*"            element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
}
