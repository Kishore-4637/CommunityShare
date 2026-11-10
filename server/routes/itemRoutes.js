import express from 'express';
import Item from '../models/Item.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadFileToStorage } from '../config/s3.js';

const router = express.Router();

// @desc    Get all items with search, filters, pagination and sorting
// @route   GET /api/items
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      category,
      sharingType,
      availability,
      maxPrice,
      location,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search query across title and description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    // Sharing type filter (free / rent / deposit_only)
    if (sharingType && sharingType !== 'all') {
      query.sharingType = sharingType;
    }

    // Availability status
    if (availability && availability !== 'all') {
      query.availabilityStatus = availability;
    }

    // Price range
    if (maxPrice && !isNaN(Number(maxPrice))) {
      query.pricePerDay = { $lte: Number(maxPrice) };
    }

    // Location filter
    if (location && location.trim() !== '') {
      query.$or = (query.$or || []).concat([
        { 'location.neighborhood': { $regex: location.trim(), $options: 'i' } },
        { 'location.city': { $regex: location.trim(), $options: 'i' } },
      ]);
    }

    // Sorting
    let sortCriteria = { createdAt: -1 };
    if (sort === 'price_asc') sortCriteria = { pricePerDay: 1 };
    else if (sort === 'price_desc') sortCriteria = { pricePerDay: -1 };
    else if (sort === 'rating') sortCriteria = { rating: -1, reviewsCount: -1 };
    else if (sort === 'popular') sortCriteria = { viewsCount: -1, favoritesCount: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate('owner', 'name avatar rating reviewsCount badges location')
        .sort(sortCriteria)
        .skip(skip)
        .limit(limitNum),
      Item.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get featured items for home landing page
// @route   GET /api/items/featured
router.get('/featured', async (req, res) => {
  try {
    const featured = await Item.find({ availabilityStatus: 'available' })
      .populate('owner', 'name avatar rating reviewsCount location')
      .sort({ rating: -1, favoritesCount: -1 })
      .limit(8);

    res.json({
      success: true,
      items: featured,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get items listed by currently authenticated user
// @route   GET /api/items/user/my-listings
router.get('/user/my-listings', protect, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get single item details by ID
// @route   GET /api/items/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'owner',
      'name email avatar bio rating reviewsCount badges location phone createdAt'
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Increment views asynchronously
    Item.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } }).exec();

    res.json({
      success: true,
      item,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Invalid item ID or server error' });
  }
});

// @desc    Get similar items based on category
// @route   GET /api/items/:id/similar
router.get('/:id/similar', async (req, res) => {
  try {
    const currentItem = await Item.findById(req.params.id);
    if (!currentItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const similar = await Item.find({
      _id: { $ne: currentItem._id },
      category: currentItem.category,
      availabilityStatus: 'available',
    })
      .populate('owner', 'name avatar rating location')
      .limit(4);

    res.json({
      success: true,
      items: similar,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Create new item listing with optional multi-image uploads
// @route   POST /api/items
router.post('/', protect, upload.array('images', 6), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      sharingType,
      pricePerDay,
      depositAmount,
      neighborhood,
      city,
      rulesAndConditions,
      imageUrls,
      tags,
    } = req.body;

    const uploadedUrls = [];

    // Process files if uploaded via multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const publicUrl = await uploadFileToStorage(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        uploadedUrls.push(publicUrl);
      }
    }

    // Process additional image URLs passed as strings or json array
    if (imageUrls) {
      let parsed = imageUrls;
      if (typeof imageUrls === 'string') {
        try {
          parsed = JSON.parse(imageUrls);
        } catch {
          parsed = [imageUrls];
        }
      }
      if (Array.isArray(parsed)) {
        uploadedUrls.push(...parsed.filter((u) => typeof u === 'string' && u.trim().length > 0));
      }
    }

    // Fallback default image if none supplied
    if (uploadedUrls.length === 0) {
      uploadedUrls.push(
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80'
      );
    }

    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    }

    const item = await Item.create({
      title,
      category,
      description,
      owner: req.user._id,
      sharingType: sharingType || 'free',
      pricePerDay: Number(pricePerDay) || 0,
      depositAmount: Number(depositAmount) || 0,
      location: {
        neighborhood: neighborhood || req.user.location?.neighborhood || 'Local Community',
        city: city || req.user.location?.city || 'San Francisco',
      },
      rulesAndConditions:
        rulesAndConditions ||
        'Please return item in the same clean, operational condition. Timely return is appreciated.',
      images: uploadedUrls,
      tags: parsedTags,
      availabilityStatus: 'available',
    });

    const populatedItem = await Item.findById(item._id).populate(
      'owner',
      'name avatar rating reviewsCount badges location'
    );

    res.status(201).json({
      success: true,
      item: populatedItem,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Update an item listing
// @route   PUT /api/items/:id
router.put('/:id', protect, upload.array('images', 6), async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Check ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing',
      });
    }

    const updates = { ...req.body };

    // Process new uploaded images if any
    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const publicUrl = await uploadFileToStorage(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        newUrls.push(publicUrl);
      }
      updates.images = (item.images || []).concat(newUrls);
    }

    item = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name avatar rating reviewsCount location');

    res.json({
      success: true,
      item,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Delete an item listing
// @route   DELETE /api/items/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing',
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item listing successfully deleted',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
