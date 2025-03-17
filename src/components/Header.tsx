'use client'

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeProvider'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '@/components/ModeToggle'
import { Search, ArrowLeft } from 'lucide-react'

export function Header() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Back Button (only show when not on home page) */}
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Pennywise</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                className="pl-8 w-[200px]"
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
