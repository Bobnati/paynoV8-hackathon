// voiceService.js

class VoiceService {
  constructor() {
    // Remove process.env since it doesn't work in browser
    this.baseUrl = 'https://api.yourdomain.com'; // Replace with your actual API URL
  }

  // Upload voice note to cloud storage
  async uploadVoiceNote(voiceBlob, transactionId, options = {}) {
    try {
      console.log('Starting voice note upload process...');
      
      // Step 1: Compress the audio
      console.log('Compressing audio...');
      const compressedBlob = await this.compressVoiceNote(voiceBlob, options);
      
      // Step 2: Generate unique filename
      const fileName = this.generateFileName(transactionId);
      
      // Step 3: Get upload URL from your backend (mock for now)
      const uploadUrl = await this.getUploadUrl(fileName, compressedBlob.type);
      
      // Step 4: Upload to cloud storage (mock for now)
      const voiceNoteUrl = await this.uploadToCloud(uploadUrl, compressedBlob, fileName);
      
      console.log('Voice note uploaded successfully:', voiceNoteUrl);
      return {
        success: true,
        voiceNoteUrl,
        compressedBlob,
        fileName
      };
    } catch (error) {
      console.error('Voice note upload failed:', error);
      throw new Error(`Voice upload failed: ${error.message}`);
    }
  }

  // Compress voice note using Web Audio API directly
  async compressVoiceNote(voiceBlob, options = {}) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await voiceBlob.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Create offline context for processing with lower sample rate
      const offlineContext = new OfflineAudioContext(
        1, // mono
        audioBuffer.duration * 16000, // reduced sample rate
        16000
      );

      // Create source buffer
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      // Add compression for voice optimization
      const compressor = offlineContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;

      // Connect nodes
      source.connect(compressor);
      compressor.connect(offlineContext.destination);

      // Start rendering
      source.start(0);
      const renderedBuffer = await offlineContext.startRendering();

      // Convert to WAV format
      const wavBlob = this.audioBufferToWav(renderedBuffer);
      
      return wavBlob;
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      // Fallback to original blob if compression fails
      return voiceBlob;
    }
  }

  // Generate unique filename
  generateFileName(transactionId) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    return `voice-${transactionId}-${timestamp}-${randomId}.wav`;
  }

  // Get pre-signed upload URL from your backend (mock)
  async getUploadUrl(fileName, fileType) {
    // Mock implementation - in real app, call your backend API
    console.log('Getting upload URL for:', fileName);
    return `https://storage.yourapp.com/upload/${fileName}`;
  }

  // Upload to cloud storage (mock)
  async uploadToCloud(uploadUrl, compressedBlob, fileName) {
    // Mock implementation - in real app, actually upload the file
    console.log('Mock upload to:', uploadUrl, 'Size:', compressedBlob.size);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
    
    // Return mock URL
    return `https://storage.yourapp.com/voice-notes/${fileName}`;
  }

  // Get auth token (implement based on your auth system)
  getAuthToken() {
    // This should be implemented based on your authentication system
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || 'mock-token';
  }

  // Delete voice note from cloud storage
  async deleteVoiceNote(voiceNoteUrl) {
    try {
      console.log('Deleting voice note:', voiceNoteUrl);
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error('Voice note deletion failed:', error);
      throw error;
    }
  }

  // Get voice note info
  async getVoiceNoteInfo(voiceNoteUrl) {
    try {
      console.log('Getting voice note info for:', voiceNoteUrl);
      // Mock implementation
      return {
        size: '150KB',
        type: 'audio/wav',
        lastModified: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get voice note info:', error);
      return null;
    }
  }

  // Helper function to convert AudioBuffer to WAV
  audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
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
    setUint32(buffer.sampleRate * numOfChan * 2);
    setUint16(numOfChan * 2);
    setUint16(16);
    writeString('data');
    setUint32(length - offset - 4);

    // Get channel data
    for (let i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }

    // Write interleaved data
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        let sample = Math.max(-1, Math.min(1, channels[channel][i]));
        sample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
    }

    return new Blob([bufferArray], { type: 'audio/wav' });
  }

  // Mock implementation for development
  async mockUploadVoiceNote(voiceBlob, transactionId) {
    console.log('Mock upload - simulating cloud upload...');
    
    // Simulate compression
    const compressedBlob = await this.compressVoiceNote(voiceBlob);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock URL
    const mockUrl = `https://storage.yourapp.com/voice-notes/mock-${transactionId}-${Date.now()}.wav`;
    
    return {
      success: true,
      voiceNoteUrl: mockUrl,
      compressedBlob,
      fileName: `mock-${transactionId}.wav`
    };
  }

  // Simple compression without Web Audio API (fallback)
  async simpleCompress(voiceBlob) {
    // For very basic compression, we can just change the format
    // This is a fallback if Web Audio API fails
    return new Blob([voiceBlob], { type: 'audio/wav' });
  }
}

// Create singleton instance
const voiceService = new VoiceService();
export default voiceService;