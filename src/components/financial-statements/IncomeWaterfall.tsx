import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { processFinancialData, getKeyMetrics } from '@/utils/financialData'
import { useTheme } from '@/context/ThemeProvider'

interface IncomeWaterfallProps {
  data: {
    item: string
    2024: number | null
    2023: number | null
    2022: number | null
  }[]
}

export function IncomeWaterfall({ data }: IncomeWaterfallProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { years, data: processedData } = processFinancialData(data)
  const latestYear = years[0]
  const metrics = getKeyMetrics(processedData, latestYear)

  // Theme-aware colors
  const colors = {
    positive: {
      primary: isDark ? '#10b981' : '#059669',
      secondary: isDark ? '#059669' : '#047857',
    },
    negative: {
      primary: isDark ? '#ef4444' : '#dc2626',
      secondary: isDark ? '#dc2626' : '#b91c1c',
    },
    neutral: {
      primary: isDark ? '#22c55e' : '#16a34a',
      secondary: isDark ? '#16a34a' : '#15803d',
    },
  }

  // Get key metrics in order with theme-aware colors
  const keyMetrics = [
    {
      name: 'Total Revenue',
      value: metrics.revenue,
      color: colors.positive.primary,
      gradient: [colors.positive.primary, colors.positive.secondary],
      isTotal: true,
    },
    {
      name: 'Cost of Sales',
      value: -metrics.costOfSales,
      color: colors.negative.primary,
      gradient: [colors.negative.primary, colors.negative.secondary],
      isNegative: true,
    },
    {
      name: 'Gross Profit',
      value: metrics.grossProfit,
      color: colors.neutral.primary,
      gradient: [colors.neutral.primary, colors.neutral.secondary],
      isTotal: true,
    },
    {
      name: 'Operating Expenses',
      value: -metrics.operatingExpenses,
      color: colors.negative.primary,
      gradient: [colors.negative.primary, colors.negative.secondary],
      isNegative: true,
    },
    {
      name: 'Operating Income',
      value: metrics.operatingIncome,
      color: colors.neutral.primary,
      gradient: [colors.neutral.primary, colors.neutral.secondary],
      isTotal: true,
    },
    {
      name: 'Other Income/(Expense)',
      value: metrics.otherIncome,
      color:
        metrics.otherIncome >= 0
          ? colors.positive.primary
          : colors.negative.primary,
      gradient:
        metrics.otherIncome >= 0
          ? [colors.positive.primary, colors.positive.secondary]
          : [colors.negative.primary, colors.negative.secondary],
      isNegative: metrics.otherIncome < 0,
    },
    {
      name: 'Income Before Taxes',
      value: metrics.incomeBeforeTaxes,
      color: colors.neutral.primary,
      gradient: [colors.neutral.primary, colors.neutral.secondary],
      isTotal: true,
    },
    {
      name: 'Income Taxes',
      value: -metrics.incomeTaxes,
      color: colors.negative.primary,
      gradient: [colors.negative.primary, colors.negative.secondary],
      isNegative: true,
    },
    {
      name: 'Net Income',
      value: metrics.netIncome,
      color: colors.neutral.primary,
      gradient: [colors.neutral.primary, colors.neutral.secondary],
      isTotal: true,
    },
  ]

  // Calculate values and running totals
  let cumulative = 0
  const changes = keyMetrics.map((metric) => {
    const start = cumulative
    cumulative += metric.value

    // Calculate percentage change from previous step
    const percentageChange =
      start !== 0 ? ((metric.value / start) * 100).toFixed(1) : null

    return {
      name: metric.name,
      value: Math.abs(metric.value),
      itemStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: metric.gradient[0] },
            { offset: 1, color: metric.gradient[1] },
          ],
        },
      },
      start,
      end: cumulative,
      isNegative: metric.isNegative,
      isTotal: metric.isTotal,
      percentageChange,
    }
  })

  // Format numbers for display
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value)
  }

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: isDark
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
      },
      formatter: (params: any) => {
        const item = changes[params[0].dataIndex]
        let result = `<div class="font-semibold mb-2">${item.name}</div>`
        result += `<div class="flex items-center gap-2 mb-1">
          <span class="text-muted-foreground">Value:</span>
          <span class="font-medium">${formatNumber(item.value)}</span>
        </div>`
        result += `<div class="flex items-center gap-2 mb-1">
          <span class="text-muted-foreground">Total:</span>
          <span class="font-medium">${formatNumber(item.end)}</span>
        </div>`
        if (item.percentageChange) {
          result += `<div class="flex items-center gap-2">
            <span class="text-muted-foreground">Change:</span>
            <span class="font-medium ${
              item.isNegative ? 'text-red-500' : 'text-green-500'
            }">
              ${item.percentageChange}%
            </span>
          </div>`
        }
        return result
      },
    },
    legend: {
      data: ['Additions', 'Deductions'],
      top: 0,
      textStyle: {
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
      },
      itemGap: 20,
      icon: 'circle',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: changes.map((item) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30,
        width: 100,
        overflow: 'truncate',
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => formatNumber(value),
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          type: 'dashed',
        },
      },
      axisLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    series: [
      {
        type: 'bar',
        stack: 'total',
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent',
        },
        data: changes.map((item) => item.start),
      },
      {
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          position: 'top',
          distance: 10,
          formatter: (params: any) => {
            const item = changes[params.dataIndex]
            return `${formatNumber(item.end)}${
              item.percentageChange ? `\n${item.percentageChange}%` : ''
            }`
          },
          color: isDark ? '#fff' : '#000',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 'normal',
        },
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 4,
          shadowOffsetY: 2,
        },
        emphasis: {
          itemStyle: {
            shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 6,
            shadowOffsetY: 3,
          },
        },
        data: changes.map((item) => ({
          value: item.value,
          itemStyle: item.itemStyle,
        })),
      },
      {
        type: 'line',
        lineStyle: {
          opacity: 0.2,
          type: 'dashed',
          color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        },
        showSymbol: false,
        data: changes.map((item) => item.end),
        z: -1,
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Income Statement Waterfall ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Shows progression from revenue to net income with percentage changes)
        </div>
        <div className="flex items-center justify-center gap-8 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-sm bg-gradient-to-br from-[${colors.positive.primary}] to-[${colors.positive.secondary}]`}
            />
            <span>Additions (Revenue/Income)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-sm bg-gradient-to-br from-[${colors.negative.primary}] to-[${colors.negative.secondary}]`}
            />
            <span>Deductions (Costs/Expenses)</span>
          </div>
        </div>
        <ReactECharts
          option={option}
          style={{ height: '500px' }}
          theme={isDark ? 'dark' : undefined}
        />
      </CardContent>
    </Card>
  )
}
