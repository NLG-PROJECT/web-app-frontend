// import { Button } from './components/ui/button'
// import { Send } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ParticleAnimation from './components/ParticleAnimation'
import { ThemeProvider } from './context/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import Header from './components/Header'
import Footer from './components/Footer'
import Investor from './pages/Investor'

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="penny-wise-theme">
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ParticleAnimation />} />
              <Route path="/investor" element={<Investor />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </Router>
  )
}

export default App
