import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getMyOrders, cancelOrder } from '../services/api';
import { Order } from '../types';
import toast from 'react-hot-toast';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      toast.success('Order cancelled');
      fetchOrders();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to cancel order');
    }
  };

  return (
    <div>
      <Navbar onCartClick={() => {}} />
      <div className="max-w-4xl mx-auto p-4">
        <button onClick={() => window.location.replace('/menu')} className="mb-4 text-sm text-gray-700 hover:underline">← Back to menu</button>
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}
        <div className="space-y-4">
          {orders.map((o) => {
            const canCancel = !['preparing','ready','delivered','cancelled'].includes(o.status);
            return (
              <div key={o.id} className="card p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">Order #{o.id}</p>
                    <p className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">${o.total.toFixed(2)}</p>
                    <p className={`text-sm capitalize ${o.status==='cancelled' ? 'text-red-500' : 'text-gray-600'}`}>{o.status}</p>
                  </div>
                </div>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {o.items.map((it, idx) => (
                    <li key={idx}>{it.name} x {it.quantity}</li>
                  ))}
                </ul>
                {canCancel && (
                  <button
                    className="mt-3 btn-secondary text-red-600 border-red-400 hover:bg-red-50"
                    onClick={() => handleCancel(o.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
