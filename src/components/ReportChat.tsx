import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Send,
  X,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
} from 'lucide-react'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PDFViewer } from './PDFViewer'
import { FactCheckOverlay } from './FactCheckOverlay'

interface FactCheckResult {
  claim: string
  score: number
  status: string
  evidence: string
  page: number
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  isFactChecking?: boolean
  factCheckResult?: FactCheckResult[]
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
  const [showFactCheck, setShowFactCheck] = useState(false)
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult[]>([])
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
        option: currentSection,
      })

      console.log('Chat response received:', response.data)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          response.data.response ||
          "I apologize, but I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date(),
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

  const getFactCheckIcon = (score: number) => {
    if (score >= 0.75) {
      return <CheckCircle2 className="size-3 text-green-500" />
    } else if (score >= 0.5) {
      return <CheckCircle2 className="size-3 text-orange-500" />
    } else if (score >= 0.25) {
      return <AlertCircle className="size-3 text-yellow-500" />
    } else {
      return <XCircle className="size-3 text-red-500" />
    }
  }

  const getAverageScore = (factChecks: FactCheckResult[]) => {
    if (!factChecks.length) return 0
    const sum = factChecks.reduce((acc, curr) => acc + curr.score, 0)
    return sum / factChecks.length
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">AI Assistant</h3>
            <span
              title="AI-generated — experimental content"
              className="text-primary"
            >
              ✨
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Experimental — Assistant can make mistakes. Please fact-check
            critical responses.
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
                {message.sender === 'ai' && (
                  <button
                    onClick={async () => {
                      console.log('Fact check button clicked:', {
                        hasResult: !!message.factCheckResult,
                        messageId: message.id,
                        content: message.content,
                      })

                      if (message.factCheckResult) {
                        console.log('Showing existing fact check result')
                        setFactCheckResult(message.factCheckResult)
                        setShowFactCheck(true)
                      } else {
                        console.log('Starting new fact check')
                        // Set loading state for this specific message
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === message.id
                              ? { ...msg, isFactChecking: true }
                              : msg,
                          ),
                        )

                        try {
                          // Check session storage first
                          const cacheKey = `chat_fact_check_${message.id}`
                          const cachedData = sessionStorage.getItem(cacheKey)
                          if (cachedData) {
                            const parsedData = JSON.parse(cachedData)
                            setMessages((prev) =>
                              prev.map((msg) =>
                                msg.id === message.id
                                  ? {
                                      ...msg,
                                      isFactChecking: false,
                                      factCheckResult: parsedData.fact_check,
                                    }
                                  : msg,
                              ),
                            )
                            setFactCheckResult(parsedData.fact_check)
                            setShowFactCheck(true)
                            return
                          }

                          console.log(
                            'Making API call to fact-check endpoint...',
                          )
                          const response = await axios.post(
                            'http://127.0.0.1:8000/fact-check',
                            {
                              statement: message.content,
                            },
                          )

                          console.log('Raw API response:', response)
                          console.log(
                            'Fact check API response data:',
                            response.data,
                          )

                          // Check if we have the expected data structure
                          if (
                            !response.data ||
                            typeof response.data !== 'object'
                          ) {
                            throw new Error('Invalid response format from API')
                          }

                          // Store in session storage
                          sessionStorage.setItem(
                            cacheKey,
                            JSON.stringify(response.data),
                          )

                          // Update message with fact check result
                          setMessages((prev) =>
                            prev.map((msg) =>
                              msg.id === message.id
                                ? {
                                    ...msg,
                                    isFactChecking: false,
                                    factCheckResult: response.data.fact_check,
                                  }
                                : msg,
                            ),
                          )

                          console.log('Message updated with fact check result')
                        } catch (err) {
                          console.error('Fact check error:', err)
                          if (axios.isAxiosError(err)) {
                            console.error('API Error details:', {
                              status: err.response?.status,
                              data: err.response?.data,
                              message: err.message,
                            })
                          }
                          // Reset loading state on error
                          setMessages((prev) =>
                            prev.map((msg) =>
                              msg.id === message.id
                                ? { ...msg, isFactChecking: false }
                                : msg,
                            ),
                          )
                        }
                      }
                    }}
                    disabled={message.isFactChecking}
                    className="mt-2 text-xs text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1"
                  >
                    {message.isFactChecking ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        Fact-checking...
                      </>
                    ) : message.factCheckResult ? (
                      <div className="mt-2 flex items-center gap-1">
                        {getFactCheckIcon(
                          getAverageScore(message.factCheckResult),
                        )}
                        <button
                          onClick={() => {
                            if (message.factCheckResult) {
                              setFactCheckResult(message.factCheckResult)
                              setShowFactCheck(true)
                            }
                          }}
                          className="text-xs text-primary hover:underline transition-colors"
                        >
                          View details
                        </button>
                      </div>
                    ) : (
                      'Fact-check response'
                    )}
                  </button>
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
            placeholder="Ask me anything about your report..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="size-4" />
          </Button>
        </div>
      </form>

      {showFactCheck && factCheckResult && (
        <FactCheckOverlay
          isOpen={showFactCheck}
          onClose={() => setShowFactCheck(false)}
          factCheck={factCheckResult}
          pdfUrl="/uploads/report.pdf"
        />
      )}
    </div>
  )
}
