import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './HomePage';
import Navbar from './Navbar';
import Footer from './components/Footer';
import Plan from './components/Plan';
import ProtectedRoute from './components/ProtectedRoute';

// For debugging
console.log("App.jsx loading components:", { 
  HomePage: !!HomePage, 
  Navbar: !!Navbar, 
  AuthProvider: !!AuthProvider 
});

const AppContent = () => {
  const location = useLocation();
  // Only show footer on homepage
  const showFooter = location.pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
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