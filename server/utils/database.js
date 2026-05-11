const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message);
    throw err;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('[DB] MongoDB disconnected');
};

module.exports = { connectDB, disconnectDB };
