import React, { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { processFinancialData } from '@/utils/financialData'
import { useTheme } from '@/context/ThemeProvider'

interface IncomeTableProps {
  data: {
    item: string
    2024: number | null
    2023: number | null
    2022: number | null
  }[]
}

export function IncomeTable({ data }: IncomeTableProps) {
  const { theme } = useTheme()
  const { years, data: processedData } = processFinancialData(data)

  // Format numbers for display
  const formatNumber = (value: number | string | null) => {
    if (value === null || value === undefined) return '-'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '-'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num)
  }

  // Calculate year-over-year growth
  const calculateGrowth = (
    current: number | string | null,
    previous: number | string | null,
  ) => {
    if (!current || !previous) return null
    const currentNum =
      typeof current === 'string' ? parseFloat(current) : current
    const previousNum =
      typeof previous === 'string' ? parseFloat(previous) : previous
    if (isNaN(currentNum) || isNaN(previousNum) || previousNum === 0)
      return null
    return ((currentNum - previousNum) / Math.abs(previousNum)) * 100
  }

  // Determine if an item is a section header
  const isSectionHeader = (item: string) => {
    const headers = [
      'Revenue',
      'Cost of revenue',
      'Operating expenses',
      'Other income',
      'Income taxes',
    ]
    return headers.some((header) =>
      item.toLowerCase().includes(header.toLowerCase()),
    )
  }

  // Determine if an item is a total/subtotal
  const isTotal = (item: string) => {
    return (
      item.toLowerCase().includes('total') ||
      item.toLowerCase().includes('margin') ||
      item.toLowerCase().includes('income') ||
      item.toLowerCase().includes('earnings')
    )
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Income Statement Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Detailed breakdown of income statement items with year-over-year
          growth)
        </div>
        <div className="overflow-x-auto rounded-lg border border-primary/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-primary/20 hover:bg-transparent">
                <TableHead className="w-[300px] text-primary font-semibold">
                  Item
                </TableHead>
                {years.map((year) => (
                  <TableHead
                    key={year}
                    className="text-right min-w-[120px] text-primary font-semibold"
                  >
                    {year}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((item, index) => {
                const isHeader = isSectionHeader(item.item)
                const isSubtotal = isTotal(item.item)

                return (
                  <TableRow
                    key={item.item}
                    className={`
                      ${isHeader ? 'bg-muted/50 dark:bg-muted/10' : ''}
                      ${
                        isSubtotal
                          ? 'font-semibold border-t border-primary/20'
                          : ''
                      }
                      transition-colors
                      ${
                        !isHeader && !isSubtotal
                          ? 'hover:bg-muted/30 dark:hover:bg-muted/5'
                          : ''
                      }
                    `}
                  >
                    <TableCell
                      className={`
                        ${isHeader ? 'font-bold text-primary/80' : ''}
                        ${isSubtotal ? 'font-semibold' : ''}
                        ${!isHeader && !isSubtotal ? 'pl-8' : ''}
                      `}
                    >
                      {item.item}
                    </TableCell>
                    {years.map((year, yearIndex) => {
                      const value = item[year]
                      const prevYear = years[yearIndex + 1]
                      const prevValue = prevYear ? item[prevYear] : null
                      const growth = calculateGrowth(value, prevValue)

                      return (
                        <TableCell
                          key={year}
                          className={`
                            text-right
                            ${isSubtotal ? 'font-semibold' : ''}
                          `}
                        >
                          <div className="flex flex-col items-end">
                            <div className="font-medium">
                              {formatNumber(value)}
                            </div>
                            {growth !== null && (
                              <div
                                className={`
                                  text-xs font-medium
                                  ${
                                    growth > 0
                                      ? 'text-green-500 dark:text-green-400'
                                      : growth < 0
                                      ? 'text-red-500 dark:text-red-400'
                                      : 'text-muted-foreground'
                                  }
                                `}
                                title={`${
                                  growth > 0 ? 'Increase' : 'Decrease'
                                } of ${Math.abs(growth).toFixed(
                                  1,
                                )}% from ${prevYear}`}
                              >
                                {growth > 0 ? '↑' : '↓'}{' '}
                                {Math.abs(growth).toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
