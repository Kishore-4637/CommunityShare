import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Sparkles,
  MapPin,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { requestService } from '../services/requestService';
import { useSocket } from '../context/SocketContext';

export const BorrowRequestsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') === 'outgoing' ? 'outgoing' : 'incoming';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [incRes, outRes] = await Promise.all([
        requestService.getIncomingRequests(),
        requestService.getOutgoingRequests(),
      ]);

      if (incRes.success) setIncomingRequests(incRes.requests || []);
      if (outRes.success) setOutgoingRequests(outRes.requests || []);
    } catch (err) {
      console.warn('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Listen for real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = () => {
      fetchRequests();
    };

    const handleStatusChanged = () => {
      fetchRequests();
    };

    socket.on('new_request', handleNewRequest);
    socket.on('request_status_changed', handleStatusChanged);

    return () => {
      socket.off('new_request', handleNewRequest);
      socket.off('request_status_changed', handleStatusChanged);
    };
  }, [socket]);

  const handleUpdateStatus = async (requestId, status, reason = '') => {
    try {
      setProcessingId(requestId);
      const res = await requestService.updateRequestStatus(requestId, status, reason);
      if (res.success) {
        // Optimistically update
        setIncomingRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status } : r))
        );
        setOutgoingRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status } : r))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    } finally {
      setProcessingId(null);
    }
  };

  const currentList = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Exchange Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display mt-0.5">
            Borrowing Requests
          </h1>
        </div>

        {/* Tab Pills */}
        <div className="flex p-1 bg-warmgray-200/80 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'bg-white text-forest-900 shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Incoming Requests ({incomingRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'outgoing'
                ? 'bg-white text-forest-900 shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Send className="w-4 h-4" />
            My Requests ({outgoingRequests.length})
          </button>
        </div>
      </div>

      {/* Requests Stream */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-warmgray-200 animate-pulse" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={
            activeTab === 'incoming'
              ? 'No incoming borrow requests yet'
              : 'You have not sent any borrow requests'
          }
          description={
            activeTab === 'incoming'
              ? 'When neighbors request items you listed, their requests will appear here for you to approve.'
              : 'Browse items in your area and send a request to start borrowing!'
          }
          actionLabel={activeTab === 'incoming' ? 'List another item' : 'Explore marketplace'}
          onAction={() => navigate(activeTab === 'incoming' ? '/create-listing' : '/explore')}
        />
      ) : (
        <div className="space-y-4">
          {currentList.map((req) => {
            const counterParty = activeTab === 'incoming' ? req.requester : req.owner;
            const isProcessing = processingId === req._id;

            return (
              <motion.div
                key={req._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-warmgray-200/90 shadow-subtle space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-warmgray-100">
                  {/* Item and Counterparty info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        req.item?.images?.[0] ||
                        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=150&q=80'
                      }
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-warmgray-200"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/items/${req.item?._id}`}
                        className="text-base font-bold text-charcoal-900 hover:text-forest-800 transition-colors line-clamp-1"
                      >
                        {req.item?.title || 'Resource'}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-charcoal-500">
                        <span>
                          {activeTab === 'incoming' ? 'Requested by' : 'Owned by'}{' '}
                          <span className="font-semibold text-charcoal-800">
                            {counterParty?.name}
                          </span>
                        </span>
                        <span>•</span>
                        <span>{counterParty?.location?.neighborhood || 'San Francisco'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                {/* Dates & Financials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-warmgray-50/70 p-3.5 rounded-2xl text-xs">
                  <div>
                    <span className="text-charcoal-400 block text-[11px]">Start Date</span>
                    <span className="font-semibold text-charcoal-800">
                      {new Date(req.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[11px]">Return Date</span>
                    <span className="font-semibold text-charcoal-800">
                      {new Date(req.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[11px]">Duration</span>
                    <span className="font-semibold text-charcoal-800">{req.totalDays} day(s)</span>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[11px]">Total Fee / Deposit</span>
                    <span className="font-semibold text-charcoal-800">
                      ₹{req.totalCost?.toLocaleString('en-IN')} / ₹{req.depositAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Personal Message */}
                {req.message && (
                  <div className="text-xs bg-forest-50/50 p-3 rounded-xl border border-forest-100/60 text-charcoal-700 italic">
                    "{req.message}"
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={MessageSquare}
                    onClick={() =>
                      navigate(
                        `/chat?target=${counterParty?._id}&itemId=${req.item?._id}`
                      )
                    }
                  >
                    Chat with {counterParty?.name?.split(' ')[0]}
                  </Button>

                  <div className="flex items-center gap-2">
                    {/* Incoming Owner Actions */}
                    {activeTab === 'incoming' && req.status === 'pending' && (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={isProcessing}
                          onClick={() => handleUpdateStatus(req._id, 'rejected')}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isProcessing}
                          onClick={() => handleUpdateStatus(req._id, 'approved')}
                        >
                          Approve Request
                        </Button>
                      </>
                    )}

                    {activeTab === 'incoming' && req.status === 'approved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isProcessing}
                        icon={CheckCircle2}
                        onClick={() => handleUpdateStatus(req._id, 'completed')}
                      >
                        Confirm Item Returned
                      </Button>
                    )}

                    {/* Outgoing Borrower Actions */}
                    {activeTab === 'outgoing' && req.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isProcessing}
                        onClick={() => handleUpdateStatus(req._id, 'cancelled')}
                      >
                        Cancel Request
                      </Button>
                    )}

                    {req.status === 'completed' && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        Transaction Completed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
