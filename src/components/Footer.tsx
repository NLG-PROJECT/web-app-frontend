'use client'

import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="h-8 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Report Analyzer. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
