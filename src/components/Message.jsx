import React from 'react'

const Message = ({ role, content }) => {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl p-3 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
        {content}
      </div>
    </div>
  )
}

export default Message

