import React from 'react';
import { useAudioRecording } from '../../hooks/useAudioRecording';
import VoiceVisualizer from './VoiceVisualizer';
import VoicePlayer from './VoicePlayer';
import './styles/VoiceRecorder.css';

const VoiceRecorder = ({ 
  onRecordingComplete, 
  onCancel,
  maxDuration = 30,
  compact = false 
}) => {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    togglePause,
    cancelRecording,
    resetRecording,
    formatTime,
  } = useAudioRecording(maxDuration);

  // Handle recording completion
  React.useEffect(() => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob);
    }
  }, [audioBlob, onRecordingComplete]);

  // Handle new recording (reset previous)
  const handleStartRecording = async () => {
    resetRecording();
    await startRecording();
  };

  const handleReRecord = () => {
    resetRecording();
    handleStartRecording();
  };

  if (error) {
    return (
      <div className="voice-recorder error">
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
        <button className="btn-secondary" onClick={resetRecording}>
          Try Again
        </button>
      </div>
    );
  }

  // Recording in progress
  if (isRecording) {
    return (
      <div className={`voice-recorder recording ${compact ? 'compact' : ''}`}>
        <div className="recording-header">
          <div className="recording-indicator">
            <span className="pulse-dot"></span>
            Recording... {formatTime(recordingTime)}
          </div>
          <div className="time-remaining">
            {formatTime(maxDuration - recordingTime)} remaining
          </div>
        </div>

        <VoiceVisualizer isRecording={isRecording} isPaused={isPaused} />

        <div className="recording-controls">
          <button 
            className="btn-control stop"
            onClick={stopRecording}
            title="Stop recording"
          >
            ⏹️
          </button>
          
          <button 
            className={`btn-control pause ${isPaused ? 'paused' : ''}`}
            onClick={togglePause}
            title={isPaused ? 'Resume recording' : 'Pause recording'}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
          
          <button 
            className="btn-control cancel"
            onClick={cancelRecording}
            title="Cancel recording"
          >
            ❌
          </button>
        </div>
      </div>
    );
  }

  // Recording complete - show preview
  if (audioBlob) {
    return (
      <div className={`voice-recorder preview ${compact ? 'compact' : ''}`}>
        <div className="preview-header">
          <span className="success-icon">✅</span>
          <span>Voice recorded ({formatTime(recordingTime)})</span>
        </div>

        <VoicePlayer audioBlob={audioBlob} showControls />

        <div className="preview-controls">
          <button 
            className="btn-primary"
            onClick={() => onRecordingComplete?.(audioBlob)}
          >
            Attach Voice
          </button>
          <button 
            className="btn-secondary"
            onClick={handleReRecord}
          >
            Re-record
          </button>
          {onCancel && (
            <button 
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // Initial state - ready to record
  return (
    <div className={`voice-recorder idle ${compact ? 'compact' : ''}`}>
      <div className="idle-content">
        <div className="voice-icon">🎤</div>
        <div className="idle-text">
          <h4>Add Voice Note</h4>
          <p>Record a {maxDuration}-second message</p>
        </div>
      </div>
      
      <div className="idle-controls">
        <button 
          className="btn-primary start-recording"
          onClick={handleStartRecording}
        >
          Start Recording
        </button>
        {onCancel && (
          <button 
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;