import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    aspectRatings: {
      itemCondition: { type: Number, default: 5 },
      communication: { type: Number, default: 5 },
      punctuality: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
