import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface CashFlowMultiBarChartProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

const COMMON_METRICS = [
  'Net cash provided by operating activities',
  'Net cash used for investing activities',
  'Net cash provided by (used for) financing activities',
  'Net increase (decrease) in cash and cash equivalents',
]

function normalizeItemName(item: string) {
  return item
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .toLowerCase()
}

export default function CashFlowAnalysis({ data }: CashFlowMultiBarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const filtered = COMMON_METRICS.map((label) => {
    const match = data.find(
      (d) => normalizeItemName(d.item) === normalizeItemName(label),
    )
    return {
      name: label,
      values: match
        ? Object.entries(match)
            .filter(([k]) => k !== 'item')
            .map(([year, val]) => ({ year, value: Number(val ?? 0) }))
        : [],
    }
  })

  const allYears = Array.from(
    new Set(filtered.flatMap((d) => d.values.map((v) => v.year))).values(),
  ).sort((a, b) => Number(a) - Number(b))

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: COMMON_METRICS,
      textStyle: {
        color: isDark ? '#aaa' : '#333',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: allYears,
      axisLabel: {
        color: isDark ? '#aaa' : '#333',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
        color: isDark ? '#aaa' : '#333',
      },
    },
    series: filtered.map((metric) => ({
      name: metric.name,
      type: 'bar',
      stack: undefined,
      emphasis: {
        focus: 'series',
      },
      data: allYears.map((year) => {
        const found = metric.values.find((v) => v.year === year)
        return found?.value ?? 0
      }),
    })),
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Key Cash Flow Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold text-center mb-6 text-foreground">
          Comparison of key cash flow components across years (in millions USD)
        </div>
        <ReactECharts
          option={option}
          style={{ height: 500 }}
          theme={isDark ? 'dark' : undefined}
        />
      </CardContent>
    </Card>
  )
}
