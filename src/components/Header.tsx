'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeProvider'
import { motion } from 'framer-motion'

export function Header() {
  return (
    <header className="h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center justify-between">
        <Link to="/" className="font-semibold">
          Report Analyzer
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/report-analysis"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Analysis
          </Link>
        </nav>
      </div>
    </header>
  )
}
