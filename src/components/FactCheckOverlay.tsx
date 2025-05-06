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
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
                      onClick={() => window.open(pdfUrl, '_blank')}
                    >
                      <ExternalLink className="size-3" />
                      View in PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
