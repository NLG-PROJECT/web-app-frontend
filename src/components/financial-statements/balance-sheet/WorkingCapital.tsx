import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface WorkingCapitalProps {
  assets: {
    item: string
    [key: string]: string | number | null
  }[]
  liabilities: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function WorkingCapital({ assets, liabilities }: WorkingCapitalProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const getLatestYear = () => {
    if (assets.length === 0 && liabilities.length === 0) return ''
    const source = assets.length > 0 ? assets[0] : liabilities[0]
    const years = Object.keys(source)
      .filter((key) => key !== 'item')
      .sort()
    return years[years.length - 1]
  }

  const latestYear = getLatestYear()

  const abbreviate = (text: string) => {
    const clean = text.replace(/[^a-zA-Z0-9 ]/g, '')
    const words = clean.split(/\s+/).filter(Boolean)
    const abbr = words
      .map((w) => w[0])
      .join('')
      .toUpperCase()
    return abbr.length > 7 ? abbr.slice(0, 7) : abbr
  }

  const extractValidEntries = (
    dataset: { item: string; [key: string]: string | number | null }[],
  ) => {
    return dataset
      .map((entry) => {
        const value = entry[latestYear]
        const full = entry.item
        const abbr = abbreviate(full)
        return {
          full,
          abbr,
          value: typeof value === 'number' && value > 0 ? value : null,
        }
      })
      .filter((e) => e.value !== null) as {
      full: string
      abbr: string
      value: number
    }[]
  }

  const assetEntries = extractValidEntries(assets)
  const liabilityEntries = extractValidEntries(liabilities)

  const abbrToFullMap = Object.fromEntries([
    ...assetEntries.map((e) => [e.abbr, e.full]),
    ...liabilityEntries.map((e) => [e.abbr, e.full]),
  ])

  const nodes = [
    ...assetEntries.map((e) => ({
      name: `${e.abbr} - ${e.value}M`,
      value: e.value,
    })),
    ...liabilityEntries.map((e) => ({
      name: `${e.abbr} - ${e.value}M`,
      value: e.value,
    })),
  ]

  const links = [
    ...assetEntries.map((e) => ({
      source: `${e.abbr} - ${e.value}M`,
      target: `${liabilityEntries[0]?.abbr} - ${liabilityEntries[0]?.value}M`,
      value: e.value,
    })),
    ...liabilityEntries.slice(1).map((e) => ({
      source: `${liabilityEntries[0]?.abbr} - ${liabilityEntries[0]?.value}M`,
      target: `${e.abbr} - ${e.value}M`,
      value: e.value,
    })),
  ]

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
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
        const abbr = params.name.split(' - ')[0]
        const fullName = abbrToFullMap[abbr] || abbr
        return `${fullName}: ${params.value}M`
      },
    },
    series: [
      {
        type: 'sankey',
        data: nodes,
        links: links,
        emphasis: {
          focus: 'adjacency',
        },
        levels: [
          {
            depth: 0,
            itemStyle: { color: isDark ? '#10b981' : '#059669' },
            lineStyle: { color: 'source', opacity: 0.6 },
          },
          {
            depth: 1,
            itemStyle: { color: isDark ? '#6366f1' : '#4f46e5' },
            lineStyle: { color: 'source', opacity: 0.4 },
          },
          {
            depth: 2,
            itemStyle: { color: isDark ? '#ef4444' : '#dc2626' },
            lineStyle: { color: 'source', opacity: 0.2 },
          },
        ],
        lineStyle: { curveness: 0.5, opacity: 0.4 },
        label: {
          color: isDark ? '#fff' : '#000',
          fontFamily: 'Inter, sans-serif',
          formatter: (params: any) => `${params.name}`,
        },
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-col space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Asset & Liability Flow ({latestYear})
        </CardTitle>
        <div className="text-lg font-semibold text-center mb-6 text-muted-foreground">
          Relationship between key assets and liabilities.
        </div>
      </CardHeader>
      <CardContent>
        <ReactECharts
          option={option}
          style={{ height: `${150 + nodes.length * 12}px` }}
          theme={isDark ? 'dark' : undefined}
        />
      </CardContent>
    </Card>
  )
}
