import React, { useState, useEffect } from 'react';
import TransactionItem from './TransactionItem';
import TransactionFilters from './TransactionFilters';
import './styles/TransactionList.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    timeRange: 'week',
    category: 'all',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTransactions = [
          {
            id: 'txn_001',
            type: 'sent',
            amount: 150.00,
            recipient: 'John Doe',
            description: 'Dinner payment',
            category: 'food',
            status: 'completed',
            date: new Date('2024-01-15T14:30:00'),
            hasVoiceNote: true,
            voiceNoteDuration: 25
          },
          {
            id: 'txn_002',
            type: 'received',
            amount: 75.50,
            sender: 'Jane Smith',
            description: 'Coffee shop bill split',
            category: 'food',
            status: 'completed',
            date: new Date('2024-01-14T10:15:00'),
            hasVoiceNote: false
          },
          {
            id: 'txn_003',
            type: 'sent',
            amount: 200.00,
            recipient: 'Mike Johnson',
            description: 'Monthly rent',
            category: 'bills',
            status: 'completed',
            date: new Date('2024-01-10T09:00:00'),
            hasVoiceNote: true,
            voiceNoteDuration: 18
          },
          {
            id: 'txn_004',
            type: 'sent',
            amount: 45.00,
            recipient: 'Netflix',
            description: 'Subscription renewal',
            category: 'entertainment',
            status: 'pending',
            date: new Date('2024-01-15T16:45:00'),
            hasVoiceNote: false
          },
          {
            id: 'txn_005',
            type: 'received',
            amount: 120.00,
            sender: 'Alex Brown',
            description: 'Concert tickets refund',
            category: 'entertainment',
            status: 'completed',
            date: new Date('2024-01-13T20:30:00'),
            hasVoiceNote: false
          }
        ];
        
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on filters and search
  useEffect(() => {
    let filtered = transactions;

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(txn => txn.type === filters.type);
    }

    // Filter by time range
    const now = new Date();
    switch (filters.timeRange) {
      case 'today':
        filtered = filtered.filter(txn => {
          const txnDate = new Date(txn.date);
          return txnDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(txn => new Date(txn.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter(txn => new Date(txn.date) >= monthAgo);
        break;
      default:
        break;
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(txn => txn.category === filters.category);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(txn => txn.status === filters.status);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(txn =>
        txn.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const getTotalAmount = () => {
    return filteredTransactions.reduce((total, txn) => {
      const amount = txn.type === 'sent' ? -txn.amount : txn.amount;
      return total + amount;
    }, 0);
  };

  if (loading) {
    return (
      <div className="transaction-list loading">
        <div className="loading-spinner large"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {/* Header Section */}
      <div className="list-header">
        <div className="header-content">
          <h1 className="list-title">Transactions</h1>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Total Balance</span>
              <span className="stat-value">${getTotalAmount().toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Transactions</span>
              <span className="stat-value">{filteredTransactions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        transactionCount={filteredTransactions.length}
      />

      {/* Transactions List */}
      <div className="transactions-container">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <h3>No transactions found</h3>
            <p>
              {searchTerm || filters.type !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Get started by sending or receiving money'
              }
            </p>
            {!searchTerm && filters.type === 'all' && filters.category === 'all' && (
              <button className="btn-primary">Send Money</button>
            )}
          </div>
        ) : (
          <>
            <div className="transactions-list">
              {filteredTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onSelect={handleTransactionSelect}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            {filteredTransactions.length >= 5 && (
              <div className="load-more-section">
                <button className="btn-secondary load-more-btn">
                  Load More Transactions
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TransactionDetails
              transaction={selectedTransaction}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// TransactionDetails Component (Simplified for modal)
const TransactionDetails = ({ transaction, onClose }) => {
  return (
    <div className="transaction-details-modal">
      <div className="modal-header">
        <h2>Transaction Details</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="transaction-overview">
        <div className="amount-display">
          <span className={`amount ${transaction.type}`}>
            {transaction.type === 'sent' ? '-' : '+'}${transaction.amount.toFixed(2)}
          </span>
          <span className="transaction-type">
            {transaction.type === 'sent' ? 'Money Sent' : 'Money Received'}
          </span>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <span className="label">{transaction.type === 'sent' ? 'To' : 'From'}</span>
          <span className="value">{transaction.recipient || transaction.sender}</span>
        </div>
        
        <div className="detail-item">
          <span className="label">Description</span>
          <span className="value">{transaction.description}</span>
        </div>
        
        <div className="detail-item">
          <span className="label">Category</span>
          <span className="value category-tag">{transaction.category}</span>
        </div>
        
        <div className="detail-item">
          <span className="label">Date & Time</span>
          <span className="value">{transaction.date.toLocaleString()}</span>
        </div>
        
        <div className="detail-item">
          <span className="label">Transaction ID</span>
          <span className="value transaction-id">{transaction.id}</span>
        </div>
        
        <div className="detail-item">
          <span className="label">Status</span>
          <span className={`value status ${transaction.status}`}>
            {transaction.status}
          </span>
        </div>
      </div>

      {/* Voice Note Section */}
      {transaction.hasVoiceNote && (
        <div className="voice-note-section">
          <h3>Voice Message</h3>
          <div className="voice-player">
            <button className="play-btn">▶</button>
            <div className="voice-waveform"></div>
            <span className="voice-duration">{transaction.voiceNoteDuration}s</span>
          </div>
        </div>
      )}

      <div className="modal-actions">
        <button className="btn-secondary">Download Receipt</button>
        <button className="btn-primary">Report Issue</button>
      </div>
    </div>
  );
};

export default TransactionList;