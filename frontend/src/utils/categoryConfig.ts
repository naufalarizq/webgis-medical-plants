import type { LocationOption, PlantCategory } from '@/types'

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

export const DEFAULT_LOCATION_OPTIONS: LocationOption[] = [
  { name: 'CCR', latitude: -6.556095, longitude: 106.731130, is_default: true },
  { name: 'FAPERTA', latitude: -6.558691, longitude: 106.730719, is_default: true },
  { name: 'FAHUTAN', latitude: -6.557048, longitude: 106.730657, is_default: true },
  { name: 'FMIPA', latitude: -6.557551, longitude: 106.731283, is_default: true },
  { name: 'AHN', latitude: -6.560458, longitude: 106.725682, is_default: true },
]

export const CAMPUS_LOCATION_OPTIONS = DEFAULT_LOCATION_OPTIONS

export const CAMPUS_LOCATIONS: string[] = DEFAULT_LOCATION_OPTIONS.map(
  (location) => location.name
)

export const buildLocationOptions = (locations: LocationOption[] = []): LocationOption[] => {
  const defaultsByName = new Map(DEFAULT_LOCATION_OPTIONS.map((location) => [location.name, location]))
  const customLocations = new Map<string, LocationOption>()

  locations.forEach((location) => {
    const name = location.name.trim()
    if (!name || defaultsByName.has(name)) return
    customLocations.set(name, { ...location, name, is_default: false })
  })

  return [
    ...DEFAULT_LOCATION_OPTIONS,
    ...Array.from(customLocations.values()).sort((a, b) => a.name.localeCompare(b.name)),
  ]
}
