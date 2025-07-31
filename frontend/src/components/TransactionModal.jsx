import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

function TransactionModal({ type, categories, onClose, onSubmit, onAddCategory }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type,
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(type, newCategoryName.trim());
      setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`input-field flex-1 ${errors.category ? 'border-red-300' : ''}`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="btn-secondary p-2"
                title="Add new category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {showNewCategory && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Category Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter category name"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="btn-primary px-3"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="btn-secondary px-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={`input-field ${errors.amount ? 'border-red-300' : ''}`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`input-field ${errors.date ? 'border-red-300' : ''}`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="input-field resize-none"
              rows="3"
              placeholder="Add a note about this transaction..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;