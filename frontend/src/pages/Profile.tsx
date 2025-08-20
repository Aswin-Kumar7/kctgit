import React, { useEffect, useState } from 'react';
import { getMe, updateMe, deleteMe } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaUserTag, FaPhone, FaSave, FaTrash, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(u => { 
        setUsername(u.username); 
        setEmail(u.email); 
        setName(u.name || ''); 
        setPhone(u.phone || ''); 
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const u = await updateMe({ name, phone });
      setName(u.name || ''); 
      setPhone(u.phone || '');
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally { 
      setSaving(false); 
    }
  };

  const onDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.')) return;
    try {
      await deleteMe();
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      navigate('/intro');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FaUser className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Account Information</h2>
                    <p className="text-orange-100 text-sm">Update your personal details</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaUserTag className="h-4 w-4 text-orange-500" />
                    Username
                  </label>
                  <div className="relative">
                    <input 
                      value={username} 
                      disabled 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" 
                      placeholder="Username"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FaShieldAlt className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Username cannot be changed</p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaEnvelope className="h-4 w-4 text-orange-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      value={email} 
                      disabled 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" 
                      placeholder="Email address"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FaShieldAlt className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaUser className="h-4 w-4 text-orange-500" />
                    Full Name
                  </label>
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" 
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaPhone className="h-4 w-4 text-orange-500" />
                    Phone Number
                  </label>
                  <input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" 
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button 
                    onClick={onSave} 
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium py-3 px-6 rounded-lg hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaSave className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <motion.button
                onClick={onDelete}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaTrash className="h-4 w-4" />
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
