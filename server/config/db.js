const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/finpulse';
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`[FinPulse Treasury] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => console.error(`[FinPulse DB Error]: ${err.message}`));
    mongoose.connection.on('disconnected', () => console.warn('[FinPulse DB]: Database disconnected. Reconnecting...'));
    return conn;
  } catch (error) {
    console.error(`[FinPulse DB Fatal]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
