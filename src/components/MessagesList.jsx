import React from 'react'
import Message from './Message'

const MessagesList = ({ messages }) => {
  return (
    <div className="space-y-3">
      {messages.map((msg, idx) => (
        <Message key={idx} role={msg.role} content={msg.content} />
      ))}
    </div>
  )
}

export default MessagesList

