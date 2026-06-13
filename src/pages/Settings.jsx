import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, Plus, Trash2, X, Shield, Check, Loader2 } from 'lucide-react'
import { OWNER_CREDENTIALS, loadData, addBrand, updateBrand, deleteBrand, generateId } from '../store/data'

const BRAND_COLORS = ['#16a34a', '#2563eb', '#dc2626', '#7c3aed', '#0891b2', '#ea580c', '#db2777', '#65a30d']

function OwnerLogin({ onAuth }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function attempt() {
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (u === OWNER_CREDENTIALS.username && p === OWNER_CREDENTIALS.password) {
        sessionStorage.setItem('is_owner_auth', '1')
        onAuth()
      } else {
        setError('Invalid credentials.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Shield size={26} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Owner Access</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Settings are restricted to authorized owners.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Username"
            value={u}
            onChange={e => { setU(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'var(--bg-secondary)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={p}
              onChange={e => { setP(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              style={{
                width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10,
                background: 'var(--bg-secondary)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
            <button onClick={() => setShow(s => !s)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
            }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</p>}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={attempt}
            disabled={loading}
            style={{
              padding: '12px', borderRadius: 10, border: 'none',
              background: 'var(--accent)', color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Access Settings'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

function BrandRow({ brand, onUpdate, onDelete }) {
  const [showPw, setShowPw] = useState(false)
  const [editPw, setEditPw] = useState(false)
  const [newPw, setNewPw] = useState(brand.password)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function savePw() {
    if (!newPw.trim()) return
    setSaving(true)
    try {
      await onUpdate({ ...brand, password: newPw.trim() })
      setEditPw(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 120px', minWidth: 120 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: brand.color || '#6366f1', flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{brand.name}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 20 }}>
          {brand.rows.length} models
        </span>
      </div>

      <div style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {editPw ? (
          <>
            <input
              autoFocus
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') savePw(); if (e.key === 'Escape') { setEditPw(false); setNewPw(brand.password) } }}
              style={{
                flex: 1, padding: '7px 12px', borderRadius: 8,
                background: 'var(--bg-secondary)', border: '1px solid var(--accent)',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              }}
            />
            <button onClick={savePw} disabled={saving} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', display: 'flex' }}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
            </button>
            <button onClick={() => { setEditPw(false); setNewPw(brand.password) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <div style={{
              flex: 1, padding: '7px 12px', borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-primary)', fontFamily: 'monospace',
              letterSpacing: showPw ? '0.02em' : '0.15em',
              userSelect: showPw ? 'text' : 'none',
            }}>
              {showPw ? brand.password : '•'.repeat(Math.min(brand.password.length, 12))}
            </div>
            <button onClick={() => setShowPw(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <button onClick={() => setEditPw(true)} style={{
              padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
            }}>
              {saved ? '✓ Saved' : 'Change'}
            </button>
          </>
        )}
      </div>

      <button onClick={() => onDelete(brand.id)} style={{
        width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)',
        background: 'rgba(239,68,68,0.08)', color: '#ef4444',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Trash2 size={14} />
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  )
}

function AddBrandModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [pw, setPw] = useState('')
  const [color, setColor] = useState(BRAND_COLORS[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!name.trim()) return setError('Brand name is required.')
    if (!pw.trim()) return setError('Page password is required.')
    setLoading(true)
    try {
      await onAdd({
        id: name.trim().toLowerCase().replace(/\s+/g, '_') + '_' + generateId(),
        name: name.trim(),
        password: pw.trim(),
        color,
        columns: ['Model', 'Configuration', 'Stock', 'Required Qty', 'Notes'],
        rows: [],
      })
      onClose()
    } catch (e) {
      setError('Failed to add brand: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Add Brand Page</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Brand Name</label>
            <input
              autoFocus
              placeholder="e.g. Samsung"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 10,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Page Password</label>
            <input
              placeholder="Password for edit access"
              value={pw}
              onChange={e => { setPw(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 10,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Brand Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BRAND_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                  cursor: 'pointer', outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: 2,
                }} />
              ))}
            </div>
          </div>
          {error && <p style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Cancel</button>
            <button onClick={submit} disabled={loading} style={{
              flex: 2, padding: '11px 0', borderRadius: 10, border: 'none',
              background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Adding...' : 'Add Brand'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Settings() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('is_owner_auth') === '1')
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    if (!authed) { setLoading(false); return }
    loadData()
      .then(setBrands)
      .finally(() => setLoading(false))
  }, [authed])

  async function handleUpdate(updated) {
    await updateBrand(updated)
    setBrands(b => b.map(x => x.id === updated.id ? { ...x, ...updated } : x))
  }

  async function handleDelete(id) {
    if (!confirm('Delete this brand page and all its data?')) return
    await deleteBrand(id)
    setBrands(b => b.filter(x => x.id !== id))
  }

  async function handleAdd(brand) {
    await addBrand(brand)
    setBrands(b => [...b, { ...brand }])
  }

  function handleLogout() {
    sessionStorage.removeItem('is_owner_auth')
    setAuthed(false)
  }

  if (!authed) return <OwnerLogin onAuth={() => setAuthed(true)} />

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Shield size={18} color="var(--accent)" />
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Owner Settings</p>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Brand Management</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
              Add or remove brand pages, view and update page passwords.
            </p>
          </div>
          <button onClick={handleLogout} style={{
            padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
          }}>
            Sign Out
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', padding: '40px 0' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 14 }}>Loading...</span>
            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'Brand Pages', value: brands.length },
                { label: 'Total Models', value: brands.reduce((a, b) => a + b.rows.length, 0) },
                { label: 'High Priority', value: brands.reduce((a, b) => a + b.rows.filter(r => r.priority === 'high').length, 0) },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Brand Pages</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdd(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                  borderRadius: 10, border: 'none', background: 'var(--accent)',
                  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={14} /> Add Brand
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {brands.map(brand => (
                  <BrandRow key={brand.id} brand={brand} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
              {brands.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>
                  No brand pages yet. Add one to get started.
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {showAdd && <AddBrandModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  )
}
