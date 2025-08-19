import React, { useEffect, useState } from 'react';
import { MenuItem as MenuItemType } from '../types';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const blank: MenuItemType = {
  id: '',
  name: '',
  price: 0,
  category: 'Appetizer',
  description: '',
  isVegetarian: false,
};

const AdminMenuManager: React.FC = () => {
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MenuItemType | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const list = await getMenuItems();
      setItems(list);
    } catch (e) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    try {
      let imageUrl = editing.image;
      const pending = (editing as any)._pendingFile as File | undefined;
      if (pending) {
        const upl = await uploadMenuImage(pending);
        imageUrl = upl.url;
        try { URL.revokeObjectURL((editing as any).image); } catch {}
      }

      if (!editing.id) {
        const payload = { ...editing } as any;
        delete payload.id;
        payload.image = imageUrl;
        const created = await createMenuItem(payload);
        setItems(prev => [created, ...prev]);
        toast.success('Menu item created');
      } else {
        const updated = await updateMenuItem(editing.id, { ...editing, image: imageUrl });
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        toast.success('Menu item updated');
      }
      setEditing(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Menu management</h3>     
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin')} className="btn-primary">Go to Order Management</button>
          <button onClick={() => setEditing({ ...blank })} className="btn-primary">Add new</button>
          <button onClick={load} className="btn-secondary">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : (
        <div>
          {items.map(it => (
            <div key={it.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <div className="font-semibold">{it.name} <span className="text-sm text-gray-500">• {it.category}</span></div>
                <div className="text-sm text-gray-500">${it.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(it)} className="text-sm text-indigo-600">Edit</button>
                <button onClick={() => handleDelete(it.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
              <h4 className="text-lg font-semibold mb-4">{editing.id ? 'Edit item' : 'Add item'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} placeholder="id (optional)" className="input" />
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="name" className="input" />
                <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value || '0') })} placeholder="price" className="input" />
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as any })} className="input">
                  <option>Appetizer</option>
                  <option>Main-course</option>
                  <option>Dessert</option>
                  <option>Beverage</option>
                </select>
                <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="description" className="input col-span-1 md:col-span-2" />
                <div className="col-span-1 md:col-span-2">
                  <input type="file" accept="image/*" onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f || !editing) return;
                    const obj = URL.createObjectURL(f);
                    setEditing({ ...editing, image: obj });
                    (editing as any)._pendingFile = f;
                  }} className="w-full" />
                  <div className="text-sm text-gray-500 mt-1">Or paste an image URL below.</div>
                  <input value={editing.image || ''} onChange={e => setEditing({ ...editing, image: e.target.value })} placeholder="image url (or leave blank to upload)" className="input mt-2" />
                </div>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={editing.isVegetarian} onChange={e => setEditing({ ...editing, isVegetarian: e.target.checked })} /> Vegetarian
                </label>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenuManager;
