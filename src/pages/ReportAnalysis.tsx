import { useState } from 'react'
import { ReportChat } from '@/components/ReportChat'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ReportHeader } from '@/components/ReportHeader'
import { ReportFooter } from '@/components/ReportFooter'
import { ReportUpload } from '@/components/ReportUpload'
import {
  MessageSquare,
  FileText,
  BarChart3,
  DollarSign,
  LineChart,
  Building2,
  Users,
  AlertTriangle,
  Target,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import {
  ExecutiveSummary,
  FinancialMetrics,
  Valuation,
  MarketAnalysis,
  RiskAnalysis,
  TeamStrategy,
} from '@/components/report-sections'

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Report Analysis
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChevronRight className="size-4" />
                  <p>{reportName}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="relative hover:bg-primary/5 transition-colors"
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
            </motion.div>

            <Tabs
              value={currentSection}
              onValueChange={setCurrentSection}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6 bg-muted/50 p-1">
                <TabsTrigger
                  value="executive-summary"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <FileText className="size-4" />
                  Executive Summary
                </TabsTrigger>
                <TabsTrigger
                  value="financial-metrics"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="size-4" />
                  Financial Metrics
                </TabsTrigger>
                <TabsTrigger
                  value="valuation"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <DollarSign className="size-4" />
                  Valuation
                </TabsTrigger>
                <TabsTrigger
                  value="market-analysis"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <LineChart className="size-4" />
                  Market Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="risk-factors"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <AlertTriangle className="size-4" />
                  Risk Factors
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Users className="size-4" />
                  Team & Strategy
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="executive-summary">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ExecutiveSummary />
                  </motion.div>
                </TabsContent>

                <TabsContent value="financial-metrics">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FinancialMetrics />
                  </motion.div>
                </TabsContent>

                <TabsContent value="valuation">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Valuation />
                  </motion.div>
                </TabsContent>

                <TabsContent value="market-analysis">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <MarketAnalysis />
                  </motion.div>
                </TabsContent>

                <TabsContent value="risk-factors">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <RiskAnalysis />
                  </motion.div>
                </TabsContent>

                <TabsContent value="team">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <TeamStrategy />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
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
