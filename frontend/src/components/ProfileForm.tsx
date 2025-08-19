import React, { useState } from 'react';

type Props = {
  initialUser: any;
  token?: string | null;
  onSaved?: () => void;
};

const ProfileForm: React.FC<Props> = ({ initialUser, token, onSaved }) => {
  const [form, setForm] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
    phone: initialUser.phone || '',
    address: initialUser.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      setMsg('Profile saved');
      onSaved && onSaved();
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {msg && <div className="text-sm text-green-600">{msg}</div>}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
