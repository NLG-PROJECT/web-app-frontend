import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption, LineSeriesOption } from 'echarts'
import { processFinancialData, getKeyMetrics } from '@/utils/financialData'
import { useTheme } from '@/context/ThemeProvider'

interface IncomeTrendsProps {
  data: {
    item: string
    2024: number | null
    2023: number | null
    2022: number | null
  }[]
}

export function IncomeTrends({ data }: IncomeTrendsProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { years, data: processedData } = processFinancialData(data)

  // Get key metrics with theme-aware colors
  const metrics = [
    {
      name: 'Total Revenue',
      item: 'Total net sales',
      color: isDark ? '#10b981' : '#059669',
      areaColor: new Array(2)
        .fill(isDark ? '#10b981' : '#059669')
        .map((color, index) => ({
          offset: index,
          color: index === 0 ? color + '20' : 'transparent',
        })),
    },
    {
      name: 'Gross Profit',
      item: 'Gross margin',
      color: isDark ? '#6366f1' : '#4f46e5',
      areaColor: new Array(2)
        .fill(isDark ? '#6366f1' : '#4f46e5')
        .map((color, index) => ({
          offset: index,
          color: index === 0 ? color + '20' : 'transparent',
        })),
    },
    {
      name: 'Operating Income',
      item: 'Operating income',
      color: isDark ? '#f59e0b' : '#d97706',
      areaColor: new Array(2)
        .fill(isDark ? '#f59e0b' : '#d97706')
        .map((color, index) => ({
          offset: index,
          color: index === 0 ? color + '20' : 'transparent',
        })),
    },
    {
      name: 'Net Income',
      item: 'Net income',
      color: isDark ? '#8b5cf6' : '#7c3aed',
      areaColor: new Array(2)
        .fill(isDark ? '#8b5cf6' : '#7c3aed')
        .map((color, index) => ({
          offset: index,
          color: index === 0 ? color + '20' : 'transparent',
        })),
    },
  ]

  // Prepare data series
  const series: LineSeriesOption[] = metrics.map((metric) => {
    const data = years.map((year) => {
      const metrics = getKeyMetrics(processedData, year)
      return [
        Number(year),
        metrics[
          metric.item === 'Total net sales'
            ? 'revenue'
            : metric.item === 'Gross margin'
            ? 'grossProfit'
            : metric.item === 'Operating income'
            ? 'operatingIncome'
            : 'netIncome'
        ],
      ]
    })

    return {
      name: metric.name,
      type: 'line',
      symbol: 'circle',
      symbolSize: 8,
      smooth: true,
      lineStyle: {
        width: 3,
        color: metric.color,
      },
      itemStyle: {
        color: metric.color,
        borderWidth: 2,
        borderColor: isDark ? '#1f2937' : '#ffffff',
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
          colorStops: metric.areaColor,
        },
      },
      data,
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
        let result = `<div class="font-medium">Year ${params[0].data[0]}</div>`
        params.forEach((param: any) => {
          result += `
            <div class="flex items-center gap-2 mt-1">
              <span style="color: ${param.color}">${param.seriesName}</span>
              <span>${formatNumber(param.data[1])}</span>
            </div>`
        })
        return result
      },
    },
    legend: {
      data: metrics.map((m) => m.name),
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
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      min: Number(years[years.length - 1]),
      max: Number(years[0]),
      interval: 1,
      axisLabel: {
        formatter: '{value}',
        color: isDark ? '#888' : '#666',
        fontFamily: 'Inter, sans-serif',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
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
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      axisLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    series,
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Income Statement Trends ({years[years.length - 1]}-{years[0]})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Key metrics progression over time)
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
