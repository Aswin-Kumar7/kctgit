import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import Otp from '../models/Otp';
import sendEmail from '../utils/mailer';
import config from '../config/config';

const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRES_IN_ENV = config.jwt.expiresIn;
const DEV_MODE = config.smtp.devMode;

const JWT_EXPIRES_IN_NORMALIZED: SignOptions['expiresIn'] = ((): any => {
	const maybeNumber = Number(JWT_EXPIRES_IN_ENV as any);
	if (Number.isFinite(maybeNumber)) return maybeNumber;
	return JWT_EXPIRES_IN_ENV as any;
})();

function createToken(user: { id: string; email: string }): string {
	const options: SignOptions = { expiresIn: JWT_EXPIRES_IN_NORMALIZED } as any;
	return jwt.sign(user, JWT_SECRET, options);
}

export async function register(req: Request, res: Response): Promise<void> {
	try {
		const { username, email, password, name, phone } = req.body || {};
		if (!username || !email || !password) {
			res.status(400).json({ error: 'username, email and password are required' });
			return;
		}
		const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
		if (existing) {
			res.status(409).json({ error: 'User already exists' });
			return;
		}
		await User.create({ username, email: email.toLowerCase(), password, name, phone });
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to register user' });
	}
}

export async function login(req: Request, res: Response): Promise<void> {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			res.status(400).json({ error: 'email and password are required' });
			return;
		}
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}
		const valid = await user.comparePassword(password);
		if (!valid) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}
		const token = createToken({ id: user.id, email: user.email });
		res.json({ token, user: { id: user.id, username: user.username, email: user.email, name: user.name, phone: user.phone } });
	} catch (error) {
		res.status(500).json({ error: 'Failed to login' });
	}
}

function generateOtpCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(req: Request, res: Response): Promise<void> {
	try {
		const { email } = req.body || {};
		if (!email) {
			res.status(400).json({ error: 'email is required' });
			return;
		}
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			res.json({ message: 'If the email exists, an OTP has been sent' });
			return;
		}
		const code = generateOtpCode();
		const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
		await Otp.create({ email: user.email, code, expiresAt, used: false });
		try {
			await sendEmail({
				to: user.email,
				subject: "KORE – Your One-Time Password (OTP)",
				text: `Your KORE OTP is ${code}. It expires in 10 minutes.`,
				html: `
				<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; padding: 40px;">
				  <table align="center" width="600" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.08);">

					<tr>
					  <td style="background: linear-gradient(90deg,rgb(255, 102, 0),rgb(255, 167, 36)); padding: 28px; text-align: center; color: white; font-size: 26px; font-weight: bold; letter-spacing: 1px;">
						KORE
					  </td>
					</tr>
					<tr>
					  <td style="padding: 36px; text-align: center; color: #333;">
						<h2 style="margin-bottom: 12px; font-size: 22px; font-weight: 600; color: #111;">
						  Email Verification Code
						</h2>
						<p style="font-size: 16px; color: #555; margin-bottom: 24px; line-height: 1.5;">
						  Hi <strong>${user.username}</strong>,  
						  use the code below to complete your login to <strong>KORE</strong>.  
						  This OTP is valid for <strong>10 minutes</strong>.
						</p>
						
						<div style="font-size: 34px; font-weight: bold; letter-spacing: 6px; color: rgb(255, 145, 0); margin: 28px auto;">
						  ${code}
						</div>
			  
						<p style="font-size: 14px; color: #777; margin-top: 20px;">
						  For your security, never share this code with anyone.
						</p>
			  
						<a href="http://localhost:5173/login" 
						   style="display: inline-block; margin-top: 28px; padding: 14px 28px; 
						   background:rgb(255, 145, 0); color: #fff; text-decoration: none; border-radius: 8px; 
						   font-size: 15px; font-weight: 600; transition: background 0.3s ease;">
						  Open KORE
						</a>
					  </td>
					</tr>

					<tr>
					  <td style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #888;">
						© ${new Date().getFullYear()} KORE. All rights reserved.  
						<br/>This is an automated email, please do not reply.
					  </td>
					</tr>
				  </table>
				</div>
				`
			  });
			
			res.json({ message: 'OTP sent to your email' });
			return;
		} catch (mailErr) {
			if (DEV_MODE) {
				console.warn('OTP email send failed (dev fallback):', mailErr);
				console.log(`DEV OTP for ${user.email}: ${code}`);
				res.json({ message: 'OTP sent to your email' });
				return;
			}
			throw mailErr;
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to send OTP' });
	}
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
	try {
		const { email, code } = req.body || {};
		if (!email || !code) {
			res.status(400).json({ error: 'email and code are required' });
			return;
		}
		const otpDoc = await Otp.findOne({ email: email.toLowerCase(), code }).sort({ expiresAt: -1 });
		if (!otpDoc) {
			res.status(400).json({ error: 'Invalid OTP' });
			return;
		}
		if (otpDoc.used) {
			res.status(400).json({ error: 'OTP already used' });
			return;
		}
		if (otpDoc.expiresAt.getTime() < Date.now()) {
			res.status(400).json({ error: 'OTP expired' });
			return;
		}
		otpDoc.used = true;
		await otpDoc.save();
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}
		const token = createToken({ id: user.id, email: user.email });
		res.json({ token, user: { id: user.id, username: user.username, email: user.email, name: user.name, phone: user.phone } });
	} catch (error) {
		res.status(500).json({ error: 'Failed to verify OTP' });
	}
}

export async function me(req: Request, res: Response): Promise<void> {
	try {
		const userId = (req as any).user?.id as string | undefined;
		if (!userId) {
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}
		const user = await User.findById(userId).select('username email createdAt name phone');
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}
		res.json({ user });
	} catch (error) {
		res.status(500).json({ error: 'Failed to load profile' });
	}
}
