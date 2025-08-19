// User cancel order
export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await api.patch<ApiResponse<Order>>(`/order/${id}/cancel`);
  if (!response.data.data) throw new Error('Failed to cancel order');
  return response.data.data;
};
// Admin Orders API
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>('/order/all');
  if (!response.data.data) throw new Error('Failed to fetch orders');
  return response.data.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const response = await api.patch<ApiResponse<Order>>(`/order/${id}`, { status });
  if (!response.data.data) throw new Error('Failed to update order');
  return response.data.data;
};
import axios from 'axios';
import { MenuItem, Order, CreateOrderRequest, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const getTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const m = document.cookie.match(/(?:^|; )token=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  };

  const token = localStorage.getItem('token') || getTokenFromCookie();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
  // Do not auto-remove token/cookie on 401 to allow testing multiple sessions in different browsers.
  // UI should handle logout explicitly when necessary.
    return Promise.reject(err);
  }
);

// Auth API
export const registerUser = async (data: { username: string; email: string; password: string }): Promise<void> => {
  await api.post('/auth/register', data);
};

export const loginUser = async (data: { email: string; password: string }): Promise<{ token: string; user: any }> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const requestOtp = async (data: { email: string }): Promise<{ message: string }> => {
  const res = await api.post('/auth/request-otp', data);
  return res.data;
};

export const verifyOtp = async (data: { email: string; code: string }): Promise<{ token: string; user: any }> => {
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
};

export const getMe = async (): Promise<{ id: string; username: string; email: string }> => {
  const res = await api.get('/auth/me');
  return res.data.user;
};

// Menu API
export const getMenuItems = async (category?: string, vegetarian?: boolean): Promise<MenuItem[]> => {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (vegetarian) params.append('vegetarian', 'true');
    const response = await api.get<ApiResponse<MenuItem[]>>(`/menu?${params.toString()}`);
    return response.data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch menu items');
  }
};

export const getMenuCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<ApiResponse<string[]>>('/menu/categories');
    return response.data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};

export const getMenuItem = async (id: string): Promise<MenuItem> => {
  const response = await api.get<ApiResponse<MenuItem>>(`/menu/${id}`);
  if (!response.data.data) throw new Error('Menu item not found');
  return response.data.data;
};

// Admin Menu CRUD
export const createMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  const res = await api.post<ApiResponse<MenuItem>>('/menu', item);
  if (!res.data.data) throw new Error('Failed to create menu item');
  return res.data.data;
};

export const updateMenuItem = async (id: string, update: Partial<MenuItem>): Promise<MenuItem> => {
  const res = await api.put<ApiResponse<MenuItem>>(`/menu/${id}`, update);
  if (!res.data.data) throw new Error('Failed to update menu item');
  return res.data.data;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  await api.delete(`/menu/${id}`);
};

export const uploadMenuImage = async (file: File): Promise<{ id: string; url: string }> => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post('/menu/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  if (!res.data.data) throw new Error('Upload failed');
  return res.data.data;
};

// Orders API
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>('/order', orderData);
  if (!response.data.data) throw new Error('Failed to create order');
  return response.data.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/order/${id}`);
  if (!response.data.data) throw new Error('Order not found');
  return response.data.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const res = await api.get<ApiResponse<Order[]>>('/order/me');
  return res.data.data || [];
};

export default api;
