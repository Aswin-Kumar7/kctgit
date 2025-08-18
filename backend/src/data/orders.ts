import { Order } from '../types';

export const orders: Order[] = [
  {
    id: '1',
    userId: 'u1',
    items: [
      {
        menuItemId: '4',
        quantity: 1,
        price: 24.99,
        name: 'Grilled Salmon',
      },
      {
        menuItemId: '12',
        quantity: 2,
        price: 4.99,
        name: 'Fresh Orange Juice',
      },
    ],
    total: 34.97,
    status: 'delivered',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    customerName: 'John Doe',
    customerPhone: '+1234567890',
  },
  {
    id: '2',
    userId: 'u2',
    items: [
      {
        menuItemId: '5',
        quantity: 2,
        price: 16.99,
        name: 'Beef Burger',
      },
      {
        menuItemId: '9',
        quantity: 1,
        price: 8.99,
        name: 'Chocolate Cake',
      },
    ],
    total: 42.97,
    status: 'ready',
    createdAt: new Date('2024-01-15T12:15:00Z'),
    customerName: 'Jane Smith',
    customerPhone: '+1987654321',
  },
];

export const addOrder = (order: Order): void => {
  orders.push(order);
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const getAllOrders = (): Order[] => {
  return [...orders];
};

export const getOrdersByUserId = (userId: string): Order[] => {
  return orders.filter(o => o.userId === userId);
};
