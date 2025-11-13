import React, { useState, useRef, useEffect } from 'react';
import { Button, Chip, Spinner, ListItem, Icon, InputChip, ThemeProvider } from '@momentum-design/components/react';
import { useSpeechRecognition } from './useSpeechRecognition';

const ChatInput = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [contextChips, setContextChips] = useState([]);
  const [micButtonActive, setMicButtonActive] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const loadingTimeoutRef = useRef(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    isProcessing,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition();

  const contextOptions = [
    { id: 'recent', label: 'Recently visited articles', icon: 'file-text-bold' },
    { id: 'collections', label: 'Content collections', icon: 'notes-bold' },
    { id: 'products', label: 'Products', icon: 'application-bold' },
    { id: 'devices', label: 'Device models', icon: 'devices-bold' },
    { id: 'roles', label: 'Roles', icon: 'user-bold' },
    { id: 'industries', label: 'Industries', icon: 'company-bold' },
  ];

  const handleAddContext = () => {
    setShowContextMenu(!showContextMenu);
  };

  const handleContextSelect = (option) => {
    setContextChips([...contextChips, option]);
    setShowContextMenu(false);
  };

  const handleRemoveChip = (chipId) => {
    setContextChips(contextChips.filter((chip) => chip.id !== chipId));
  };

  // Update input value when speech recognition provides transcript
  useEffect(() => {
    if (transcript && (isListening || isProcessing)) {
      setInputValue(transcript);
    }
  }, [transcript, isListening, isProcessing]);

  // Handle loading spinner timing for speech transcription
  useEffect(() => {
    if (isListening && (transcript || interimTranscript)) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      setShowLoadingSpinner(false);

      if (transcript.trim().length > 0) {
        loadingTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            setShowLoadingSpinner(true);
          }
        }, 1000);
      }
    }
  }, [transcript, interimTranscript, isListening]);

  // Cleanup loading spinner when not listening
  useEffect(() => {
    if (!isListening) {
      setShowLoadingSpinner(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [isListening]);

  // Auto-submit when processing is complete
  useEffect(() => {
    if (isProcessing && transcript) {
      const timer = setTimeout(() => {
        console.log('Auto-submitted via voice:', transcript);
        // Create a synthetic event to submit
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
        setMicButtonActive(false);
        setShowLoadingSpinner(false);
        resetTranscript();
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [isProcessing, transcript, resetTranscript]);

  // Stop listening when mic button is deactivated
  useEffect(() => {
    if (!micButtonActive && isListening) {
      stopListening();
    }
  }, [micButtonActive, isListening, stopListening]);

  const handleMicClick = () => {
    if (!hasRecognitionSupport) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      stopListening();
      setMicButtonActive(false);
      setShowLoadingSpinner(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    } else {
      startListening();
      setMicButtonActive(true);
    }
  };

  const getDisplayValue = () => {
    if (isListening || isProcessing) {
      return transcript + (interimTranscript ? ` ${interimTranscript}` : '');
    }
    return inputValue;
  };

  const handleInputChangeWithReset = (value) => {
    setInputValue(value);

    // If user manually types while listening, stop speech recognition
    if (isListening) {
      stopListening();
      setMicButtonActive(false);
      setShowLoadingSpinner(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      resetTranscript();
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, unless Shift is held
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = getDisplayValue().trim();
    if (!messageText || disabled) return;
    
    onSend(messageText);
    setInputValue('');
    resetTranscript();
    setMicButtonActive(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mx-[1rem] min-height p-[0.25rem] pb-[1rem] flex-shrink-0">
      {/* Add Context Button */}
      <div className="compose-header">
        <Button 
          size={28} 
          prefixIcon='mention-filled' 
          onClick={handleAddContext} 
          variant="secondary" 
          className='bg-[#fff] hover:bg-[rgba(255,255,255,0.4)] rounded-[8px] my-[0.25rem]'
        >
          Add context
        </Button>

        {/* Context Menu Popover */}
        {showContextMenu && (
          <div className="absolute w-[400px] mt-[-304px] rounded-[0.5rem] shadow-xl bg-[#fff] z-[99] outline-1px outline-[#000]">
            <p label='@ Add context' className=' pl-[1rem] text-[1rem] font-[700]'>@ Add context</p>
            {contextOptions.map((option) => (
              <ListItem
                key={option.id}
                onClick={() => handleContextSelect(option)}
                variant="full-width"
                label={option.label}
                className="cursor-pointer transition-colors"
              >
                <Icon
                  slot="leading-controls"
                  lengthUnit="rem"
                  name={option.icon}
                ></Icon>
              </ListItem>
            ))}
          </div>
        )}
      </div>

      {/* Unified Input Container with Gradient Ring */}
      <div
        className="relative rounded-[12px] transition-all duration-300 overflow-visible"
        style={{
          background: micButtonActive || isListening
            ? 'linear-gradient(224deg, #3492eb 14.64%, #22c7d6 51.1%, #68debd 85.36%)'
            : 'transparent',
          padding: micButtonActive || isListening ? '2px' : '0px'
        }}
      >
        {/* Gradient Border Ring (masked) */}
        {(micButtonActive || isListening) && (
          <>
            <div
              className="absolute inset-0 rounded-[12px] pointer-events-none transition-opacity duration-300"
              style={{
                background: 'linear-gradient(224deg, #3492eb 14.64%, #22c7d6 51.1%, #68debd 85.36%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '2px',
              }}
            />
            <div
              className="absolute inset-[-8px] rounded-[12px] pointer-events-none -z-10 transition-opacity duration-300 blur-[20px]"
              style={{
                background: 'linear-gradient(224deg, #3492eb 14.64%, #22c7d6 51.1%, #68debd 85.36%)',
                opacity: 0.6
              }}
            />
          </>
        )}

        {/* Inner Container */}
        <div 
          className="px-[0.5rem] py-[0.5rem] flex flex-col justify-between bg-[#fff] max-h-[200px] border border-[var(--mds-color-theme-control-active-normal)] rounded-[12px] p-3 flex flex-col gap-2 focus-within:ring-1 focus-within:ring-blue-500/10"
          style={{
            border: micButtonActive || isListening ? 'none' : '2px solid var(--mds-color-theme-control-active-normal)',
            boxShadow: micButtonActive || isListening
              ? '0 0 40px 15px rgba(52, 146, 235, 0.25)'
              : 'none'
          }}
        >
          {/* Context Chips */}
          {contextChips.length > 0 && (
            <div className="flex flex-wrap gap-[0.25rem]">
              {contextChips.map((chip) => (
                <ThemeProvider key={chip.id} themeclass={`mds-theme-stable-lightWebex`}>
                  <InputChip
                    color='lime'
                    onClick={() => handleRemoveChip(chip.id)}
                    label={chip.label}
                    iconName={chip.icon}
                    style={{
                      '--mdc-chip-color': '#',
                      '--mdc-chip-border-color': '#your-border-color',
                      '--mdc-chip-background-color': '#3E7E61',
                    }}
                  >
                    {chip.label}
                  </InputChip>
                </ThemeProvider>
              ))}
            </div>
          )}
          {contextChips.length < 1 && (
            <Chip iconName="search-ai-bold" color="slate" label="Site-wide search"></Chip>
          )}

          {/* Text Input with Loading Spinner */}
          <div className="relative flex w-full">
            <textarea
              value={getDisplayValue()}
              onChange={(e) => handleInputChangeWithReset(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isProcessing
                  ? 'Processing...'
                  : isListening
                    ? 'Listening...'
                    : 'Ask AI Assistant or search'
              }
              rows={3}
              className=" text-[1rem] w-full bg-transparent outline-none border-none text-sm placeholder-gray-400 disabled:text-gray-400 resize-none overflow-y-auto"
              style={{
                height: '2rem',
                marginTop: '0.5rem',
                maxHeight: '4rem',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
                fontFamily: 'inherit'
              }}
              disabled={disabled || isListening || isProcessing}
              readOnly={isListening || isProcessing}
            />

            {/* Loading Spinner */}
            {showLoadingSpinner && isListening && transcript.trim() && (
              <div className="ml-2 flex-shrink-0 mt-1">
                <Spinner size="small" variant="primary" />
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex justify-end items-center gap-2 -mr-1">
            <Button
              type="button"
              variant="tertiary"
              prefixIcon='microphone-bold'
              onClick={handleMicClick}
              disabled={disabled || isProcessing}
              aria-label="Voice transcription"
              title={isListening ? 'Stop listening' : 'Start listening'}
              className={`transition-all duration-300 ease-in-out ${micButtonActive || isListening ? 'text-blue-600' : 'text-gray-500'
                }`}
            >
              {isProcessing ? '⟳' : isListening ? 'Stop' : ''}
            </Button>
            {!micButtonActive && (
              <Button
                type="submit"
                variant='tertiary'
                prefixIcon='send-bold'
                disabled={disabled || !getDisplayValue().trim()}
                aria-label="Send message"
              />
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer Caption */}
      <div className="text-[0.75rem] max-h-[16px] text-gray-500 text-center mt-1">
        <p>Assistant can make mistakes. Verify responses.</p>
      </div>
    </form>
  );
};

export default ChatInput;

