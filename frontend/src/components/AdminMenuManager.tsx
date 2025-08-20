import React, { useEffect, useState } from 'react';
import { MenuItem as MenuItemType } from '../types';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaRedo, 
  FaImage, 
  FaUtensils, 
  FaLeaf, 
  FaDollarSign, 
  FaTag, 
  FaAlignLeft,
  FaTimes,
  FaSave
} from 'react-icons/fa';

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
        toast.success('Menu item created successfully');
      } else {
        const updated = await updateMenuItem(editing.id, { ...editing, image: imageUrl });
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        toast.success('Menu item updated successfully');
      }
      setEditing(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save menu item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Menu item deleted successfully');
    } catch (e) {
      toast.error('Failed to delete menu item');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center">
              <FaUtensils className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Menu Management</h3>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin')}
              className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEditing({ ...blank })}
              className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Add New Item
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={load}
              className="bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <FaRedo className="h-4 w-4" />
              Refresh
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUtensils className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Menu Items Yet</h3>
            <p className="text-gray-600">Start by adding your first menu item.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEditing({ ...blank })}
              className="mt-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all"
            >
              <FaPlus className="h-4 w-4 inline mr-2" />
              Add First Item
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Item Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FaImage className="h-16 w-16 text-gray-400" />
                  )}
                  <div className="absolute top-2 right-2">
                    {item.isVegetarian && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaLeaf className="h-3 w-3" />
                        Veg
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-lg line-clamp-1">{item.name}</h4>
                    <div className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <FaTag className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex items-start gap-2">
                      <FaAlignLeft className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      {item.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditing(item)}
                      className="flex-1 bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center">
                      <FaUtensils className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {editing.id ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h4>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditing(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input
                      value={editing.name}
                      onChange={e => setEditing({ ...editing, name: e.target.value })}
                      placeholder="Enter item name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editing.price}
                      onChange={e => setEditing({ ...editing, price: parseFloat(e.target.value || '0') })}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editing.category}
                      onChange={e => setEditing({ ...editing, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option>Appetizer</option>
                      <option>Main-course</option>
                      <option>Dessert</option>
                      <option>Beverage</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vegetarian</label>
                    <div className="flex items-center h-10">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editing.isVegetarian}
                          onChange={e => setEditing({ ...editing, isVegetarian: e.target.checked })}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700">Mark as vegetarian</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editing.description || ''}
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Enter item description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f || !editing) return;
                        const obj = URL.createObjectURL(f);
                        setEditing({ ...editing, image: obj });
                        (editing as any)._pendingFile = f;
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <FaImage className="h-4 w-4" />
                      Or paste an image URL below
                    </div>
                    <input
                      value={editing.image || ''}
                      onChange={e => setEditing({ ...editing, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditing(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <FaSave className="h-4 w-4" />
                    {editing.id ? 'Update Item' : 'Create Item'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenuManager;
