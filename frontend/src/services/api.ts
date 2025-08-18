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
      // optional: reload or redirect handled in UI
    }
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
  // support both /orders/me and /order/me/list (compat)
  try {
    const res = await api.get<ApiResponse<Order[]>>('/orders/me');
    return (res.data as any).data || res.data || [];
  } catch {
    const res2 = await api.get<ApiResponse<Order[]>>('/order/me/list');
    return (res2.data as any).data || res2.data || [];
  }
};

export default api;
