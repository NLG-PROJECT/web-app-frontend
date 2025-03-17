// import { Button } from './components/ui/button'
// import { Send } from 'lucide-react'
import ParticleAnimation from './components/ParticleAnimation'
import { ThemeProvider } from './context/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="penny-wise-theme">
      <div className="min-h-screen bg-black dark:bg-black bg-white">
        <ThemeToggle />
        <ParticleAnimation />
      </div>
    </ThemeProvider>
  )
}

export default App
