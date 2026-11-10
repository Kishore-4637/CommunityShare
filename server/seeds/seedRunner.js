import mongoose from 'mongoose';
import User from '../models/User.js';
import Item from '../models/Item.js';
import BorrowRequest from '../models/BorrowRequest.js';
import Review from '../models/Review.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { usersSeed, itemsTemplate } from './seedData.js';
import { getConversationId } from '../routes/messageRoutes.js';

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Cleaning existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      BorrowRequest.deleteMany({}),
      Review.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seeder] Seeding users...');
    const createdUsers = [];
    for (const u of usersSeed) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const [elena, marcus, sophia, david] = createdUsers;

    console.log('[Seeder] Seeding items...');
    const createdItems = [];
    for (let i = 0; i < itemsTemplate.length; i++) {
      const template = itemsTemplate[i];
      // Distribute items among the 4 users
      const owner = createdUsers[i % createdUsers.length];
      const item = await Item.create({
        ...template,
        owner: owner._id,
        location: {
          neighborhood: owner.location.neighborhood,
          city: owner.location.city,
          zip: owner.location.zip,
        },
      });
      createdItems.push(item);
    }

    // Set some wishlist items
    elena.wishlist = [createdItems[1]._id, createdItems[3]._id]; // Sony camera, Tent
    marcus.wishlist = [createdItems[6]._id, createdItems[2]._id]; // Ooni pizza, Sous vide
    await Promise.all([elena.save(), marcus.save()]);

    console.log('[Seeder] Seeding borrowing requests...');
    const req1 = await BorrowRequest.create({
      item: createdItems[0]._id, // DeWalt Drill (owned by Elena)
      requester: marcus._id,
      owner: elena._id,
      startDate: new Date(Date.now() + 86400000 * 2),
      endDate: new Date(Date.now() + 86400000 * 5),
      totalDays: 3,
      totalCost: 0,
      depositAmount: 800,
      message: 'Hey Elena! Building a custom planter box this weekend and would love to borrow your DeWalt drill!',
      status: 'approved',
    });

    const req2 = await BorrowRequest.create({
      item: createdItems[1]._id, // Sony Camera (owned by Marcus)
      requester: sophia._id,
      owner: marcus._id,
      startDate: new Date(Date.now() + 86400000 * 4),
      endDate: new Date(Date.now() + 86400000 * 7),
      totalDays: 3,
      totalCost: 5400,
      depositAmount: 8000,
      message: 'Hi Marcus, shooting a local artisan profile documentary and would cherish having this camera body as a second angle.',
      status: 'pending',
    });

    const req3 = await BorrowRequest.create({
      item: createdItems[6]._id, // Ooni Pizza Oven
      requester: david._id,
      owner: createdItems[6].owner,
      startDate: new Date(Date.now() - 86400000 * 8),
      endDate: new Date(Date.now() - 86400000 * 5),
      totalDays: 3,
      totalCost: 2250,
      depositAmount: 2500,
      message: 'Family birthday gathering in the garden - would be so grateful to borrow the pizza oven!',
      status: 'completed',
    });

    console.log('[Seeder] Seeding reviews...');
    await Review.create({
      author: david._id,
      targetUser: createdItems[6].owner,
      item: createdItems[6]._id,
      rating: 5,
      comment: 'The pizza oven was spotless, perfectly seasoned, and came with detailed lighting instructions! Made the best pizzas of our lives. 10/10 lender!',
      aspectRatings: { itemCondition: 5, communication: 5, punctuality: 5 },
    });

    await Review.create({
      author: elena._id,
      targetUser: marcus._id,
      item: createdItems[5]._id,
      rating: 5,
      comment: 'Marcus was super friendly, punctual, and gave a helpful walkthrough of the tool settings. Truly embodies community spirit!',
      aspectRatings: { itemCondition: 5, communication: 5, punctuality: 5 },
    });

    console.log('[Seeder] Seeding conversation and messages...');
    const convId = getConversationId(elena._id, marcus._id);

    await Message.create({
      conversationId: convId,
      sender: marcus._id,
      recipient: elena._id,
      item: createdItems[0]._id,
      text: 'Hi Elena! Just submitted a borrow request for your DeWalt drill set. When would be a convenient pickup time?',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 4),
    });

    await Message.create({
      conversationId: convId,
      sender: elena._id,
      recipient: marcus._id,
      item: createdItems[0]._id,
      text: 'Hi Marcus! Friday afternoon around 5:30 PM works great. I have the batteries fully charged for you!',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 2),
    });

    await Message.create({
      conversationId: convId,
      sender: marcus._id,
      recipient: elena._id,
      item: createdItems[0]._id,
      text: 'Fantastic! See you Friday. Thank you so much!',
      isRead: false,
      createdAt: new Date(Date.now() - 1800000),
    });

    console.log('[Seeder] Seeding notifications...');
    await Notification.create({
      recipient: elena._id,
      sender: marcus._id,
      type: 'request_received',
      title: 'New Borrow Request',
      message: 'Marcus requested to borrow "DeWalt 20V Cordless Drill" for 3 day(s).',
      relatedItem: createdItems[0]._id,
      relatedRequest: req1._id,
      isRead: false,
    });

    await Notification.create({
      recipient: marcus._id,
      sender: elena._id,
      type: 'request_approved',
      title: 'Request Approved! 🎉',
      message: 'Elena approved your request for "DeWalt 20V Cordless Drill". You can now arrange pickup.',
      relatedItem: createdItems[0]._id,
      relatedRequest: req1._id,
      isRead: true,
    });

    console.log('[Seeder] Seeding completed successfully!');
  } catch (err) {
    console.error('[Seeder] Seed failed:', err);
  }
};

// Auto-seed if collections are empty
export const seedIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('[Seeder] Database is empty. Running initial seed data...');
    await seedDatabase();
  } else {
    console.log(`[Seeder] Database already populated with ${count} users.`);
  }
};

// Direct script execution
if (process.argv[1]?.endsWith('seedRunner.js')) {
  import('dotenv/config').then(async () => {
    const { connectDB, closeDB } = await import('../config/db.js');
    await connectDB();
    await seedDatabase();
    await closeDB();
    process.exit(0);
  });
}
