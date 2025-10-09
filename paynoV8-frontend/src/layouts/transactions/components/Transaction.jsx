import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransferSplit from './TransferSplit';
import './styles/Transaction.css';

const Transaction = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'send', 'split'

  // Views configuration
  const views = {
    list: {
      title: 'Transactions',
      component: <TransactionList />,
      icon: '📋',
      description: 'View your transaction history'
    },
    send: {
      title: 'Send Money',
      component: <TransactionForm />, // No need to pass theme - it will inherit
      icon: '💸',
      description: 'Transfer money to friends and family'
    },
    split: {
      title: 'Split Payment',
      component: <TransferSplit />,
      icon: '🧾',
      description: 'Split bills with group members'
    }
  };

  const currentView = views[activeView];

  return (
    <div className="transaction-container">
      {/* Header - Remove theme toggle since it's controlled globally */}
      <header className="transaction-header">

        {/* Navigation Tabs */}
        <nav className="transaction-nav">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
            >
              <span className="tab-icon">📋</span>
              <span className="tab-label">Transactions</span>
            </button>
            
            <button
              className={`nav-tab ${activeView === 'send' ? 'active' : ''}`}
              onClick={() => setActiveView('send')}
            >
              <span className="tab-icon">💸</span>
              <span className="tab-label">Send Money</span>
            </button>
            
            <button
              className={`nav-tab ${activeView === 'split' ? 'active' : ''}`}
              onClick={() => setActiveView('split')}
            >
              <span className="tab-icon">🧾</span>
              <span className="tab-label">Split Bill</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="transaction-main">
        <div className="view-header">
          <div className="view-title">
            <span className="title-icon">{currentView.icon}</span>
            <h2>{currentView.title}</h2>
          </div>
          <p className="view-description">{currentView.description}</p>
        </div>

        <div className="view-content">
          {currentView.component}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          <span className="mobile-nav-icon">📋</span>
          <span className="mobile-nav-label">Transactions</span>
        </button>
        
        <button
          className={`mobile-nav-item ${activeView === 'send' ? 'active' : ''}`}
          onClick={() => setActiveView('send')}
        >
          <span className="mobile-nav-icon">💸</span>
          <span className="mobile-nav-label">Send</span>
        </button>
        
        <button
          className={`mobile-nav-item ${activeView === 'split' ? 'active' : ''}`}
          onClick={() => setActiveView('split')}
        >
          <span className="mobile-nav-icon">🧾</span>
          <span className="mobile-nav-label">Split</span>
        </button>
      </nav>
    </div>
  );
};

export default Transaction;