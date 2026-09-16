import mongoose from 'mongoose';

const connectDB = async (silent = false) => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('✓ MongoDB connected: ' + connection.connection.host);
    return connection;
  } catch {
    if (!silent) {
      console.log('ℹ Local MongoDB not detected on port 27017.');
      console.log('ℹ Active Database: backend/data/db.json (Admin user ready)');
      console.log('ℹ (To use MongoDB, paste your MongoDB Atlas URI in .env or start MongoDB locally)');
    }
    return null;
  }
};

export default connectDB;
