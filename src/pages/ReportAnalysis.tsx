import { useState } from 'react'
import { ReportChat } from '@/components/ReportChat'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function ReportAnalysis() {
  const [currentSection, setCurrentSection] = useState('executive-summary')
  const [isChatOpen, setIsChatOpen] = useState(true)

  return (
    <div className="flex-1 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Main Content Area */}
        <div
          className={`h-full transition-all duration-300 ${
            isChatOpen ? 'mr-[400px]' : ''
          }`}
        >
          <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Report Analysis</h1>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageSquare className="size-4" />
              </Button>
            </div>

            <Tabs value={currentSection} onValueChange={setCurrentSection}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="executive-summary">
                  Executive Summary
                </TabsTrigger>
                <TabsTrigger value="financial-metrics">
                  Financial Metrics
                </TabsTrigger>
                <TabsTrigger value="valuation">Valuation</TabsTrigger>
                <TabsTrigger value="market-analysis">
                  Market Analysis
                </TabsTrigger>
                <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
                <TabsTrigger value="team">Team & Strategy</TabsTrigger>
              </TabsList>

              <TabsContent value="executive-summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add executive summary content here */}
                    <p>Loading executive summary...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial-metrics">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add financial metrics content here */}
                    <p>Loading financial metrics...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="valuation">
                <Card>
                  <CardHeader>
                    <CardTitle>Valuation & Investor Returns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add valuation content here */}
                    <p>Loading valuation data...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market-analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Market & Competitive Landscape</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add market analysis content here */}
                    <p>Loading market analysis...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk-factors">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add risk factors content here */}
                    <p>Loading risk factors...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team">
                <Card>
                  <CardHeader>
                    <CardTitle>Team & Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add team content here */}
                    <p>Loading team information...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="fixed right-0 top-[3rem] bottom-8 w-[400px]">
            <div className="h-full pt-8">
              <div className="h-full border-l border-t">
                <ReportChat
                  currentSection={currentSection}
                  onClose={() => setIsChatOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
