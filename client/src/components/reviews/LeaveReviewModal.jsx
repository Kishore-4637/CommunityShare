import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { reviewService } from '../../services/reviewService';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const LeaveReviewModal = ({ isOpen, onClose, targetUser, item, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [punctuality, setPunctuality] = useState(5);
  const [itemCondition, setItemCondition] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please share a few words about your experience.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await reviewService.submitReview({
        itemId: item._id,
        targetUserId: targetUser._id,
        rating,
        comment,
        aspectRatings: {
          punctuality,
          itemCondition,
          communication,
        },
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onReviewSubmitted) onReviewSubmitted(res.review);
          setSuccess(false);
          setComment('');
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate & Review Experience"
      subtitle={`Sharing transaction with ${targetUser?.name || 'Neighbor'}`}
    >
      {success ? (
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-charcoal-800">Review Submitted!</h4>
          <p className="text-xs text-charcoal-500 mt-1">Thank you for strengthening community trust.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center p-4 bg-forest-50/50 rounded-2xl border border-forest-100">
            <span className="text-xs font-semibold text-charcoal-700 mb-2">Overall Experience</span>
            <RatingStars
              rating={rating}
              interactive={true}
              onRatingChange={(r) => setRating(r)}
              size="lg"
              showText={false}
            />
            <span className="text-xs text-charcoal-500 mt-1.5 font-medium">
              {rating === 5 && 'Outstanding ⭐⭐⭐⭐⭐'}
              {rating === 4 && 'Great ⭐⭐⭐⭐'}
              {rating === 3 && 'Good ⭐⭐⭐'}
              {rating === 2 && 'Fair ⭐⭐'}
              {rating === 1 && 'Poor ⭐'}
            </span>
          </div>

          {/* Aspect Ratings */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-charcoal-600 font-medium">Item Condition & Care</span>
              <RatingStars rating={itemCondition} interactive={true} onRatingChange={setItemCondition} size="sm" showText={false} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-600 font-medium">Communication & Clarity</span>
              <RatingStars rating={communication} interactive={true} onRatingChange={setCommunication} size="sm" showText={false} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-600 font-medium">Punctuality & Reliability</span>
              <RatingStars rating={punctuality} interactive={true} onRatingChange={setPunctuality} size="sm" showText={false} />
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
              Your Review
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the item? Was pickup and return smooth?"
              className="w-full text-xs p-3 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 resize-none text-charcoal-800"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting} className="flex-1">
              Submit Review
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
