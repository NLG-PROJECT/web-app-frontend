import React, { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { processFinancialData, getKeyMetrics } from '@/utils/financialData'
import { useTheme } from '@/context/ThemeProvider'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface IncomeTableProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function IncomeTable({ data }: IncomeTableProps) {
  const { theme } = useTheme()
  const { years, data: processedData } = processFinancialData(data)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const isDark = theme === 'dark'

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
    if (current === null || previous === null) return null
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

  // Calculate profitability ratios
  const profitabilityRatios = useMemo(() => {
    return years.map((year) => {
      const metrics = getKeyMetrics(processedData, year)
      return {
        year,
        grossMargin: (metrics.grossProfit / metrics.revenue) * 100,
        operatingMargin: (metrics.operatingIncome / metrics.revenue) * 100,
        netMargin: (metrics.netIncome / metrics.revenue) * 100,
      }
    })
  }, [years, processedData])

  // Prepare margin chart options
  const marginChartOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Inter, sans-serif',
      },
      formatter: (params: any) => {
        let result = `<div class="font-medium">Year ${params[0].axisValue}</div>`
        params.forEach((param: any) => {
          result += `
            <div class="flex items-center gap-2 mt-1">
              <span style="color: ${param.color}">${param.seriesName}</span>
              <span>${param.value.toFixed(1)}%</span>
            </div>`
        })
        return result
      },
    },
    legend: {
      data: ['Gross Margin', 'Operating Margin', 'Net Margin'],
      top: 0,
      textStyle: {
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLabel: {
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
      },
    },
    series: [
      {
        name: 'Gross Margin',
        type: 'line',
        data: profitabilityRatios.map((r) => r.grossMargin),
        smooth: true,
        lineStyle: {
          width: 3,
          color: isDark ? '#10b981' : '#059669',
        },
        itemStyle: {
          color: isDark ? '#10b981' : '#059669',
        },
      },
      {
        name: 'Operating Margin',
        type: 'line',
        data: profitabilityRatios.map((r) => r.operatingMargin),
        smooth: true,
        lineStyle: {
          width: 3,
          color: isDark ? '#6366f1' : '#4f46e5',
        },
        itemStyle: {
          color: isDark ? '#6366f1' : '#4f46e5',
        },
      },
      {
        name: 'Net Margin',
        type: 'line',
        data: profitabilityRatios.map((r) => r.netMargin),
        smooth: true,
        lineStyle: {
          width: 3,
          color: isDark ? '#8b5cf6' : '#7c3aed',
        },
        itemStyle: {
          color: isDark ? '#8b5cf6' : '#7c3aed',
        },
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Income Statement Details
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="flex items-center gap-2"
        >
          {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
          {showAnalysis ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
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

        {showAnalysis && (
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Profitability Analysis
              </h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <ReactECharts
                  option={marginChartOption}
                  style={{ height: '400px' }}
                  theme={isDark ? 'dark' : undefined}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Key Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {years.map((year) => {
                  const metrics = getKeyMetrics(processedData, year)
                  const prevYear = years[years.indexOf(year) + 1]
                  const prevMetrics = prevYear
                    ? getKeyMetrics(processedData, prevYear)
                    : null

                  return (
                    <Card key={year} className="border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">
                          {year}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Gross Margin
                            </div>
                            <div className="font-medium">
                              {(
                                (metrics.grossProfit / metrics.revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Operating Margin
                            </div>
                            <div className="font-medium">
                              {(
                                (metrics.operatingIncome / metrics.revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Net Margin
                            </div>
                            <div className="font-medium">
                              {(
                                (metrics.netIncome / metrics.revenue) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
