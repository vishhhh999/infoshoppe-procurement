import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, Settings, Home } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const location = useLocation()

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            color: '#fff',
          }}>IS</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Infoshoppe
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-muted)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '2px 7px',
            borderRadius: 20,
            letterSpacing: '0.04em',
          }}>PROCUREMENT</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: location.pathname === '/settings' ? 'var(--accent-soft)' : 'var(--bg-card)',
                color: location.pathname === '/settings' ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={16} />
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
