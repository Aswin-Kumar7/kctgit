import React from 'react';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/Cart';

const CartPage: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <Navbar onCartClick={() => setOpen(true)} />
      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default CartPage;
