import React from 'react';
import Navbar from '../components/Navbar';
import MenuList from '../components/MenuList';
import CartDrawer from '../components/Cart';
import { motion } from 'framer-motion';

const MenuPage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <motion.main 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <MenuList />
      </motion.main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;
