// import { Button } from './components/ui/button'
// import { Send } from 'lucide-react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import AppPage from '@/pages/App'
import ReportAnalysis from '@/pages/ReportAnalysis'
import ParticleAnimation from '@/components/ParticleAnimation'
import Investor from '@/pages/Investor'

function AppContent() {
  const location = useLocation()
  const isReportAnalysis = location.pathname === '/report-analysis'

  return (
    <div className="flex flex-col min-h-screen">
      {!isReportAnalysis && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ParticleAnimation />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/report-analysis" element={<ReportAnalysis />} />
          <Route path="/investor" element={<Investor />} />
        </Routes>
      </main>
      {!isReportAnalysis && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}
