import { useState, useCallback } from 'react';

export const useTransactionForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
    description: '',
    category: 'general',
    transactionId: '',
    voiceNote: null,
    compressedVoiceNote: null, // Add compressed version
    hasVoiceNote: false,
    voiceNoteUrl: null // Cloud URL after upload
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = useCallback((data = null) => {
    const dataToValidate = data || formData;
    const newErrors = {};

    if (!dataToValidate.amount || parseFloat(dataToValidate.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!dataToValidate.recipient.trim()) {
      newErrors.recipient = 'Please enter a recipient';
    }

    if (dataToValidate.amount && parseFloat(dataToValidate.amount) > 100000) {
      newErrors.amount = 'Amount cannot exceed N100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.amount, formData.recipient]);

  // Handle input changes with validation
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Handle voice note attachment
  const handleVoiceNoteAttach = useCallback((voiceBlob) => {
    setFormData(prev => ({
      ...prev,
      voiceNote: voiceBlob,
      hasVoiceNote: true
    }));
  }, []);

  // Handle compressed voice note
  const handleCompressedVoiceNote = useCallback((compressedBlob, voiceNoteUrl = null) => {
    setFormData(prev => ({
      ...prev,
      compressedVoiceNote: compressedBlob,
      voiceNoteUrl: voiceNoteUrl
    }));
  }, []);

  // Handle voice note removal
  const handleVoiceNoteRemove = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      voiceNote: null,
      compressedVoiceNote: null,
      hasVoiceNote: false,
      voiceNoteUrl: null
    }));
  }, []);

  // Format amount input
  const formatAmount = useCallback((value) => {
    if (value === '') return '';

    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return numericValue;
  }, []);

  // Submit transaction
  const submitTransaction = useCallback(async (transactionData = null) => {
    const dataToSubmit = transactionData || formData;
    
    if (!validateForm(dataToSubmit)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with voice note
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error('Transaction failed. Please try again.'));
          } else {
            resolve();
          }
        }, 2000);
      });

      // Generate mock transaction ID
      const mockTransactionId = 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setFormData(prev => ({ 
        ...prev, 
        transactionId: mockTransactionId,
        voiceNote: dataToSubmit.voiceNote,
        compressedVoiceNote: dataToSubmit.compressedVoiceNote,
        voiceNoteUrl: dataToSubmit.voiceNoteUrl,
        hasVoiceNote: dataToSubmit.hasVoiceNote
      }));
      setStep(3);
      return true;
    } catch (error) {
      setErrors({ submit: error.message });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (step === 1 && validateForm()) {
      setStep(2);
    }
  }, [step, validateForm]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      amount: '',
      recipient: '',
      description: '',
      category: 'general',
      transactionId: '',
      voiceNote: null,
      compressedVoiceNote: null,
      hasVoiceNote: false,
      voiceNoteUrl: null
    });
    setStep(1);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
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
    resetForm,
    validateForm
  };
};