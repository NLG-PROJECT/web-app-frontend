import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface IncomeStatementProps {
  data: {
    item: string
    2024: number | null
    2023: number | null
    2022: number | null
  }[]
}

const formatNumber = (num: number | null): string => {
  if (num === null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function IncomeStatement({ data }: IncomeStatementProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          CONSOLIDATED STATEMENTS OF INCOME
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center mb-4 text-muted-foreground">
          (In millions, except per share amounts)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-primary/20">
                <th className="text-left py-2 px-4">Item</th>
                <th className="text-right py-2 px-4">2024</th>
                <th className="text-right py-2 px-4">2023</th>
                <th className="text-right py-2 px-4">2022</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const isHeader =
                  row[2024] === null && row[2023] === null && row[2022] === null
                const isTotal =
                  row.item.toLowerCase().includes('total') ||
                  row.item.toLowerCase().includes('margin')

                return (
                  <tr
                    key={index}
                    className={`
                      ${isHeader ? 'font-semibold bg-muted/30' : ''}
                      ${
                        isTotal
                          ? 'font-semibold border-t border-primary/20'
                          : ''
                      }
                      hover:bg-muted/50 transition-colors
                    `}
                  >
                    <td className={`py-2 px-4 ${isHeader ? '' : 'pl-8'}`}>
                      {row.item}
                    </td>
                    <td className="text-right py-2 px-4">
                      {row[2024] !== null ? `$${formatNumber(row[2024])}` : ''}
                    </td>
                    <td className="text-right py-2 px-4">
                      {row[2023] !== null ? `$${formatNumber(row[2023])}` : ''}
                    </td>
                    <td className="text-right py-2 px-4">
                      {row[2022] !== null ? `$${formatNumber(row[2022])}` : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
