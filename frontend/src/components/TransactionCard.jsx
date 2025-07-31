import React, { useState } from 'react';
import { Trash2, Calendar } from 'lucide-react';

function TransactionCard({ transaction, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(transaction.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">
            ₹{transaction.amount.toFixed(2)}
          </div>
          {transaction.description && (
            <div className="text-sm text-gray-600 mt-1 truncate">
              {transaction.description}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Calendar className="w-3 h-3" />
            {formatDate(transaction.date)}
          </div>
        </div>
        
        <div className="ml-2">
          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-600 hover:text-gray-700 text-xs px-2 py-1 bg-gray-100 rounded"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;