import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { Button } from './ui/button'

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

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
  factCheck: FactCheckResult
  pdfUrl: string
}

export function FactCheckOverlay({
  isOpen,
  onClose,
  factCheck,
  pdfUrl,
}: FactCheckOverlayProps) {
  const [showPDF, setShowPDF] = useState(false)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(factCheck?.page || 1)
  const [scale, setScale] = useState(1.0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Debug logs for component lifecycle
  useEffect(() => {
    console.log('FactCheckOverlay mounted/updated:', {
      isOpen,
      showPDF,
      pdfUrl,
      factCheck,
    })
  }, [isOpen, showPDF, pdfUrl, factCheck])

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setShowPDF(false)
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen])

  if (!isOpen || !factCheck) return null

  const getFactCheckIcon = (score: number) => {
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

  const formatEvidence = (evidence: string) => {
    if (!evidence) return null
    return evidence.split('\\n').map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ))
  }

  const handlePDFLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully:', { numPages, currentPage })
    setNumPages(numPages)
    setIsLoading(false)
  }

  const handlePDFLoadError = (error: Error) => {
    console.error('Error loading PDF:', {
      error,
      pdfUrl,
      currentPage,
    })
    setError('Failed to load PDF')
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div
        className={`bg-background w-[80%] h-[90%] rounded-lg shadow-lg flex flex-col transition-all duration-300 ${
          showPDF ? 'pt-16' : ''
        }`}
      >
        {/* Compact Header (shown when PDF is visible) */}
        {showPDF && (
          <div className="absolute top-0 left-0 right-0 h-16 bg-background border-b flex items-center justify-between px-4 z-10">
            <div className="flex items-center gap-4">
              {getFactCheckIcon(factCheck.score)}
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  Score: {(factCheck.score * 100).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="capitalize">{factCheck.status}</span>
                <span className="text-muted-foreground">•</span>
                <span>Page {factCheck.page}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-auto ${showPDF ? 'pt-4' : 'p-6'}`}>
          {!showPDF ? (
            // Fact Check Details View
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    Fact Check Results
                  </span>
                  {getFactCheckIcon(factCheck.score)}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Claim</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {factCheck.claim}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Evidence</h4>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {formatEvidence(factCheck.evidence)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Page {factCheck.page}
                </span>
                <Button
                  onClick={() => {
                    console.log('Switching to PDF view:', {
                      pdfUrl,
                      page: factCheck.page,
                    })
                    setIsLoading(true)
                    setShowPDF(true)
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="size-4" />
                  Confirm in Document
                </Button>
              </div>
            </div>
          ) : (
            // PDF Viewer
            <div className="h-full">
              <div className="flex items-center justify-between mb-4 px-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {numPages || '?'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(numPages || prev, prev + 1),
                      )
                    }
                    disabled={currentPage >= (numPages || currentPage)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setScale((prev) => Math.max(0.5, prev - 0.1))
                    }
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{Math.round(scale * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
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
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    className="shadow-lg"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
