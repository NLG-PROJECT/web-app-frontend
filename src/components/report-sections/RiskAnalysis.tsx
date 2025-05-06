import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface RiskAnalysis {
  message: string
  summary: string
}

// Cache key for session storage
const RISK_ANALYSIS_CACHE_KEY = 'risk_analysis_cache'

export function RiskAnalysis() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)

  useEffect(() => {
    const fetchRiskAnalysis = async () => {
      try {
        // Check session storage first
        const cachedData = sessionStorage.getItem(RISK_ANALYSIS_CACHE_KEY)
        if (cachedData) {
          const parsedData = JSON.parse(cachedData)
          setRiskAnalysis(parsedData)
          setIsLoading(false)
          return
        }

        setIsLoading(true)
        setError(null)
        const response = await axios.post(
          'http://127.0.0.1:8000/generate-risk-factors',
        )
        const data = response.data

        // Store in session storage
        sessionStorage.setItem(RISK_ANALYSIS_CACHE_KEY, JSON.stringify(data))
        setRiskAnalysis(data)
      } catch (err) {
        console.error('Error fetching risk analysis:', err)
        setError('Failed to load risk analysis. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRiskAnalysis()
  }, [])

  const renderRiskAnalysis = (summary: string) => {
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
            <AlertTriangle className="size-5 text-primary" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Assessment of key risks, mitigation strategies, and risk management
            framework.
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
          {!isLoading && !error && riskAnalysis && (
            <div className="mt-8">
              {renderRiskAnalysis(riskAnalysis.summary)}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
