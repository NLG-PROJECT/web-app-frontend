import { useState } from 'react'
import { ReportChat } from '@/components/ReportChat'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { ReportHeader } from '@/components/ReportHeader'
import { ReportFooter } from '@/components/ReportFooter'
import { ReportUpload } from '@/components/ReportUpload'

export default function ReportAnalysis() {
  const [currentSection, setCurrentSection] = useState('executive-summary')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasReport, setHasReport] = useState(false)
  const [reportName, setReportName] = useState<string | null>(null)

  const handleReportUpload = (fileName: string) => {
    setReportName(fileName)
    setHasReport(true)
  }

  if (!hasReport) {
    return (
      <div className="min-h-screen flex flex-col">
        <ReportHeader />
        <div className="flex-1">
          <ReportUpload onUpload={handleReportUpload} />
        </div>
        <ReportFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ReportHeader />
      <div className="flex-1 flex relative">
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isChatOpen ? 'pr-[400px]' : ''
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Report Analysis</h1>
                <p className="text-muted-foreground">{reportName}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <motion.div
                  animate={
                    !isChatOpen
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                          color: ['#888888', '#8B5CF6', '#888888'],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <MessageSquare className="size-4" />
                </motion.div>
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
      <ReportFooter />
    </div>
  )
}
