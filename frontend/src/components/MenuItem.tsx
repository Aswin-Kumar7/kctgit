import React from 'react';
import { FaPlus, FaLeaf, FaMinus, FaStar, FaClock } from 'react-icons/fa';
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'main-course':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dessert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'beverage':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categoryIcon = (category: string) => {
    switch (category) {
      case 'appetizer':
        return '🥗';
      case 'main-course':
        return '🍽️';
      case 'dessert':
        return '🍰';
      case 'beverage':
        return '🥤';
      default:
        return '🍴';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }} 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl group"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {item.image ? (
          <div className="relative">
            <img 
              src={item.image} 
              alt={item.name} 
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-100 flex items-center justify-center">
            <span className="text-6xl opacity-60">{categoryIcon(item.category)}</span>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm text-orange-600 font-bold text-lg px-3 py-1 rounded-full shadow-lg border border-orange-200"
          >
            {formatPrice(item.price)}
          </motion.div>
        </div>

        {/* Vegetarian Badge */}
        {item.isVegetarian && (
          <div className="absolute top-3 left-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-green-500 text-white px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-medium"
            >
              <FaLeaf className="h-3 w-3" />
              Veg
            </motion.div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColor(item.category)}`}
          >
            {item.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait" initial={false}>
            {quantity > 0 ? (
              <motion.div 
                key="qty" 
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -8 }} 
                className="flex items-center gap-3"
              >
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => updateQuantity(quantity - 1)} 
                  className="h-8 w-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors duration-200 border border-red-200"
                >
                  <FaMinus className="h-3 w-3" />
                </motion.button>
                
                <motion.span 
                  key={quantity} 
                  initial={{ scale: 0.9 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: 'spring', stiffness: 300 }} 
                  className="min-w-[2rem] text-center font-bold text-gray-800 text-lg"
                >
                  {quantity}
                </motion.span>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => updateQuantity(quantity + 1)} 
                  className="h-8 w-8 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-200 shadow-lg"
                >
                  <FaPlus className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button 
                key="add" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }} 
                onClick={handleAddToCart} 
                className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaPlus className="h-4 w-4" />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>

          {/* Quick Info */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <FaClock className="h-3 w-3" />
              <span>15-20 min</span>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-gray-600">4.8</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;
