import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface LiabilityEquityFlowProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function LiabilityEquityFlow({ data }: LiabilityEquityFlowProps) {
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

  // Process data for parallel coordinates
  const processData = () => {
    const findValue = (itemName: string, year: string) => {
      const item = data.find((d) => d.item === itemName)
      return item ? (item[year] as number) : 0
    }

    const dimensions = [
      'Year',
      'Total Liabilities',
      'Total Equity',
      'Debt-to-Equity Ratio',
    ]

    const seriesData = years.map((year, idx) => {
      const totalLiabilities = findValue('Total liabilities', year)
      const totalEquity = findValue("Total shareholders' equity", year)
      const debtToEquity =
        totalEquity !== 0 ? totalLiabilities / totalEquity : 0

      // Highlight the most recent year (last in sorted years) with a custom color
      if (idx === years.length - 1) {
        return {
          value: [Number(year), totalLiabilities, totalEquity, debtToEquity],
          lineStyle: { color: '#2563eb', width: 4, opacity: 1 }, // blue, thicker
        }
      }
      return [Number(year), totalLiabilities, totalEquity, debtToEquity]
    })

    return { dimensions, seriesData }
  }

  const { dimensions, seriesData } = processData()

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
        const data = params[0].data
        return `
          <div style="font-weight: bold">${data[0]}</div>
          <div>Total Liabilities: $${(data[1] / 1000000).toFixed(2)}M</div>
          <div>Total Equity: $${(data[2] / 1000000).toFixed(2)}M</div>
          <div>Debt-to-Equity: ${data[3].toFixed(2)}</div>
        `
      },
    },
    parallelAxis: [
      { dim: 0, name: 'Year', type: 'value' },
      {
        dim: 1,
        name: 'Total Liabilities',
        type: 'value',
        nameLocation: 'start',
        nameGap: 20,
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000000).toFixed(0)}M`,
        },
      },
      {
        dim: 2,
        name: 'Total Equity',
        type: 'value',
        nameLocation: 'start',
        nameGap: 20,
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000000).toFixed(0)}M`,
        },
      },
      {
        dim: 3,
        name: 'Debt-to-Equity',
        type: 'value',
        nameLocation: 'start',
        nameGap: 20,
      },
    ],
    parallel: {
      left: '5%',
      right: '15%',
      bottom: '10%',
      top: '10%',
      parallelAxisDefault: {
        type: 'value',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          color: isDark ? '#fff' : '#000',
          fontFamily: 'Inter, sans-serif',
        },
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
      },
    },
    series: [
      {
        type: 'parallel',
        lineStyle: {
          width: 2,
          opacity: 0.7,
        },
        data: seriesData,
        emphasis: {
          lineStyle: {
            width: 3,
            opacity: 1,
          },
        },
        progressive: 200,
        smooth: true,
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Liability & Equity Flow Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Parallel coordinates showing the relationship between liabilities and
          equity over time)
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
