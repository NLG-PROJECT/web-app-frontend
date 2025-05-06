import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { IncomeAnalysis } from '@/components/financial-statements/IncomeAnalysis'
import { BalanceSheetAnalysis } from '@/components/financial-statements/balance-sheet/BalanceSheetAnalysis'
import CashflowAnalysis from '@/components/financial-statements/CashflowAnalysis'
import { Button } from '@/components/ui/button'
import { fetchFinancialData } from '@/services/financialDataService'

interface FinancialStatement {
  item: string
  [year: string]: string | number | null
}

interface FinancialData {
  ConsolidatedStatementsOfIncomeOrComprehensiveIncome: FinancialStatement[]
  ConsolidatedStatementsOfCashFlows: FinancialStatement[]
  ConsolidatedBalanceSheets: {
    flattened: FinancialStatement[]
    assets: FinancialStatement[]
    liabilities: FinancialStatement[]
    derivatives?: FinancialStatement[]
  }
  income_statement_dates?: string[]
  cashflow_statement_dates?: string[]
  ConsolidatedStatementsOfEquity?: FinancialStatement[]
}

// Cache keys for session storage
const FINANCIAL_DATA_CACHE_KEY = 'financial_data_cache'
const FINANCIAL_INITIAL_FETCH_KEY = 'financial_initial_fetch'

export function FinancialMetrics() {
  const [isLoading, setIsLoading] = useState(() => {
    const cachedData = sessionStorage.getItem(FINANCIAL_DATA_CACHE_KEY)
    return !cachedData
  })
  const [error, setError] = useState<string | null>(null)
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    () => {
      const cachedData = sessionStorage.getItem(FINANCIAL_DATA_CACHE_KEY)
      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        console.log('Loaded financial data from cache:', parsedData)
        return parsedData
      }
      return null
    },
  )

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchFinancialData()

      // Store in session storage
      sessionStorage.setItem(FINANCIAL_DATA_CACHE_KEY, JSON.stringify(data))
      console.log('Stored financial data in cache:', data)
      setFinancialData(data)
    } catch (err) {
      console.error('Error fetching financial data:', err)
      setError('Failed to load financial data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const hasInitialFetch = sessionStorage.getItem(FINANCIAL_INITIAL_FETCH_KEY)
    if (!hasInitialFetch) {
      fetchData()
      sessionStorage.setItem(FINANCIAL_INITIAL_FETCH_KEY, 'true')
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
            <BarChart3 className="size-5 text-primary" />
            Financial Metrics
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem(FINANCIAL_DATA_CACHE_KEY)
                setFinancialData(null)
                setIsLoading(true)
                fetchData()
              }}
              className="gap-2"
            >
              <Loader2 className="size-3" />
              Resync
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Detailed analysis of financial performance including revenue,
            expenses, balance sheet composition, and key financial ratios.
          </p>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading financial data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-8 p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && financialData && (
            <div className="space-y-8">
              <IncomeAnalysis
                data={
                  financialData.ConsolidatedStatementsOfIncomeOrComprehensiveIncome
                }
              />
              <BalanceSheetAnalysis
                data={financialData.ConsolidatedBalanceSheets}
              />
              <CashflowAnalysis
                data={financialData.ConsolidatedStatementsOfCashFlows}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
