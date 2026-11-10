import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { emitToUser } from '../sockets/socketEmitter.js';

const router = express.Router();

// @desc    Submit a review for an item and user
// @route   POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, targetUserId, rating, comment, aspectRatings } = req.body;

    if (!itemId || !targetUserId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Item, target user, rating, and comment are required',
      });
    }

    if (targetUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself!',
      });
    }

    const review = await Review.create({
      author: req.user._id,
      targetUser: targetUserId,
      item: itemId,
      rating: Number(rating),
      comment: comment.trim(),
      aspectRatings: aspectRatings || { itemCondition: 5, communication: 5, punctuality: 5 },
    });

    // Update item average rating
    const itemReviews = await Review.find({ item: itemId });
    const itemAvg =
      itemReviews.reduce((acc, curr) => acc + curr.rating, 0) / itemReviews.length;
    await Item.findByIdAndUpdate(itemId, {
      rating: Number(itemAvg.toFixed(1)),
      reviewsCount: itemReviews.length,
    });

    // Update target user average rating
    const userReviews = await Review.find({ targetUser: targetUserId });
    const userAvg =
      userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length;
    await User.findByIdAndUpdate(targetUserId, {
      rating: Number(userAvg.toFixed(1)),
      reviewsCount: userReviews.length,
    });

    // Send notification
    const notification = await Notification.create({
      recipient: targetUserId,
      sender: req.user._id,
      type: 'reminder',
      title: 'New Review Received! ⭐',
      message: `${req.user.name} gave you a ${rating}-star review: "${comment.substring(0, 40)}..."`,
      relatedItem: itemId,
    });

    emitToUser(targetUserId, 'notification', { notification });

    const populatedReview = await Review.findById(review._id)
      .populate('author', 'name avatar location')
      .populate('item', 'title images');

    res.status(201).json({
      success: true,
      review: populatedReview,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get reviews for an item
// @route   GET /api/reviews/item/:itemId
router.get('/item/:itemId', async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate('author', 'name avatar location rating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ targetUser: req.params.userId })
      .populate('author', 'name avatar location')
      .populate('item', 'title images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
