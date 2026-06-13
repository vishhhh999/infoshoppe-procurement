import { supabase } from './supabase'

export const OWNER_CREDENTIALS = {
  username: 'admin',
  password: 'infoshoppe2710$',
}

export function generateId() {
  return 'id_' + Math.random().toString(36).slice(2, 10)
}

// ─── Fetch all brands with their rows ─────────────────────────────────────────
export async function loadData() {
  const { data: brands, error: brandsErr } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: true })

  if (brandsErr) throw brandsErr

  const { data: rows, error: rowsErr } = await supabase
    .from('rows')
    .select('*')
    .order('position', { ascending: true })

  if (rowsErr) throw rowsErr

  // Attach rows to their brands, expand jsonb data into flat object
  return brands.map(b => ({
    id: b.id,
    name: b.name,
    password: b.password,
    color: b.color,
    columns: b.columns || [],
    rows: rows
      .filter(r => r.brand_id === b.id)
      .map(r => ({ id: r.id, priority: r.priority, ...r.data })),
  }))
}

// ─── Save a brand's rows + columns after editing ───────────────────────────────
export async function saveBrandData(brandId, columns, localRows) {
  // Update columns on brand
  const { error: brandErr } = await supabase
    .from('brands')
    .update({ columns })
    .eq('id', brandId)

  if (brandErr) throw brandErr

  // Delete all existing rows for this brand and re-insert
  // Simpler than diffing -- row counts will be small
  const { error: delErr } = await supabase
    .from('rows')
    .delete()
    .eq('brand_id', brandId)

  if (delErr) throw delErr

  if (localRows.length === 0) return

  const toInsert = localRows.map((r, i) => {
    const { id, priority, ...rest } = r
    return {
      id,
      brand_id: brandId,
      priority: priority || 'low',
      data: rest,
      position: i,
    }
  })

  const { error: insertErr } = await supabase
    .from('rows')
    .insert(toInsert)

  if (insertErr) throw insertErr
}

// ─── Settings: add a new brand ────────────────────────────────────────────────
export async function addBrand(brand) {
  const { error } = await supabase.from('brands').insert({
    id: brand.id,
    name: brand.name,
    password: brand.password,
    color: brand.color,
    columns: brand.columns,
  })
  if (error) throw error
}

// ─── Settings: update brand password or color ─────────────────────────────────
export async function updateBrand(brand) {
  const { error } = await supabase
    .from('brands')
    .update({ password: brand.password, color: brand.color, name: brand.name })
    .eq('id', brand.id)
  if (error) throw error
}

// ─── Settings: delete a brand (rows cascade) ──────────────────────────────────
export async function deleteBrand(id) {
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) throw error
}
