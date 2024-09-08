'use client'
import classes from './page.module.css'
import { useSocket } from '../context/SocketProvider'
import { useState } from 'react'

export default function Page() {
  const { sendMessage, messages } = useSocket()
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className='max-w-7xl mx-auto flex flex-col h-screen'>
      <div>
        <h1>All Messages</h1>
        {messages.map((msg: string, idx: number) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <div className={classes['chat-container']}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={classes['chat-input']}
          placeholder="Message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} className={classes['button']}>
          Send
        </button>
      </div>
    </div>
  )
}