import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'

// Cache keys for session storage
const EXECUTIVE_SUMMARY_CACHE_KEY = 'executive_summary_cache'
const EXECUTIVE_INITIAL_FETCH_KEY = 'executive_initial_fetch'

interface ExecutiveSummaryResponse {
  errorType: string | null
  errorMessage: string | null
  warnings: string[]
  result: string
  wordCount: number
}

export function ExecutiveSummary() {
  const [isLoading, setIsLoading] = useState(() => {
    const cachedData = sessionStorage.getItem(EXECUTIVE_SUMMARY_CACHE_KEY)
    return !cachedData
  })
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<ExecutiveSummaryResponse | null>(
    () => {
      const cachedData = sessionStorage.getItem(EXECUTIVE_SUMMARY_CACHE_KEY)
      return cachedData ? JSON.parse(cachedData) : null
    },
  )

  const fetchExecutiveSummary = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(
        'http://127.0.0.1:8000/executive-summary',
      )
      const data = response.data[0] // Get first item from array

      // Store in session storage
      sessionStorage.setItem(EXECUTIVE_SUMMARY_CACHE_KEY, JSON.stringify(data))
      setSummary(data)
    } catch (err) {
      console.error('Error fetching executive summary:', err)
      setError('Failed to load executive summary. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const hasInitialFetch = sessionStorage.getItem(EXECUTIVE_INITIAL_FETCH_KEY)
    if (!hasInitialFetch) {
      fetchExecutiveSummary()
      sessionStorage.setItem(EXECUTIVE_INITIAL_FETCH_KEY, 'true')
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Executive Summary
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem(EXECUTIVE_SUMMARY_CACHE_KEY)
                setSummary(null)
                setIsLoading(true)
                fetchExecutiveSummary()
              }}
              className="gap-2"
            >
              <Loader2 className="size-3" />
              Resync
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Loading executive summary...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && summary && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-6 [&>p:first-child]:mt-4 [&>strong]:block [&>strong]:mb-3 [&>strong]:text-lg [&>strong]:text-primary [&>hr]:my-4 [&>hr]:border-border prose-headings:mt-0 prose-p:mt-0"
              dangerouslySetInnerHTML={{ __html: summary.result }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
