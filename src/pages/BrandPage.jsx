import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Unlock, Eye, EyeOff, Plus, Save, Trash2,
  ArrowLeft, ChevronDown, X, Check
} from 'lucide-react'
import { loadData, saveData, generateId } from '../store/data'

const PRIORITY = ['high', 'medium', 'low']
const PRIORITY_LABELS = { high: 'High', medium: 'Med', low: 'Low' }
const PRIORITY_COLORS = {
  high: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', border: 'rgba(239,68,68,0.25)' },
  medium: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  low: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
}

function PriorityBadge({ value, editable, onChange }) {
  const [open, setOpen] = useState(false)
  const c = PRIORITY_COLORS[value] || PRIORITY_COLORS.low

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => editable && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 20,
          background: c.bg, color: c.text,
          border: `1px solid ${c.border}`,
          fontSize: 12, fontWeight: 600,
          cursor: editable ? 'pointer' : 'default',
          whiteSpace: 'nowrap',
        }}
      >
        {PRIORITY_LABELS[value] || 'Low'}
        {editable && <ChevronDown size={10} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 4,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, overflow: 'hidden', zIndex: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              minWidth: 100,
            }}
          >
            {PRIORITY.map(p => {
              const pc = PRIORITY_COLORS[p]
              return (
                <button
                  key={p}
                  onClick={() => { onChange(p); setOpen(false) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', fontSize: 12, fontWeight: 600,
                    color: pc.text, background: 'transparent',
                    cursor: 'pointer', border: 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = pc.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PasswordModal({ brandName, onSuccess, onClose }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100) }, [])

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
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 32, width: '100%', maxWidth: 380,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--accent-soft)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={20} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Mode</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{brandName} page password</p>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            ref={inputRef}
            type={show ? 'text' : 'password'}
            placeholder="Enter page password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && onSuccess(pw, setError)}
            style={{
              width: '100%', padding: '12px 44px 12px 16px',
              background: 'var(--bg-secondary)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 10, fontSize: 14, color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <button
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center',
            }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => onSuccess(pw, setError)} style={{
            flex: 2, padding: '11px 0', borderRadius: 10, border: 'none',
            background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Unlock</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function BrandPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [brands, setBrands] = useState([])
  const [brand, setBrand] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [localRows, setLocalRows] = useState([])
  const [localCols, setLocalCols] = useState([])
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [addingCol, setAddingCol] = useState(false)

  useEffect(() => {
    const data = loadData()
    setBrands(data)
    const b = data.find(x => x.id === id)
    if (b) {
      setBrand(b)
      setLocalRows(b.rows.map(r => ({ ...r })))
      setLocalCols([...b.columns])
    }
  }, [id])

  // Reset edit mode on any navigation away
  useEffect(() => {
    return () => setEditMode(false)
  }, [id])

  if (!brand) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      Brand not found. <button onClick={() => navigate('/')} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Go back</button>
    </div>
  )

  function handleUnlock(pw, setError) {
    if (pw === brand.password) {
      setEditMode(true)
      setShowPwModal(false)
      setDirty(false)
    } else {
      setError('Incorrect password. Try again.')
    }
  }

  function handleCellChange(rowId, col, val) {
    setLocalRows(rows => rows.map(r => r.id === rowId ? { ...r, [col]: val } : r))
    setDirty(true)
  }

  function handlePriorityChange(rowId, val) {
    setLocalRows(rows => rows.map(r => r.id === rowId ? { ...r, priority: val } : r))
    setDirty(true)
  }

  function addRow() {
    const blank = { id: generateId(), priority: 'low' }
    localCols.forEach(c => { blank[c] = '' })
    setLocalRows(rows => [...rows, blank])
    setDirty(true)
  }

  function deleteRow(rowId) {
    setLocalRows(rows => rows.filter(r => r.id !== rowId))
    setDirty(true)
  }

  function addColumn() {
    const name = newColName.trim()
    if (!name || localCols.includes(name)) return
    setLocalCols(cols => [...cols, name])
    setLocalRows(rows => rows.map(r => ({ ...r, [name]: '' })))
    setNewColName('')
    setAddingCol(false)
    setDirty(true)
  }

  function handleSave() {
    const updated = brands.map(b =>
      b.id === id ? { ...b, rows: localRows, columns: localCols } : b
    )
    saveData(updated)
    setBrands(updated)
    setBrand(updated.find(b => b.id === id))
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const brandColor = brand.color || 'var(--accent)'

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/')} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ArrowLeft size={16} />
          </button>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${brandColor}18`, border: `1px solid ${brandColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: brandColor,
          }}>{brand.name.charAt(0)}</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{brand.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{localRows.length} models</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {editMode && dirty && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 10, border: 'none',
                background: saved ? '#22c55e' : 'var(--accent)',
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? 'Saved' : 'Save Changes'}
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (editMode) { setEditMode(false); setLocalRows(brand.rows.map(r => ({ ...r }))); setLocalCols([...brand.columns]); setDirty(false) }
              else setShowPwModal(true)
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 10,
              border: `1px solid ${editMode ? 'var(--border)' : brandColor}`,
              background: editMode ? 'var(--bg-card)' : `${brandColor}15`,
              color: editMode ? 'var(--text-secondary)' : brandColor,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {editMode ? <><Lock size={15} /> Lock</> : <><Unlock size={15} /> Edit</>}
          </motion.button>
        </div>
      </div>

      {/* Edit mode banner */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 10, padding: '10px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: 'var(--accent)',
            }}
          >
            <Unlock size={14} />
            Edit mode active — changes are local until you save. Refreshing discards unsaved changes.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                Priority
              </th>
              {localCols.map(col => (
                <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                  {col}
                </th>
              ))}
              {editMode && (
                <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                  {addingCol ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        autoFocus
                        placeholder="Column name"
                        value={newColName}
                        onChange={e => setNewColName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addColumn(); if (e.key === 'Escape') setAddingCol(false) }}
                        style={{
                          padding: '4px 8px', borderRadius: 6, border: '1px solid var(--accent)',
                          background: 'var(--bg-card)', color: 'var(--text-primary)',
                          fontSize: 12, width: 110, outline: 'none',
                        }}
                      />
                      <button onClick={addColumn} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', display: 'flex' }}><Check size={14} /></button>
                      <button onClick={() => setAddingCol(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingCol(true)} style={{
                      display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                      borderRadius: 8, border: '1px dashed var(--border)',
                      background: 'transparent', color: 'var(--text-muted)',
                      fontSize: 12, cursor: 'pointer', fontWeight: 500,
                    }}>
                      <Plus size={12} /> Add Column
                    </button>
                  )}
                </th>
              )}
              {editMode && <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', width: 48 }} />}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {localRows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <PriorityBadge
                      value={row.priority || 'low'}
                      editable={editMode}
                      onChange={val => handlePriorityChange(row.id, val)}
                    />
                  </td>
                  {localCols.map(col => (
                    <td key={col} style={{ padding: '10px 16px', fontSize: 14, color: 'var(--text-primary)' }}>
                      {editMode ? (
                        <input
                          value={row[col] || ''}
                          onChange={e => handleCellChange(row.id, col, e.target.value)}
                          style={{
                            width: '100%', minWidth: 80, padding: '6px 10px',
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                            borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
                            outline: 'none', transition: 'border-color 0.15s',
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                          onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                      ) : (
                        <span>{row[col] || <span style={{ color: 'var(--text-muted)' }}>—</span>}</span>
                      )}
                    </td>
                  ))}
                  {editMode && <td style={{ padding: '10px 16px' }} />}
                  {editMode && (
                    <td style={{ padding: '10px 16px' }}>
                      <button onClick={() => deleteRow(row.id)} style={{
                        width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)',
                        background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {localRows.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No models added yet.{editMode && ' Click "Add Row" below to get started.'}
          </div>
        )}
      </div>

      {editMode && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={addRow}
          style={{
            marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 10, border: '1px dashed var(--border)',
            background: 'transparent', color: 'var(--text-secondary)',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Plus size={15} /> Add Row
        </motion.button>
      )}

      <AnimatePresence>
        {showPwModal && (
          <PasswordModal
            brandName={brand.name}
            onSuccess={handleUnlock}
            onClose={() => setShowPwModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
