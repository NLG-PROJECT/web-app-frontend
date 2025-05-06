import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { IncomeAnalysis } from '@/components/financial-statements/IncomeAnalysis'
import { BalanceSheetAnalysis } from '@/components/financial-statements/balance-sheet/BalanceSheetAnalysis'
import CashflowAnalysis from '@/components/financial-statements/CashflowAnalysis'
import sampleData from '../../../data/sample.json'

interface FinancialStatement {
  item: string
  [year: string]: string | number | null
}

interface SampleData {
  ConsolidatedStatementsOfIncomeOrComprehensiveIncome: FinancialStatement[]
  ConsolidatedStatementsOfCashFlows: FinancialStatement[]
  ConsolidatedBalanceSheets: {
    flattened: FinancialStatement[]
    assets: FinancialStatement[]
    liabilities: FinancialStatement[]
    derivatives?: FinancialStatement[]
  }
}

export function FinancialMetrics() {
  const typedSampleData = sampleData as SampleData

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
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Detailed analysis of financial performance including revenue,
            expenses, balance sheet composition, and key financial ratios.
          </p>

          <div className="space-y-8">
            <IncomeAnalysis
              data={
                typedSampleData.ConsolidatedStatementsOfIncomeOrComprehensiveIncome
              }
            />
            <BalanceSheetAnalysis
              data={typedSampleData.ConsolidatedBalanceSheets}
            />
            <CashflowAnalysis
              data={typedSampleData.ConsolidatedStatementsOfCashFlows}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
