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
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}
		const token = authHeader.split(' ')[1];
		const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
		const decoded = jwt.verify(token, secret) as JwtPayload;
		req.user = { id: decoded.id, email: decoded.email };
		next();
	} catch (error) {
		res.status(401).json({ error: 'Invalid or expired token' });
	}
};

export default authMiddleware;
