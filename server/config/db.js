import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/communityshare';
  
  try {
    console.log(`[Database] Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('[Database] Connected successfully to live MongoDB instance.');
    return true;
  } catch (err) {
    console.error(`[Database] MongoDB connection failed: ${err.message}`);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
};
