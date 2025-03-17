// import { Button } from './components/ui/button'
// import { Send } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ParticleAnimation from './components/ParticleAnimation'
import { ThemeProvider } from '@/context/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import AppPage from '@/pages/App'
import Investor from '@/pages/Investor'
import ReportAnalysis from '@/pages/ReportAnalysis'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ParticleAnimation />} />
              <Route path="/investor" element={<Investor />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/report-analysis" element={<ReportAnalysis />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
