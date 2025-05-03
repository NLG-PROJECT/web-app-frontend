import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useTheme } from '@/context/ThemeProvider'

interface WorkingCapitalProps {
  data: {
    item: string
    [key: string]: string | number | null
  }[]
}

export function WorkingCapital({ data }: WorkingCapitalProps) {
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

  // Process data for Sankey diagram
  const processData = () => {
    const findValue = (itemName: string) => {
      const item = data.find((d) => d.item === itemName)
      return item ? (item[latestYear] as number) : 0
    }

    // Current Assets
    const cash = findValue('Cash and cash equivalents')
    const marketableSecurities = findValue('Marketable securities')
    const accountsReceivable = findValue('Accounts receivable, net')
    const inventories = findValue('Inventories')
    const otherCurrentAssets = findValue('Other current assets')

    // Current Liabilities
    const accountsPayable = findValue('Accounts payable')
    const otherCurrentLiabilities = findValue('Other current liabilities')
    const deferredRevenue = findValue('Deferred revenue')
    const commercialPaper = findValue('Commercial paper')
    const currentTermDebt = findValue('Term debt')

    return {
      nodes: [
        // Current Assets
        { name: 'Current Assets' },
        { name: 'Cash', value: cash },
        { name: 'Marketable Securities', value: marketableSecurities },
        { name: 'Accounts Receivable', value: accountsReceivable },
        { name: 'Inventories', value: inventories },
        { name: 'Other Current Assets', value: otherCurrentAssets },

        // Working Capital
        { name: 'Working Capital' },

        // Current Liabilities
        { name: 'Current Liabilities' },
        { name: 'Accounts Payable', value: accountsPayable },
        { name: 'Other Current Liabilities', value: otherCurrentLiabilities },
        { name: 'Deferred Revenue', value: deferredRevenue },
        { name: 'Commercial Paper', value: commercialPaper },
        { name: 'Current Term Debt', value: currentTermDebt },
      ],
      links: [
        // Current Assets to Working Capital
        { source: 'Cash', target: 'Working Capital', value: cash },
        {
          source: 'Marketable Securities',
          target: 'Working Capital',
          value: marketableSecurities,
        },
        {
          source: 'Accounts Receivable',
          target: 'Working Capital',
          value: accountsReceivable,
        },
        {
          source: 'Inventories',
          target: 'Working Capital',
          value: inventories,
        },
        {
          source: 'Other Current Assets',
          target: 'Working Capital',
          value: otherCurrentAssets,
        },

        // Working Capital to Current Liabilities
        {
          source: 'Working Capital',
          target: 'Accounts Payable',
          value: accountsPayable,
        },
        {
          source: 'Working Capital',
          target: 'Other Current Liabilities',
          value: otherCurrentLiabilities,
        },
        {
          source: 'Working Capital',
          target: 'Deferred Revenue',
          value: deferredRevenue,
        },
        {
          source: 'Working Capital',
          target: 'Commercial Paper',
          value: commercialPaper,
        },
        {
          source: 'Working Capital',
          target: 'Current Term Debt',
          value: currentTermDebt,
        },
      ],
    }
  }

  const { nodes, links } = processData()

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
            itemStyle: {
              color: isDark ? '#10b981' : '#059669',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6,
            },
          },
          {
            depth: 1,
            itemStyle: {
              color: isDark ? '#6366f1' : '#4f46e5',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.4,
            },
          },
          {
            depth: 2,
            itemStyle: {
              color: isDark ? '#ef4444' : '#dc2626',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.2,
            },
          },
        ],
        lineStyle: {
          curveness: 0.5,
          opacity: 0.4,
        },
        label: {
          color: isDark ? '#fff' : '#000',
          fontFamily: 'Inter, sans-serif',
          formatter: '{b}\n{c}M',
        },
      },
    ],
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Working Capital Flow ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (Flow of current assets to current liabilities)
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
