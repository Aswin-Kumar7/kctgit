import mongoose from 'mongoose';
import config from './config';

const MONGO_URI = config.mongoUri;

export const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('✅ MongoDB connected');
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		process.exit(1);
	}
};

export default connectDB;
