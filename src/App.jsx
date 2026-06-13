import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BrandPage from './pages/BrandPage'
import Settings from './pages/Settings'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/brand/:id" element={<BrandPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              Page not found.
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
