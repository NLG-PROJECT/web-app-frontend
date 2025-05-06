import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertTriangle,
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

interface RiskSummary {
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
const RISK_SUMMARY_CACHE_KEY = 'risk_summary_cache'
const RISK_FACT_CHECK_CACHE_KEY = 'risk_fact_check_cache'
const RISK_INITIAL_FETCH_KEY = 'risk_initial_fetch'

export function RiskAnalysis() {
  const [isLoading, setIsLoading] = useState(() => {
    const cachedData = sessionStorage.getItem(RISK_SUMMARY_CACHE_KEY)
    return !cachedData
  })
  const [error, setError] = useState<string | null>(null)
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(() => {
    const cachedData = sessionStorage.getItem(RISK_SUMMARY_CACHE_KEY)
    return cachedData ? JSON.parse(cachedData) : null
  })
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

  const fetchRiskSummary = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.post(
        'http://127.0.0.1:8000/generate-risk-factors',
      )
      const data = response.data

      // Store in session storage
      sessionStorage.setItem(RISK_SUMMARY_CACHE_KEY, JSON.stringify(data))
      setRiskSummary(data)
    } catch (err) {
      console.error('Error fetching risk summary:', err)
      setError('Failed to load risk analysis. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const hasInitialFetch = sessionStorage.getItem(RISK_INITIAL_FETCH_KEY)
    if (!hasInitialFetch) {
      fetchRiskSummary()
      sessionStorage.setItem(RISK_INITIAL_FETCH_KEY, 'true')
    }
  }, [])

  const handleFactCheck = async () => {
    try {
      // Check session storage first
      const cachedData = sessionStorage.getItem(RISK_FACT_CHECK_CACHE_KEY)
      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        setFactCheckResult(parsedData)
        setShowFactCheck(true)
        return
      }

      setIsFactChecking(true)
      const response = await axios.post('http://127.0.0.1:8000/fact-check', {
        statement: riskSummary?.summary,
      })

      // Store in session storage
      sessionStorage.setItem(
        RISK_FACT_CHECK_CACHE_KEY,
        JSON.stringify(response.data),
      )
      setFactCheckResult(response.data)
      setShowFactCheck(true)
    } catch (err) {
      console.error('Error fact-checking risk analysis:', err)
      setError('Failed to fact-check risk analysis. Please try again later.')
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

  const renderRiskSummary = (summary: string) => {
    // Split the summary into sections based on ### headers
    const sections = summary.split('###').filter(Boolean)

    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n').filter(Boolean)
      const contentText = content.join('\n').trim()

      return (
        <div key={index} className="mb-8 last:mb-0">
          <h3 className="text-lg font-semibold mb-3 text-primary">
            {title.trim().replace(/^###\s*/, '')}
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {contentText.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-4 last:mb-0 text-muted-foreground">
                {paragraph.replace(/^###\s*/g, '')}
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
            <AlertTriangle className="size-5 text-primary" />
            Risk Analysis
          </CardTitle>
          <div className="flex gap-2">
            {riskSummary && (
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem(RISK_SUMMARY_CACHE_KEY)
                sessionStorage.removeItem(RISK_FACT_CHECK_CACHE_KEY)
                setRiskSummary(null)
                setFactCheckResult(null)
                setShowFactCheck(false)
                setIsLoading(true)
                fetchRiskSummary()
              }}
              className="gap-2"
            >
              <Loader2 className="size-3" />
              Resync
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Risk factors, mitigation strategies, and potential impact analysis.
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
                Generating risk analysis...
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
          {!isLoading && !error && riskSummary && (
            <div className="mt-8">{renderRiskSummary(riskSummary.summary)}</div>
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
