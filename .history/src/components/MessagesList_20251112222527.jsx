// Momentum Design CSS is imported in index.css - no need to import here
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Avatar, Icon, Text, Chip } from '@momentum-design/components/react';

const MessagesList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  const getSessionDate = () => {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${dayOfWeek}, ${date}`;
  };

  // Filter out system messages for display
  const displayMessages = messages.filter(msg => msg.role !== 'system');

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 mx-[1rem] pb-[2rem]">
      {displayMessages.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-[30%] h-full text-center text-gray-600">
          <Icon name="sparkle-bold" className="scale-400" />
          <h3 className="mt-[48px] text-lg font-semibold text-gray-900">Hello, I'm your AI Assistant</h3>
          <p className="text-sm">Start a conversation or ask me anything. I'm here to help you.</p>
        </div>
      ) : (
        <>
          <div className="w-[100%] flex flex-row justify-center">
            <Text type="body-small-regular">{getSessionDate()}</Text>
          </div>
          {displayMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const timestamp = new Date();
            
            return (
              <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed break-words ${
                    isUser
                      ? 'bg-[#ffffff22] my-[1rem] m-[0.25rem] py-[0.5rem] rounded-[1rem]'
                      : 'text-[var(--mds-color-theme-secondary-light)] rounded-[1rem] bg-[var(--mds-color-theme-background-glass-normal)]'
                  }`}
                  style={{
                    backdropFilter: 'var(--mds-effect-backdrop-filter)',
                    WebkitBackdropFilter: 'var(--mds-effect-backdrop-filter)', // Safari support
                    padding: '1rem 1rem 0.75rem 1.25rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {isUser ? (
                    <div className="prose prose-sm ">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row items-center gap-[0.5rem]">
                          <Avatar />
                          <Text type="body-large-bold">You</Text>
                        </div>
                        <Text type="body-small-regular">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </div>
                      {/* <Chip iconName="search-ai-bold" color="slate" label="Site-wide search"></Chip> */}
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="prose prose-sm ">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row items-center gap-[0.5rem]">
                          <Icon name="cisco-ai-assistant-color-gradient" className="scale-190 mr-[4px]" />
                          <Text type="body-large-bold">AI Assistant</Text>
                        </div>
                        <Text type="body-small-regular">{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </div>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div
                className="max-w-xs px-3 py-2 rounded-lg text-sm leading-relaxed break-words bg-[var(--mds-color-theme-background-glass-normal)]"
                style={{
                  backdropFilter: 'var(--mds-effect-backdrop-filter)',
                  padding: '1rem 1rem 0.75rem 1.25rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderLeft: '4px solid var(--mds-color-theme-primary-normal)',
                  borderRadius: '1rem'
                }}
              >
                <div className="flex flex-row items-center gap-[0.5rem] mb-2">
                  <Icon name="cisco-ai-assistant-color-gradient" className="scale-190 mr-[4px]" />
                  <Text type="body-large-bold">AI Assistant</Text>
                </div>
                <div className="flex gap-2 items-center">
                  <Text type="body-large-medium">
                    <span className="text-sm text-gray-600">One moment while I find an answer for you...</span>
                  </Text>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessagesList;

