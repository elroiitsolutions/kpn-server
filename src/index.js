import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 KPN Promoters API Server running on port: ${PORT}`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===================================================`);
  });
};

startServer().catch((err) => {
  console.error('[Server Fatal Error]:', err);
  process.exit(1);
});
