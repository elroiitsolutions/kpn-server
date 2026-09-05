import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import awardRoutes from './routes/awardRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import celebrationRoutes from './routes/celebrationRoutes.js';

const app = express();

// Security and utility middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false, // Allow cross-origin asset loading for images
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/celebrations', celebrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'KPN Promoters Real Estate API & CMS Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
