import mongoose from 'mongoose';

const borrowRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a requested start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end/return date'],
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: 'Hi, I would love to borrow this item and will return it in pristine condition!',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'active', 'completed'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    itemHandedOver: {
      type: Boolean,
      default: false,
    },
    itemReturned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BorrowRequest', borrowRequestSchema);
