import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllOrders, updateOrderStatus } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = ['pending','confirmed','preparing','ready','delivered'];

const statusBadge = (status: string) => {
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  if (status === 'delivered') return 'bg-green-100 text-green-700';
  if (status === 'preparing') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-800';
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
      toast.success('Order updated');
      fetchOrders();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to update order');
    }
  };

  if (!user || user.email !== 'admin@kore.com') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <Navbar onCartClick={() => {}} />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800"> Order Management</h2>
          <button onClick={() => navigate('/admin/menumanagement')} className="btn-primary">Go to Menu Management</button>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-600">No orders found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold">#{String(order.id).slice(-4)}</div>
                    <div>
                      <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                      <div className="text-lg font-semibold text-gray-800">#{order.id} — {order.customerName || 'Unknown customer'}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone ? `Phone: ${order.customerPhone}` : 'Phone: —'} • User: {order.userId}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(order.status)}`}>{order.status}</div>

                    {order.status !== 'cancelled' ? (
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-red-600">Cannot edit cancelled</div>
                    )}

                    <button onClick={() => fetchOrders()} className="text-sm text-indigo-600">Refresh</button>
                    <button onClick={() => setOpenOrder(openOrder === order.id ? null : order.id)} className="text-sm text-gray-600 underline">{openOrder === order.id ? 'Hide' : 'Details'}</button>
                  </div>
                </div>

                <AnimatePresence>
                  {openOrder === order.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600"><strong>Items</strong></div>
                          <ul className="mt-2 space-y-2">
                            {order.items.map((it: any, idx: number) => (
                              <li key={idx} className="flex justify-between items-center">
                                <div className="text-gray-800">{it.name} <span className="text-sm text-gray-500">x{it.quantity}</span></div>
                                <div className="font-semibold text-gray-800">${(it.price * it.quantity).toFixed(2)}</div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600"><strong>Customer Information</strong></div>
                          <div className="mt-2 text-gray-800">{order.customerName || '—'}</div>
                          <div className="text-gray-600">{order.customerPhone || '—'}</div>

                          <div className="mt-4 text-lg font-bold">Total ${order.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
