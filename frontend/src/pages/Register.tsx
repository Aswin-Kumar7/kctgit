import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaArrowRight, FaUtensils, FaUserPlus } from 'react-icons/fa';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error('Username, Email and Password are required');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ username, email, password, name, phone, address } as any);
      toast.success('Registered successfully');
      navigate('/login');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-rose-300/30 to-orange-300/30 blur-3xl rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-gradient-to-br from-yellow-400/30 to-orange-400/30 blur-3xl rounded-full" 
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 blur-2xl rounded-full" 
        />
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }} 
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl shadow-2xl mb-4"
          >
            <FaUserPlus className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            KORE
          </h1>
          <p className="text-gray-600 text-lg">Join our culinary community today</p>
        </motion.div>

        {/* Registration Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
        >
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-rose-50/50 opacity-50" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            {/* Form */}
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={onSubmit} 
              className="space-y-6"
            >
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-orange-500" />
                  Username
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" 
                    placeholder="Choose a username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                  />
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-orange-500" />
                  Full Name
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaPhone className="h-4 w-4 text-orange-500" />
                  Phone Number
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" 
                    placeholder="Enter your phone number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                  <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-orange-500" />
                  Address (Optional)
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" 
                    placeholder="Enter your address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaEnvelope className="h-4 w-4 text-orange-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" 
                    placeholder="Enter your email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaLock className="h-4 w-4 text-orange-500" />
                  Password
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-4 pl-12 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm" 
                    placeholder="Create a strong password" 
                    type={showPwd ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(v => !v)} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPwd ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Use at least 8 characters with a mix of letters, numbers, and symbols</p>
              </div>

              {/* Submit Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Login Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-6 border-t border-gray-200/50"
            >
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors underline decoration-2 underline-offset-2">
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
