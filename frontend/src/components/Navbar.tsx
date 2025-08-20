import React, { useState } from 'react';
import {
  FaShoppingCart,
  FaUtensils,
  FaUserCircle,
  FaSignOutAlt,
  FaListUl,
  FaIdBadge,
  FaCog,
  FaHeart,
  FaHome,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const isActive = (path: string) => location.pathname.startsWith(path);
  const isAdmin = user?.email === 'admin@kore.com';

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 shadow-xl border-b border-orange-400/20">
      <div className="backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/menu')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <FaUtensils className="h-7 w-7 text-white group-hover:text-orange-100 transition-colors" />
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white group-hover:text-orange-100 transition-colors">
                KORE
              </h1>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {isAdmin ? (
                <>
                  <motion.button
                    onClick={() => navigate('/admin')}
                    className={`flex items-center gap-2 text-white/90 hover:text-white transition-all duration-200 border-b-2 pb-1 ${
                      isActive('/admin') ? 'border-white text-white' : 'border-transparent hover:border-white/50'
                    }`}
                    whileHover={{ y: -1 }}
                  >
                    <FaListUl className="h-4 w-4" />
                    Orders
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/admin/menumanagement')}
                    className={`flex items-center gap-2 text-white/90 hover:text-white transition-all duration-200 border-b-2 pb-1 ${
                      isActive('/admin/menumanagement') ? 'border-white text-white' : 'border-transparent hover:border-white/50'
                    }`}
                    whileHover={{ y: -1 }}
                  >
                    <FaCog className="h-4 w-4" />
                    Menu Management
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate('/menu')}
                    className={`flex items-center gap-2 text-white/90 hover:text-white transition-all duration-200 border-b-2 pb-1 ${
                      isActive('/menu') ? 'border-white text-white' : 'border-transparent hover:border-white/50'
                    }`}
                    whileHover={{ y: -1 }}
                  >
                    <FaHome className="h-4 w-4" />
                    Menu
                  </motion.button>

                  <motion.button
                    onClick={() => navigate('/orders')}
                    className={`flex items-center gap-2 text-white/90 hover:text-white transition-all duration-200 border-b-2 pb-1 ${
                      isActive('/orders') ? 'border-white text-white' : 'border-transparent hover:border-white/50'
                    }`}
                    whileHover={{ y: -1 }}
                  >
                    <FaListUl className="h-4 w-4" />
                    Orders
                  </motion.button>
                </>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <motion.button
                onClick={onCartClick}
                className="relative p-3 text-white/90 hover:text-white focus:outline-none group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart className="h-6 w-6 group-hover:rotate-12 transition-transform duration-200" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="absolute -top-1 -right-1 bg-white text-orange-700 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg border-2 border-orange-500"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 text-white/90 hover:text-white group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <FaUserCircle className="h-7 w-7 group-hover:text-orange-100 transition-colors" />
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <span className="hidden sm:inline capitalize font-medium">
                    {user?.name || user?.username || 'Account'}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {open && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-20"
                      >
                        {/* User Info Header */}
                        <div className="bg-gradient-to-r from-orange-50 to-rose-50 px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 capitalize">
                                {user?.name || user?.username}
                              </p>
                              <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {!isAdmin && (
                            <>
                              <motion.button
                                onClick={() => {
                                  setOpen(false);
                                  navigate('/profile');
                                }}
                                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 flex items-center gap-3 transition-colors duration-150"
                                whileHover={{ x: 4 }}
                              >
                                <FaIdBadge className="h-4 w-4 text-orange-500" />
                                <span className="font-medium">Profile Settings</span>
                              </motion.button>

                              <motion.button
                                onClick={() => {
                                  setOpen(false);
                                  navigate('/orders');
                                }}
                                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 flex items-center gap-3 transition-colors duration-150"
                                whileHover={{ x: 4 }}
                              >
                                <FaListUl className="h-4 w-4 text-orange-500" />
                                <span className="font-medium">Order History</span>
                              </motion.button>
                            </>
                          )}

                          {isAdmin && (
                            <motion.button
                              onClick={() => {
                                setOpen(false);
                                navigate('/admin');
                              }}
                              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 flex items-center gap-3 transition-colors duration-150"
                              whileHover={{ x: 4 }}
                            >
                              <FaCog className="h-4 w-4 text-orange-500" />
                              <span className="font-medium">Admin Dashboard</span>
                            </motion.button>
                          )}

                          <div className="border-t border-gray-100 my-1" />

                          <motion.button
                            onClick={() => {
                              logout();
                              setOpen(false);
                              navigate('/login');
                            }}
                            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150"
                            whileHover={{ x: 4 }}
                          >
                            <FaSignOutAlt className="h-4 w-4" />
                            <span className="font-medium">Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
