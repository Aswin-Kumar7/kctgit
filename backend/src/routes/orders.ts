import { Router } from 'express';
import { menuItems } from '../data/menu';
import MenuItemModel from '../models/MenuItem';
import { ApiResponse, Order as LegacyOrder, CreateOrderRequest, OrderItem } from '../types';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import Order from '../models/Order';
import User from '../models/User';
import sendEmail from '../utils/mailer';
import { Request, Response, NextFunction } from 'express'; // keep this import only

const router = Router();

// Protect all order routes
router.use(authMiddleware);

// Admin middleware (only allow hardcoded admin user)
const adminEmail = 'admin@kore.com';
function adminOnly(req: Request, res: Response, next: NextFunction) {
	if ((req as any).user?.email === adminEmail) return next();
	return res.status(403).json({ error: 'Admin access only' });
}

// GET /api/order/all - List all orders (admin only)
router.get('/all', adminOnly, async (req, res) => {
	try {
		const docs = await Order.find({}).sort({ createdAt: -1 });
		const data: LegacyOrder[] = [];
		for (const o of docs) {
			const user = await User.findById(o.userId);
			data.push({
					id: o.id,
					userId: o.userId.toString(),
					items: o.items.map(i => ({
						menuItemId: i.menuItemId,
						name: i.name,
						price: i.price,
						quantity: i.quantity,
					})),
					total: o.total,
					status: o.status as any,
					createdAt: o.createdAt,
					customerName: o.customerName || user?.name,
					customerPhone: o.customerPhone || user?.phone,
					canCancel: !['preparing','ready','delivered'].includes(o.status),
				});
		}
		res.json({ success: true, data });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve all orders' });
	}
});

// PATCH /api/order/:id - Update order status (admin only)
router.patch('/:id', adminOnly, async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const order = await Order.findById(id);
		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		// If order is already cancelled, do not allow any further edits
		if (order.status === 'cancelled') {
			return res.status(400).json({ error: 'Cannot modify a cancelled order' });
		}

		const allowed = ['pending','confirmed','preparing','ready','delivered','cancelled'];
		if (!allowed.includes(status)) {
			return res.status(400).json({ error: 'Invalid status' });
		}

		// Only allow cancel if not preparing/ready/delivered
		if (status === 'cancelled' && ['preparing','ready','delivered'].includes(order.status)) {
			return res.status(400).json({ error: 'Cannot cancel after order is being prepared or completed' });
		}

		order.status = status;
		await order.save();
		return res.json({ success: true, data: order });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'Failed to update order' });
	}
});

// PATCH /api/order/:id/cancel - User cancels their own order if not preparing/ready/delivered
router.patch('/:id/cancel', async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { id } = req.params;
		const order = await Order.findById(id);
		if (!order) return res.status(404).json({ error: 'Order not found' });
		if (order.userId.toString() !== req.user?.id) return res.status(403).json({ error: 'Forbidden' });
		if (['preparing','ready','delivered'].includes(order.status)) {
			return res.status(400).json({ error: 'Cannot cancel after order is being prepared or completed' });
		}
		order.status = 'cancelled';
		await order.save();
		return res.json({ success: true, data: order });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'Failed to cancel order' });
	}
});

// POST /api/order - Create a new order
router.post('/', async (req: AuthenticatedRequest, res: Response<ApiResponse<LegacyOrder>>): Promise<void> => {
	try {
		console.log('POST /order called, user:', req.user);
		console.log('Request body:', JSON.stringify(req.body));
		const orderData: CreateOrderRequest = req.body;
		if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
			res.status(400).json({ success: false, error: 'Order must contain at least one item' });
			return;
		}

		const orderItems: OrderItem[] = [];
		let total = 0;
		for (const item of orderData.items) {
			// Try to resolve menu item from DB first (new items use Mongo _id)
			let menuItem = null as any;
			try {
				menuItem = await MenuItemModel.findById(item.menuItemId).lean().exec();
			} catch (e) {
				// ignore invalid ObjectId format
				menuItem = null;
			}

			// If not found in DB, fallback to static seed list
			if (!menuItem) {
				menuItem = menuItems.find(menuItem => menuItem.id === item.menuItemId);
			}

			if (!menuItem) {
				console.error('Menu item not found for id:', item.menuItemId);
				console.error('Available menu ids (static):', menuItems.map(m=>m.id).join(','));
				res.status(400).json({ success: false, error: `Menu item with ID ${item.menuItemId} not found` });
				return;
			}

			if (item.quantity <= 0) {
				res.status(400).json({ success: false, error: `Quantity must be greater than 0 for item ${menuItem.name}` });
				return;
			}

			const price = typeof menuItem.price === 'number' ? menuItem.price : Number(menuItem.price || 0);
			total += price * item.quantity;
			orderItems.push({ menuItemId: item.menuItemId, quantity: item.quantity, price, name: menuItem.name });
		}

		const user = await User.findById(req.user?.id);
		const created = await Order.create({
			userId: user?._id,
			items: orderItems,
			total: Math.round(total * 100) / 100,
			status: 'pending',
			customerName: orderData.customerName || user?.name,
			customerPhone: orderData.customerPhone || user?.phone,
		});

		const response: LegacyOrder = {
			id: created.id,
			userId: req.user?.id,
			items: orderItems,
			total: created.total,
			status: created.status as LegacyOrder['status'],
			createdAt: created.createdAt,
			customerName: created.customerName || user?.name,
			customerPhone: created.customerPhone || user?.phone,
			canCancel: true,
			
		};

	// Send order summary email (best-effort)
	try {
		if (user?.email) {
		  const lines = orderItems.map(i => `
			<tr>
			  <td style="padding:10px 12px; border-bottom:1px solid #eee; text-align:left;">${i.name}</td>
			  <td style="padding:10px 12px; border-bottom:1px solid #eee; text-align:center;">${i.quantity}</td>
			  <td style="padding:10px 12px; border-bottom:1px solid #eee; text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
			</tr>
		  `).join('');
	  
		  const text = `Hello ${user.name || user.username},
		  
	  Thank you for your order on KORE.
	  
	  Order ID: ${response.id}
	  Total: $${response.total.toFixed(2)}
	  
	  Items:
	  ${orderItems.map(i => `- ${i.name} x ${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`).join('\n')}
	  
	  — KORE`;
	  
		  const html = `
		  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; padding: 40px;">
			<table align="center" width="600" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.08);">
	  
			  <!-- Header -->
			  <tr>
				<td style="background: linear-gradient(90deg,rgb(255, 102, 0),rgb(255, 167, 36)); padding: 28px; text-align: center; color: white; font-size: 26px; font-weight: bold; letter-spacing: 1px;">
				  KORE
				</td>
			  </tr>
	  
			  <!-- Body -->
			  <tr>
				<td style="padding: 36px; color: #333; text-align: left;">
				  <h2 style="margin-bottom: 12px; font-size: 22px; font-weight: 600; color: #111; text-align:center;">
					Order Confirmation
				  </h2>
				  <p style="font-size: 16px; color: #555; margin-bottom: 24px; line-height: 1.5; text-align:center;">
					Hi <strong>${user.name || user.username}</strong>,  
					thanks for shopping with <strong>KORE</strong>!  
					Your order has been placed successfully.
				  </p>
	  
				  <p style="font-size:15px; margin-bottom:20px;">
					<strong>Order ID:</strong> ${response.id}<br/>
					<strong>Total:</strong> $${response.total.toFixed(2)}
				  </p>
	  
				  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-top:15px;">
					<thead>
					  <tr style="background:#f5f5f5;">
						<th style="padding:10px; text-align:left;">Item</th>
						<th style="padding:10px; text-align:center;">Qty</th>
						<th style="padding:10px; text-align:right;">Price</th>
					  </tr>
					</thead>
					<tbody>
					  ${lines}
					</tbody>
				  </table>
	  
				  <div style="text-align:center; margin-top:30px;">
					<a href="http://localhost:5173/orders/" 
					   style="display:inline-block; padding:14px 28px; background:rgb(255, 145, 0); color:#fff; 
					   text-decoration:none; border-radius:8px; font-size:15px; font-weight:600; 
					   transition: background 0.3s ease;">
					  Track Your Order
					</a>
				  </div>
				</td>
			  </tr>
	  
			  <!-- Footer -->
			  <tr>
				<td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#888;">
				  © ${new Date().getFullYear()} KORE. All rights reserved.  
				  <br/>This is an automated email, please do not reply.
				</td>
			  </tr>
			</table>
		  </div>
		  `;
	  
		  await sendEmail({
			to: user.email,
			subject: 'KORE – Order Confirmation',
			text,
			html
		  });
		}
	  } catch (e) {
		console.warn('Order confirmation email failed:', (e as Error)?.message);
	  }
	  
	  

	console.log('Order created successfully:', response.id, 'user:', req.user?.id);
	res.status(201).json({ success: true, data: response, message: 'Order created successfully' });
	} catch (error) {
	console.error('Failed to create order:', error);
	res.status(500).json({ success: false, error: 'Failed to create order' });
	}
});

// GET /api/order/me and /api/orders/me - List current user's orders
const getUserOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
	console.log('GET /order/me called, user:', req.user);
	if (!req.user?.id) {
			console.error('No user in request for /me', req.user);
			res.status(401).json({ success: false, error: 'Unauthorized' });
			return;
		}

	const docs = await Order.find({ userId: req.user?.id }).sort({ createdAt: -1 });
	console.log('Found orders count for user', req.user.id, ':', docs.length);
		const user = await User.findById(req.user.id);

		const data: LegacyOrder[] = [];
		for (const o of docs) {
			try {
				data.push({
					id: o.id,
					userId: req.user?.id,
					items: Array.isArray(o.items) ? o.items.map(i => ({
						menuItemId: i.menuItemId,
						name: i.name,
						price: i.price,
						quantity: i.quantity,
					})) : [],
					total: o.total || 0,
					status: o.status as any,
					createdAt: o.createdAt,
					customerName: o.customerName || user?.name,
					customerPhone: o.customerPhone || user?.phone,
					canCancel: !['preparing','ready','delivered'].includes(o.status),
				});
			} catch (e) {
				console.error('Failed to map order', o.id, e);
			}
		}

		res.json({ success: true, data });
	} catch (error) {
		console.error('Error in /me:', error);
		res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
	}
};

// Mount both /order/me and /orders/me routes to same handler
router.get('/orders/me', getUserOrders);
router.get('/me', getUserOrders);

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
		const user = await User.findById(req.user.id);
		const data: LegacyOrder = {
			id: order.id,
			userId: req.user?.id,
			items: Array.isArray(order.items) ? order.items.map(i => ({
				menuItemId: i.menuItemId,
				name: i.name,
				price: i.price,
				quantity: i.quantity,
			})) : [],
			total: order.total,
			status: order.status as any,
			createdAt: order.createdAt,
			customerName: order.customerName || user?.name,
			customerPhone: order.customerPhone || user?.phone,
			canCancel: !['preparing','ready','delivered'].includes(order.status),
		};
		res.json({ success: true, data });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve order' });
	}
});

export default router;
