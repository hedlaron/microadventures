import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ContactBubble from "./components/ui/ContactBubble";
import Plan from "./components/features/Plan";
import HistoryPage from "./components/features/HistoryPage";
import SharedAdventure from "./components/features/SharedAdventure";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// For debugging
console.log("App.jsx loading components:", {
  HomePage: !!HomePage,
  Navbar: !!Navbar,
  Footer: !!Footer,
  AuthProvider: !!AuthProvider,
});

const AppContent = () => {
  const _location = useLocation(); // Keep for future use

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-0 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <React.Suspense fallback={<div>Loading HomePage...</div>}>
                <HomePage />
              </React.Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <React.Suspense fallback={<div>Loading About...</div>}>
                <AboutPage />
              </React.Suspense>
            }
          />
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
          <Route path="/shared/:shareToken" element={<SharedAdventure />} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ContactBubble />
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
