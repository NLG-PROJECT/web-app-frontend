import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Document, Page, pdfjs } from 'react-pdf'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

interface FactCheckResult {
  claim: string
  score: number
  status: string
  evidence: string
  page: number
}

interface FactCheckOverlayProps {
  isOpen: boolean
  onClose: () => void
  factCheck: FactCheckResult[]
  pdfUrl: string
}

export function FactCheckOverlay({
  isOpen,
  onClose,
  factCheck,
  pdfUrl,
}: FactCheckOverlayProps) {
  const [expandedClaims, setExpandedClaims] = useState<Set<number>>(new Set())
  const [showPDF, setShowPDF] = useState(false)
  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [scale, setScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleClaim = (index: number) => {
    const newExpanded = new Set(expandedClaims)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedClaims(newExpanded)
  }

  const getScoreIcon = (score: number) => {
    if (score >= 0.75) {
      return <CheckCircle2 className="size-4 text-green-500" />
    } else if (score >= 0.5) {
      return <CheckCircle2 className="size-4 text-orange-500" />
    } else if (score >= 0.25) {
      return <AlertCircle className="size-4 text-yellow-500" />
    } else {
      return <XCircle className="size-4 text-red-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.75) return 'text-green-500'
    if (score >= 0.5) return 'text-orange-500'
    if (score >= 0.25) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.75) return 'High confidence'
    if (score >= 0.5) return 'Moderate confidence'
    if (score >= 0.25) return 'Low confidence'
    return 'Unverified'
  }

  const handleViewDocument = (page: number) => {
    setCurrentPage(page)
    setShowPDF(true)
    setIsLoading(true)
  }

  const handlePDFLoadSuccess = () => {
    setIsLoading(false)
  }

  const handlePDFLoadError = (error: Error) => {
    console.error('Error loading PDF:', error)
    setError('Failed to load PDF')
    setIsLoading(false)
  }

  // Custom text renderer to highlight evidence
  const customTextRenderer = (
    props: TextItem & {
      pageIndex: number
      pageNumber: number
      itemIndex: number
    },
  ) => {
    const { str, pageNumber } = props
    return `<span style="color: black; opacity: 1;">${str}</span>`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Fact Check Results
            <span className="text-sm font-normal text-muted-foreground">
              ({factCheck.length} claims verified)
            </span>
          </DialogTitle>
        </DialogHeader>

        {!showPDF ? (
          <div className="space-y-4">
            {factCheck.map((claim, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleClaim(index)}
                >
                  <div className="flex items-center gap-3">
                    {getScoreIcon(claim.score)}
                    <div>
                      <p className="font-medium">{claim.claim}</p>
                      <p className={cn('text-sm', getScoreColor(claim.score))}>
                        {getScoreLabel(claim.score)} (
                        {Math.round(claim.score * 100)}%)
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedClaims.has(index) ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>
                </div>

                {expandedClaims.has(index) && (
                  <div className="px-4 pb-4 space-y-4">
                    <div className="rounded-md bg-muted p-3">
                      <h4 className="text-sm font-medium mb-2">Evidence</h4>
                      <p className="text-sm text-muted-foreground">
                        {claim.evidence}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Found on page {claim.page}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleViewDocument(claim.page)}
                      >
                        <FileText className="size-3" />
                        View document
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPDF(false)}
                className="gap-2"
              >
                <ChevronDown className="size-4" />
                Back to claims
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                >
                  -
                </Button>
                <span className="text-sm">{Math.round(scale * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              {isLoading && (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              {error && (
                <div className="text-red-500 p-4 text-center">
                  {error}
                  <div className="text-sm text-muted-foreground mt-2">
                    Please check if the PDF file exists and is accessible.
                  </div>
                </div>
              )}
              <Document
                file={pdfUrl}
                onLoadSuccess={handlePDFLoadSuccess}
                onLoadError={handlePDFLoadError}
                className="flex justify-center"
                loading={
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }
              >
                <div className="p-8 bg-muted/20 rounded-lg">
                  <Page
                    pageNumber={currentPage || 1}
                    scale={scale}
                    className="shadow-lg"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    customTextRenderer={customTextRenderer}
                  />
                </div>
              </Document>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
