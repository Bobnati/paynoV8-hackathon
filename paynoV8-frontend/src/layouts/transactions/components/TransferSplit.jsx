import React from 'react';
import { useTransferSplit } from './useTransferSplit';
import './TransferSplit.css';

const TransferSplit = () => {
  const {
    // State
    step,
    formData,
    participantInputs,
    users,
    calculatedShares,
    errors,
    isSubmitting,
    transactionStatus,
    pin,
    
    // Actions
    handleInputChange,
    handleAmountChange,
    handleReceiverChange,
    handleSplitTypeChange,
    handleParticipantIdChange,
    addParticipantField,
    removeParticipantField,
    nextStep,
    prevStep,
    handleSubmit,
    handlePinSubmit,
    handlePinChange,
    clearTransactionStatus,
    resetForm,
    
    // Utilities
    getDisplayAmount,
    getUserName
  } = useTransferSplit();

  // Filter out sender from receiver options
  const receiverOptions = users.filter(user => user.id !== '123');

  // Step 1: Split Details
  const renderStep1 = () => (
    <div className="split-step step-details">
      <h2 className="step-title">Create Split Payment</h2>
      
      {/* Total Amount Input */}
      <div className="input-group">
        <label htmlFor="totalAmount" className="input-label">Total Amount (₦)</label>
        <div className="amount-input-container">
          <span className="currency-symbol">₦</span>
          <input
            id="totalAmount"
            type="number"
            className={`amount-input ${errors.totalAmount ? 'input-error' : ''}`}
            placeholder="0.00"
            value={getDisplayAmount()}
            onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        {errors.totalAmount && (
          <div className="error-message">⚠️ {errors.totalAmount}</div>
        )}
      </div>

      {/* Receiver Selection */}
      <div className="input-group">
        <label htmlFor="receiver" className="input-label">Receiver</label>
        <select
          id="receiver"
          className={`text-input ${errors.receiverId ? 'input-error' : ''}`}
          value={formData.receiverId}
          onChange={(e) => handleReceiverChange(e.target.value)}
        >
          <option value="">Select who receives the money</option>
          {receiverOptions.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.phone})
            </option>
          ))}
        </select>
        {errors.receiverId && (
          <div className="error-message">⚠️ {errors.receiverId}</div>
        )}
      </div>

      {/* Purpose Input - Optional */}
      <div className="input-group">
        <label htmlFor="purpose" className="input-label">
          Purpose <span className="optional-text">(Optional)</span>
        </label>
        <input
          id="purpose"
          type="text"
          className={`text-input ${errors.purpose ? 'input-error' : ''}`}
          placeholder="What's this for? (optional)"
          value={formData.purpose}
          onChange={(e) => handleInputChange('purpose', e.target.value)}
          maxLength={100}
        />
        {errors.purpose && (
          <div className="error-message">⚠️ {errors.purpose}</div>
        )}
      </div>

      {/* Split Type Selection */}
      <div className="input-group">
        <label className="input-label">Split Type</label>
        <div className="split-type-options">
          <label className="radio-option">
            <input
              type="radio"
              name="splitType"
              value="EQUAL"
              checked={formData.splitType === 'EQUAL'}
              onChange={(e) => handleSplitTypeChange(e.target.value)}
            />
            <span className="radio-label">
              <strong>Equal Split</strong>
              <small>Divide total equally among contributors</small>
            </span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="splitType"
              value="PERCENTAGE"
              checked={formData.splitType === 'PERCENTAGE'}
              onChange={(e) => handleSplitTypeChange(e.target.value)}
            />
            <span className="radio-label">
              <strong>Percentage Split</strong>
              <small>Assign percentages to each contributor</small>
            </span>
          </label>
        </div>
      </div>

      <button
        className="btn-primary continue-btn"
        onClick={nextStep}
        disabled={!formData.totalAmount || formData.totalAmount < 100 || !formData.receiverId}
      >
        Continue to Contributors
      </button>
    </div>
  );

  // Step 2: Contributor Input
  const renderStep2 = () => (
    <div className="split-step step-participants">
      <h2 className="step-title">Add Contributors</h2>
      <p className="step-description">
        People who will contribute to the payment for {getUserName(formData.receiverId)}
      </p>

      <div className="participants-input-list">
        {participantInputs.map((participant, index) => (
          <div key={index} className="participant-input-group">
            <label className="participant-input-label">
              {index === 0 ? 'You (Contributor)' : `Contributor ${index}`}
            </label>
            <div className="input-with-actions">
              <input
                type="text"
                className={`text-input ${errors[`participant_${index}`] ? 'input-error' : ''} ${
                  index === 0 ? 'sender-input' : ''
                }`}
                placeholder={index === 0 ? "Your account ID" : "Enter account ID"}
                value={participant.id}
                onChange={(e) => handleParticipantIdChange(index, e.target.value)}
                maxLength={20}
                disabled={index === 0}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="remove-participant-btn"
                  onClick={() => removeParticipantField(index)}
                  aria-label="Remove contributor"
                >
                  ×
                </button>
              )}
            </div>
            {errors[`participant_${index}`] && (
              <div className="error-message">⚠️ {errors[`participant_${index}`]}</div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-secondary add-participant-btn"
        onClick={addParticipantField}
      >
        + Add Another Contributor
      </button>

      {errors.participantIds && (
        <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
          ⚠️ {errors.participantIds}
        </div>
      )}

      <div className="selected-count">
        {participantInputs.filter(p => p.id.trim()).length} contributor{participantInputs.filter(p => p.id.trim()).length !== 1 ? 's' : ''} total
        {participantInputs.length > 1 && ` (You + ${participantInputs.length - 1} others)`}
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button
          className="btn-primary"
          onClick={nextStep}
          disabled={participantInputs.filter(p => p.id.trim()).length < 1}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );

  // Step 3: Review & Confirm
  const renderStep3 = () => {
    const contributions = calculatedShares.filter(share => share.type === 'contribution');
    const receiver = calculatedShares.find(share => share.type === 'receiving');

    return (
      <div className="split-step step-review">
        <h2 className="step-title">Review Split Payment</h2>

        <div className="split-summary">
          <div className="summary-item">
            <span className="summary-label">Total Amount</span>
            <span className="summary-value">₦{getDisplayAmount()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Receiver</span>
            <span className="summary-value">{receiver ? getUserName(receiver.participantId) : 'Not set'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Purpose</span>
            <span className="summary-value">{formData.purpose || 'Split Payment'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Split Type</span>
            <span className="summary-value">
              {formData.splitType === 'EQUAL' && 'Equal Split'}
              {formData.splitType === 'PERCENTAGE' && 'Percentage Split'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Contributors</span>
            <span className="summary-value">{contributions.length} people</span>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="amount-breakdown">
          <h3>Amount Breakdown</h3>
          
          {/* Receiver Section */}
          {receiver && (
            <div className="receiver-section">
              <h4 className="breakdown-subtitle">Receiver</h4>
              <div className="breakdown-item receiver-item">
                <span className="participant-name">{getUserName(receiver.participantId)}</span>
                <span className="participant-amount">
                  ₦{(receiver.amount / 100).toFixed(2)} (100%)
                </span>
              </div>
            </div>
          )}

          {/* Contributors Section */}
          <div className="contributors-section">
            <h4 className="breakdown-subtitle">
              Contributors {formData.splitType === 'PERCENTAGE' && '(Percentage)'}
            </h4>
            <div className="breakdown-list">
              {contributions.map((share, index) => (
                <div key={index} className="breakdown-item contributor-item">
                  <span className="participant-name">
                    {share.participantId === '123' ? 'You' : getUserName(share.participantId)}
                  </span>
                  <span className="participant-amount">
                    ₦{(share.amount / 100).toFixed(2)}
                    {formData.splitType === 'PERCENTAGE' && ` (${share.percentage}%)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
            ⚠️ {errors.submit}
          </div>
        )}

        <div className="action-buttons">
         
        <button
        className="btn-primary"
        onClick={() => {
            console.log('Button clicked - Step:', step);
            console.log('Form data ready:', formData);
            console.log('Calculated shares:', calculatedShares);
            handleSubmit();
        }}
        disabled={isSubmitting}
        >
        {isSubmitting ? (
            <>
            <span className="loading-spinner"></span>
            Creating Split...
            </>
        ) : (
            'Create Split Payment'
        )}
        </button>
        </div>
      </div>
    );
  };

  // Step 4: Success
  const renderStep4 = () => {
    const receiver = calculatedShares.find(share => share.type === 'receiving');
    
    return (
      <div className="split-step step-success">
        <div className="success-animation">
          <div className="success-icon">✓</div>
        </div>
        
        <h2 className="step-title">Split Payment Created!</h2>
        <p className="success-message">
          Payment requests have been sent to all contributors.
        </p>

        <div className="success-details">
          <div className="detail-item">
            <span className="detail-label">Total Amount</span>
            <span className="detail-value">₦{getDisplayAmount()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Receiver</span>
            <span className="detail-value">{receiver ? getUserName(receiver.participantId) : 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Purpose</span>
            <span className="detail-value">{formData.purpose || 'Split Payment'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Contributors</span>
            <span className="detail-value">
              {calculatedShares.filter(share => share.type === 'contribution').length} people
            </span>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn-primary" onClick={resetForm}>
            Create Another Split
          </button>
          {/* <button className="btn-secondary">
            View Split Details
          </button> */}
        </div>
      </div>
    );
  };

  // PIN Dialog (same as before)
  const renderPinDialog = () => (
    <div className="pin-dialog-overlay">
      <div className="pin-dialog">
        <h3>Enter Your PIN</h3>
        <p className="pin-description">Please enter your 4-digit PIN to confirm the transaction</p>
        
        <div className="pin-input-container">
          <input
            type="password"
            className="pin-input"
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
            placeholder="****"
            autoFocus
          />
        </div>
        
        {errors.pin && (
          <div className="error-message" style={{ textAlign: 'center', margin: '10px 0' }}>
            ⚠️ {errors.pin}
          </div>
        )}
        
        <div className="pin-dialog-actions">
          <button
            className="btn-secondary"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handlePinSubmit}
            disabled={isSubmitting || pin.length !== 4}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              'Confirm Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Transaction Status Dialog (same as before)
  const renderTransactionStatus = () => {
    if (!transactionStatus || transactionStatus === 'idle') return null;

    const statusConfig = {
      pending: {
        icon: '⏳',
        title: 'Transaction Pending',
        message: 'Waiting for contributors to accept the split payment...',
        className: 'status-pending'
      },
      success: {
        icon: '✅',
        title: 'Transaction Successful',
        message: 'All contributors have accepted the split payment!',
        className: 'status-success'
      },
      failed: {
        icon: '❌',
        title: 'Transaction Failed',
        message: 'Some contributors did not accept the payment in time.',
        className: 'status-failed'
      }
    };

    const config = statusConfig[transactionStatus];

    return (
      <div className={`transaction-status-dialog ${config.className}`}>
        <div className="status-icon">{config.icon}</div>
        <div className="status-content">
          <h4 className="status-title">{config.title}</h4>
          <p className="status-message">{config.message}</p>
        </div>
        {(transactionStatus === 'success' || transactionStatus === 'failed') && (
          <button
            className="clear-status-btn"
            onClick={clearTransactionStatus}
            aria-label="Clear status"
          >
            ×
          </button>
        )}
      </div>
    );
  };

  // Progress Indicator
  const progressSteps = ['Details', 'Contributors', 'Review', 'Complete'];

  return (
    <div className="transfer-split-container">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        {progressSteps.map((stepLabel, index) => (
          <div key={stepLabel} className={`progress-step ${step >= index + 1 ? 'active' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <span className="step-label">{stepLabel}</span>
          </div>
        ))}
      </div>

      {/* Transaction Status Display */}
      <div className="transaction-status-area">
        {renderTransactionStatus()}
      </div>

      {/* Form Steps */}
      <div className="split-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* PIN Dialog */}
      {step === 3.5 && renderPinDialog()}
    </div>
  );
};

export default TransferSplit;