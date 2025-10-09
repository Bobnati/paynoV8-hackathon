import React, { useState } from 'react';
import './styles/TransactionFilters.css';

const TransactionFilters = ({ filters, onFilterChange, onSearch, searchTerm, transactionCount }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleTypeChange = (type) => {
    onFilterChange({ ...filters, type });
  };

  const handleTimeRangeChange = (timeRange) => {
    onFilterChange({ ...filters, timeRange });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const clearAllFilters = () => {
    onFilterChange({
      type: 'all',
      timeRange: 'week',
      category: 'all',
      status: 'all'
    });
    onSearch('');
  };

  const hasActiveFilters = () => {
    return filters.type !== 'all' ||
      filters.category !== 'all' ||
      filters.status !== 'all' ||
      searchTerm;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (searchTerm) count++;
    return count;
  };

  return (
    <div className="transaction-filters">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => onSearch('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-toggle-section">
          <button
            className={`filter-toggle-btn ${hasActiveFilters() ? 'has-filters' : ''}`}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <span className="filter-icon">⚙️</span>
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="filter-count">{getActiveFilterCount()}</span>
            )}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">
          {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} found
        </span>
        {hasActiveFilters() && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Clear all
          </button>
        )}
      </div>

      {/* Expanded Filters Panel */}
      {isFiltersOpen && (
        <div className="filters-panel">
          {/* Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Transaction Type</label>
            <div className="filter-options">
              <button
                className={`filter-option ${filters.type === 'all' ? 'active' : ''}`}
                onClick={() => handleTypeChange('all')}
              >
                All
              </button>
              <button
                className={`filter-option ${filters.type === 'sent' ? 'active' : ''}`}
                onClick={() => handleTypeChange('sent')}
              >
                Money Sent
              </button>
              <button
                className={`filter-option ${filters.type === 'received' ? 'active' : ''}`}
                onClick={() => handleTypeChange('received')}
              >
                Money Received
              </button>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Time Period</label>
            <div className="filter-options">
              <button
                className={`filter-option ${filters.timeRange === 'today' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('today')}
              >
                Today
              </button>
              <button
                className={`filter-option ${filters.timeRange === 'week' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('week')}
              >
                This Week
              </button>
              <button
                className={`filter-option ${filters.timeRange === 'month' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('month')}
              >
                This Month
              </button>
              <button
                className={`filter-option ${filters.timeRange === 'all' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('all')}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              <button
                className={`filter-option ${filters.category === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Categories
              </button>
              <button
                className={`filter-option ${filters.category === 'food' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('food')}
              >
                Food & Dining
              </button>
              <button
                className={`filter-option ${filters.category === 'shopping' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('shopping')}
              >
                Shopping
              </button>
              <button
                className={`filter-option ${filters.category === 'bills' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('bills')}
              >
                Bills
              </button>
              <button
                className={`filter-option ${filters.category === 'entertainment' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('entertainment')}
              >
                Entertainment
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <div className="filter-options">
              <button
                className={`filter-option ${filters.status === 'all' ? 'active' : ''}`}
                onClick={() => handleStatusChange('all')}
              >
                All Status
              </button>
              <button
                className={`filter-option ${filters.status === 'completed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </button>
              <button
                className={`filter-option ${filters.status === 'pending' ? 'active' : ''}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-option ${filters.status === 'failed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('failed')}
              >
                Failed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Filter Chips (Visible when filters are closed but active) */}
      {!isFiltersOpen && hasActiveFilters() && (
        <div className="quick-filter-chips">
          {filters.type !== 'all' && (
            <span className="filter-chip">
              {filters.type === 'sent' ? 'Money Sent' : 'Money Received'}
              <button onClick={() => handleTypeChange('all')}>✕</button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="filter-chip">
              {filters.category}
              <button onClick={() => handleCategoryChange('all')}>✕</button>
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="filter-chip">
              {filters.status}
              <button onClick={() => handleStatusChange('all')}>✕</button>
            </span>
          )}
          {searchTerm && (
            <span className="filter-chip">
              {`Search:  '${searchTerm}'`};
              <button onClick={() => onSearch('')}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;