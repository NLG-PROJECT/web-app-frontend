import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IncomeWaterfall } from './IncomeWaterfall'
import { IncomeTrends } from './IncomeTrends'
import { IncomeTable } from './IncomeTable'
import { Eye, EyeOff } from 'lucide-react'

interface IncomeAnalysisProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function IncomeAnalysis({ data }: IncomeAnalysisProps) {
  const [showTable, setShowTable] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Income Analysis
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2"
        >
          {showTable ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Income Table
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Income Table
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {showTable && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Income Statement Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeTable data={data} />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <IncomeWaterfall data={data} />
          <IncomeTrends data={data} />
        </div>
      </div>
    </div>
  )
}
