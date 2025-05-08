import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import { useTheme } from '@/context/ThemeProvider'

interface IncomeWaterfallProps {
  data: {
    item: string
    [year: string]: string | number | null
  }[]
}

export function IncomeWaterfall({ data }: IncomeWaterfallProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 1. Get list of all years from the dataset
  const allYears = Array.from(
    new Set(
      data.flatMap((row) => Object.keys(row).filter((k) => /^\d{4}$/.test(k))),
    ),
  ).sort((a, b) => Number(b) - Number(a)) // Descending

  const latestYear = allYears[0]

  // 2. Define relevant labels
  const labels = {
    revenue: 'Net revenue',
    costOfSales: 'Cost of sales',
    operatingExpenses: 'Operating expenses',
    operatingIncome: 'Operating income',
    incomeTaxes: 'Provision for (benefit from) taxes',
    netIncome: 'Net income',
  }

  const getValue = (label: string): number => {
    const row = data.find((d) => d.item.toLowerCase() === label.toLowerCase())
    const val = row?.[latestYear]
    return typeof val === 'number' ? val : 0
  }

  const metrics = {
    revenue: getValue(labels.revenue),
    costOfSales: getValue(labels.costOfSales),
    operatingExpenses: getValue(labels.operatingExpenses),
    operatingIncome: getValue(labels.operatingIncome),
    incomeTaxes: getValue(labels.incomeTaxes),
    netIncome: getValue(labels.netIncome),
  }

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

  const steps = [
    {
      name: 'Revenue',
      value: metrics.revenue,
      color: colors.positive,
      isTotal: true,
    },
    {
      name: 'Cost of Sales',
      value: -metrics.costOfSales,
      color: colors.negative,
      isNegative: true,
    },
    {
      name: 'Operating Expenses',
      value: -metrics.operatingExpenses,
      color: colors.negative,
      isNegative: true,
    },
    {
      name: 'Operating Income',
      value: metrics.operatingIncome,
      color: colors.neutral,
      isTotal: true,
    },
    {
      name: 'Income Taxes',
      value: -metrics.incomeTaxes,
      color: colors.negative,
      isNegative: true,
    },
    {
      name: 'Net Income',
      value: metrics.netIncome,
      color: colors.neutral,
      isTotal: true,
    },
  ]

  let cumulative = 0
  const changes = steps.map((step) => {
    const start = cumulative
    cumulative += step.value
    const pctChange =
      start !== 0 ? ((step.value / start) * 100).toFixed(1) : null

    return {
      name: step.name,
      value: Math.abs(step.value),
      itemStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: step.color.primary },
            { offset: 1, color: step.color.secondary },
          ],
        },
      },
      start,
      end: cumulative,
      percentageChange: pctChange,
      isNegative: step.isNegative,
    }
  })

  const formatNumber = (val: number) =>
    `$${new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)}M`

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255,255,255,0.9)',
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
      },
      formatter: (params: any) => {
        const item = changes[params[0].dataIndex]
        return `
          <div><strong>${item.name}</strong></div>
          <div>Value: ${formatNumber(item.value)}</div>
          <div>Total: ${formatNumber(item.end)}</div>
          ${
            item.percentageChange
              ? `<div>Change: <span style="color:${
                  item.isNegative
                    ? colors.negative.primary
                    : colors.positive.primary
                }">${item.percentageChange}%</span></div>`
              : ''
          }
        `
      },
    },
    xAxis: {
      type: 'category',
      data: changes.map((c) => c.name),
      axisLabel: {
        rotate: 30,
        color: isDark ? '#aaa' : '#555',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: formatNumber,
        color: isDark ? '#aaa' : '#555',
      },
    },
    series: [
      {
        type: 'bar',
        stack: 'total',
        itemStyle: { color: 'transparent' },
        data: changes.map((c) => c.start),
      },
      {
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            const item = changes[params.dataIndex]
            return `${formatNumber(item.end)}${
              item.percentageChange ? `\n${item.percentageChange}%` : ''
            }`
          },
          color: isDark ? '#fff' : '#000',
        },
        data: changes.map((item) => ({
          value: item.value,
          itemStyle: item.itemStyle,
        })),
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Income Statement Waterfall ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (USD values in millions)
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
