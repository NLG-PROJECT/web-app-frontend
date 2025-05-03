import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { processFinancialData } from '@/utils/financialData'
import { useTheme } from '@/context/ThemeProvider'

interface EPSAnalysisProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function EPSAnalysis({ data }: EPSAnalysisProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { years, data: processedData } = processFinancialData(data)

  // Get EPS and share data
  const basicEPS = years.map((year) => {
    const item = processedData.find((item) => item.item === 'Basic')
    return item?.[year] as number
  })

  const dilutedEPS = years.map((year) => {
    const item = processedData.find((item) => item.item === 'Diluted')
    return item?.[year] as number
  })

  const shareCount = years.map((year) => {
    const item = processedData.find((item) => item.item === 'Basic')
    return item?.[year] as number
  })

  // Format numbers for display
  const formatEPS = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatShares = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value)
  }

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
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
        const year = years[params[0].dataIndex]
        let result = `<div class="font-medium">Year ${year}</div>`
        params.forEach((param: any) => {
          const value = param.seriesName.includes('EPS')
            ? formatEPS(param.value)
            : formatShares(param.value)
          result += `
            <div class="flex items-center gap-2 mt-1">
              <span style="color: ${param.color}">${param.seriesName}</span>
              <span>${value}</span>
            </div>`
        })
        return result
      },
    },
    legend: {
      data: ['Basic EPS', 'Diluted EPS', 'Share Count'],
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
    yAxis: [
      {
        type: 'value',
        name: 'EPS',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => formatEPS(value),
          color: isDark ? '#888' : '#666',
          fontFamily: 'Inter, sans-serif',
        },
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      {
        type: 'value',
        name: 'Shares',
        position: 'right',
        axisLabel: {
          formatter: (value: number) => formatShares(value),
          color: isDark ? '#888' : '#666',
          fontFamily: 'Inter, sans-serif',
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: 'Basic EPS',
        type: 'line',
        data: basicEPS,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: isDark ? '#10b981' : '#059669',
        },
        itemStyle: {
          color: isDark ? '#10b981' : '#059669',
          borderWidth: 2,
          borderColor: isDark ? '#1f2937' : '#ffffff',
        },
      },
      {
        name: 'Diluted EPS',
        type: 'line',
        data: dilutedEPS,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: isDark ? '#6366f1' : '#4f46e5',
        },
        itemStyle: {
          color: isDark ? '#6366f1' : '#4f46e5',
          borderWidth: 2,
          borderColor: isDark ? '#1f2937' : '#ffffff',
        },
      },
      {
        name: 'Share Count',
        type: 'bar',
        yAxisIndex: 1,
        data: shareCount,
        barWidth: '20%',
        itemStyle: {
          color: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.2)',
        },
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Earnings Per Share Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Basic vs Diluted EPS with Share Count Impact)
        </div>
        <ReactECharts
          option={option}
          style={{ height: '400px' }}
          theme={isDark ? 'dark' : undefined}
        />
      </CardContent>
    </Card>
  )
}
