import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CashFlowCombinedChart from './CashFlowCombinedChart'

// Placeholder for the chart component import
// import CashFlowCombinedChart from './cashflow/CashFlowCombinedChart'

export default function CashflowAnalysis({ data }: { data: any }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Cashflow Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          Combined bar and line charts for cash flow components and net change
          over time
        </div>
        <CashFlowCombinedChart data={data} />
        {/* <CashFlowCombinedChart data={data} /> */}
        <div className="text-center text-muted-foreground">
          [Cash Flow Chart Coming Soon]
        </div>
      </CardContent>
    </Card>
  )
}
