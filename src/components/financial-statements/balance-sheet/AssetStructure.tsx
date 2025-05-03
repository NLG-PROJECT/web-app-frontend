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

  // Process data for sunburst chart
  const processData = () => {
    const findValue = (itemName: string) => {
      const item = data.find((d) => d.item === itemName)
      return item ? (item[latestYear] as number) : 0
    }

    // Modern color palettes with material design influence
    const currentAssetsColors = isDark
      ? ['#7582EB', '#9575CD', '#EC407A', '#EF5350', '#FF7043', '#FFB74D']
      : ['#3F51B5', '#673AB7', '#E91E63', '#F44336', '#FF5722', '#FF9800']

    const nonCurrentAssetsColors = isDark
      ? ['#4DB6AC', '#4FC3F7', '#64B5F6', '#7986CB']
      : ['#009688', '#03A9F4', '#2196F3', '#3F51B5']

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
              itemStyle: {
                color: currentAssetsColors[0],
              },
            },
            {
              name: 'Marketable Securities',
              value: findValue('Marketable securities'),
              itemStyle: {
                color: currentAssetsColors[1],
              },
            },
            {
              name: 'Accounts Receivable',
              value: findValue('Accounts receivable, net'),
              itemStyle: {
                color: currentAssetsColors[2],
              },
            },
            {
              name: 'Inventories',
              value: findValue('Inventories'),
              itemStyle: {
                color: currentAssetsColors[3],
              },
            },
            {
              name: 'Other Current',
              value: findValue('Other current assets'),
              itemStyle: {
                color: currentAssetsColors[4],
              },
            },
          ],
        },
        {
          name: 'Non-Current Assets',
          value: findValue('Total non-current assets'),
          children: [
            {
              name: 'Long-term Securities',
              value: findValue('Marketable securities'),
              itemStyle: {
                color: nonCurrentAssetsColors[0],
              },
            },
            {
              name: 'Property & Equipment',
              value: findValue('Property, plant and equipment, net'),
              itemStyle: {
                color: nonCurrentAssetsColors[1],
              },
            },
            {
              name: 'Other Non-Current',
              value: findValue('Other non-current assets'),
              itemStyle: {
                color: nonCurrentAssetsColors[2],
              },
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

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark
        ? 'rgba(38, 38, 38, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? 'rgba(82, 82, 82, 0.2)' : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      padding: [12, 16],
      borderRadius: 12,
      textStyle: {
        color: isDark ? '#e5e5e5' : '#171717',
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
      },
      formatter: (params: any) => {
        const value = formatNumber(params.value)
        const percent = formatPercent(
          params.treePathInfo[params.treePathInfo.length - 2]?.value
            ? (params.value /
                params.treePathInfo[params.treePathInfo.length - 2].value) *
                100
            : 100,
        )
        return `
          <div class="font-medium text-base mb-2">${params.name}</div>
          <div class="space-y-1">
            <div class="flex items-center justify-between gap-4">
              <span class="opacity-75">Value:</span>
              <span class="font-medium">${value}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="opacity-75">% of Parent:</span>
              <span class="font-medium">${percent}</span>
            </div>
          </div>
        `
      },
      extraCssText: isDark
        ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);'
        : 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);',
    },
    series: [
      {
        name: 'Asset Structure',
        type: 'sunburst',
        data: [processData()],
        radius: ['0%', '90%'],
        center: ['50%', '50%'],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        itemStyle: {
          borderColor: isDark ? 'rgba(38, 38, 38, 0.8)' : '#ffffff',
          borderWidth: 1,
          borderRadius: 4,
        },
        label: {
          show: true,
          rotate: 'radial',
          color: isDark ? '#ffffff' : '#171717',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          lineHeight: 16,
          padding: [4, 8],
          backgroundColor: isDark
            ? 'rgba(0, 0, 0, 0.3)'
            : 'rgba(255, 255, 255, 0.7)',
          borderRadius: 4,
          formatter: (params: any) => {
            const value = formatNumber(params.value)
            // Check if this is a major category (Current Assets or Non-Current Assets)
            const isMajorCategory = [
              'Current Assets',
              'Non-Current Assets',
            ].includes(params.name)
            if (isMajorCategory) {
              return `{major|${params.name}}\n{value|${value}}`
            }
            return `{name|${params.name}}\n{value|${value}}`
          },
          rich: {
            major: {
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 20,
              color: isDark ? '#ffffff' : '#171717',
              fontFamily: 'Inter, sans-serif',
              padding: [4, 8],
              backgroundColor: isDark
                ? 'rgba(0, 0, 0, 0.5)'
                : 'rgba(255, 255, 255, 0.9)',
              borderRadius: 4,
            },
            name: {
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 16,
              color: isDark ? '#ffffff' : '#171717',
              fontFamily: 'Inter, sans-serif',
            },
            value: {
              fontSize: 10,
              fontWeight: 500,
              lineHeight: 14,
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              fontFamily: 'Inter, sans-serif',
            },
          },
        },
        emphasis: {
          focus: 'ancestor',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
          },
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.5)'
              : 'rgba(255, 255, 255, 0.9)',
          },
        },
        levels: [
          {
            r0: '0%',
            r: '30%',
            itemStyle: {
              borderWidth: 0,
            },
            label: {
              rotate: 'none',
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          {
            r0: '30%',
            r: '60%',
            itemStyle: {
              borderWidth: 1,
              borderRadius: 4,
            },
            emphasis: {
              itemStyle: {
                borderWidth: 2,
              },
            },
          },
          {
            r0: '60%',
            r: '90%',
            itemStyle: {
              borderWidth: 1,
              borderRadius: 4,
            },
            emphasis: {
              itemStyle: {
                borderWidth: 2,
              },
            },
          },
        ],
      } as SunburstSeriesOption,
    ],
  }

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-background via-background to-muted/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Asset Structure ({latestYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-6 text-muted-foreground">
          Hierarchical breakdown of assets showing the composition and relative
          sizes of different asset categories
        </div>
        <ReactECharts
          option={option}
          style={{ height: '600px' }}
          theme={isDark ? 'dark' : undefined}
          opts={{ renderer: 'canvas' }}
        />
      </CardContent>
    </Card>
  )
}
