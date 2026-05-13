import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Loader2, ChevronDown } from 'lucide-react'
import { useFeatures } from '../../context/FeatureContext'

const SYSTEM_PROMPT = `You are a helpful productivity assistant embedded in TaskFlow, a task management app.
You help users manage their tasks better, prioritize work, overcome procrastination, and stay productive.
Keep answers concise and practical (2–4 sentences unless a longer answer is clearly needed).
You may ask clarifying questions. Be warm but efficient.`

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
        <Sparkles size={12} className="text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <Sparkles size={12} className="text-white" />
        </div>
      )}
      <div
        className={[
          'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm',
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm',
        ].join(' ')}
      >
        {msg.content}
      </div>
    </div>
  )
}

export function ChatWidget() {
  const { aiEnabled } = useFeatures()
  const [open, setOpen] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your TaskFlow assistant. Ask me anything about your tasks, productivity, or how to make the most of your day. 🚀",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (!aiEnabled) return null

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message: text,
          history: history.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }),
      })

      if (!response.ok) throw new Error('API error')
      const data = await response.json()
      const reply = data.response
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleToggleChat() {
    const wasOpen = open
    setOpen((v) => !v)
    
    if (!wasOpen && !hasBeenOpened) {
      setHasBeenOpened(true)
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[540px] flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">TaskFlow AI</p>
                <p className="text-xs text-green-500 font-medium">Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <p className="text-xs text-red-500 text-center py-1">{error}</p>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 px-4 py-3 bg-white border-t border-slate-100">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none leading-5 max-h-24 overflow-y-auto"
                style={{ minHeight: '20px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 hover:bg-blue-700 transition-colors shrink-0"
              >
                {loading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggleChat}
          className={[
            'relative h-14 w-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center',
            open
              ? 'bg-slate-700 hover:bg-slate-800'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105',
          ].join(' ')}
          aria-label="Toggle chat"
        >
          {open ? (
            <X size={22} className="text-white" />
          ) : (
            <>
              <MessageCircle size={22} className="text-white" />
              {!hasBeenOpened && (
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
              )}
            </>
          )}
        </button>
      </div>
    </>
  )
}