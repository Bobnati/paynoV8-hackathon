import { useState, useCallback, useEffect } from 'react';

export const useTransferSplit = () => {
  // Main form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    groupId: '68e6b191cfb5ca18c7c06119',
    creatorId: '123', // Sender
    receiverId: '', // Receiver who gets the money
    totalAmount: 0, // in kobo
    purpose: '',
    splitType: 'EQUAL',
    customSplits: null,
    participantIds: [] // Contributors (excluding receiver)
  });
  
  const [participantInputs, setParticipantInputs] = useState([
    { id: '123' } // Start with sender as first contributor
  ]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedShares, setCalculatedShares] = useState([]);
  
  // New states for PIN and transaction status
  const [pin, setPin] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('idle');
  const [transactionId, setTransactionId] = useState(null);

  // Mock users data
  const [users] = useState([
    { id: '123', name: 'You (Sender)', phone: '+2348012345678' },
    { id: '246389', name: 'John Doe', phone: '+2348012345679' },
    { id: '146389', name: 'Jane Smith', phone: '+2348012345680' },
    { id: '345678', name: 'Mike Johnson', phone: '+2348012345681' },
    { id: '456789', name: 'Sarah Wilson', phone: '+2348012345682' }
  ]);

  // Calculate shares whenever relevant data changes
  useEffect(() => {
    calculateShares();
  }, [formData.totalAmount, formData.splitType, formData.participantIds, formData.receiverId]);

  // Update participantIds when participantInputs change
  useEffect(() => {
    const validParticipantIds = participantInputs
      .map(p => p.id.trim())
      .filter(id => id.length > 0);
    
    setFormData(prev => ({
      ...prev,
      participantIds: validParticipantIds
    }));
  }, [participantInputs]);

  // Simulate transaction status polling
  useEffect(() => {
    let pollInterval;
    
    if (transactionStatus === 'pending' && transactionId) {
      pollInterval = setInterval(() => {
        if (Math.random() < 0.3) {
          const isSuccess = Math.random() < 0.7;
          setTransactionStatus(isSuccess ? 'success' : 'failed');
          clearInterval(pollInterval);
        }
      }, 2000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [transactionStatus, transactionId]);

  // Validate current step
  const validateStep = useCallback((stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.totalAmount || formData.totalAmount <= 0) {
          newErrors.totalAmount = 'Please enter a valid amount';
        } else if (formData.totalAmount < 100) {
          newErrors.totalAmount = 'Minimum amount is ₦1.00';
        }
        if (!formData.receiverId.trim()) {
          newErrors.receiverId = 'Please select a receiver';
        }
        break;

      case 2:
        const validParticipants = participantInputs.filter(p => p.id.trim().length > 0);
        if (validParticipants.length === 0) {
          newErrors.participantIds = 'Please add at least one contributor';
        }
        
        // Validate individual participant IDs
        participantInputs.forEach((participant, index) => {
          if (participant.id.trim() && participant.id.trim().length < 3) {
            newErrors[`participant_${index}`] = 'Account ID must be at least 3 characters';
          }
          // Prevent receiver from being added as contributor
          if (participant.id === formData.receiverId) {
            newErrors[`participant_${index}`] = 'Receiver cannot also be a contributor';
          }
        });

        if (validParticipants.length < 1) {
          newErrors.participantIds = 'Please add at least one contributor';
        }
        break;

      case 3:
        // Check if we have valid data for submission
        if (!formData.totalAmount || formData.totalAmount <= 0) {
          newErrors.submit = 'Invalid amount';
        }
        if (!formData.receiverId) {
          newErrors.submit = 'Receiver not selected';
        }
        if (formData.participantIds.length === 0) {
          newErrors.submit = 'No contributors added';
        }
        if (calculatedShares.length === 0) {
          newErrors.submit = 'Split calculation failed';
        }
        break;

      case 3.5:
        if (pin.length !== 4) {
          newErrors.pin = 'PIN must be 4 digits';
        } else if (!/^\d+$/.test(pin)) {
          newErrors.pin = 'PIN must contain only numbers';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, participantInputs, calculatedShares, pin]);

  // Calculate shares based on split type
  const calculateShares = useCallback(() => {
    if (!formData.totalAmount || formData.participantIds.length === 0 || !formData.receiverId) {
      setCalculatedShares([]);
      return;
    }

    let shares = [];

    switch (formData.splitType) {
      case 'EQUAL':
        // Equal split among contributors
        const equalShare = Math.round(formData.totalAmount / formData.participantIds.length);
        shares = formData.participantIds.map(participantId => ({
          participantId,
          amount: equalShare,
          percentage: Math.round((100 / formData.participantIds.length) * 100) / 100,
          type: 'contribution'
        }));
        
        // Adjust the last share to account for rounding
        if (shares.length > 0) {
          const totalWithoutLast = shares.slice(0, -1).reduce((sum, share) => sum + share.amount, 0);
          shares[shares.length - 1].amount = formData.totalAmount - totalWithoutLast;
        }
        break;

      case 'PERCENTAGE':
        // For percentage split, distribute based on percentages
        // Default: equal percentages for all contributors
        const percentageShare = Math.round(formData.totalAmount / formData.participantIds.length);
        const percentage = Math.round((100 / formData.participantIds.length) * 100) / 100;
        
        shares = formData.participantIds.map(participantId => ({
          participantId,
          amount: percentageShare,
          percentage: percentage,
          type: 'contribution'
        }));
        
        // Adjust the last share
        if (shares.length > 0) {
          const totalWithoutLast = shares.slice(0, -1).reduce((sum, share) => sum + share.amount, 0);
          shares[shares.length - 1].amount = formData.totalAmount - totalWithoutLast;
        }
        break;

      default:
        shares = [];
    }

    // Add receiver entry
    shares.push({
      participantId: formData.receiverId,
      amount: formData.totalAmount,
      percentage: 100,
      type: 'receiving'
    });

    setCalculatedShares(shares);
  }, [formData.totalAmount, formData.splitType, formData.participantIds, formData.receiverId]);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Handle amount input
  const handleAmountChange = useCallback((value) => {
    const amountInKobo = Math.round(value * 100);
    setFormData(prev => ({
      ...prev,
      totalAmount: amountInKobo
    }));

    if (errors.totalAmount) {
      setErrors(prev => ({
        ...prev,
        totalAmount: ''
      }));
    }
  }, [errors]);

  // Handle receiver selection
  const handleReceiverChange = useCallback((receiverId) => {
    setFormData(prev => ({
      ...prev,
      receiverId
    }));

    if (errors.receiverId) {
      setErrors(prev => ({
        ...prev,
        receiverId: ''
      }));
    }
  }, [errors]);

  // Handle split type change
  const handleSplitTypeChange = useCallback((splitType) => {
    setFormData(prev => ({
      ...prev,
      splitType,
      customSplits: splitType === 'CUSTOM' ? [] : null
    }));
  }, []);

  // Handle participant ID input changes
  const handleParticipantIdChange = useCallback((index, value) => {
    if (index === 0) return; // Prevent modifying sender

    setParticipantInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = { id: value };
      return newInputs;
    });

    if (errors[`participant_${index}`]) {
      setErrors(prev => ({
        ...prev,
        [`participant_${index}`]: ''
      }));
    }
  }, [errors]);

  // Add new participant input field
  const addParticipantField = useCallback(() => {
    setParticipantInputs(prev => [...prev, { id: '' }]);
  }, []);

  // Remove participant input field
  const removeParticipantField = useCallback((index) => {
    if (index === 0) return; // Prevent removing sender

    setParticipantInputs(prev => {
      const newInputs = prev.filter((_, i) => i !== index);
      return newInputs.length === 0 ? [{ id: '123' }] : newInputs;
    });
  }, []);

  // Handle PIN input
  const handlePinChange = useCallback((e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      
      if (errors.pin) {
        setErrors(prev => ({
          ...prev,
          pin: ''
        }));
      }
    }
  }, [errors]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  }, [step, validateStep]);

  const prevStep = useCallback(() => {
    if (step === 3.5) {
      setPin('');
    }
    setStep(prev => Math.max(prev - 1, 1));
  }, [step]);

  // Submit split payment (moves to PIN step)
  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit called - Step:', step);
    console.log('Form data:', formData);
    console.log('Calculated shares:', calculatedShares);
    
    if (!validateStep(3)) {
      console.log('Validation failed for step 3');
      return;
    }

    console.log('Validation passed, moving to PIN step');
    // Move to PIN step instead of directly submitting
    setStep(3.5);
  }, [validateStep, formData, calculatedShares, step]);

  // Confirm with PIN and submit to backend
  const handlePinSubmit = useCallback(async () => {
    console.log('handlePinSubmit called');
    
    if (!validateStep(3.5)) {
      console.log('PIN validation failed');
      return;
    }

    setIsSubmitting(true);
    console.log('Starting submission process...');

    try {
      const payload = {
        groupId: formData.groupId,
        creatorId: formData.creatorId,
        receiverId: formData.receiverId,
        totalAmount: formData.totalAmount,
        purpose: formData.purpose || 'Split Payment',
        splitType: formData.splitType,
        customSplits: formData.customSplits,
        participantIds: formData.participantIds,
        pin: pin
      };

      console.log('Submitting split payment:', { 
        ...payload, 
        pin: '***'
      });

      const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error('Invalid PIN. Please try again.'));
          } else {
            setTransactionId(mockTransactionId);
            setTransactionStatus('pending');
            resolve(mockTransactionId);
          }
        }, 1500);
      });

      console.log('Submission successful, moving to step 4');
      setStep(4);
      setPin('');

    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, pin, validateStep]);

  // Clear transaction status
  const clearTransactionStatus = useCallback(() => {
    setTransactionStatus('idle');
    setTransactionId(null);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      groupId: '68e6b191cfb5ca18c7c06119',
      creatorId: '123',
      receiverId: '',
      totalAmount: 0,
      purpose: '',
      splitType: 'EQUAL',
      customSplits: null,
      participantIds: []
    });
    setParticipantInputs([{ id: '123' }]);
    setStep(1);
    setErrors({});
    setCalculatedShares([]);
    setIsSubmitting(false);
    setPin('');
    setTransactionStatus('idle');
    setTransactionId(null);
  }, []);

  // Get display amount
  const getDisplayAmount = useCallback(() => {
    return formData.totalAmount ? (formData.totalAmount / 100).toFixed(2) : '';
  }, [formData.totalAmount]);

  // Get user name by ID
  const getUserName = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `Account: ${userId}`;
  }, [users]);

  // Debug logging
  useEffect(() => {
    console.log('Current step:', step);
    console.log('Form data:', formData);
    console.log('Participant inputs:', participantInputs);
    console.log('Calculated shares:', calculatedShares);
    console.log('Errors:', errors);
  }, [step, formData, participantInputs, calculatedShares, errors]);

  return {
    // State
    step,
    formData,
    participantInputs,
    users,
    calculatedShares,
    errors,
    isSubmitting,
    pin,
    transactionStatus,
    transactionId,

    // Actions
    handleInputChange,
    handleAmountChange,
    handleReceiverChange,
    handleSplitTypeChange,
    handleParticipantIdChange,
    addParticipantField,
    removeParticipantField,
    handlePinChange,
    nextStep,
    prevStep,
    handleSubmit,
    handlePinSubmit,
    clearTransactionStatus,
    resetForm,

    // Utilities
    validateStep,
    getDisplayAmount,
    getUserName
  };
};

export default useTransferSplit;