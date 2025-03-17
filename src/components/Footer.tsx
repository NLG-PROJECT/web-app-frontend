'use client'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex h-10 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pennywise
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full"
            >
              <Twitter className="h-3.5 w-3.5" />
              <span className="sr-only">Twitter</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full"
            >
              <Linkedin className="h-3.5 w-3.5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
