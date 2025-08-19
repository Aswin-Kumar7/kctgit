import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, requestOtp, verifyOtp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
      {/* Floating accents */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-orange-400/20 blur-3xl rounded-full" />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-100/60">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>KORE</h1>
            <p className="text-gray-600">Welcome back. Please sign in to continue.</p>
          </div>

          <div className="flex gap-2 mb-5">
            <button className={`btn-secondary ${tab==='password' ? '!ring-2 !ring-orange-400 !bg-orange-50 !text-gray-800' : 'text-gray-700'}`} onClick={()=>setTab('password')}>Password</button>
            <button className={`btn-secondary ${tab==='otp' ? '!ring-2 !ring-orange-400 !bg-orange-50 !text-gray-800' : 'text-gray-700'}`} onClick={()=>setTab('otp')}>OTP</button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'password' ? (
              <motion.form key="pwd" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={onPasswordLogin} className="space-y-4">
                <input className="input-field" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <div className="relative">
                  <input className="input-field pr-10" placeholder="Password" type={showPwd ? 'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} />
                  <button type="button" onClick={()=>setShowPwd(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPwd ? <FaEyeSlash/> : <FaEye/>}
                  </button>
                </div>
                <button className="btn-primary w-full" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
              </motion.form>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
                <input className="input-field" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                {!otpSent ? (
                  <button className="btn-primary w-full" onClick={onRequestOtp} disabled={loading}>{loading ? 'Please wait...' : 'Send OTP'}</button>
                ) : (
                  <>
                    <input className="input-field" placeholder="Enter OTP" value={code} onChange={(e)=>setCode(e.target.value)} />
                    <button className="btn-primary w-full" onClick={onVerifyOtp} disabled={loading}>{loading ? 'Please wait...' : 'Verify OTP'}</button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-gray-700 mt-6 text-center">No account? <Link to="/register" className="font-semibold text-orange-600 hover:underline">Register</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
