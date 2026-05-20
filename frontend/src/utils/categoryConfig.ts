import type { PlantCategory } from '@/types'

export interface CategoryConfig {
  label: string
  badgeClass: string
  markerColor: string
}

export const CATEGORY_CONFIG: Record<PlantCategory, CategoryConfig> = {
  ornamental: {
    label: 'Tanaman Ornamental',
    badgeClass: 'bg-pink-100 text-pink-800 border border-pink-200',
    markerColor: '#ec4899',
  },
  food: {
    label: 'Tanaman Food',
    badgeClass: 'bg-green-100 text-green-800 border border-green-200',
    markerColor: '#c52222',
  },
  herbal: {
    label: 'Tanaman Herbal',
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    markerColor: '#10b981',
  },
  aromatic: {
    label: 'Tanaman Aromatic',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
    markerColor: '#3b82f6',
  },
  shade: {
    label: 'Tanaman Shade',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    markerColor: '#f59e0b',
  },
}

export const PLANT_CATEGORIES: PlantCategory[] = [
  'ornamental', 'food', 'herbal', 'aromatic', 'shade',
]

export const CAMPUS_LOCATIONS: string[] = [
  'CCR', 'FAPERTA', 'FAHUTAN', 'FMIPA', 'AHN',
]