import { Router, Response } from 'express';
import { menuItems } from '../data/menu';
import { ApiResponse, Order as LegacyOrder, CreateOrderRequest, OrderItem } from '../types';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import Order from '../models/Order';
import User from '../models/User';
import sendEmail from '../utils/mailer';

const router = Router();

// Protect all order routes
router.use(authMiddleware);

// POST /api/order - Create a new order
router.post('/', async (req: AuthenticatedRequest, res: Response<ApiResponse<LegacyOrder>>): Promise<void> => {
	try {
		const orderData: CreateOrderRequest = req.body;
		if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
			res.status(400).json({ success: false, error: 'Order must contain at least one item' });
			return;
		}

		const orderItems: OrderItem[] = [];
		let total = 0;
		for (const item of orderData.items) {
			const menuItem = menuItems.find(menuItem => menuItem.id === item.menuItemId);
			if (!menuItem) {
				res.status(400).json({ success: false, error: `Menu item with ID ${item.menuItemId} not found` });
				return;
			}
			if (item.quantity <= 0) {
				res.status(400).json({ success: false, error: `Quantity must be greater than 0 for item ${menuItem.name}` });
				return;
			}
			total += menuItem.price * item.quantity;
			orderItems.push({ menuItemId: item.menuItemId, quantity: item.quantity, price: menuItem.price, name: menuItem.name });
		}

		const user = await User.findById(req.user?.id);
		const created = await Order.create({
			userId: user?._id,
			items: orderItems,
			total: Math.round(total * 100) / 100,
			status: 'pending',
		});

		const response: LegacyOrder = {
			id: created.id,
			userId: req.user?.id,
			items: orderItems,
			total: created.total,
			status: created.status as LegacyOrder['status'],
			createdAt: created.createdAt,
			customerName: user?.name,
			customerPhone: user?.phone,
		};

		// Send order summary email (best-effort)
		try {
			if (user?.email) {
				const lines = orderItems.map(i => `• ${i.name} x ${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`).join('\n');
				const text = `Hello ${user.name || user.username},\n\nThank you for your order on KORE.\n\nOrder ID: ${response.id}\nTotal: $${response.total.toFixed(2)}\n\nItems:\n${lines}\n\n— KORE`;
				const html = `<p>Hello ${user.name || user.username},</p><p>Thank you for your order on <strong>KORE</strong>.</p><p><strong>Order ID:</strong> ${response.id}<br/><strong>Total:</strong> $${response.total.toFixed(2)}</p><p><strong>Items:</strong></p><ul>${orderItems.map(i => `<li>${i.name} x ${i.quantity} = $${(i.price * i.quantity).toFixed(2)}</li>`).join('')}</ul><p>— KORE</p>`;
				await sendEmail({ to: user.email, subject: 'KORE - Order Confirmation', text, html });
			}
		} catch (e) {
			// Do not fail the order on email errors
			console.warn('Order confirmation email failed:', (e as Error)?.message);
		}

		res.status(201).json({ success: true, data: response, message: 'Order created successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to create order' });
	}
});

// GET /api/order/:id - Get order by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const order = await Order.findById(id);
		if (!order) {
			res.status(404).json({ success: false, error: 'Order not found' });
			return;
		}
		if (order.userId.toString() !== req.user?.id) {
			res.status(403).json({ success: false, error: 'Forbidden' });
			return;
		}
		const data: LegacyOrder = {
			id: order.id,
			userId: req.user?.id,
			items: order.items as any,
			total: order.total,
			status: order.status as any,
			createdAt: order.createdAt,
		};
		res.json({ success: true, data });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve order' });
	}
});

// GET /api/order/me - List current user's orders
router.get('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		const docs = await Order.find({ userId: req.user?.id }).sort({ createdAt: -1 });
		const data: LegacyOrder[] = docs.map(o => ({
			id: o.id,
			userId: req.user?.id,
			items: o.items as any,
			total: o.total,
			status: o.status as any,
			createdAt: o.createdAt,
		}));
		res.json({ success: true, data });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
	}
});

export default router;
