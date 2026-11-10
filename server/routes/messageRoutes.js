import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { emitToUser, emitToConversation } from '../sockets/socketEmitter.js';

const router = express.Router();

// Helper to generate a deterministic conversation ID for two users
export const getConversationId = (user1Id, user2Id) => {
  return [user1Id.toString(), user2Id.toString()].sort().join('_');
};

// @desc    Get all conversations for the logged in user
// @route   GET /api/messages/conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar rating location')
      .populate('recipient', 'name avatar rating location')
      .populate('item', 'title images');

    // Group by conversationId
    const conversationsMap = new Map();

    for (const msg of messages) {
      if (!conversationsMap.has(msg.conversationId)) {
        const otherUser =
          msg.sender._id.toString() === currentUserId.toString()
            ? msg.recipient
            : msg.sender;

        conversationsMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          otherUser,
          lastMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            sender: msg.sender._id,
            isRead: msg.isRead,
          },
          item: msg.item,
          unreadCount: 0,
        });
      }

      // Count unread messages where current user is the recipient
      if (
        msg.recipient._id.toString() === currentUserId.toString() &&
        !msg.isRead
      ) {
        const conv = conversationsMap.get(msg.conversationId);
        conv.unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      conversations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get message history between current user and target user
// @route   GET /api/messages/:targetUserId
router.get('/:targetUserId', protect, async (req, res) => {
  try {
    const convId = getConversationId(req.user._id, req.params.targetUserId);

    const messages = await Message.find({ conversationId: convId })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('item', 'title images')
      .sort({ createdAt: 1 });

    // Mark all incoming messages in this conversation as read
    await Message.updateMany(
      { conversationId: convId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      conversationId: convId,
      messages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Send a message
// @route   POST /api/messages
router.post('/', protect, async (req, res) => {
  try {
    const { recipientId, text, itemId } = req.body;

    if (!recipientId || !text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Recipient and message content are required',
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const conversationId = getConversationId(req.user._id, recipientId);

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      recipient: recipientId,
      item: itemId || undefined,
      text: text.trim(),
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .populate('item', 'title images');

    // Send real-time notification
    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'message_received',
      title: `New message from ${req.user.name}`,
      message: text.length > 50 ? `${text.substring(0, 47)}...` : text,
      relatedItem: itemId || undefined,
    });

    // Realtime Socket emission
    emitToConversation(conversationId, 'receive_message', populatedMsg);
    emitToUser(recipientId, 'receive_message', populatedMsg);
    emitToUser(recipientId, 'notification', { notification });

    res.status(201).json({
      success: true,
      message: populatedMsg,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
