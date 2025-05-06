import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption, GaugeSeriesOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface BalanceSheetHealthProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function BalanceSheetHealth({ data }: BalanceSheetHealthProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const getLatestYear = () => {
    if (data.length === 0) return ''
    const firstItem = data[0]
    const years = Object.keys(firstItem)
      .filter((key) => key !== 'item')
      .sort()
    return years[years.length - 1]
  }

  const latestYear = getLatestYear()

  const findValue = (itemName: string): number => {
    const item = data.find((d) => d.item === itemName)
    return item ? (item[latestYear] as number) || 0 : 0
  }

  const currentAssets = findValue('Total current assets')
  const currentLiabilities = findValue('Total current liabilities')
  const totalAssets = findValue('Total assets')
  const totalLiabilities = findValue('Total liabilities')
  const shareholdersEquity = findValue("Total shareholders' equity")

  const ratios = {
    currentRatio: currentLiabilities ? currentAssets / currentLiabilities : 0,
    debtToEquity: shareholdersEquity
      ? totalLiabilities / shareholdersEquity
      : 0,
    assetCoverage: totalLiabilities ? totalAssets / totalLiabilities : 0,
  }

  const ratioConfigs = [
    {
      key: 'currentRatio',
      name: 'Current Ratio',
      value: ratios.currentRatio,
      description: 'Ability to cover short-term obligations.',
      min: 0,
      max: 3,
      thresholds: { good: 2, warning: 1.5 },
      isInverse: false,
    },
    {
      key: 'debtToEquity',
      name: 'Debt to Equity',
      value: ratios.debtToEquity,
      description: 'Financial leverage risk.',
      min: 0,
      max: 3,
      thresholds: { good: 1, warning: 2 },
      isInverse: true,
    },
    {
      key: 'assetCoverage',
      name: 'Asset Coverage',
      value: ratios.assetCoverage,
      description: 'Assets to liabilities ratio.',
      min: 0,
      max: 2,
      thresholds: { good: 1.5, warning: 1.2 },
      isInverse: false,
    },
  ]

  const getStatusColor = (
    value: number,
    thresholds: any,
    isInverse: boolean,
  ) => {
    if (isInverse) {
      if (value <= thresholds.good)
        return { status: 'Healthy', color: isDark ? '#22c55e' : '#16a34a' }
      if (value <= thresholds.warning)
        return { status: 'Warning', color: isDark ? '#f97316' : '#ea580c' }
      return { status: 'Critical', color: isDark ? '#ef4444' : '#dc2626' }
    } else {
      if (value >= thresholds.good)
        return { status: 'Healthy', color: isDark ? '#22c55e' : '#16a34a' }
      if (value >= thresholds.warning)
        return { status: 'Warning', color: isDark ? '#f97316' : '#ea580c' }
      return { status: 'Critical', color: isDark ? '#ef4444' : '#dc2626' }
    }
  }

  const getGaugeSeries = (
    value: number,
    config: any,
    color: string,
  ): GaugeSeriesOption => {
    const thresholds: [number, string][] = [
      [config.thresholds.warning / config.max, isDark ? '#ef4444' : '#dc2626'],
      [config.thresholds.good / config.max, isDark ? '#f97316' : '#ea580c'],
      [1, isDark ? '#22c55e' : '#16a34a'],
    ]

    const sortedThresholds = thresholds.sort((a, b) => {
      const aVal = typeof a[0] === 'number' ? a[0] : 0
      const bVal = typeof b[0] === 'number' ? b[0] : 0
      return config.isInverse ? bVal - aVal : aVal - bVal
    }) as [number, string][]

    return {
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: config.min,
      max: config.max,
      radius: '80%',
      splitNumber: 4,
      itemStyle: {
        color,
      },
      progress: {
        show: true,
        roundCap: true,
        width: 10,
      },
      pointer: {
        show: true,
        length: '60%',
        width: 4,
        itemStyle: {
          color,
        },
      },
      axisLine: {
        lineStyle: {
          width: 10,
          color: sortedThresholds,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      data: [{ value }],
      title: { show: false },
      detail: { show: false },
    }
  }

  return (
    <Card className="border-none rounded-2xl bg-gradient-to-br from-background via-background to-muted/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Balance Sheet Health ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold text-center mb-6 text-muted-foreground">
          Key financial ratios and indicators of balance sheet strength
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ratioConfigs.map((config) => {
            const { status, color } = getStatusColor(
              config.value,
              config.thresholds,
              config.isInverse,
            )
            const gaugeOption: EChartsOption = {
              series: [getGaugeSeries(config.value, config, color)],
            }

            return (
              <div
                key={config.key}
                className="flex flex-col items-center bg-card rounded-xl px-4 py-8"
                style={{ overflow: 'visible', minHeight: 320 }}
              >
                <div className="text-3xl font-bold mb-2" style={{ color }}>
                  {Number.isFinite(config.value)
                    ? config.value.toFixed(2)
                    : 'N/A'}
                </div>
                <div className="w-full flex flex-col items-center">
                  <ReactECharts
                    option={gaugeOption}
                    style={{ height: '240px', width: '100%' }}
                    theme={isDark ? 'dark' : undefined}
                  />
                </div>
                <div className="mt-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: color + '22', color }}
                  >
                    {status}
                  </span>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-base font-semibold mb-1">
                    {config.name}
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    {config.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
