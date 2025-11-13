import { useState, useEffect, useRef } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout for auto-submit
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(true);
          setTimeout(() => {
            recognition.stop();
          }, 3000); // Show processing state for 500ms
        }, 3000); // Wait 500ms after final result
      }
      
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessing(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // If we were processing, simulate submission
      if (isProcessing) {
        setTimeout(() => {
          setIsProcessing(false);
          // Trigger submission here if needed
        }, 300);
      }
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isProcessing]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      setIsProcessing(false);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setIsProcessing(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    isProcessing,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
};