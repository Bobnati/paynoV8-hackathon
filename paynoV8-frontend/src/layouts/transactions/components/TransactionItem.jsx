import React from 'react';
import './styles/TransactionItem.css'; // Import dedicated CSS file

const TransactionItem = ({ transaction, onSelect, compact = false }) => {
  const formatDate = (date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffTime = Math.abs(now - transactionDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return transactionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return transactionDate.toLocaleDateString();
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍽️',
      shopping: '🛍️',
      bills: '📊',
      entertainment: '🎬',
      transport: '🚗',
      health: '🏥',
      travel: '✈️',
      education: '📚',
      gifts: '🎁',
      general: '💰'
    };
    return icons[category] || icons.general;
  };

  const handleClick = () => {
    onSelect(transaction);
  };

  return (
    <div 
      className={`transaction-item ${compact ? 'compact' : ''}`} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Category Icon */}
      <div className="transaction-icon">
        <span className="category-icon">{getCategoryIcon(transaction.category)}</span>
      </div>

      {/* Main Content */}
      <div className="transaction-content">
        <div className="transaction-main">
          <div className="transaction-info">
            <span className="transaction-party">
              {transaction.type === 'sent' ? transaction.recipient : transaction.sender}
            </span>
            <span className="transaction-description">
              {transaction.description}
            </span>
          </div>
          <div className="transaction-amount">
            <span className={`amount ${transaction.type}`}>
              {transaction.type === 'sent' ? '-' : '+'}${transaction.amount.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="transaction-meta">
          <span className="transaction-time">
            {formatDate(transaction.date)}
          </span>
          <div className="transaction-tags">
            <span className={`status-tag ${transaction.status}`}>
              {transaction.status}
            </span>
            <span className="category-tag">
              {transaction.category}
            </span>
            {transaction.hasVoiceNote && (
              <span className="voice-indicator" title="Voice message">
                🎤
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Arrow */}
      <div className="transaction-arrow">
        <span>›</span>
      </div>
    </div>
  );
};

export default TransactionItem;