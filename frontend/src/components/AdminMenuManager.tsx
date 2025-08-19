import React, { useEffect, useState } from 'react';
import { MenuItem as MenuItemType } from '../types';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../services/api';
import toast from 'react-hot-toast';

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
      // if a pending file exists, upload it first
      let imageUrl = editing.image;
      const pending = (editing as any)._pendingFile as File | undefined;
      if (pending) {
        const upl = await uploadMenuImage(pending);
        imageUrl = upl.url;
        // revoke object URL if we created one earlier
        try { URL.revokeObjectURL((editing as any).image); } catch {}
      }

      if (!editing.id) {
        // create with random id
        const id = Math.random().toString(36).slice(2, 9);
        const created = await createMenuItem({ ...editing, id, image: imageUrl });
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
      <h3 className="text-xl font-semibold mb-4">Menu management</h3>
      <div className="flex gap-2">
        <button onClick={() => setEditing({ ...blank })} className="btn-primary">Add new</button>
        <button onClick={load} className="btn-secondary">Refresh</button>
      </div>

      {loading ? (
        <div className="mt-4 text-gray-600">Loading…</div>
      ) : (
        <div className="mt-4">
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

      {editing && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
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
                // store temporarily as object URL while upload happens on save
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

          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="btn-primary">Save</button>
            <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManager;
