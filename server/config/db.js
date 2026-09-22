const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 DNS order for Windows compatibility with MongoDB Atlas
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS override fails
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) return;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`🌿 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Notice: ${error.message}`);
    console.log(`ℹ️ Running in resilient mode. Local API endpoints will serve structured responses.`);
  }
};

module.exports = connectDB;
