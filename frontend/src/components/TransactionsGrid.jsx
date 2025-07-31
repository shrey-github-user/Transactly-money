import React from 'react';
import TransactionCard from './TransactionCard.jsx';

function TransactionsGrid({ transactions, categories, onDeleteTransaction }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No transactions yet</div>
        <div className="text-gray-500 text-sm">
          Click the "+" button to add your first transaction
        </div>
      </div>
    );
  }

  const groupedTransactions = categories.reduce((acc, category) => {
    acc[category] = transactions.filter(t => t.category === category);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map(category => {
        const categoryTransactions = groupedTransactions[category] || [];
        const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

        return (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{category}</h3>
                <div className="text-sm text-gray-500">
                  {categoryTransactions.length} items
                </div>
              </div>
              {totalAmount > 0 && (
                <div className="text-lg font-bold text-blue-600 mt-1">
                  ${totalAmount.toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {categoryTransactions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No transactions in this category
                </div>
              ) : (
                categoryTransactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(transaction => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      onDelete={onDeleteTransaction}
                    />
                  ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionsGrid;