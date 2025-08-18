import React, { useState } from 'react';
import { FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Order } from '../types';

interface CheckoutProps {
  onBack: () => void;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onClose }) => {
  const { state, dispatch } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Please enter your phone number');
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
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
      };

      const order = await createOrder(orderData);
      setOrderPlaced(order);
      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
        <div className="bg-white w-full max-w-md h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FaCheck className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-600 mb-6">Thank you for your order</p>
            
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-left">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">{orderPlaced.id}</p>
                
                <p className="text-sm text-gray-600 mt-3">Total Amount</p>
                <p className="font-semibold text-primary-600 text-lg">{formatPrice(orderPlaced.total)}</p>
                
                <p className="text-sm text-gray-600 mt-3">Order Date</p>
                <p className="font-semibold text-gray-900">{formatDate(orderPlaced.createdAt)}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
        </div>

        {/* Checkout Form */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="input-field"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.menuItem.price * item.quantity)}
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(state.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                `Place Order - ${formatPrice(state.total)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
