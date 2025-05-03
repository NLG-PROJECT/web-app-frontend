import { IncomeAnalysis } from './IncomeAnalysis'
import { BalanceSheetAnalysis } from './balance-sheet/BalanceSheetAnalysis'

interface FinancialMetricsProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function FinancialMetrics({ data }: FinancialMetricsProps) {
  return (
    <div className="space-y-8">
      <IncomeAnalysis data={data} />
      <BalanceSheetAnalysis data={data} />
    </div>
  )
}
