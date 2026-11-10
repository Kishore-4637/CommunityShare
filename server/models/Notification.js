import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'request_received',
        'request_approved',
        'request_rejected',
        'request_cancelled',
        'request_completed',
        'message_received',
        'reminder',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BorrowRequest',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
