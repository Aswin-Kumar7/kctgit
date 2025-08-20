import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getMyOrders, cancelOrder } from '../services/api';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUtensils, 
  FaCalendarAlt, 
  FaDollarSign,
  FaBan,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    getMyOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <FaCheckCircle className="h-4 w-4 text-blue-500" />;
      case 'preparing':
        return <FaUtensils className="h-4 w-4 text-orange-500" />;
      case 'ready':
        return <FaCheckCircle className="h-4 w-4 text-green-500" />;
      case 'delivered':
        return <FaCheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <FaTimesCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FaClock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar onCartClick={() => {}} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FaSpinner className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your orders...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Navbar onCartClick={() => {}} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/menu')} 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4 group"
          >
            <FaArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Menu</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Order History</h1>
            <p className="text-gray-600">Track your past and current orders</p>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaClock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaUtensils className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status === 'preparing').length}
                  </p>
                  <p className="text-sm text-gray-600">Preparing</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUtensils className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start your culinary journey by placing your first order!</p>
            <button
              onClick={() => navigate('/menu')}
              className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium py-3 px-6 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all"
            >
              Browse Menu
            </button>
          </motion.div>
        )}

        {/* Orders List */}
        <AnimatePresence>
          {orders.map((order, index) => {
            const canCancel = !['preparing', 'ready', 'delivered', 'cancelled'].includes(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 hover:shadow-2xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">#{order.id.slice(-4)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendarAlt className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FaUtensils className="h-3 w-3 text-orange-600" />
                            </div>
                            <span className="font-medium text-gray-800">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">x{item.quantity}</span>
                            <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {canCancel && (
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <motion.button
                        onClick={() => handleCancel(order.id)}
                        className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 font-medium py-2 px-4 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaBan className="h-4 w-4" />
                        Cancel Order
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersPage;
