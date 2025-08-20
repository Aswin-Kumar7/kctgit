import React, { useState, useEffect } from 'react';
import { FaFilter, FaLeaf, FaSearch, FaUtensils, FaStar } from 'react-icons/fa';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '../types';
import { getMenuItems, getMenuCategories } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const MenuList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [items, cats] = await Promise.all([
          getMenuItems(),
          getMenuCategories()
        ]);
        setMenuItems(items);
        setCategories(cats);
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        setLoading(true);
        const items = await getMenuItems(selectedCategory || undefined, showVegetarianOnly);
        setMenuItems(items);
      } catch (err) {
        setError('Failed to load filtered menu items');
        console.error('Error loading filtered menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredItems();
  }, [selectedCategory, showVegetarianOnly]);

  const filteredItems = menuItems.filter(item =>
    searchQuery === '' || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full border-2 border-orange-200 animate-pulse"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading delicious menu items...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUtensils className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium py-3 px-6 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center">
            <FaUtensils className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            Our Menu
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of delicious dishes, prepared with the finest ingredients and crafted with passion
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
          />
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Options</h3>
          </div>
          
          {/* Category Filters */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                  selectedCategory === ''
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                All Items
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-transparent shadow-lg'
                      : 'bg-white text-gray-700 border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Vegetarian Filter */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showVegetarianOnly}
                  onChange={(e) => setShowVegetarianOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 ${
                  showVegetarianOnly 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 group-hover:border-green-400'
                }`}>
                  {showVegetarianOnly && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center h-full"
                    >
                      <FaLeaf className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                Vegetarian Only
              </span>
            </label>

            {/* Results Count */}
            <div className="text-sm text-gray-500">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-16"
        >
          <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaSearch className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Items Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `No dishes match "${searchQuery}". Try adjusting your search or filters.`
              : 'No items match your current filters. Try selecting different options.'
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setShowVegetarianOnly(false);
            }}
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium py-3 px-6 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ 
            hidden: { opacity: 0 }, 
            show: { 
              opacity: 1, 
              transition: { staggerChildren: 0.08 } 
            } 
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={{ 
                  hidden: { opacity: 0, y: 20, scale: 0.95 }, 
                  show: { opacity: 1, y: 0, scale: 1 } 
                }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <MenuItem item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MenuList;
