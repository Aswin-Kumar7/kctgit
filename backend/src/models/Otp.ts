import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp extends Document {
	email: string;
	code: string; // 6 digits
	expiresAt: Date;
	used: boolean;
}

const OtpSchema = new Schema<IOtp>({
	email: { type: String, required: true, index: true, lowercase: true, trim: true },
	code: { type: String, required: true },
	expiresAt: { type: Date, required: true },
	used: { type: Boolean, default: false },
});

// TTL index to auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);
export default Otp;
