import { useState, useCallback } from 'react';

export const useAudioCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  // Basic audio compression using Web Audio API
  const compressAudio = useCallback(async (audioBlob, options = {}) => {
    const {
      targetSampleRate = 16000, // Reduce sample rate for voice
      targetChannels = 1,       // Mono for voice
      bitDepth = 16            // 16-bit for smaller size
    } = options;

    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      setCompressionProgress(20);

      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      setCompressionProgress(40);

      // Create offline context for processing with lower sample rate
      const offlineContext = new OfflineAudioContext(
        targetChannels,
        audioBuffer.duration * targetSampleRate,
        targetSampleRate
      );

      // Create source buffer
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      // Add compression and filtering for voice optimization
      const compressor = offlineContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      // Low-pass filter to remove high frequencies (not needed for voice)
      const filter = offlineContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4000; // Voice typically under 4kHz

      // Connect nodes: source -> compressor -> filter -> destination
      source.connect(compressor);
      compressor.connect(filter);
      filter.connect(offlineContext.destination);

      setCompressionProgress(60);

      // Start rendering
      source.start(0);
      const renderedBuffer = await offlineContext.startRendering();
      
      setCompressionProgress(80);

      // Convert to WAV format with reduced quality
      const wavBlob = await audioBufferToWav(renderedBuffer, bitDepth);
      
      setCompressionProgress(100);

      return wavBlob;
    } catch (error) {
      console.error('Audio compression failed:', error);
      // Fallback: return original blob
      return audioBlob;
    } finally {
      setIsCompressing(false);
    }
  }, []);

  // Alias functions for compatibility with voiceService
  const compressToMP3 = useCallback(async (audioBlob, options = {}) => {
    // Since we don't have MP3 encoding, we'll use WAV with aggressive settings
    return compressAudio(audioBlob, {
      targetSampleRate: 8000,
      targetChannels: 1,
      bitDepth: 8,
      ...options
    });
  }, [compressAudio]);

  const compressToOpus = useCallback(async (audioBlob, options = {}) => {
    // Since we don't have Opus encoding, we'll use WAV with good voice settings
    return compressAudio(audioBlob, {
      targetSampleRate: 16000,
      targetChannels: 1,
      bitDepth: 16,
      ...options
    });
  }, [compressAudio]);

  // Smart compression with format selection
  const smartCompress = useCallback(async (audioBlob, targetSizeKB = 100) => {
    const info = await getAudioInfo(audioBlob);
    
    // If already small enough, return as is
    if (info.sizeKB <= targetSizeKB) {
      return { blob: audioBlob, format: 'original', compressed: false };
    }

    // Try aggressive compression for voice
    try {
      const compressedBlob = await compressAudio(audioBlob, {
        targetSampleRate: 16000,
        targetChannels: 1,
        bitDepth: 16
      });

      const compressedInfo = await getAudioInfo(compressedBlob);
      
      if (compressedInfo.sizeKB <= targetSizeKB) {
        return { blob: compressedBlob, format: 'wav', compressed: true };
      }

      // If still too large, try even more aggressive settings
      const moreCompressedBlob = await compressAudio(audioBlob, {
        targetSampleRate: 8000,
        targetChannels: 1,
        bitDepth: 8
      });

      return { blob: moreCompressedBlob, format: 'wav', compressed: true };

    } catch (error) {
      console.error('Compression failed:', error);
      return { blob: audioBlob, format: 'original', compressed: false };
    }
  }, [compressAudio]);

  // Get audio information
  const getAudioInfo = useCallback(async (audioBlob) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(audioBlob);
      
      audio.onloadedmetadata = () => {
        const info = {
          duration: audio.duration,
          size: audioBlob.size,
          sizeKB: Math.round(audioBlob.size / 1024),
          sizeMB: Math.round((audioBlob.size / (1024 * 1024)) * 100) / 100,
          type: audioBlob.type
        };
        URL.revokeObjectURL(url);
        resolve(info);
      };
      
      audio.onerror = () => {
        const info = {
          duration: 0,
          size: audioBlob.size,
          sizeKB: Math.round(audioBlob.size / 1024),
          sizeMB: Math.round((audioBlob.size / (1024 * 1024)) * 100) / 100,
          type: audioBlob.type
        };
        URL.revokeObjectURL(url);
        resolve(info);
      };
      
      audio.src = url;
    });
  }, []);

  // Compare compression results
  const compareCompression = useCallback(async (originalBlob, compressedBlob) => {
    const originalInfo = await getAudioInfo(originalBlob);
    const compressedInfo = await getAudioInfo(compressedBlob);

    const sizeReduction = originalInfo.size - compressedInfo.size;
    const reductionPercentage = (sizeReduction / originalInfo.size) * 100;

    return {
      original: originalInfo,
      compressed: compressedInfo,
      reduction: {
        bytes: sizeReduction,
        percentage: Math.round(reductionPercentage * 100) / 100,
        ratio: Math.round((compressedInfo.size / originalInfo.size) * 100) / 100
      }
    };
  }, [getAudioInfo]);

  // Convert to different format (simple type change)
  const convertFormat = useCallback(async (audioBlob, targetType = 'audio/wav') => {
    // Simple conversion by re-wrapping the data
    return new Blob([audioBlob], { type: targetType });
  }, []);

  return {
    // Compression methods
    compressAudio,
    compressToMP3,
    compressToOpus,
    smartCompress,
    convertFormat,
    
    // Utilities
    getAudioInfo,
    compareCompression,
    
    // State
    isCompressing,
    compressionProgress,
    
    // Presets
    presets: {
      voiceMessage: {
        targetSampleRate: 16000,
        targetChannels: 1,
        bitDepth: 16
      },
      smallFile: {
        targetSampleRate: 8000,
        targetChannels: 1, 
        bitDepth: 8
      }
    }
  };
};

// Helper function to convert AudioBuffer to WAV
const audioBufferToWav = (buffer, bitDepth = 16) => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * (bitDepth / 8) + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let offset = 0;

  // Write WAV header
  const writeString = (str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  };

  const setUint16 = (data) => {
    view.setUint16(offset, data, true);
    offset += 2;
  };

  const setUint32 = (data) => {
    view.setUint32(offset, data, true);
    offset += 4;
  };

  writeString('RIFF');
  setUint32(length - 8);
  writeString('WAVE');
  writeString('fmt ');
  setUint32(16);
  setUint16(1); // PCM format
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * numOfChan * (bitDepth / 8));
  setUint16(numOfChan * (bitDepth / 8));
  setUint16(bitDepth);
  writeString('data');
  setUint32(length - offset - 4);

  // Get channel data
  for (let i = 0; i < numOfChan; i++) {
    channels.push(buffer.getChannelData(i));
  }

  // Write interleaved data
  const volume = 1;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      let sample = Math.max(-1, Math.min(1, channels[channel][i])) * volume;
      
      if (bitDepth === 16) {
        sample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(offset, sample, true);
        offset += 2;
      } else if (bitDepth === 8) {
        sample = (sample + 1) * 127;
        view.setUint8(offset, sample);
        offset += 1;
      }
    }
  }

  return new Blob([bufferArray], { type: 'audio/wav' });
};

export default useAudioCompression;