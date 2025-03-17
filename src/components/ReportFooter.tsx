'use client'

import { Link } from 'react-router-dom'

export function ReportFooter() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Penny Wise
          </p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
