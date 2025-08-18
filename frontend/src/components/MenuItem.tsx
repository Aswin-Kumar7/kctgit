import React from 'react';
import { FaPlus, FaLeaf, FaMinus } from 'react-icons/fa';
import { MenuItem as MenuItemType } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { state, dispatch } = useCart();

  const cartEntry = state.items.find(ci => ci.menuItem.id === item.id);
  const quantity = cartEntry?.quantity ?? 0;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (next: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId: item.id, quantity: next } });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const categoryColor = (category: string) => {
    switch (category) {
      case 'appetizer':
        return 'bg-blue-100 text-blue-800';
      case 'main-course':
        return 'bg-green-100 text-green-800';
      case 'dessert':
        return 'bg-purple-100 text-purple-800';
      case 'beverage':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card transition-shadow duration-200 hover:shadow-xl">
      <div className="p-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-40 w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                {item.isVegetarian && (
                  <FaLeaf className="h-4 w-4 text-green-600" title="Vegetarian" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            </div>
            <span className="text-xl font-bold text-primary-600 ml-4">
              {formatPrice(item.price)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor(item.category)}`}>
              {item.category.replace('-', ' ')}
            </span>

            <div className="flex items-center">
              <AnimatePresence mode="wait" initial={false}>
                {quantity > 0 ? (
                  <motion.div key="qty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateQuantity(quantity - 1)} className="btn-secondary !py-1 !px-3">
                      <FaMinus className="h-3 w-3" />
                    </motion.button>
                    <motion.span key={quantity} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="min-w-[2rem] text-center font-semibold text-gray-900">
                      {quantity}
                    </motion.span>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateQuantity(quantity + 1)} className="btn-primary !py-1 !px-3">
                      <FaPlus className="h-3 w-3" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button key="add" whileTap={{ scale: 0.95 }} onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                    <FaPlus className="h-4 w-4" />
                    Add to Cart
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;
