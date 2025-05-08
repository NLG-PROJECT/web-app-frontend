import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import { useTheme } from '@/context/ThemeProvider'
import type { EChartsOption, LineSeriesOption } from 'echarts'

interface IncomeTrendsProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function IncomeTrends({ data }: IncomeTrendsProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Extract years dynamically
  const allYears = Array.from(
    new Set(
      data.flatMap((row) => Object.keys(row).filter((k) => /^\d{4}$/.test(k))),
    ),
  ).sort((a, b) => Number(a) - Number(b)) // ascending for timeline

  const yearRangeLabel = `${allYears[0]}–${allYears[allYears.length - 1]}`

  // Metric definitions
  const metrics = [
    {
      name: 'Revenue',
      key: 'Net revenue',
      color: isDark ? '#10b981' : '#059669',
    },
    {
      name: 'Gross Profit',
      key: 'Gross margin',
      color: isDark ? '#6366f1' : '#4f46e5',
    },
    {
      name: 'Operating Income',
      key: 'Operating income',
      color: isDark ? '#f59e0b' : '#d97706',
    },
    {
      name: 'Net Income',
      key: 'Net income',
      color: isDark ? '#8b5cf6' : '#7c3aed',
    },
  ]

  // Format numbers as USD in millions
  const formatNumber = (val: number) =>
    `$${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)}M`

  // Build series for each metric
  const series: LineSeriesOption[] = metrics.map((metric) => {
    const values = allYears.map((year) => {
      const row = data.find(
        (d) => d.item.toLowerCase() === metric.key.toLowerCase(),
      )
      const val = row?.[year]
      return [Number(year), typeof val === 'number' ? val : 0]
    })

    return {
      name: metric.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: metric.color,
      },
      itemStyle: {
        color: metric.color,
        borderColor: isDark ? '#1f2937' : '#fff',
        borderWidth: 2,
      },
      emphasis: {
        focus: 'series',
        scale: 1.1,
        itemStyle: {
          borderWidth: 3,
        },
      },
      areaStyle: {
        opacity: 0.2,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: metric.color + '20' },
            { offset: 1, color: 'transparent' },
          ],
        },
      },
      data: values,
    }
  })

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(255, 255, 255, 0.9)',
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Inter, sans-serif',
      },
      formatter: (params: any) => {
        const year = params[0].data[0]
        let result = `<div><strong>Year ${year}</strong></div>`
        params.forEach((param: any) => {
          result += `
            <div style="margin-top:4px;">
              <span style="color:${param.color}">${param.seriesName}:</span>
              <span style="margin-left:8px;">${formatNumber(
                param.data[1],
              )}</span>
            </div>`
        })
        return result
      },
    },
    legend: {
      data: metrics.map((m) => m.name),
      top: 0,
      textStyle: {
        color: isDark ? '#888' : '#444',
        fontFamily: 'Inter, sans-serif',
      },
      itemGap: 20,
      icon: 'circle',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      min: Number(allYears[0]),
      max: Number(allYears[allYears.length - 1]),
      interval: 1,
      axisLabel: {
        formatter: '{value}',
        color: isDark ? '#aaa' : '#555',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: formatNumber,
        color: isDark ? '#aaa' : '#555',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
    },
    series,
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Income Statement Trends ({yearRangeLabel})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (USD values shown in millions)
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
