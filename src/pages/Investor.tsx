import { LineChart, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Investor() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Smart Investment Decisions</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Make informed investment choices with our AI-powered financial report
          analysis
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <LineChart className="size-12 text-primary mb-4" />
            <CardTitle>Financial Analysis</CardTitle>
            <CardDescription>
              Comprehensive analysis of financial reports and market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Real-time market data integration</li>
              <li>• Historical performance tracking</li>
              <li>• Risk assessment metrics</li>
              <li>• Custom report generation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Building2 className="size-12 text-primary mb-4" />
            <CardTitle>Company Insights</CardTitle>
            <CardDescription>
              Deep dive into company performance and potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Financial health indicators</li>
              <li>• Growth trajectory analysis</li>
              <li>• Competitive positioning</li>
              <li>• Industry benchmarking</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">AI</span>
            </div>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Advanced machine learning algorithms for smarter decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Natural language processing</li>
              <li>• Sentiment analysis</li>
              <li>• Pattern recognition</li>
              <li>• Predictive analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
