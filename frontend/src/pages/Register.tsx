import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
      await registerUser({ username, email, password, name, phone } as any);
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
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <input className="input-field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="input-field" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input-field" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="input-field" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <input className="input-field pr-10" placeholder="Password" type={showPwd ? 'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} />
              <button type="button" onClick={()=>setShowPwd(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPwd ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Please wait...' : 'Register'}</button>
          </form>

          <p className="text-sm text-gray-700 mt-6 text-center">Already have an account? <Link to="/login" className="font-semibold text-orange-600 hover:underline">Log in</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
