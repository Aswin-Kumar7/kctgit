import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	name?: string;
	phone?: string;
	createdAt: Date;
	comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
	username: { type: String, required: true, unique: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true },
	name: { type: String, trim: true },
	phone: { type: String, trim: true },
	createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
	const user = this as IUser;
	if (!user.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
