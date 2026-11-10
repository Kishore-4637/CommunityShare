import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { BorrowRequestsPage } from './pages/BorrowRequestsPage';
import { ChatPage } from './pages/ChatPage';
import { MyItemsPage } from './pages/MyItemsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { WishlistPage } from './pages/WishlistPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

// Global Floating Real-time Toast Component
const NotificationToast = () => {
  const { activeToast, dismissToast } = useNotifications();

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-forest-900 text-white rounded-2xl p-4 shadow-2xl border border-forest-700 flex items-start gap-3 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-xl bg-forest-700 flex items-center justify-center shrink-0 text-emerald-300">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white truncate">{activeToast.title}</h5>
            <p className="text-[11px] text-forest-200 mt-0.5 line-clamp-2">
              {activeToast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="text-forest-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen bg-background-light font-sans selection:bg-forest-100 selection:text-forest-900">
                <Navbar />
                <NotificationToast />

                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/items/:id" element={<ItemDetailPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-listing"
                      element={
                        <ProtectedRoute>
                          <CreateListingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/requests"
                      element={
                        <ProtectedRoute>
                          <BorrowRequestsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-items"
                      element={
                        <ProtectedRoute>
                          <MyItemsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <WishlistPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </WishlistProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
