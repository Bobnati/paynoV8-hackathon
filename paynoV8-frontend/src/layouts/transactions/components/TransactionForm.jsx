import React, { useState, useEffect } from 'react';
import { useTransactionForm } from './useTransactionForm';
import { useAudioCompression } from '../hooks/useAudioCompression';
import voiceService from '../services/voiceService';
import VoiceRecorder from './voice/VoiceRecorder';
import VoicePlayer from './voice/VoicePlayer';
import './styles/TransactionForm.css';

const TransactionForm = (props) => {
  const [theme, setTheme] = useState(props.colorTheme);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [voiceProcessingStage, setVoiceProcessingStage] = useState('');
  const [voiceUploadProgress, setVoiceUploadProgress] = useState(0);
  
  const {
    step,
    formData,
    isSubmitting,
    errors,
    handleInputChange,
    handleVoiceNoteAttach,
    handleCompressedVoiceNote,
    handleVoiceNoteRemove,
    formatAmount,
    nextStep,
    prevStep,
    submitTransaction,
    resetForm
  } = useTransactionForm();

  const { 
    smartCompress, 
    getAudioInfo, 
    isCompressing,
    compressionProgress 
  } = useAudioCompression();

  // Update theme when prop changes
  useEffect(() => {
    if (props.colorTheme) {
      setTheme(props.colorTheme);
    }
  }, [props.colorTheme]);

  // Handle voice recording completion
  const handleVoiceRecordingComplete = async (audioBlob) => {
    handleVoiceNoteAttach(audioBlob);
    setShowVoiceRecorder(false);
    
    // Process the voice note (compress + upload)
    await processVoiceNote(audioBlob);
  };

  // Process voice note: compress and upload
  const processVoiceNote = async (audioBlob) => {
    setIsProcessingVoice(true);
    setVoiceProcessingStage('Compressing audio...');
    setVoiceUploadProgress(0);

    try {
      // Get original audio info
      const originalInfo = await getAudioInfo(audioBlob);
      console.log('Original audio:', originalInfo);

      // Step 1: Compress the audio
      setVoiceProcessingStage('Compressing audio...');
      const compressionResult = await smartCompress(audioBlob, 100); // Target 100KB max
      
      if (compressionResult.compressed) {
        console.log('Audio compressed successfully');
        const compressedInfo = await getAudioInfo(compressionResult.blob);
        console.log('Compressed audio:', compressedInfo);
      }

      // Step 2: Upload to cloud (in a real app, this would happen here)
      // For now, we'll simulate the upload and store the compressed blob
      setVoiceProcessingStage('Preparing upload...');
      setVoiceUploadProgress(50);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store compressed blob in form state
      handleCompressedVoiceNote(
        compressionResult.blob, 
        `mock-url-${Date.now()}` // Mock URL for demo
      );

      setVoiceUploadProgress(100);
      setVoiceProcessingStage('Voice note ready!');

      // Wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Voice processing failed:', error);
      // If processing fails, still keep the original voice note
      handleCompressedVoiceNote(audioBlob, null);
    } finally {
      setIsProcessingVoice(false);
      setVoiceProcessingStage('');
      setVoiceUploadProgress(0);
    }
  };

  // Handle voice recording cancellation
  const handleVoiceRecordingCancel = () => {
    setShowVoiceRecorder(false);
  };

  // Remove attached voice note
  const handleRemoveVoiceNote = () => {
    handleVoiceNoteRemove();
  };

  // Start voice recording
  const handleStartVoiceRecording = () => {
    setShowVoiceRecorder(true);
  };

  // Handle form submission with voice upload
  const handleSubmit = async () => {
    // If we have a voice note, upload it first
    if (formData.voiceNote && !formData.voiceNoteUrl) {
      setIsProcessingVoice(true);
      setVoiceProcessingStage('Uploading voice note...');
      
      try {
        // Generate a temporary transaction ID for the upload
        const tempTransactionId = 'TEMP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Upload the compressed voice note
        const uploadResult = await voiceService.mockUploadVoiceNote(
          formData.compressedVoiceNote || formData.voiceNote,
          tempTransactionId
        );

        // Update form data with the cloud URL
        handleCompressedVoiceNote(
          uploadResult.compressedBlob,
          uploadResult.voiceNoteUrl
        );

      } catch (error) {
        console.error('Voice upload failed:', error);
        // Continue with transaction even if voice upload fails
      } finally {
        setIsProcessingVoice(false);
        setVoiceProcessingStage('');
      }
    }

    // Submit the transaction
    await submitTransaction();
  };

  // Format amount for display
  const formatAmountDisplay = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  // Voice processing status display
  const renderVoiceProcessingStatus = () => {
    if (!isProcessingVoice) return null;

    return (
      <div className="voice-processing-status">
        <div className="processing-indicator">
          <div className="processing-spinner"></div>
          <span>{voiceProcessingStage}</span>
        </div>
        {voiceUploadProgress > 0 && (
          <div className="upload-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${voiceUploadProgress}%` }}
            ></div>
            <span>{voiceUploadProgress}%</span>
          </div>
        )}
      </div>
    );
  };

  // Step 1: Transaction Details
  const renderStep1 = () => (
    <div className="form-step step-details">
      <h2 className="step-title">Send Money</h2>
      
      {/* Amount Input */}
      <div className="input-group">
        <label htmlFor="amount" className="input-label">Amount</label>
        <div className="amount-input-container">
          <span className="currency-symbol">N</span>
          <input
            id="amount"
            type="text"
            className={`amount-input ${errors.amount ? 'input-error' : ''}`}
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', formatAmount(e.target.value))}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
        </div>
        {errors.amount && (
          <div id="amount-error" className="error-message">
            ⚠️ {errors.amount}
          </div>
        )}
      </div>

      {/* Recipient Input */}
      <div className="input-group">
        <label htmlFor="recipient" className="input-label">To</label>
        <input
          id="recipient"
          type="number"
          className={`text-input ${errors.recipient ? 'input-error' : ''}`}
          placeholder="receiver's Account ID"
          value={formData.recipient}
          onChange={(e) => handleInputChange('recipient', e.target.value)}
          aria-describedby={errors.recipient ? "recipient-error" : undefined}
        />
        {errors.recipient && (
          <div id="recipient-error" className="error-message">
            ⚠️ {errors.recipient}
          </div>
        )}
      </div>

      {/* Description Input */}
      <div className="input-group">
        <label htmlFor="description" className="input-label">Description (Optional)</label>
        <input
          id="description"
          type="text"
          className="text-input"
          placeholder="What's this for?"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      {/* Category Selection */}
      <div className="input-group">
        <label htmlFor="category" className="input-label">Category</label>
        <select
          id="category"
          className="select-input"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="general">General</option>
          <option value="food">Food & Dining</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills & Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="transport">Transportation</option>
          <option value="health">Health & Wellness</option>
          <option value="travel">Travel</option>
          <option value="education">Education</option>
          <option value="gifts">Gifts & Donations</option>
        </select>
      </div>

      {/* Voice Note Section */}
      <div className="voice-note-section">
        {!showVoiceRecorder && !formData.voiceNote && (
          <button 
            type="button" 
            className="voice-note-btn"
            onClick={handleStartVoiceRecording}
            disabled={isProcessingVoice}
          >
            <span className="voice-icon">🎤</span>
            {isProcessingVoice ? 'Processing Voice...' : 'Add Voice Note (Optional)'}
          </button>
        )}

        {/* Voice Recorder */}
        {showVoiceRecorder && (
          <div className="voice-recorder-container">
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecordingComplete}
              onCancel={handleVoiceRecordingCancel}
              maxDuration={30}
              compact={true}
            />
          </div>
        )}

        {/* Voice Processing Status */}
        {isProcessingVoice && renderVoiceProcessingStatus()}

        {/* Voice Note Preview */}
        {formData.voiceNote && !showVoiceRecorder && !isProcessingVoice && (
          <div className="voice-note-preview">
            <div className="preview-header">
              <span className="preview-icon">🔊</span>
              <span className="preview-text">Preview Your Recording</span>
              <span className="preview-badge">Ready to attach</span>
            </div>
            
            <div className="voice-player-container">
              <VoicePlayer 
                audioBlob={formData.voiceNote} 
                showControls={true}
                compact={true}
                autoPlay={false}
              />
            </div>

            <div className="preview-instruction">
              <p>🎧 <strong>Listen to your recording</strong> - it has been compressed and is ready to send.</p>
            </div>

            <div className="preview-actions">
              <button 
                className="btn-primary confirm-voice-btn"
                onClick={nextStep}
              >
                ✅ Sounds Good - Continue to Review
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  handleVoiceNoteRemove();
                  handleStartVoiceRecording();
                }}
              >
                🔄 Re-record Message
              </button>
            </div>
          </div>
        )}

        <p className="voice-note-hint">
          {!formData.voiceNote 
            ? 'Record a 30-second message (max 30 seconds)' 
            : isProcessingVoice 
            ? 'Processing your voice note...' 
            : 'Voice note ready to attach'
          }
        </p>
      </div>

      {errors.submit && (
        <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
          ⚠️ {errors.submit}
        </div>
      )}

      {/* Regular Continue button (only shown when no voice note is being previewed) */}
      {!formData.voiceNote && (
        <button
          className="btn-primary continue-btn"
          onClick={nextStep}
          disabled={!formData.amount || !formData.recipient || isSubmitting || isProcessingVoice}
        >
          {isProcessingVoice ? 'Processing Voice...' : 'Continue'}
        </button>
      )}
    </div>
  );

  // Step 2: Review Transaction
  const renderStep2 = () => (
    <div className="form-step step-review">
      <h2 className="step-title">Review Transaction</h2>
      
      <div className="transaction-summary">
        <div className="summary-item">
          <span className="summary-label">Amount</span>
          <span className="summary-value amount">N{formatAmountDisplay(formData.amount)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">To</span>
          <span className="summary-value">{formData.recipient}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Description</span>
          <span className="summary-value">{formData.description || "No description"}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Category</span>
          <span className="category-tag">{formData.category}</span>
        </div>
        
        {/* Voice Note in Summary */}
        {formData.voiceNote && (
          <div className="summary-item voice-summary">
            <span className="summary-label">Voice Note</span>
            <span className="summary-value voice-attached">
              <span className="voice-indicator">🎤</span>
              Attached {formData.compressedVoiceNote && '(Compressed)'}
            </span>
          </div>
        )}
        
        <div className="summary-item fee">
          <span className="summary-label">Fee</span>
          <span className="summary-value">N0.00</span>
        </div>
        <div className="summary-item total">
          <span className="summary-label">Total</span>
          <span className="summary-value">N{formatAmountDisplay(formData.amount)}</span>
        </div>
      </div>

      {errors.submit && (
        <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
          ⚠️ {errors.submit}
        </div>
      )}

      <div className="action-buttons">
        <button
          className="btn-secondary"
          onClick={prevStep}
          disabled={isSubmitting || isProcessingVoice}
        >
          Back
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting || isProcessingVoice}
        >
          {isProcessingVoice ? (
            <>
              <span className="loading-spinner"></span>
              Uploading Voice...
            </>
          ) : isSubmitting ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            'Confirm & Send'
          )}
        </button>
      </div>
    </div>
  );

  // Step 3: Success
  const renderStep3 = () => (
    <div className="form-step step-success">
      <div className="success-animation">
        <div className="success-icon">✓</div>
      </div>
      
      <h2 className="step-title">Payment Sent Successfully!</h2>
      <p className="success-message">Your money has been transferred securely.</p>
      
      <div className="transaction-receipt">
        <div className="receipt-item">
          <span className="receipt-label">Amount</span>
          <span className="receipt-value">N{formatAmountDisplay(formData.amount)}</span>
        </div>
        <div className="receipt-item">
          <span className="receipt-label">To</span>
          <span className="receipt-value">{formData.recipient}</span>
        </div>
        <div className="receipt-item">
          <span className="receipt-label">Description</span>
          <span className="receipt-value">{formData.description || "No description"}</span>
        </div>
        
        {/* Voice Note in Receipt */}
        {formData.voiceNote && (
          <div className="receipt-item voice-receipt">
            <span className="receipt-label">Voice Note</span>
            <span className="receipt-value">
              <VoicePlayer 
                audioBlob={formData.voiceNote} 
                showControls={true}
                compact={true}
              />
              {formData.voiceNoteUrl && (
                <div className="voice-note-url">
                  <small>Stored at: {formData.voiceNoteUrl}</small>
                </div>
              )}
            </span>
          </div>
        )}
        
        <div className="receipt-item">
          <span className="receipt-label">Transaction ID</span>
          <span className="receipt-value transaction-id">{formData.transactionId}</span>
        </div>
        <div className="receipt-item">
          <span className="receipt-label">Date & Time</span>
          <span className="receipt-value">{new Date().toLocaleString()}</span>
        </div>
        <div className="receipt-item">
          <span className="receipt-label">Status</span>
          <span className="status-badge completed">Completed</span>
        </div>
      </div>

      <div className="success-actions">
        <button className="btn-primary" onClick={() => {
          resetForm();
          setShowVoiceRecorder(false);
          setIsProcessingVoice(false);
          setVoiceProcessingStage('');
          setVoiceUploadProgress(0);
        }}>
          Send Another Payment
        </button>
        <button className="btn-secondary">
          View Receipt
        </button>
      </div>
    </div>
  );

  return (
    <div className="transaction-form-container" data-theme={theme}>
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-label">Details</span>
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Review</span>
        </div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Complete</span>
        </div>
      </div>

      {/* Form Steps */}
      <div className="form-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default TransactionForm;