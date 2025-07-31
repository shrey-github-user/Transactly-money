import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import TransactionModal from './components/TransactionModal.jsx';
import TransactionsGrid from './components/TransactionsGrid.jsx';
import { api } from './utils/api.js';

function App() {
  const [currentView, setCurrentView] = useState('expense');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        api.getTransactions(),
        api.getCategories()
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await api.createTransaction(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleAddCategory = async (type, name) => {
    try {
      const updatedCategories = await api.createCategory(type, name);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(t => t.type === currentView);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddClick={() => setShowModal(true)}
        transactions={filteredTransactions}
      />
      
      <main className="container mx-auto px-4 py-8">
        <TransactionsGrid
          transactions={filteredTransactions}
          categories={categories[currentView]}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>

      {showModal && (
        <TransactionModal
          type={currentView}
          categories={categories[currentView]}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTransaction}
          onAddCategory={handleAddCategory}
        />
      )}
    </div>
  );
}

export default App;