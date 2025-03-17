import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from 'lucide-react'
import { motion } from 'framer-motion'

export function MarketAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="size-5 text-primary" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Market size, growth trends, competitive landscape, and market
            positioning analysis.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
