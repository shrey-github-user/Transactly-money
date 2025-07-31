import React from 'react';
import { Plus, Download } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch.jsx';
import { exportToPDF } from '../utils/pdfExport.js';

function Header({ currentView, onViewChange, onAddClick, transactions }) {
  const handleExportPDF = () => {
    exportToPDF(transactions, currentView);
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Transactly Money
            </h1>
            <ToggleSwitch
              value={currentView}
              onChange={onViewChange}
              options={[
                { value: 'expense', label: 'Expenses', color: 'red' },
                { value: 'income', label: 'Income', color: 'green' }
              ]}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Total {currentView === 'income' ? 'Income' : 'Expenses'}
              </div>
              <div className={`text-xl font-bold ${
                currentView === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="btn-secondary flex items-center gap-2"
                disabled={transactions.length === 0}
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              
              <button
                onClick={onAddClick}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add {currentView === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;