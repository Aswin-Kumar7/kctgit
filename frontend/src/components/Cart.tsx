import React, { useEffect, useState } from 'react';
import { FaTrash, FaMinus, FaPlus, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Checkout from './Checkout';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    const duration = 300;
    const start = animatedTotal;
    const end = state.total;
    const startTime = performance.now();

    function animate(time: number) {
      const progress = Math.min((time - startTime) / duration, 1);
      setAnimatedTotal(start + (end - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [state.total]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (!isOpen) return null;
  if (showCheckout) return <Checkout onBack={() => setShowCheckout(false)} onClose={onClose} />;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaShoppingCart className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                </div>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaShoppingCart className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                  <button onClick={onClose} className="btn-primary">Browse Menu</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.menuItem.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 leading-tight">{item.menuItem.name}</h3>
                        <p className="text-sm text-gray-600">{formatPrice(item.menuItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FaPlus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.menuItem.id)}
                          className="ml-1 h-8 w-8 flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          aria-label="Remove item"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-orange-600">{formatPrice(animatedTotal)}</span>
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full btn-primary">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
