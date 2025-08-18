import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import config from './config/config';

const app = express();
const PORT = config.server.port;


// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting (global)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	message: {
		success: false,
		error: 'Too many requests from this IP, please try again later.',
	},
});
app.use(limiter);

// CORS configuration
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ success: true, message: 'Food Ordering System API is running', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', authMiddleware, menuRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`);
	console.log(`📖 API Documentation: http://localhost:${PORT}/health`);
	console.log(`🍽️  Menu API: http://localhost:${PORT}/api/menu`);
	console.log(`🔐  Auth API: http://localhost:${PORT}/api/auth`);
	console.log(`📋 Orders API: http://localhost:${PORT}/api/order`);
	console.log("Loaded ENV SMTP_USER:", process.env.SMTP_USER);

});

export default app;
