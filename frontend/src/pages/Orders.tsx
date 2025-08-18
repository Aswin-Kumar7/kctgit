import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getMyOrders } from '../services/api';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar onCartClick={() => {}} />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Order #{o.id}</p>
                  <p className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">${o.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 capitalize">{o.status}</p>
                </div>
              </div>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {o.items.map((it, idx) => (
                  <li key={idx}>{it.name} x {it.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
