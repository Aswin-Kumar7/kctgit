import nodemailer from 'nodemailer';
import config from '../config/config';

const { host, port, secure, user, pass, from: fromCfg, allowSelfSigned, ignoreTLS } = config.smtp;
const from = fromCfg || user;

function buildTransport(relaxed = false) {
	return nodemailer.createTransport({
	  host,
	  port,
	  secure: secure, // false for STARTTLS
	  auth: user && pass ? { user, pass } : undefined,
	  tls: relaxed ? { rejectUnauthorized: false } : undefined, // only relax cert check
	});
  }

let transporter = buildTransport();

let verified = false;
async function ensureVerified(): Promise<void> {
	if (!user || !pass) {
		console.error('SMTP credentials missing in config.ts (smtp.user / smtp.pass)');
		throw new Error('SMTP credentials missing');
	}
	if (verified) return;
	try {
		await transporter.verify();
		verified = true;
		console.log('✉️  SMTP transporter verified');
	} catch (err) {
		console.warn('SMTP verify failed (continuing):', err instanceof Error ? err.message : err);
	}
}

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string; }): Promise<void> {
	await ensureVerified();
	try {
		await transporter.sendMail({ from, to, subject, text, html });
	} catch (err: any) {
		const msg = (err && (err.message || err.toString())) || '';
		const code = err?.code || '';
		const canRelax = allowSelfSigned || ignoreTLS;
		const looksLikeTls = code === 'ESOCKET' || /self[- ]signed|certificate|tls|ssl/i.test(msg);
		if (canRelax && looksLikeTls) {
			console.warn('Retrying email send with relaxed TLS due to TLS error...');
			transporter = buildTransport(true);
			await transporter.sendMail({ from, to, subject, text, html });
			return;
		}
		console.error('Email send failed:', msg);
		throw err;
	}
}

export default sendEmail;
