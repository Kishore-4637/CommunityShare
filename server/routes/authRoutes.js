import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email address already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      location: location || { city: 'San Francisco', neighborhood: 'Mission District' },
      bio: bio || 'Passionate about sharing resources with my community!',
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        isVerified: user.isVerified,
        badges: user.badges,
        wishlist: user.wishlist,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        isVerified: user.isVerified,
        badges: user.badges,
        wishlist: user.wishlist,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, location, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location) user.location = { ...user.location, ...location };
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/:itemId
router.post('/wishlist/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    const existsIndex = user.wishlist.findIndex(
      (id) => id.toString() === itemId.toString()
    );

    let isWishlisted = false;
    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
      isWishlisted = false;
    } else {
      user.wishlist.push(itemId);
      isWishlisted = true;
    }

    await user.save();

    res.json({
      success: true,
      isWishlisted,
      wishlist: user.wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get user wishlist items
// @route   GET /api/auth/wishlist
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'owner', select: 'name avatar rating location' },
    });
    res.json({
      success: true,
      items: user.wishlist || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get demo accounts for quick 1-click testing
// @route   GET /api/auth/demo-users
router.get('/demo-users', async (req, res) => {
  try {
    const users = await User.find({}).limit(4).select('name email avatar rating location');
    res.json({
      success: true,
      users: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        rating: u.rating,
        location: u.location,
        demoPassword: 'password123',
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
