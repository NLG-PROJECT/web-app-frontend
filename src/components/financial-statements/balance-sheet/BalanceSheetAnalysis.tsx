import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { AssetStructure } from './AssetStructure'
import { BalanceSheetHealth } from './BalanceSheetHealth'
import { WorkingCapital } from './WorkingCapital'
import { LiabilityEquityFlow } from './LiabilityEquityFlow'
import { BalanceBridge } from './BalanceBridge'
import { useTheme } from '@/context/ThemeProvider'

interface BalanceSheetAnalysisProps {
  data: {
    flattened: { item: string; [key: string]: string | number | null }[]
    assets: { item: string; [key: string]: string | number | null }[]
    liabilities: { item: string; [key: string]: string | number | null }[]
    derivatives?: { item: string; [key: string]: string | number | null }[]
  }
}
export function BalanceSheetAnalysis({ data }: BalanceSheetAnalysisProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [showTable, setShowTable] = useState(false)

  // Get years from the data
  const getYears = () => {
    if (data.flattened.length === 0) return []
    const firstItem = data.flattened[0]
    return Object.keys(firstItem)
      .filter((key) => key !== 'item')
      .sort()
  }

  const years = getYears()

  // Format number for display
  const formatNumber = (value: number | null) => {
    if (value === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Balance Sheet Analysis
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTable(!showTable)}
          className="border-primary/20"
        >
          {showTable ? 'Hide Table' : 'Show Table'}
        </Button>
      </div>

      {showTable && (
        <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Balance Sheet Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th className="text-left">Item</th>
                    {years.map((year) => (
                      <th key={year} className="text-right">
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.flattened.map((row) => (
                    <tr key={row.item}>
                      <td className="text-left">{row.item}</td>
                      {years.map((year) => (
                        <td key={year} className="text-right">
                          {formatNumber(row[year] as number)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetStructure data={data.assets} />
        {/* <BalanceSheetHealth data={[...data.assets, ...data.liabilities]} /> */}
        <WorkingCapital assets={data.assets} liabilities={data.liabilities} />
        {/* <LiabilityEquityFlow data={data} />
        <BalanceBridge data={data} /> */}
      </div>
    </div>
  )
}
