import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllOrders, updateOrderStatus } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClipboardList, 
  FaClock, 
  FaCheckCircle, 
  FaUtensils, 
  FaTruck, 
  FaTimesCircle, 
  FaUsers, 
  FaDollarSign, 
  FaEye, 
  FaEyeSlash,
  FaRedo,
  FaArrowRight,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaCog
} from 'react-icons/fa';

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

const statusBadge = (status: string) => {
  switch (status) {
    case 'cancelled':
      return { bg: 'bg-red-100 text-red-800 border-red-200', icon: <FaTimesCircle className="h-3 w-3" /> };
    case 'delivered':
      return { bg: 'bg-green-100 text-green-800 border-green-200', icon: <FaCheckCircle className="h-3 w-3" /> };
    case 'ready':
      return { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: <FaTruck className="h-3 w-3" /> };
    case 'preparing':
      return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: <FaUtensils className="h-3 w-3" /> };
    case 'confirmed':
      return { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: <FaCheckCircle className="h-3 w-3" /> };
    default:
      return { bg: 'bg-gray-100 text-gray-800 border-gray-200', icon: <FaClock className="h-3 w-3" /> };
  }
};

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.email !== 'admin@kore.com') { navigate('/menu'); return; }
    fetchOrders();
    // eslint-disable-next-line
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to update order');
    }
  };

  if (!user || user.email !== 'admin@kore.com') return null;

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Navbar onCartClick={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center">
                <FaClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800">Order Management</h1>
                <p className="text-gray-600">Monitor and manage all customer orders</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/menumanagement')}
              className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FaCog className="h-4 w-4" />
              Menu Management
              <FaArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{pendingOrders}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaUtensils className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{preparingOrders}</p>
                <p className="text-sm text-gray-600">Preparing</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{completedOrders}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-16"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600">Orders will appear here once customers start placing them.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        #{String(order.id).slice(-4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FaCalendarAlt className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          Order #{order.id} — {order.customerName || 'Unknown customer'}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaUser className="h-3 w-3" />
                            {order.userId}
                          </div>
                          {order.customerPhone && (
                            <div className="flex items-center gap-1">
                              <FaPhone className="h-3 w-3" />
                              {order.customerPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {statusBadge(order.status).icon}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadge(order.status).bg} capitalize`}>
                          {order.status}
                        </span>
                      </div>

                      {order.status !== 'cancelled' ? (
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-red-600 font-medium">Cannot edit cancelled</div>
                      )}

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => fetchOrders()}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Refresh"
                        >
                          <FaRedo className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setOpenOrder(openOrder === order.id ? null : order.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title={openOrder === order.id ? 'Hide Details' : 'Show Details'}
                        >
                          {openOrder === order.id ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <AnimatePresence>
                  {openOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 p-6 bg-gray-50/50"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaClipboardList className="h-4 w-4 text-orange-500" />
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="h-6 w-6 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xs font-medium text-orange-600">{idx + 1}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-800">{it.name}</div>
                                    <div className="text-sm text-gray-500">x{it.quantity}</div>
                                  </div>
                                </div>
                                <div className="font-semibold text-gray-800">${(it.price * it.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaUsers className="h-4 w-4 text-orange-500" />
                            Customer Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FaUser className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-800">{order.customerName || '—'}</span>
                            </div>
                            {order.customerPhone && (
                              <div className="flex items-center gap-2">
                                <FaPhone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-800">{order.customerPhone}</span>
                              </div>
                            )}
                            <div className="pt-3 border-t border-gray-100">
                              <div className="text-2xl font-bold text-orange-600">
                                Total: ${order.total.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
