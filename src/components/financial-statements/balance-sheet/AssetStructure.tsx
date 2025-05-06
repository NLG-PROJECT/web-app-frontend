import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption, SunburstSeriesOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface AssetStructureProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function AssetStructure({ data }: AssetStructureProps) {
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

  const processData = () => {
    const findValue = (itemName: string) => {
      const item = data.find((d) => d.item === itemName)
      return item ? (item[latestYear] as number) : 0
    }

    const currentAssetsColors = isDark
      ? ['#22c55e', '#f97316', '#ef4444', '#eab308']
      : ['#16a34a', '#ea580c', '#dc2626', '#ca8a04']

    const nonCurrentAssetsColors = isDark
      ? ['#38bdf8', '#a78bfa', '#f472b6', '#60a5fa']
      : ['#0ea5e9', '#8b5cf6', '#ec4899', '#3b82f6']

    return {
      name: 'Total Assets',
      value: findValue('Total assets'),
      children: [
        {
          name: 'Current Assets',
          value: findValue('Total current assets'),
          children: [
            {
              name: 'Cash & Equivalents',
              value: findValue('Cash and cash equivalents'),
              itemStyle: { color: currentAssetsColors[0] },
            },
            {
              name: 'Accounts Receivable',
              value: findValue('Accounts receivable, net'),
              itemStyle: { color: currentAssetsColors[1] },
            },
            {
              name: 'Inventories',
              value: findValue('Inventories'),
              itemStyle: { color: currentAssetsColors[2] },
            },
            {
              name: 'Other Current',
              value: findValue('Other current assets'),
              itemStyle: { color: currentAssetsColors[3] },
            },
          ],
        },
        {
          name: 'Non-Current Assets',
          value:
            findValue('Property, plant, and equipment, net') +
            findValue('Equity investments') +
            findValue('Goodwill') +
            findValue('Identified intangible assets, net') +
            findValue('Other long-term assets'),
          children: [
            {
              name: 'Property & Equipment',
              value: findValue('Property, plant, and equipment, net'),
              itemStyle: { color: nonCurrentAssetsColors[0] },
            },
            {
              name: 'Equity Investments',
              value: findValue('Equity investments'),
              itemStyle: { color: nonCurrentAssetsColors[1] },
            },
            {
              name: 'Goodwill & Intangibles',
              value:
                findValue('Goodwill') +
                findValue('Identified intangible assets, net'),
              itemStyle: { color: nonCurrentAssetsColors[2] },
            },
            {
              name: 'Other Long-term Assets',
              value: findValue('Other long-term assets'),
              itemStyle: { color: nonCurrentAssetsColors[3] },
            },
          ],
        },
      ],
    }
  }

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
      trigger: 'item',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      textStyle: {
        color: isDark ? '#e5e5e5' : '#111827',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
      },
      borderColor: isDark ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      formatter: (params: any) =>
        `${params.name}: ${formatNumber(params.value)}`,
    },
    series: [
      ({
        name: 'Asset Structure',
        type: 'sunburst',
        data: [processData()],
        radius: ['5%', '90%'],
        center: ['50%', '50%'],
        sort: null,
        emphasis: {
          focus: 'ancestor',
        },
        label: {
          rotate: 'radial',
          fontSize: 14,
          fontWeight: 'bold',
          color: isDark ? '#ffffff' : '#111827',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
          borderRadius: 4,
          padding: [4, 8],
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#ffffff',
        },
      } as unknown) as SunburstSeriesOption,
    ],
  }

  return (
    <Card className="border-none rounded-2xl bg-gradient-to-br from-background via-background to-muted/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Asset Structure ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold text-center mb-6 text-muted-foreground">
          Hierarchical breakdown of company assets using an interactive sunburst
          chart
        </div>
        <ReactECharts
          option={option}
          style={{ height: '600px' }}
          theme={isDark ? 'dark' : undefined}
        />
      </CardContent>
    </Card>
  )
}
