import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Inbox,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useNotifications } from '../context/NotificationContext';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Activity Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display mt-0.5">
            Notifications Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCheck}
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}

          <div className="flex p-1 bg-warmgray-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'unread'
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications to show"
          description={
            filter === 'unread'
              ? 'You have caught up with all your alerts!'
              : 'When neighbors request items, send messages, or confirm returns, you will see them here.'
          }
        />
      ) : (
        <div className="bg-white rounded-3xl border border-warmgray-200/90 shadow-subtle divide-y divide-warmgray-100 overflow-hidden">
          {filtered.map((notif) => (
            <motion.div
              key={notif._id}
              layout
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                !notif.isRead ? 'bg-forest-50/30' : 'hover:bg-warmgray-50/60'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                {notif.sender?.avatar ? (
                  <img
                    src={notif.sender.avatar}
                    alt=""
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <Bell className="w-5 h-5 text-forest-700" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-charcoal-900">{notif.title}</h4>
                  <span className="text-[11px] text-charcoal-400">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed">{notif.message}</p>

                {/* Direct quick link buttons */}
                <div className="flex items-center gap-3 pt-2">
                  {notif.type.includes('request') && (
                    <Link
                      to="/requests"
                      className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
                    >
                      Open Requests <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {notif.type.includes('message') && (
                    <Link
                      to="/chat"
                      className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
                    >
                      Open Chat <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notif._id)}
                      className="text-xs text-charcoal-400 hover:text-charcoal-700 font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
