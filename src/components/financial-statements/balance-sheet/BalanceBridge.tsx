import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface BalanceBridgeProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function BalanceBridge({ data }: BalanceBridgeProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Get years from the data
  const getYears = () => {
    if (data.length === 0) return []
    const firstItem = data[0]
    return Object.keys(firstItem)
      .filter((key) => key !== 'item')
      .sort()
  }

  const years = getYears()

  // Process data for bridge chart
  const processData = () => {
    const findValue = (itemName: string, year: string) => {
      const item = data.find((d) => d.item === itemName)
      return item ? (item[year] as number) : 0
    }

    const categories = ['Total Assets', 'Total Liabilities', 'Total Equity']

    const seriesData = years.map((year) => {
      return [
        findValue('Total assets', year),
        findValue('Total liabilities', year),
        findValue("Total shareholders' equity", year),
      ]
    })

    return { categories, seriesData }
  }

  const { categories, seriesData } = processData()

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
      padding: [8, 12],
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Inter, sans-serif',
      },
      formatter: (params: any) => {
        const year = years[params[0].dataIndex]
        return `
          <div style="font-weight: bold">${year}</div>
          <div>Total Assets: $${(params[0].value / 1000000).toFixed(2)}M</div>
          <div>Total Liabilities: $${(params[1].value / 1000000).toFixed(
            2,
          )}M</div>
          <div>Total Equity: $${(params[2].value / 1000000).toFixed(2)}M</div>
        `
      },
    },
    legend: {
      data: categories,
      textStyle: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Inter, sans-serif',
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
      data: years,
      axisLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        },
      },
      axisTick: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        },
      },
      axisLabel: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Inter, sans-serif',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        },
      },
      axisTick: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        },
      },
      splitLine: {
        lineStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      axisLabel: {
        color: isDark ? '#fff' : '#000',
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => `$${(value / 1000000).toFixed(0)}M`,
      },
    },
    series: categories.map((category, index) => ({
      name: category,
      type: 'line',
      stack: 'total',
      areaStyle: {
        opacity: 0.3,
      },
      emphasis: {
        focus: 'series',
      },
      data: seriesData.map((yearData) => yearData[index]),
      lineStyle: {
        width: 2,
      },
    })),
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Balance Sheet Bridge Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Changes in balance sheet items over time)
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
