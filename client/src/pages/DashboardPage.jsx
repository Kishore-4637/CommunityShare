import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Compass,
  Inbox,
  MessageSquare,
  TrendingUp,
  Package,
  Layers,
  Repeat,
  DollarSign,
  Leaf,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Badge, StatusBadge } from '../components/common/Badge';
import { statsService } from '../services/statsService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await statsService.getDashboardStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {
    totalItemsListed: 0,
    activeRequests: 0,
    itemsCurrentlyBorrowed: 0,
    itemsCurrentlyLent: 0,
    estimatedSavingsINR: 0,
    estimatedSavingsUSD: 0,
    estimatedCO2SavedKg: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-forest-200 shadow-sm shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-charcoal-900 font-display">
                Hello, {user?.name}! 👋
              </h1>
              <Badge variant="forest" size="sm">
                ★ {user?.rating || 5.0} Rating
              </Badge>
            </div>
            <p className="text-xs text-charcoal-500">
              {user?.location?.neighborhood || 'San Francisco'}, CA • Member since 2025
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(user?.badges || ['Verified Neighbor', 'Super Lender']).map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-medium bg-forest-50 text-forest-800 border border-forest-200/60 px-2 py-0.5 rounded-md"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/create-listing')}
          >
            List an Item
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={Compass}
            onClick={() => navigate('/explore')}
          >
            Explore Items
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-warmgray-200/80 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500">Items Listed</span>
            <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-display">
            {metrics.totalItemsListed}
          </p>
          <Link
            to="/my-items"
            className="text-[11px] font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1"
          >
            Manage listings &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-warmgray-200/80 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500">Active Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-display">
            {metrics.activeRequests}
          </p>
          <Link
            to="/requests"
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            Review incoming requests &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-warmgray-200/80 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500">Currently Borrowed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-display">
            {metrics.itemsCurrentlyBorrowed}
          </p>
          <Link
            to="/requests?tab=outgoing"
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            View borrowed items &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-warmgray-200/80 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500">Items Lent Out</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-display">
            {metrics.itemsCurrentlyLent}
          </p>
          <Link
            to="/requests?tab=incoming"
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            Track active loans &rarr;
          </Link>
        </div>
      </div>

      {/* Community Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-forest-900 to-forest-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Financial Savings (INR)
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold font-display">
              ₹{(metrics.estimatedSavingsINR || metrics.estimatedSavingsUSD || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-forest-200/80 max-w-sm">
              Estimated money saved vs purchasing new equipment retail.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 to-forest-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Carbon & Waste Offset
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold font-display">
              {metrics.estimatedCO2SavedKg.toFixed(1)} kg
            </p>
            <p className="text-xs text-forest-200/80 max-w-sm">
              Manufacturing and supply chain greenhouse emissions averted.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
            <Leaf className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Monthly Activity Visualization & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-charcoal-900 font-display">
                Sharing Activity
              </h3>
              <p className="text-xs text-charcoal-500">6-Month items exchanged trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-forest-800">
                <span className="w-3 h-3 rounded-md bg-forest-800 inline-block" /> Lent
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="w-3 h-3 rounded-md bg-emerald-400 inline-block" /> Borrowed
              </span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-warmgray-200 pb-2">
            {(data?.chartData || [
              { month: 'Jun', lent: 2, borrowed: 1 },
              { month: 'Jul', lent: 3, borrowed: 2 },
              { month: 'Aug', lent: 4, borrowed: 3 },
              { month: 'Sep', lent: 5, borrowed: 2 },
              { month: 'Oct', lent: 4, borrowed: 4 },
              { month: 'Nov', lent: 6, borrowed: 3 },
            ]).map((bar) => {
              const maxVal = 8;
              const lentHeight = `${Math.min(100, (bar.lent / maxVal) * 100)}%`;
              const borrowedHeight = `${Math.min(100, (bar.borrowed / maxVal) * 100)}%`;

              return (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    <div
                      style={{ height: lentHeight }}
                      className="w-1/2 max-w-[20px] bg-forest-800 rounded-t-md group-hover:bg-forest-900 transition-all"
                      title={`${bar.lent} lent`}
                    />
                    <div
                      style={{ height: borrowedHeight }}
                      className="w-1/2 max-w-[20px] bg-emerald-400 rounded-t-md group-hover:bg-emerald-500 transition-all"
                      title={`${bar.borrowed} borrowed`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-charcoal-500">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Pending Requests */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-charcoal-900 font-display">
                Action Items
              </h3>
              <Link to="/requests" className="text-xs font-semibold text-forest-800 hover:underline">
                View all &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentIncomingRequests || []).length === 0 ? (
                <div className="p-6 text-center text-xs text-charcoal-400 bg-warmgray-50 rounded-2xl">
                  No pending action requests at the moment.
                </div>
              ) : (
                data.recentIncomingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req._id}
                    className="p-3.5 bg-warmgray-50 hover:bg-forest-50/50 rounded-2xl border border-warmgray-200/70 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={req.requester?.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-charcoal-800 truncate">
                          {req.requester?.name}
                        </p>
                        <p className="text-[11px] text-charcoal-500 truncate">
                          wants "{req.item?.title}"
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-warmgray-100 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              icon={Inbox}
              onClick={() => navigate('/requests')}
            >
              Requests Inbox
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              icon={MessageSquare}
              onClick={() => navigate('/chat')}
            >
              Messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
