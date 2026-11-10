import express from 'express';
import BorrowRequest from '../models/BorrowRequest.js';
import Item from '../models/Item.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { emitToUser } from '../sockets/socketEmitter.js';

const router = express.Router();

// @desc    Create a borrowing request
// @route   POST /api/requests
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, startDate, endDate, message } = req.body;

    const item = await Item.findById(itemId).populate('owner', 'name email');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot borrow your own item!',
      });
    }

    if (item.availabilityStatus === 'borrowed') {
      return res.status(400).json({
        success: false,
        message: 'This item is currently already borrowed by someone else',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let totalCost = 0;
    if (item.sharingType === 'rent') {
      totalCost = totalDays * (item.pricePerDay || 0);
    }

    const request = await BorrowRequest.create({
      item: item._id,
      requester: req.user._id,
      owner: item.owner._id,
      startDate: start,
      endDate: end,
      totalDays,
      totalCost,
      depositAmount: item.depositAmount || 0,
      message: message || `Hi ${item.owner.name}, I would love to borrow this!`,
      status: 'pending',
    });

    // Create persistent notification for owner
    const notification = await Notification.create({
      recipient: item.owner._id,
      sender: req.user._id,
      type: 'request_received',
      title: 'New Borrow Request',
      message: `${req.user.name} requested to borrow "${item.title}" for ${totalDays} day(s).`,
      relatedItem: item._id,
      relatedRequest: request._id,
    });

    // Realtime Socket.IO emission to item owner
    emitToUser(item.owner._id, 'notification', { notification });
    emitToUser(item.owner._id, 'new_request', { request });

    const populatedRequest = await BorrowRequest.findById(request._id)
      .populate('item')
      .populate('owner', 'name avatar rating location')
      .populate('requester', 'name avatar rating location');

    res.status(201).json({
      success: true,
      request: populatedRequest,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Get all incoming requests for items I own
// @route   GET /api/requests/incoming
router.get('/incoming', protect, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ owner: req.user._id })
      .populate('item')
      .populate('requester', 'name avatar rating reviewsCount badges location phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get all outgoing requests I made
// @route   GET /api/requests/outgoing
router.get('/outgoing', protect, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ requester: req.user._id })
      .populate('item')
      .populate('owner', 'name avatar rating reviewsCount location phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Update request status (approve, reject, cancel, complete)
// @route   PUT /api/requests/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const request = await BorrowRequest.findById(req.params.id)
      .populate('item')
      .populate('owner', 'name avatar')
      .populate('requester', 'name avatar');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const isOwner = request.owner._id.toString() === req.user._id.toString();
    const isRequester = request.requester._id.toString() === req.user._id.toString();

    if (!isOwner && !isRequester) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this request',
      });
    }

    // Owner actions
    if (['approved', 'rejected', 'completed'].includes(status) && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only the item owner can approve, reject or complete this request',
      });
    }

    // Requester cancellation
    if (status === 'cancelled' && !isRequester && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request',
      });
    }

    request.status = status;
    if (rejectionReason) {
      request.rejectionReason = rejectionReason;
    }

    // Update item availability
    if (status === 'approved') {
      await Item.findByIdAndUpdate(request.item._id, {
        availabilityStatus: 'borrowed',
      });
    } else if (['completed', 'rejected', 'cancelled'].includes(status)) {
      await Item.findByIdAndUpdate(request.item._id, {
        availabilityStatus: 'available',
      });
    }

    await request.save();

    // Create notification for counter-party
    const targetUserId = isOwner ? request.requester._id : request.owner._id;
    let notifTitle = 'Request Update';
    let notifMessage = `Your request for "${request.item.title}" was updated to ${status}.`;

    if (status === 'approved') {
      notifTitle = 'Request Approved! 🎉';
      notifMessage = `${request.owner.name} approved your request for "${request.item.title}". You can now arrange pickup.`;
    } else if (status === 'rejected') {
      notifTitle = 'Request Declined';
      notifMessage = `${request.owner.name} was unable to accept your request for "${request.item.title}".`;
    } else if (status === 'completed') {
      notifTitle = 'Borrowing Completed! ⭐';
      notifMessage = `Your borrowing period for "${request.item.title}" has concluded. Don't forget to leave a review!`;
    }

    const notification = await Notification.create({
      recipient: targetUserId,
      sender: req.user._id,
      type: `request_${status}`,
      title: notifTitle,
      message: notifMessage,
      relatedItem: request.item._id,
      relatedRequest: request._id,
    });

    // Realtime Socket notifications
    emitToUser(targetUserId, 'notification', { notification });
    emitToUser(targetUserId, 'request_status_changed', {
      requestId: request._id,
      status,
      request,
    });

    res.json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
