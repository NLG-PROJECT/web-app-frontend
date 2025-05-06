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
  factCheckResult?: FactCheckResult
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
  const [
    selectedFactCheck,
    setSelectedFactCheck,
  ] = useState<FactCheckResult | null>(null)
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

  const handleFactCheck = async (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isFactChecking: true } : msg,
      ),
    )

    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/fact-check',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          statement: messages.find((m) => m.id === messageId)?.content,
        },
      })

      console.log('Fact check response:', response.data)

      // Update the message with fact check results
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                isFactChecking: false,
                factCheckResult: response.data.fact_check[0],
              }
            : msg,
        ),
      )
    } catch (err) {
      console.error('Fact check error:', err)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isFactChecking: false } : msg,
        ),
      )
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

  const formatEvidence = (evidence: string) => {
    return evidence.split('\\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ))
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
                {message.sender === 'ai' && (
                  <button
                    onClick={() => {
                      if (message.factCheckResult) {
                        setSelectedFactCheck(message.factCheckResult)
                      } else {
                        handleFactCheck(message.id)
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
                      <>
                        {getFactCheckIcon(message.factCheckResult.score)}
                        View details
                      </>
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
            placeholder="Ask about this section..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="size-4" />
          </Button>
        </div>
      </form>

      <Dialog
        open={!!selectedFactCheck}
        onOpenChange={() => setSelectedFactCheck(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Fact Check Results</span>
              {selectedFactCheck && getFactCheckIcon(selectedFactCheck.score)}
            </DialogTitle>
            <DialogDescription>
              Score:{' '}
              {selectedFactCheck
                ? (selectedFactCheck.score * 100).toFixed(1)
                : '0'}
              % • Status: {selectedFactCheck?.status}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-medium mb-2">Claim</h4>
              <p className="text-sm text-muted-foreground">
                {selectedFactCheck?.claim}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Evidence</h4>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {selectedFactCheck &&
                  formatEvidence(selectedFactCheck.evidence)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">
                Page {selectedFactCheck?.page}
              </span>
              <Button
                onClick={() => {
                  // TODO: Handle PDF navigation
                  setSelectedFactCheck(null)
                }}
                className="flex items-center gap-2"
              >
                <FileText className="size-4" />
                Confirm in Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
