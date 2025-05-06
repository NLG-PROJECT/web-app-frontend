import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { FactCheckOverlay } from '@/components/FactCheckOverlay'

interface MarketSummary {
  message: string
  summary: string
}

interface FactCheckResult {
  claim: string
  score: number
  status: string
  evidence: string
  page: number
}

interface FactCheckResponse {
  fact_check: FactCheckResult[]
}

// Cache keys for session storage
const MARKET_SUMMARY_CACHE_KEY = 'market_summary_cache'
const MARKET_FACT_CHECK_CACHE_KEY = 'market_fact_check_cache'

export function MarketAnalysis() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null)
  const [isFactChecking, setIsFactChecking] = useState(false)
  const [
    factCheckResult,
    setFactCheckResult,
  ] = useState<FactCheckResponse | null>(null)
  const [showFactCheck, setShowFactCheck] = useState(false)
  const [
    selectedFactCheck,
    setSelectedFactCheck,
  ] = useState<FactCheckResult | null>(null)

  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        // Check session storage first
        const cachedData = sessionStorage.getItem(MARKET_SUMMARY_CACHE_KEY)
        if (cachedData) {
          const parsedData = JSON.parse(cachedData)
          setMarketSummary(parsedData)
          setIsLoading(false)
          return
        }

        setIsLoading(true)
        setError(null)
        const response = await axios.post(
          'http://127.0.0.1:8000/generate-market-summary',
        )
        const data = response.data

        // Store in session storage
        sessionStorage.setItem(MARKET_SUMMARY_CACHE_KEY, JSON.stringify(data))
        setMarketSummary(data)
      } catch (err) {
        console.error('Error fetching market summary:', err)
        setError('Failed to load market analysis. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketSummary()
  }, [])

  const handleFactCheck = async () => {
    try {
      // Check session storage first
      const cachedData = sessionStorage.getItem(MARKET_FACT_CHECK_CACHE_KEY)
      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        setFactCheckResult(parsedData)
        setShowFactCheck(true)
        return
      }

      setIsFactChecking(true)
      const response = await axios.post('http://127.0.0.1:8000/fact-check', {
        statement: marketSummary?.summary,
      })

      // Store in session storage
      sessionStorage.setItem(
        MARKET_FACT_CHECK_CACHE_KEY,
        JSON.stringify(response.data),
      )
      setFactCheckResult(response.data)
      setShowFactCheck(true)
    } catch (err) {
      console.error('Error fact-checking market analysis:', err)
      setError('Failed to fact-check market analysis. Please try again later.')
    } finally {
      setIsFactChecking(false)
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

  const renderMarketSummary = (summary: string) => {
    // Split the summary into sections based on ### headers
    const sections = summary.split('###').filter(Boolean)

    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n').filter(Boolean)
      const contentText = content.join('\n').trim()

      return (
        <div key={index} className="mb-8 last:mb-0">
          <h3 className="text-lg font-semibold mb-3 text-primary">
            {title.trim()}
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {contentText.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-4 last:mb-0 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )
    })
  }

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
            <LineChart className="size-5 text-primary" />
            Market Analysis
          </CardTitle>
          {marketSummary && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFactCheck}
              disabled={isFactChecking}
              className="gap-2"
            >
              {isFactChecking ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  Fact-checking...
                </>
              ) : factCheckResult ? (
                <>
                  {getFactCheckIcon(
                    getAverageScore(factCheckResult.fact_check),
                  )}
                  View details
                </>
              ) : (
                'Fact-check analysis'
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Market size, growth trends, competitive landscape, and market
            positioning analysis.
            <span className="block mt-2 text-sm text-amber-500/80">
              ⚠️ This is an experimental AI-generated analysis. Please
              fact-check critical information before making decisions.
            </span>
          </p>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Generating market analysis...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-8 p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && marketSummary && (
            <div className="mt-8">
              {renderMarketSummary(marketSummary.summary)}
            </div>
          )}
        </CardContent>
      </Card>

      {showFactCheck && factCheckResult && (
        <FactCheckOverlay
          isOpen={showFactCheck}
          onClose={() => setShowFactCheck(false)}
          factCheck={factCheckResult.fact_check}
          pdfUrl="/data/samplepdf.pdf"
        />
      )}
    </motion.div>
  )
}
