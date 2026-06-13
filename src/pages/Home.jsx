import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Package, AlertCircle, Loader2 } from 'lucide-react'
import { loadData } from '../store/data'

export default function Home() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
      .then(setBrands)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  }

  function getPriorityCount(rows, level) {
    return rows.filter(r => r.priority === level).length
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 40 }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Procurement Portal
        </p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Brand Inventory
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 15 }}>
          Select a brand to view or manage procurement requirements.
        </p>
      </motion.div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: '60px 0' }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14 }}>Loading brands...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px 20px', borderRadius: 12,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', fontSize: 14,
        }}>
          Failed to load data: {error}
        </div>
      )}

      {!loading && !error && brands.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No brand pages yet. Ask an owner to add them via Settings.</p>
        </div>
      )}

      {!loading && !error && brands.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {brands.map(brand => {
            const highCount = getPriorityCount(brand.rows, 'high')
            const medCount = getPriorityCount(brand.rows, 'medium')
            const lowCount = getPriorityCount(brand.rows, 'low')

            return (
              <motion.div
                key={brand.id}
                variants={item}
                whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400 } }}
                onClick={() => navigate(`/brand/${brand.id}`)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 24,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = brand.color || 'var(--accent)'
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${brand.color || 'var(--accent)'}22, 0 8px 24px rgba(0,0,0,0.15)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 3, background: brand.color || 'var(--accent)',
                  borderRadius: '16px 16px 0 0',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${brand.color || 'var(--accent)'}18`,
                      border: `1px solid ${brand.color || 'var(--accent)'}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 800, color: brand.color || 'var(--accent)',
                      marginBottom: 12,
                    }}>
                      {brand.name.charAt(0)}
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {brand.name}
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                      {brand.rows.length} {brand.rows.length === 1 ? 'model' : 'models'}
                    </p>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {highCount > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#ef4444',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      padding: '3px 9px', borderRadius: 20,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <AlertCircle size={10} /> {highCount} High
                    </span>
                  )}
                  {medCount > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#f59e0b',
                      background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                      padding: '3px 9px', borderRadius: 20,
                    }}>
                      {medCount} Medium
                    </span>
                  )}
                  {lowCount > 0 && (
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#22c55e',
                      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                      padding: '3px 9px', borderRadius: 20,
                    }}>
                      {lowCount} Low
                    </span>
                  )}
                  {brand.rows.length === 0 && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No items yet</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
