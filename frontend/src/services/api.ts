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
  const token = localStorage.getItem('token');
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
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

// Auth API
export const registerUser = async (data: { username: string; email: string; password: string; name?: string; phone?: string }): Promise<void> => {
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

export const getMe = async (): Promise<{ id: string; username: string; email: string; name?: string; phone?: string }> => {
  const res = await api.get('/auth/me');
  return res.data.user;
};

export const updateMe = async (data: { name?: string; phone?: string }): Promise<{ id: string; username: string; email: string; name?: string; phone?: string }> => {
  const res = await api.put('/auth/me', data);
  return res.data.user;
};

export const deleteMe = async (): Promise<void> => {
  await api.delete('/auth/me');
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
  try {
    const res = await api.get<ApiResponse<Order[]>>('/orders/me');
    return (res.data as any).data || res.data || [];
  } catch {
    const res2 = await api.get<ApiResponse<Order[]>>('/order/me');
    return (res2.data as any).data || res2.data || [];
  }
};

export default api;
