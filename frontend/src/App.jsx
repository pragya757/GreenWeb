import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import { ToastProvider } from './hooks/useToast'
import LandingPage    from './pages/LandingPage'
import DashboardPage  from './pages/DashboardPage'
import AnalyzerPage   from './pages/AnalyzerPage'
import ResultsPage    from './pages/ResultsPage'
import HistoryPage    from './pages/HistoryPage'
import AboutPage      from './pages/AboutPage'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"          element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analyze"   element={<AnalyzerPage />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="/history"   element={<HistoryPage />} />
              <Route path="/about"     element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}
