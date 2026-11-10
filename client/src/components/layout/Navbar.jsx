import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  PlusCircle,
  MessageSquare,
  Heart,
  LayoutDashboard,
  Layers,
  Inbox,
  LogOut,
  User,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-warmgray-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-forest-800 text-white flex items-center justify-center shadow-md group-hover:bg-forest-900 group-hover:scale-105 transition-all">
            <svg
              className="w-5 h-5 text-emerald-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-forest-950 font-display flex items-center gap-1">
              Community<span className="text-forest-600">Share</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/explore"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              isActive('/explore')
                ? 'bg-forest-50 text-forest-900'
                : 'text-charcoal-700 hover:text-forest-900 hover:bg-forest-50/50'
            }`}
          >
            <Compass className="w-4 h-4 text-forest-700" />
            Explore
          </Link>

          <Link
            to="/how-it-works"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive('/how-it-works')
                ? 'bg-forest-50 text-forest-900'
                : 'text-charcoal-700 hover:text-forest-900 hover:bg-forest-50/50'
            }`}
          >
            How It Works
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'bg-forest-50 text-forest-900'
                    : 'text-charcoal-700 hover:text-forest-900 hover:bg-forest-50/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/requests"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive('/requests')
                    ? 'bg-forest-50 text-forest-900'
                    : 'text-charcoal-700 hover:text-forest-900 hover:bg-forest-50/50'
                }`}
              >
                <Inbox className="w-4 h-4" />
                Requests
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="p-2.5 rounded-xl text-charcoal-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Chat */}
              <Link
                to="/chat"
                aria-label="Chat messages"
                className="p-2.5 rounded-xl text-charcoal-600 hover:text-forest-800 hover:bg-forest-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              {/* Realtime Notification Bell */}
              <NotificationDropdown />

              {/* List Item Button */}
              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={() => navigate('/create-listing')}
                className="ml-1"
              >
                List Item
              </Button>

              {/* User Dropdown */}
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl hover:bg-forest-50 border border-transparent hover:border-forest-200 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-forest-300"
                  />
                  <span className="text-xs font-semibold text-charcoal-800 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-warmgray-200 py-2 z-50 divide-y divide-warmgray-100"
                    >
                      <div className="px-4 py-2">
                        <p className="text-xs font-bold text-charcoal-800">{user.name}</p>
                        <p className="text-[11px] text-charcoal-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <LayoutDashboard className="w-4 h-4 text-forest-600" />
                          Dashboard
                        </Link>
                        <Link
                          to="/my-items"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <Layers className="w-4 h-4 text-forest-600" />
                          My Listings
                        </Link>
                        <Link
                          to="/requests"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-forest-50 hover:text-forest-900"
                        >
                          <Inbox className="w-4 h-4 text-forest-600" />
                          Borrow Requests
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth?tab=login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth?tab=register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden gap-2">
          {isAuthenticated && <NotificationDropdown />}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-charcoal-700 hover:bg-warmgray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-warmgray-200 bg-white px-4 pt-3 pb-6 space-y-3"
          >
            <div className="space-y-1">
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-forest-50"
              >
                Explore Items
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-forest-50"
              >
                How It Works
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-forest-50"
                  >
                    User Dashboard
                  </Link>
                  <Link
                    to="/requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-forest-50"
                  >
                    Borrowing Requests
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-forest-50"
                  >
                    Chat & Messages
                  </Link>
                  <Link
                    to="/my-items"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal-800 hover:bg-forest-50"
                  >
                    My Items & Listings
                  </Link>
                  <Link
                    to="/create-listing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-bold text-forest-800 bg-forest-50"
                  >
                    + List an Item
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate('/auth?tab=login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      navigate('/auth?tab=register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
