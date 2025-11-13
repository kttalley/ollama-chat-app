// src/App.jsx
import React, { useState, useRef } from 'react'
import MessagesList from './components/MessagesList'
import ChatInput from './components/ChatInput'
import ReactMarkdown from 'react-markdown'  // install via: npm install react-markdown
import { ThemeProvider, IconProvider, Button } from '@momentum-design/components/dist/react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are chatting with a model.' }
  ])
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef(null)

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg])
  }

  const handleSend = async (userText) => {
    addMessage({ role: 'user', content: userText })
    setStreaming(true)

    try {
      if (abortRef.current) {
        abortRef.current.abort()
      }
      const controller = new AbortController()
      abortRef.current = controller

      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma3:latest',
          prompt: userText,
          stream: true
        }),
        signal: controller.signal
      })

      if (!response.ok || !response.body) {
        throw new Error(`Network error: ${response.status}`)
      }

      // Add an empty assistant message to update into
      addMessage({ role: 'assistant', content: '' })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let buffer = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          buffer += decoder.decode(value, { stream: true })
          // Split on newline to parse each JSON line
          const lines = buffer.split('\n')
          // Keep the last incomplete line in buffer
          buffer = lines.pop()
          for (const line of lines) {
            if (!line) continue
            try {
              const obj = JSON.parse(line)
              // Append the response fragment
              setMessages(prev => {
                const newMsgs = [...prev]
                const lastIdx = newMsgs.length - 1
                const last = newMsgs[lastIdx]
                newMsgs[lastIdx] = {
                  role: 'assistant',
                  content: last.content + obj.response
                }
                return newMsgs
              })
            } catch (e) {
              // if JSON parse fails, ignore for now
            }
          }
        }
      }

    } catch (error) {
      console.error('Streaming error:', error)
      addMessage({ role: 'assistant', content: 'Error: failed to load response.' })
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  return (
    <ThemeProvider themeclass="mds-color-theme-darkWebex" >
      <IconProvider iconSet="custom-icons" url="svg" className="mds-typography mds-elevation">
        <Button>hi</Button>
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="p-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Chat with Model
        </h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <MessagesList messages={messages} />
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800">
        <ChatInput onSend={handleSend} disabled={streaming} />
      </footer>
    </div>
    </IconProvider>
    </ThemeProvider>
  )
}

export default App

