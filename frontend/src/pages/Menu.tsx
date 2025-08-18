import React from 'react';
import Navbar from '../components/Navbar';
import MenuList from '../components/MenuList';
import CartDrawer from '../components/Cart';
import { motion } from 'framer-motion';

const MenuPage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <MenuList />
      </motion.main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default MenuPage;
