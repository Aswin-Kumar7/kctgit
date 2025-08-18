import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderItem {
	menuItemId: string;
	name: string;
	price: number;
	quantity: number;
}

export interface IOrder extends Document {
	userId: Types.ObjectId;
	items: IOrderItem[];
	total: number;
	status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
	createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
	menuItemId: { type: String, required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	items: { type: [OrderItemSchema], required: true },
	total: { type: Number, required: true },
	status: { type: String, enum: ['pending','confirmed','preparing','ready','delivered'], default: 'pending' },
	createdAt: { type: Date, default: Date.now },
});

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
