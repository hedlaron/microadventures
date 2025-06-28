import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './HomePage';
import Navbar from './Navbar';
// import Footer from './components/Footer'; // Removed Footer import
import Plan from './components/Plan';
import HistoryPage from './components/HistoryPage';
import SharedAdventure from './components/SharedAdventure';
import ProtectedRoute from './components/ProtectedRoute';

// For debugging
console.log("App.jsx loading components:", { 
  HomePage: !!HomePage, 
  Navbar: !!Navbar, 
  AuthProvider: !!AuthProvider 
});

const AppContent = () => {
  const location = useLocation();
  
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-0 overflow-auto">
        <Routes>
          <Route path="/" element={
            <React.Suspense fallback={<div>Loading HomePage...</div>}>
              <HomePage />
            </React.Suspense>
          } />
          <Route 
            path="/plan" 
            element={
              <ProtectedRoute>
                <Plan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } 
          />
          {/* Public shared adventure route - no auth required */}
          <Route 
            path="/shared/:shareToken" 
            element={<SharedAdventure />} 
          />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* Footer completely removed */}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;