import React, { useState, useEffect } from 'react';
import { FaFilter, FaLeaf } from 'react-icons/fa';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <FaFilter className="h-5 w-5 text-orange-600" />
        <h2
          className="text-2xl font-extrabold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Menu
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              selectedCategory === ''
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-orange-200 hover:bg-orange-50'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-orange-200 hover:bg-orange-50'
              }`}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showVegetarianOnly}
            onChange={(e) => setShowVegetarianOnly(e.target.checked)}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <FaLeaf className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-700">Vegetarian Only</span>
        </label>
      </div>

      {/* Menu Items Grid */}
      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found matching your filters.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0 }}
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
