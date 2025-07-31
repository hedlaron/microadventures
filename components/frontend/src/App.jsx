import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorProvider, useError } from "./contexts/ErrorContext";
import ErrorMessage from "./components/ui/ErrorMessage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ContactBubble from "./components/ui/ContactBubble";
import Plan from "./components/features/Plan";
import HistoryPage from "././components/features/HistoryPage";
import SharedAdventure from "./components/features/SharedAdventure";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import About from "./components/ui/About";
import ContactModal from "./components/ui/ContactModal";

// For debugging
console.log("App.jsx loading components:", {
  HomePage: !!HomePage,
  Navbar: !!Navbar,
  Footer: !!Footer,
  AuthProvider: !!AuthProvider,
});

const AppContent = () => {
  const _location = useLocation(); // Keep for future use
  const { error } = useError(); // Get error state from context
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const aboutHandler = () => setShowAbout(true);
    const contactHandler = () => setShowContact(true);
    window.addEventListener("open-about-modal", aboutHandler);
    window.addEventListener("open-contact-modal", contactHandler);
    return () => {
      window.removeEventListener("open-about-modal", aboutHandler);
      window.removeEventListener("open-contact-modal", contactHandler);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main
        className={`flex-grow overflow-auto pt-16 px-4 md:px-6 lg:px-8 ${error ? "blur-background" : ""}`}
      >
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
        {showAbout && <About onClose={() => setShowAbout(false)} />}
        {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      </main>
      <Footer />
      <ContactBubble />
      <ErrorMessage />
    </div>
  );
};

const App = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;
