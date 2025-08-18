import React, { useEffect, useState } from 'react';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                  <button onClick={onClose} className="btn-primary">Browse Menu</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.menuItem.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                        <p className="text-sm text-gray-600">{formatPrice(item.menuItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                          <FaMinus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity + 1)} className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                          <FaPlus className="h-3 w-3" />
                        </button>
                        <button onClick={() => handleRemoveItem(item.menuItem.id)} className="p-1 text-red-500 hover:text-red-700 transition-colors ml-2">
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-primary-600">{formatPrice(animatedTotal)}</span>
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
