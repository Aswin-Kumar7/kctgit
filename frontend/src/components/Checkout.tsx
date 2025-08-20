import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaSpinner, FaUser, FaPhone, FaReceipt, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import { Order } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutProps {
	onBack: () => void;
	onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onClose }) => {
	const { state, dispatch } = useCart();
	const { user } = useAuth();
	const [customerName, setCustomerName] = useState('');
	const [customerPhone, setCustomerPhone] = useState('');
	useEffect(() => {
		if (user) {
			if ((user as any).name) setCustomerName((user as any).name);
			if ((user as any).phone) setCustomerPhone((user as any).phone);
		}
	}, [user]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// prefer profile values when available
		const nameToUse = (user && (user as any).name) ? (user as any).name : customerName;
		const phoneToUse = (user && (user as any).phone) ? (user as any).phone : customerPhone;

		if (!nameToUse || !nameToUse.trim()) {
			setError('Your profile is missing a name. Please update your profile before placing orders.');
			return;
		}

		if (!phoneToUse || !phoneToUse.trim()) {
			setError('Your profile is missing a phone number. Please update your profile before placing orders.');
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const orderData = {
				items: state.items.map(item => ({
					menuItemId: item.menuItem.id,
					quantity: item.quantity,
				})),
				customerName: nameToUse.trim(),
				customerPhone: phoneToUse.trim(),
			};

			console.log('Placing order, payload:', orderData);

			const order = await createOrder(orderData);
			setOrderPlaced(order);
			dispatch({ type: 'CLEAR_CART' });
		} catch (err) {
			// Try to extract axios response if available
			const anyErr = err as any;
			console.error('Error placing order:', anyErr, anyErr?.response?.data || anyErr?.message);
			const serverMsg = anyErr?.response?.data?.error || anyErr?.response?.data?.message || anyErr?.message;
			setError(serverMsg ? `Failed to place order: ${serverMsg}` : 'Failed to place order. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatPrice = (price: number) => {
		return `$${price.toFixed(2)}`;
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	if (orderPlaced) {
		return (
			<div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
				<motion.div
					initial={{ x: 400, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 400, opacity: 0 }}
					transition={{ type: 'spring', stiffness: 280, damping: 30 }}
					className="bg-white w-full max-w-md h-full flex flex-col"
				>
					<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
						<motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
							<FaCheck className="h-8 w-8 text-green-600" />
						</motion.div>
						<h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h2>
						<p className="text-gray-600 mb-6">Thank you for your order</p>

						<div className="w-full bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
							<div className="text-left grid grid-cols-2 gap-4">
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">Order ID</p>
									<p className="font-semibold text-gray-900 break-all">{orderPlaced.id}</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">Total Amount</p>
									<p className="font-bold text-primary-600 text-lg">{formatPrice(orderPlaced.total)}</p>
								</div>
								<div className="col-span-2">
									<p className="text-xs uppercase tracking-wide text-gray-500">Order Date</p>
									<p className="font-semibold text-gray-900">{formatDate(orderPlaced.createdAt)}</p>
								</div>
							</div>
						</div>

						<button onClick={onClose} className="w-full btn-primary">Continue Shopping</button>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
			<motion.div
				initial={{ x: 400, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: 400, opacity: 0 }}
				transition={{ type: 'spring', stiffness: 280, damping: 30 }}
				className="bg-white w-full max-w-md h-full flex flex-col"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-gray-200 p-4">
					<div className="flex items-center gap-3">
						<button onClick={onBack} className="text-gray-600 hover:text-gray-800 transition-colors">
							<FaArrowLeft className="h-5 w-5" />
						</button>
						<h2 className="text-xl font-bold text-gray-900">Checkout</h2>
					</div>
				</div>

				{/* Checkout Form */}
				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 flex flex-col">
					{/* Customer Information (sourced from profile) */}
					<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
						<h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
							<FaUser className="h-3.5 w-3.5 text-orange-600" />
							Customer Information
						</h3>
						<div className="rounded-xl border border-gray-200 bg-white p-4">
							{user ? (
								<div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
									<div className="flex items-center gap-2">
										<FaUser className="h-3.5 w-3.5 text-gray-500" />
										<span className="font-medium">Name:</span>
										<span className="truncate">{(user as any).name || (user as any).username}</span>
									</div>
									<div className="flex items-center gap-2">
										<FaPhone className="h-3.5 w-3.5 text-gray-500" />
										<span className="font-medium">Phone:</span>
										<span>{(user as any).phone || <span className="text-red-600">(not set)</span>}</span>
									</div>
									{!((user as any).name && (user as any).phone) && (
										<div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-1">
											Please update your profile with a name and phone number before placing orders.
										</div>
									)}
								</div>
							) : (
								<div className="text-sm text-gray-700">You must be logged in to place an order.</div>
							)}
						</div>
					</motion.div>

					{/* Order Summary */}
					<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-24">
						<h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
							<FaReceipt className="h-3.5 w-3.5 text-orange-600" />
							Order Summary
						</h3>
						<div className="rounded-xl border border-gray-200 bg-white divide-y">
							{state.items.map((item) => (
								<div key={item.menuItem.id} className="flex justify-between items-center p-4">
									<div>
										<p className="font-medium text-gray-900">{item.menuItem.name}</p>
										<p className="text-xs text-gray-600 mt-0.5">Qty: {item.quantity}</p>
									</div>
									<p className="font-semibold text-gray-900">{formatPrice(item.menuItem.price * item.quantity)}</p>
								</div>
							))}
							<div className="p-4 bg-gray-50">
								<div className="flex justify-between items-center">
									<span className="text-base font-semibold text-gray-900">Total</span>
									<span className="text-xl font-extrabold text-orange-600">{formatPrice(state.total)}</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Sticky Footer Submit */}
					<div className="fixed bottom-0 right-0 w-full max-w-md bg-white border-t border-gray-200 p-4">
						<button
							type="submit"
							disabled={isSubmitting || Boolean(user && (!((user as any).name && (user as any).phone)))}
							className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isSubmitting ? (
								<>
									<FaSpinner className="h-4 w-4 animate-spin" />
									Placing Order...
								</>
							) : (
								<>
									<FaShoppingBag className="h-4 w-4" />
									Place Order - {formatPrice(state.total)}
								</>
							)}
						</button>
					</div>

					{/* Error Message */}
					<AnimatePresence>
						{error && (
							<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-2">
								<div className="bg-red-50 border border-red-200 rounded-lg p-3">
									<p className="text-red-600 text-sm">{error}</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</form>
			</motion.div>
		</div>
	);
};

export default Checkout;
