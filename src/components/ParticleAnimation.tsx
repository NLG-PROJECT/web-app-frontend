import React, { useRef, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeProvider'
import { ArrowRight, Building2, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      life: number
      isFirstWord: boolean
      alpha: number
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = theme === 'dark' ? 'white' : 'black'
      ctx.save()

      const fontSize = isMobile ? 64 : 130
      ctx.font = `bold ${fontSize}px 'SF Pro Display', Inter, system-ui, sans-serif`

      const text1 = 'Penny'
      const text2 = 'Wise'
      const text1Metrics = ctx.measureText(text1)
      const text2Metrics = ctx.measureText(text2)
      const spacing = isMobile ? 32 : 65
      const totalWidth = text1Metrics.width + text2Metrics.width + spacing

      const x = canvas.width / 2 - totalWidth / 2
      const y = canvas.height / 2 - fontSize / 3

      ctx.fillText(text1, x, y)
      ctx.fillText(text2, x + text1Metrics.width + spacing, y)

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return fontSize
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          const fontSize = isMobile ? 60 : 120
          ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
          const text1 = 'Penny'
          const text2 = 'Wise'
          const text1Width = ctx.measureText(text1).width
          const spacing = isMobile ? 30 : 60
          const totalWidth = text1Width + ctx.measureText(text2).width + spacing
          const centerX = canvas.width / 2
          const isFirstWord = x < centerX + text1Width / 2

          const baseAlpha = Math.random() * 0.2 + 0.7
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.2 + 0.8,
            color:
              theme === 'dark'
                ? `rgba(255, 255, 255, ${baseAlpha})`
                : `rgba(0, 0, 0, ${baseAlpha * 1.2})`,
            isFirstWord: isFirstWord,
            life: Math.random() * 100 + 50,
            alpha: baseAlpha,
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      if (!canvas) return
      const baseParticleCount = 7000
      const particleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      )
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function drawParticle(
      ctx: CanvasRenderingContext2D,
      p: typeof particles[0],
    ) {
      ctx.save()
      ctx.globalAlpha = p.alpha

      ctx.shadowBlur = 6
      ctx.shadowColor =
        theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)'

      ctx.fillStyle = p.color
      ctx.fillRect(p.x, p.y, p.size, p.size)

      ctx.restore()
    }

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = theme === 'dark' ? 'black' : 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (
          distance < maxDistance &&
          (isTouchingRef.current || !('ontouchstart' in window))
        ) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY

          p.alpha = p.alpha * 1.1
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          p.alpha = p.alpha * 0.95 + 0.05
        }

        drawParticle(ctx, p)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      if (!canvas) return
      const baseParticleCount = 7000
      const targetParticleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      )
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, theme])

  return (
    <div
      className={`relative w-full h-dvh flex flex-col items-center justify-center ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with animated text"
      />
      <div className="absolute flex flex-col items-center">
        <p
          className={`${
            theme === 'dark' ? 'text-gray-100/90' : 'text-gray-800/90'
          } text-xl sm:text-2xl md:text-[2rem] font-medium tracking-normal mt-44 sm:mt-48 md:mt-52`}
          style={{
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Next Generation Investor Relations
        </p>
        <div className="flex gap-4 sm:gap-6 mt-12 sm:mt-14">
          <Link to="/investor">
            <button
              className={`group px-8 py-3.5 rounded-xl text-base sm:text-lg font-medium transition-all
                flex items-center gap-2 sm:gap-3
                ${
                  theme === 'dark'
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              <LineChart className="w-5 h-5" />
              <span>I'm an Investor</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
          <button
            className={`group px-8 py-3.5 rounded-xl text-base sm:text-lg font-medium transition-all
              flex items-center gap-2 sm:gap-3
              ${
                theme === 'dark'
                  ? 'bg-transparent text-white border-[1.5px] border-white/80 hover:bg-white/10'
                  : 'bg-transparent text-black border-[1.5px] border-black/80 hover:bg-black/5'
              }`}
          >
            <Building2 className="w-5 h-5" />
            <span>I'm a Business</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
