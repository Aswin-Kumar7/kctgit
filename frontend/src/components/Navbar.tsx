import React, { useState } from 'react';
import { FaShoppingCart, FaUtensils, FaUserCircle, FaSignOutAlt, FaListUl } from 'react-icons/fa';
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

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 shadow-lg">
      <div className="backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/menu')}>
              <FaUtensils className="h-7 w-7 text-white" />
              <h1 className="text-2xl font-extrabold tracking-tight text-white">KORE</h1>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onCartClick} className="relative p-3 text-white/90 hover:text-white focus:outline-none">
                <FaShoppingCart className="h-6 w-6" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300 }} className="absolute -top-1 -right-1 bg-white text-orange-700 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow">
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="relative">
                <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 text-white/90 hover:text-white">
                  <FaUserCircle className="h-7 w-7" />
                  <span className="hidden sm:inline capitalize">{user?.username || 'Account'}</span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                      <button onClick={() => { setOpen(false); navigate('/orders'); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <FaListUl /> Orders
                      </button>
                      <button onClick={() => { logout(); setOpen(false); navigate('/login'); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <FaSignOutAlt /> Logout
                      </button>
                    </motion.div>
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
