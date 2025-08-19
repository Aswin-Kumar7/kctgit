import React, { useEffect, useState } from 'react';
import { getMe, updateMe, deleteMe } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(u => { setUsername(u.username); setEmail(u.email); setName(u.name || ''); setPhone(u.phone || ''); })
      .catch(() => toast.error('Failed to load profile'));
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const u = await updateMe({ name, phone });
      setName(u.name || ''); setPhone(u.phone || '');
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  const onDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await deleteMe();
      localStorage.removeItem('token');
      toast.success('Account deleted');
      navigate('/intro');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-2xl p-6 shadow">
      <button onClick={() => window.location.replace('/menu')} className="mb-4 text-sm text-gray-700 hover:underline">← Back to menu</button>
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input value={username} disabled className="input-field bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input value={email} disabled className="input-field bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone number</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button onClick={onSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save changes'}</button>
          <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg">Delete Account</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
