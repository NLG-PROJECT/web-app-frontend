import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IncomeWaterfall } from './IncomeWaterfall'
import { IncomeTrends } from './IncomeTrends'
import { IncomeTable } from './IncomeTable'
import { EPSAnalysis } from './EPSAnalysis'
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
        {showTable && <IncomeTable data={data} />}
        <div className="grid gap-6 lg:grid-cols-2">
          <IncomeWaterfall data={data} />
          <IncomeTrends data={data} />
        </div>
      </div>
    </div>
  )
}
