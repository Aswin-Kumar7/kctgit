import React from 'react';
import AdminMenuManager from '../components/AdminMenuManager';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
const AdminMenuManagement: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.email !== 'admin@kore.com') return null;
  return (
    <div>
      <Navbar onCartClick={() => {}} />
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
        <AdminMenuManager />
      </div>
    </div>
  );
};

export default AdminMenuManagement;
