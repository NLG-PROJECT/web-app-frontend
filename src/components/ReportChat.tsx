import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, X, ChevronRight, MessageSquare, Phone, Mail } from 'lucide-react'
import axios from 'axios'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  references?: {
    section?: string
    metric?: string
    chart?: string
  }
}

interface ReportChatProps {
  currentSection: string
  onClose: () => void
}

export function ReportChat({ currentSection, onClose }: ReportChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      console.log('Sending chat message:', input)
      const response = await axios.post('/api/chat', {
        message: input,
        option: currentSection, // Using current section as the option
      })

      console.log('Chat response received:', response.data)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          response.data.response ||
          "I apologize, but I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date(),
        references: {
          section: currentSection,
        },
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error('Chat API error:', err)
      setError('Failed to get response. Please try again.')

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Current section: {currentSection}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.references && (
                  <div className="mt-2 text-xs opacity-70">
                    Reference: {message.references.section}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-primary animate-bounce" />
                  <div className="size-2 rounded-full bg-primary animate-bounce delay-100" />
                  <div className="size-2 rounded-full bg-primary animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10">
          {error}
        </div>
      )}

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="p-4 border-t"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this section..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
