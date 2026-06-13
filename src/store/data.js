// Owner credentials — hardcoded, never exposed via URL
export const OWNER_CREDENTIALS = {
  username: 'admin',
  password: 'infoshoppe2710$',
}

const STORAGE_KEY = 'infoshoppe_data'

const DEFAULT_BRANDS = [
  {
    id: 'acer',
    name: 'Acer',
    password: 'acer@2024',
    color: '#16a34a',
    columns: ['Model', 'Configuration', 'Stock', 'Required Qty', 'Notes'],
    rows: [
      { id: 'r1', Model: 'Aspire Lite AL15', Configuration: 'i5 13th / 16GB / 512GB SSD', Stock: '12', 'Required Qty': '20', Notes: '', priority: 'high' },
      { id: 'r2', Model: 'Nitro V', Configuration: 'i5 / RTX 4050 / 16GB / 512GB', Stock: '4', 'Required Qty': '8', Notes: '', priority: 'medium' },
    ],
  },
  {
    id: 'hp',
    name: 'HP',
    password: 'hp@2024',
    color: '#2563eb',
    columns: ['Model', 'Configuration', 'Stock', 'Required Qty', 'Notes'],
    rows: [
      { id: 'r3', Model: 'Victus 15', Configuration: 'i5 12th / 8GB / 512GB SSD', Stock: '8', 'Required Qty': '15', Notes: '', priority: 'medium' },
    ],
  },
  {
    id: 'lenovo',
    name: 'Lenovo',
    password: 'lenovo@2024',
    color: '#dc2626',
    columns: ['Model', 'Configuration', 'Stock', 'Required Qty', 'Notes'],
    rows: [
      { id: 'r4', Model: 'IdeaPad Slim 5', Configuration: 'Ryzen 5 / 16GB / 512GB SSD', Stock: '6', 'Required Qty': '12', Notes: '', priority: 'low' },
    ],
  },
  {
    id: 'dell',
    name: 'Dell',
    password: 'dell@2024',
    color: '#7c3aed',
    columns: ['Model', 'Configuration', 'Stock', 'Required Qty', 'Notes'],
    rows: [
      { id: 'r5', Model: 'Inspiron 15', Configuration: 'i5 12th / 8GB / 256GB SSD', Stock: '10', 'Required Qty': '10', Notes: '', priority: 'low' },
    ],
  },
  {
    id: 'asus',
    name: 'Asus',
    password: 'asus@2024',
    color: '#0891b2',
    columns: ['Model', 'Configuration', 'Stock', 'Required Qty', 'Notes'],
    rows: [
      { id: 'r6', Model: 'VivoBook 15', Configuration: 'Ryzen 7 / 16GB / 512GB SSD', Stock: '5', 'Required Qty': '10', Notes: '', priority: 'medium' },
    ],
  },
]

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_BRANDS
    return JSON.parse(raw)
  } catch {
    return DEFAULT_BRANDS
  }
}

export function saveData(brands) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(brands))
}

export function generateId() {
  return 'id_' + Math.random().toString(36).slice(2, 10)
}
