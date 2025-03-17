import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Paperclip, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeProvider'

const quickActions = [
  {
    label: 'Analyze Report',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 12H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Compare Businesses',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M4 9H20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 20V9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Multi-year Performance',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 10H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 14H12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const recentReports = [
  {
    title: 'Q4 2023 Earnings Report',
    company: 'Tech Corp',
    date: '2024-02-15',
    type: 'Earnings',
  },
  {
    title: 'Annual Report 2023',
    company: 'Global Industries',
    date: '2024-02-10',
    type: 'Annual',
  },
  {
    title: 'Q3 Financial Results',
    company: 'Innovation Labs',
    date: '2024-02-05',
    type: 'Quarterly',
  },
  {
    title: 'Sustainability Report',
    company: 'Green Energy Co',
    date: '2024-02-01',
    type: 'Special',
  },
]

export default function AppPage() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <main className="flex-1 py-16 px-6">
        <div className="max-w-[800px] mx-auto w-full">
          <h1 className="text-[38px] leading-tight font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            What will you like to do?
          </h1>

          <div className="relative mb-8">
            <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <textarea
                  placeholder="Search business to invest in..."
                  className="flex-1 px-6 pt-6 pb-3 outline-none resize-none h-[60px] text-[16px] w-full transition-all duration-300 focus:h-[100px] bg-transparent"
                ></textarea>
                <div className="flex items-center gap-2 p-4">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Send className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-20">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center gap-2"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[22px] font-semibold">Recent Reports</h2>
            <Button variant="ghost" className="gap-2">
              View All <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="group cursor-pointer p-6 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {report.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {report.date}
                  </span>
                </div>
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
