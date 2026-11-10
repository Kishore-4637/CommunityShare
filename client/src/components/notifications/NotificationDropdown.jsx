import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2.5 rounded-xl text-charcoal-700 hover:text-forest-800 hover:bg-forest-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-warmgray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-warmgray-50 border-b border-warmgray-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-charcoal-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-forest-100 text-forest-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-xs text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1 hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-warmgray-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-charcoal-400 text-xs">
                  No notifications yet!
                </div>
              ) : (
                notifications.slice(0, 8).map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif._id);
                    }}
                    className={`p-3.5 hover:bg-forest-50/50 transition-colors flex gap-3 cursor-pointer ${
                      !notif.isRead ? 'bg-forest-50/30' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                      {notif.sender?.avatar ? (
                        <img
                          src={notif.sender.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-forest-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-charcoal-800 truncate">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-charcoal-600 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-charcoal-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-warmgray-50 border-t border-warmgray-100 text-center">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-forest-800 hover:text-forest-900 inline-flex items-center gap-1.5"
              >
                View all notifications
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
