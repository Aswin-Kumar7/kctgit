import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, requestOtp, verifyOtp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt, FaArrowRight, FaUtensils, FaUser, FaKey } from 'react-icons/fa';

const Login: React.FC = () => {
  const [tab, setTab] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await loginUser({ email, password });
      setAuth({ token, user });
      toast.success('Welcome back!');
      if (user.email === 'admin@kore.com') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const onRequestOtp = async () => {
    if (!email) { toast.error('Enter email'); return; }
    setLoading(true);
    try {
      await requestOtp({ email });
      setOtpSent(true);
      toast.success('OTP sent to email');
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const onVerifyOtp = async () => {
    if (!email || !code) { toast.error('Enter email and code'); return; }
    setLoading(true);
    try {
      const { token, user } = await verifyOtp({ email, code });
      setAuth({ token, user });
      toast.success('Logged in');
      if (user.email === 'admin@kore.com') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-rose-300/30 blur-3xl rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-gradient-to-br from-orange-400/30 to-yellow-400/30 blur-3xl rounded-full" 
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 blur-2xl rounded-full" 
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
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl shadow-2xl mb-4"
          >
            <FaUtensils className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            KORE
          </h1>
          <p className="text-gray-600 text-lg">Welcome back to your culinary journey</p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
        >
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-rose-50/50 opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            {/* Tab Navigation */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-1 mb-8 p-1 bg-gray-100/80 rounded-2xl backdrop-blur-sm"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  tab === 'password'
                    ? 'bg-white text-orange-600 shadow-lg shadow-orange-500/25'
                    : 'text-gray-600 hover:text-gray-800'
                }`} 
                onClick={() => setTab('password')}
              >
                <FaLock className="h-4 w-4" />
                Password
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  tab === 'otp'
                    ? 'bg-white text-orange-600 shadow-lg shadow-orange-500/25'
                    : 'text-gray-600 hover:text-gray-800'
                }`} 
                onClick={() => setTab('otp')}
              >
                <FaShieldAlt className="h-4 w-4" />
                OTP
              </motion.button>
            </motion.div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {tab === 'password' ? (
                <motion.form 
                  key="pwd" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }} 
                  transition={{ duration: 0.3 }}
                  onSubmit={onPasswordLogin} 
                  className="space-y-6"
                >
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
                        placeholder="Enter your password" 
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
                        Please wait...
                      </>
                    ) : (
                      <>
                        Sign In
                        <FaArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="otp" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }} 
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
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

                  {!otpSent ? (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                      onClick={onRequestOtp} 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <FaShieldAlt className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <>
                      {/* OTP Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaKey className="h-4 w-4 text-orange-500" />
                          One-Time Password
                        </label>
                        <div className="relative">
                          <input 
                            className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm text-center text-lg font-mono tracking-widest" 
                            placeholder="Enter 6-digit code" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                            maxLength={6}
                            required
                          />
                          <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                        <p className="text-xs text-gray-500 text-center">Check your email for the 6-digit code</p>
                      </div>

                      {/* Verify Button */}
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                        onClick={onVerifyOtp} 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify OTP
                            <FaArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Register Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-6 border-t border-gray-200/50"
            >
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors underline decoration-2 underline-offset-2">
                  Create one here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
