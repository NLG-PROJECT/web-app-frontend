import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption, GaugeSeriesOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'
import { cn } from '@/lib/utils'

interface BalanceSheetHealthProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

interface RatioConfig {
  name: string
  value: number
  description: string
  min: number
  max: number
  thresholds: { good: number; warning: number }
  isInverse?: boolean
}

type RatioConfigs = {
  [key: string]: RatioConfig
}

export function BalanceSheetHealth({ data }: BalanceSheetHealthProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Get latest year from the data
  const getLatestYear = () => {
    if (data.length === 0) return ''
    const firstItem = data[0]
    const years = Object.keys(firstItem)
      .filter((key) => key !== 'item')
      .sort()
    return years[years.length - 1]
  }

  const latestYear = getLatestYear()

  // Calculate key ratios
  const calculateRatios = () => {
    const findValue = (itemName: string) => {
      const item = data.find((d) => d.item === itemName)
      return item ? (item[latestYear] as number) : 0
    }

    const currentAssets = findValue('Total current assets')
    const currentLiabilities = findValue('Total current liabilities')
    const totalAssets = findValue('Total assets')
    const totalLiabilities = findValue('Total liabilities')
    const shareholdersEquity = findValue("Total shareholders' equity")

    return {
      currentRatio: currentAssets / currentLiabilities,
      debtToEquity: totalLiabilities / shareholdersEquity,
      assetCoverage: totalAssets / totalLiabilities,
    }
  }

  const ratios = calculateRatios()

  const createGaugeOption = (
    value: number,
    name: string,
    min: number,
    max: number,
    thresholds: { good: number; warning: number },
    isInverse = false,
    statusColor: string,
  ): EChartsOption => {
    // Clamp value to min/max for display
    let displayValue = value
    if (!Number.isFinite(displayValue)) displayValue = min
    if (displayValue < min) displayValue = min
    if (displayValue > max) displayValue = max
    // Pointer only hidden for NaN/Infinity
    const showPointer = Number.isFinite(value)
    // Calculate splitNumber for nice ticks (prefer 4 or 5 for small ranges)
    const range = max - min
    let splitNumber = 4
    if (range > 4) splitNumber = 5
    // Generate custom axis labels for clean, round numbers
    const tickValues: number[] = []
    for (let i = 0; i <= splitNumber; i++) {
      const v = min + i * (range / splitNumber)
      tickValues.push(Number(v.toFixed(2)))
    }
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min,
          max,
          splitNumber,
          radius: '90%',
          itemStyle: {
            color: statusColor,
            shadowColor: 'rgba(0,0,0,0.08)',
            shadowBlur: 4,
            shadowOffsetX: 1,
            shadowOffsetY: 1,
          },
          progress: {
            show: true,
            roundCap: true,
            width: 10,
          },
          pointer: {
            show: showPointer,
            length: '60%',
            width: 4,
            itemStyle: {
              color: statusColor,
            },
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 10,
              color: [
                [
                  Number(thresholds.warning) / Number(max),
                  isDark ? '#ef4444' : '#dc2626',
                ],
                [
                  Number(thresholds.good) / Number(max),
                  isDark ? '#f97316' : '#ea580c',
                ],
                [1, isDark ? '#22c55e' : '#16a34a'],
              ].sort((a, b) =>
                isInverse
                  ? Number(b[0]) - Number(a[0])
                  : Number(a[0]) - Number(b[0]),
              ) as [number, string][],
            },
          },
          anchor: {
            show: showPointer,
            showAbove: true,
            size: 12,
            itemStyle: {
              color: statusColor,
            },
          },
          axisTick: {
            distance: -15,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: isDark ? '#475569' : '#94a3b8',
            },
          },
          splitLine: {
            distance: -18,
            length: 6,
            lineStyle: {
              width: 2,
              color: isDark ? '#475569' : '#94a3b8',
            },
          },
          axisLabel: {
            distance: -8,
            color: isDark ? '#94a3b8' : '#475569',
            fontSize: 12,
            formatter: (v: number) => {
              // Only show labels for our custom tick values
              if (tickValues.includes(Number(v.toFixed(2)))) {
                // Show at most 1 decimal place, but no trailing .0
                return v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)
              }
              return ''
            },
          },
          title: {
            show: false,
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: displayValue,
              name,
            },
          ],
        },
      ],
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
    }
  }

  const ratioConfigs: RatioConfigs = {
    currentRatio: {
      name: 'Current Ratio',
      value: ratios.currentRatio,
      description:
        'Measures ability to pay short-term obligations. Higher is better.',
      min: 0,
      max: 3,
      thresholds: { good: 2, warning: 1.5 },
    },
    debtToEquity: {
      name: 'Debt to Equity',
      value: ratios.debtToEquity,
      description: 'Indicates financial leverage and risk. Lower is better.',
      min: 0,
      max: 3,
      thresholds: { good: 1, warning: 2 },
      isInverse: true,
    },
    assetCoverage: {
      name: 'Asset Coverage',
      value: ratios.assetCoverage,
      description: 'Shows asset protection for creditors. Higher is better.',
      min: 0,
      max: 2,
      thresholds: { good: 1.5, warning: 1.2 },
    },
  }

  // Helper for status and color
  const getStatusAndColor = (
    value: number,
    thresholds: { good: number; warning: number },
    isInverse = false,
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

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-background via-background to-muted/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Balance Sheet Health ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-6 text-muted-foreground">
          Key financial ratios and health indicators
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(ratioConfigs).map(([key, config]) => {
            const { status, color } = getStatusAndColor(
              config.value,
              config.thresholds,
              config.isInverse,
            )
            return (
              <div
                key={key}
                className="flex flex-col items-center bg-card rounded-xl shadow-sm p-6"
              >
                <div className="text-3xl font-bold mb-2" style={{ color }}>
                  {Number.isFinite(config.value)
                    ? config.value.toFixed(2)
                    : 'N/A'}
                </div>
                <div className="w-full flex flex-col items-center">
                  <ReactECharts
                    option={createGaugeOption(
                      config.value,
                      config.name,
                      config.min,
                      config.max,
                      config.thresholds,
                      config.isInverse,
                      color,
                    )}
                    style={{ height: '180px', width: '100%' }}
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
