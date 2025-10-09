
import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import './styles/Transaction.css';

const Transaction = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'send', 'split'
  const [theme, setTheme] = useState('light');

  // Split Bill Placeholder Component
  const SplitBillPlaceholder = ({ onBack }) => (
    <div className="split-bill-placeholder">
      <div className="placeholder-content">
        <div className="placeholder-icon">🧾</div>
        <h2>Split Bill</h2>
        <p>Split bills with friends and family. This feature is coming soon!</p>
        <button className="btn-primary" onClick={onBack}>
          Back to Transactions
        </button>
      </div>
    </div>
  );

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
      component: <TransactionForm  colorTheme={theme} />,
      icon: '💸',
      description: 'Transfer money to friends and family'
    },
    split: {
      title: 'Split Bill',
      component: <SplitBillPlaceholder onBack={() => setActiveView('list')} />,
      icon: '🧾',
      description: 'Split expenses with multiple people'
    }
  };

  // Detect system theme preference
 /* useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);*/

  const currentView = views[activeView];

  return (
    <div className="transaction-container" data-theme={theme}>
      {/* Header */}
      <header className="transaction-header">
        {/*
        <div className="header-content">
          <div className="header-title">
            <h1>Payments</h1>
            <p>Manage your transactions and payments</p>
          </div>
          
          <div className="header-actions">
            // Theme Toggle 
            <button 
              className="theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>*/}

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