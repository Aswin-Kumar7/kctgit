import { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: '1',
    name: 'Spring Rolls',
    price: 8.99,
    category: 'Appetizer',
    description: 'Crispy vegetable spring rolls served with sweet chili sauce',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1572552633534-5100b6602bc8?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Chicken Wings',
    price: 12.99,
    category: 'Appetizer',
    description: 'Spicy buffalo wings with blue cheese dip',
    isVegetarian: false,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Bruschetta',
    price: 9.99,
    category: 'Appetizer',
    description: 'Toasted bread topped with tomatoes, garlic, and basil',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1604908554049-1e4d9f6a2f32?q=80&w=1200&auto=format&fit=crop'
  },

  // Main Courses
  {
    id: '4',
    name: 'Grilled Salmon',
    price: 24.99,
    category: 'Main-course',
    description: 'Fresh Atlantic salmon with lemon butter sauce and vegetables',
    isVegetarian: false,
    image: 'https://images.unsplash.com/photo-1604908177076-3f4e1b2db925?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Beef Burger',
    price: 16.99,
    category: 'Main-course',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    isVegetarian: false,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Vegetable Pasta',
    price: 18.99,
    category: 'Main-course',
    description: 'Penne pasta with seasonal vegetables in creamy sauce',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Chicken Curry',
    price: 19.99,
    category: 'Main-course',
    description: 'Spicy chicken curry with rice and naan bread',
    isVegetarian: false,
    image: 'https://images.unsplash.com/photo-1625944528738-4f1ac2ffb5f7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Caesar Salad',
    price: 14.99,
    category: 'Main-course',
    description: 'Fresh roMaine lettuce with Caesar dressing and croutons',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1559561853-08451506d2b0?q=80&w=1200&auto=format&fit=crop'
  },

  // Desserts
  {
    id: '9',
    name: 'Chocolate Cake',
    price: 8.99,
    category: 'Dessert',
    description: 'Rich chocolate layer cake with chocolate ganache',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '10',
    name: 'Cheesecake',
    price: 9.99,
    category: 'Dessert',
    description: 'New York style cheesecake with berry compote',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1601972599720-b2ac0b88c5f6?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '11',
    name: 'Ice Cream Sundae',
    price: 7.99,
    category: 'Dessert',
    description: 'Vanilla ice cream with chocolate sauce and sprinkles',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6cf7?q=80&w=1200&auto=format&fit=crop'
  },

  // Beverages
  {
    id: '12',
    name: 'Fresh Orange Juice',
    price: 4.99,
    category: 'Beverage',
    description: 'Freshly squeezed orange juice',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1542444459-db63c8afee5d?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '13',
    name: 'Iced Coffee',
    price: 5.99,
    category: 'Beverage',
    description: 'Cold brewed coffee with cream and sugar',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '14',
    name: 'Green Tea',
    price: 3.99,
    category: 'Beverage',
    description: 'Premium green tea served hot',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1451743507160-0f2d20b524d6?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '15',
    name: 'Smoothie',
    price: 6.99,
    category: 'Beverage',
    description: 'Mixed berry smoothie with yogurt',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop'
  },
];
