export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Appetizer' | 'Main-course' | 'Dessert' | 'Beverage';
  description: string;
  image?: string;
  isVegetarian: boolean;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId?: string; // associated user
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  customerName?: string;
  customerPhone?: string;
  canCancel?: boolean; // <--- add this

}

export interface CreateOrderRequest {
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  customerName?: string;
  customerPhone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
