import React, { useRef, useEffect, useState } from 'react';
import './styles/VoiceVisualizer.css';

const VoiceVisualizer = ({ 
  isRecording, 
  isPaused,
  audioContext,
  barCount = 30 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if AudioContext is supported
    if (!window.AudioContext && !window.webkitAudioContext) {
      setIsSupported(false);
      return;
    }

    const setupAnalyser = async () => {
      try {
        const ctx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

      } catch (error) {
        console.error('Audio analyser setup failed:', error);
        setIsSupported(false);
      }
    };

    setupAnalyser();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioContext]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isSupported) return;

    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (!analyser || !dataArray) return;

    const draw = () => {
      if (!isRecording || isPaused) {
        // Draw idle state
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--border-primary') || '#e2e8f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw paused text if paused
        if (isPaused) {
          ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-tertiary') || '#6c757d';
          ctx.font = '12px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
        }
        
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-primary') || '#007bff';
      const secondaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--error-primary') || '#dc3545';

      for (let i = 0; i < barCount; i++) {
        const barIndex = Math.floor((i / barCount) * dataArray.length);
        const amplitude = dataArray[barIndex] / 255;
        
        // Use different colors based on amplitude
        const color = amplitude > 0.7 ? secondaryColor : primaryColor;
        
        const barHeight = amplitude * canvas.height;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPaused, barCount, isSupported]);

  const connectStream = (stream) => {
    if (!stream || !analyserRef.current) return;
    
    try {
      const audioContext = analyserRef.current.context;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
    } catch (error) {
      console.error('Error connecting stream to analyser:', error);
    }
  };

  if (!isSupported) {
    return (
      <div className="voice-visualizer fallback">
        <div className="fallback-animation">
          <div className="fallback-bar"></div>
          <div className="fallback-bar"></div>
          <div className="fallback-bar"></div>
          <div className="fallback-bar"></div>
          <div className="fallback-bar"></div>
        </div>
        <p className="fallback-text">Audio visualization not supported</p>
      </div>
    );
  }

  return (
    <div className="voice-visualizer">
      <canvas 
        ref={canvasRef}
        width={300}
        height={80}
        className="visualizer-canvas"
      />
      {isPaused && (
        <div className="visualizer-overlay">
          <span>⏸️ Paused</span>
        </div>
      )}
    </div>
  );
};

// Export connectStream for use in parent components
export { VoiceVisualizer };
export const connectStreamToVisualizer = (stream, visualizerRef) => {
  if (visualizerRef.current && visualizerRef.current.connectStream) {
    visualizerRef.current.connectStream(stream);
  }
};

export default VoiceVisualizer;