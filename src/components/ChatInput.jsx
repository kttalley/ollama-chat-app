import React, { useState } from 'react'
import { Icon } from "@momentum-design/components/dist/react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form className="flex items-center space-x-2" onSubmit={handleSubmit}>
      <textarea
        className="flex-1 p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Type your message…"
      />
      <button
        type="submit"
        disabled={disabled}
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        <Icon name="send" className="w-6 h-6" />
      </button>
    </form>
  )
}

export default ChatInput

