import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loginAsDemo } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') === 'register' ? 'register' : 'login';
  const redirectPath = queryParams.get('redirect') || '/dashboard';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [neighborhood, setNeighborhood] = useState('Mission District');
  const [city, setCity] = useState('San Francisco');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  useEffect(() => {
    const fetchDemoUsers = async () => {
      try {
        const res = await authService.getDemoUsers();
        if (res.success) setDemoUsers(res.users || []);
      } catch (err) {
        console.warn('Failed to fetch demo users:', err);
      }
    };
    fetchDemoUsers();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await login(email, password);
        if (res.success) navigate(redirectPath);
      } else {
        const res = await register({
          name,
          email,
          password,
          location: { neighborhood, city },
        });
        if (res.success) navigate(redirectPath);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please verify credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoUser) => {
    setError('');
    setIsLoading(true);
    try {
      await loginAsDemo(demoUser.email, 'password123');
      navigate(redirectPath);
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-2xl bg-forest-800 text-white flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-charcoal-900 font-display">
              Community<span className="text-forest-600">Share</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-charcoal-900 font-display">
            {activeTab === 'login' ? 'Welcome back, neighbor' : 'Join your local community'}
          </h2>
          <p className="text-xs text-charcoal-500">
            {activeTab === 'login'
              ? 'Access your items, active borrows, and messages'
              : 'Start sharing and borrowing with verified neighbors'}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        {demoUsers.length > 0 && (
          <div className="bg-forest-50/80 rounded-2xl p-4 border border-forest-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                1-Click Instant Demo Testing
              </span>
              <span className="text-[10px] text-forest-600 bg-forest-100/70 px-2 py-0.5 rounded-full font-medium">
                No typing needed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.slice(0, 4).map((u) => (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u)}
                  className="flex items-center gap-2 p-2 bg-white rounded-xl border border-forest-200 hover:border-forest-400 hover:shadow-sm transition-all text-left"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover border border-forest-300"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal-800 truncate">{u.name}</p>
                    <p className="text-[10px] text-charcoal-400 truncate">{u.location?.neighborhood}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-premium border border-warmgray-200/90 space-y-6">
          {/* Tab buttons */}
          <div className="flex p-1 bg-warmgray-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-charcoal-700">
                  Password
                </label>
                {activeTab === 'login' && (
                  <span className="text-[11px] text-forest-700 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Mission"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              {activeTab === 'login' ? 'Sign In' : 'Complete Registration'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
