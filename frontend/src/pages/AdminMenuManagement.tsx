import React from 'react';
import AdminMenuManager from '../components/AdminMenuManager';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUtensils, FaArrowLeft } from 'react-icons/fa';

const AdminMenuManagement: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.email !== 'admin@kore.com') return null;
  
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
                <FaUtensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800">Menu Management</h1>
                <p className="text-gray-600">Create, edit, and manage menu items</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Orders
            </motion.button>
          </div>
        </motion.div>

        {/* Menu Manager Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AdminMenuManager />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMenuManagement;
