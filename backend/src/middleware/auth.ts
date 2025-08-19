import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
	id: string;
	email: string;
}

export interface AuthenticatedRequest extends Request {
	user?: { id: string; email: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	try {
		console.log('Auth headers:', req.headers);
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			console.error('Missing or invalid authorization header:', authHeader);
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}
		const token = authHeader.split(' ')[1];
		console.log('Token:', token?.substring(0, 10) + '...');
		const secret = process.env.JWT_SECRET || 'f3a1b2c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
		console.log('Using JWT secret:', secret);
		try {
			const decoded = jwt.verify(token, secret) as JwtPayload;
			console.log('Decoded token:', decoded);
			req.user = { id: decoded.id, email: decoded.email };
			next();
		} catch (e) {
			console.error('Token verification failed:', e);
			res.status(401).json({ error: 'Invalid or expired token' });
		}
	} catch (error) {
		console.error('Auth middleware error:', error);
		res.status(401).json({ error: 'Authentication failed' });
	}
};

export default authMiddleware;
