import React, { useState, useRef, useEffect } from 'react';
import './styles/VoicePlayer.css';

const VoicePlayer = ({ 
  audioBlob, 
  audioUrl, 
  duration,
  showControls = true,
  compact = false,
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  // Create object URL from blob if provided
  const audioSrc = audioUrl || (audioBlob ? URL.createObjectURL(audioBlob) : '');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnd = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Auto-play if requested
    if (autoPlay && audioSrc) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      
      // Clean up object URL
      if (audioSrc && !audioUrl) {
        URL.revokeObjectURL(audioSrc);
        console.log('Object URL revoked:', audioSrc);
      }
    };
  }, [audioSrc, autoPlay, audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = audioRef.current ? (currentTime / audioRef.current.duration) * 100 : 0;

  if (!audioSrc) {
    return (
      <div className="voice-player no-audio">
        <div className="no-audio-message">
          <span>🔇</span>
          <p>No audio available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`voice-player ${compact ? 'compact' : ''}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      {/* Main Controls */}
      <div className="player-controls">
        <button 
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <div className="progress-section">
          <div 
            className="progress-bar"
            onClick={handleSeek}
            title="Click to seek"
          >
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="progress-handle"
              style={{ left: `${progress}%` }}
            />
          </div>
          
          <div className="time-display">
            <span className="current-time">
              {formatTime(currentTime)}
            </span>
            <span className="duration">
              {formatTime(audioRef.current?.duration || duration)}
            </span>
          </div>
        </div>

        {showControls && (
          <button 
            className="playback-rate-btn"
            onClick={handlePlaybackRate}
            title={`Playback speed: ${playbackRate}x`}
          >
            {playbackRate}x
          </button>
        )}
      </div>

      {/* Additional Controls */}
 
    </div>
  );
};

export default VoicePlayer;