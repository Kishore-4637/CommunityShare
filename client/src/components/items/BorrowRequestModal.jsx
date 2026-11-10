import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { requestService } from '../../services/requestService';
import { useNavigate } from 'react-router-dom';

export const BorrowRequestModal = ({ isOpen, onClose, item }) => {
  const navigate = useNavigate();

  // Tomorrow as default start, +3 days as default end
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const defaultEnd = new Date();
  defaultEnd.setDate(defaultEnd.getDate() + 4);
  const defaultEndStr = defaultEnd.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [message, setMessage] = useState(
    `Hi ${item?.owner?.name || 'Neighbor'}! I would love to borrow this item and will take excellent care of it.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!item) return null;

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end - start);
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const isRent = item.sharingType === 'rent';
  const totalCost = isRent ? totalDays * (item.pricePerDay || 0) : 0;
  const deposit = item.depositAmount || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(endDate) < new Date(startDate)) {
      setError('Return date must be on or after the start date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await requestService.createRequest({
        itemId: item._id,
        startDate,
        endDate,
        message,
      });

      if (res.success) {
        setIsSuccess(true);
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1E3A2F', '#7E9F8B', '#D1DEC3', '#F4A261'],
          });
        } catch {
          // ignore if canvas not supported
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit borrow request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isSuccess ? 'Request Sent!' : `Request to Borrow`}
      subtitle={isSuccess ? '' : item.title}
      maxWidth="max-w-lg"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-xl font-bold text-charcoal-800 mb-2">
              Borrow Request Submitted!
            </h4>
            <p className="text-sm text-charcoal-600 max-w-sm mb-6">
              We notified <span className="font-semibold text-charcoal-800">{item.owner?.name}</span>.
              You will receive a notification as soon as they respond!
            </p>

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  handleReset();
                  navigate('/requests');
                }}
              >
                View My Requests
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  handleReset();
                  navigate('/chat');
                }}
              >
                Open Messages
              </Button>
            </div>
          </motion.div>
        ) : (
          <form key="form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                  Pick-up Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                  Return Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
              </div>
            </div>

            {/* Message to Lender */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Note for {item.owner?.name || 'Owner'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                placeholder="Introduce yourself and tell them what you'll be using it for..."
                className="w-full text-xs p-3 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800 resize-none"
              />
            </div>

            {/* Pricing Summary Card */}
            <div className="bg-forest-50/60 rounded-2xl p-4 border border-forest-100 text-xs space-y-2">
              <div className="flex justify-between text-charcoal-600">
                <span>Duration</span>
                <span className="font-semibold text-charcoal-800">{totalDays} day(s)</span>
              </div>

              {isRent ? (
                <div className="flex justify-between text-charcoal-600">
                  <span>Rental rate (₹{item.pricePerDay?.toLocaleString('en-IN')} × {totalDays} days)</span>
                  <span className="font-semibold text-charcoal-800">₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Community Free Share
                  </span>
                  <span>₹0</span>
                </div>
              )}

              {deposit > 0 && (
                <div className="flex justify-between text-charcoal-600">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                    Refundable Security Deposit
                  </span>
                  <span className="font-semibold text-charcoal-800">₹{deposit.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-forest-200/50 pt-2 flex justify-between font-bold text-sm text-forest-900">
                <span>Total Amount Due</span>
                <span>₹{(totalCost + deposit).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                className="flex-1"
              >
                Send Request
              </Button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </Modal>
  );
};
