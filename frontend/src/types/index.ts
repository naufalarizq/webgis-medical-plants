export type PlantCategory =
  | 'ornamental'
  | 'food'
  | 'herbal'
  | 'aromatic'
  | 'shade'

export interface Plant {
  id: number
  name: string
  scientific_name: string
  category: PlantCategory
  location: string
  scale: number
  quantity: number
  image_url: string | null
  lat: number
  lng: number
  created_at: string
  updated_at: string
}

export interface PaginatedPlants {
  data: Plant[]
  total: number
  skip: number
  limit: number
}

export interface PlantListParams {
  category?: PlantCategory | ''
  location?: string
  search?: string
  skip?: number
  limit?: number
}

export interface PlantGeoJSONProperties {
  id: number
  name: string
  scientific_name: string
  category: PlantCategory
  location: string
  image_url: string | null
}

export interface PlantFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: PlantGeoJSONProperties
}

export interface PlantFeatureCollection {
  type: 'FeatureCollection'
  features: PlantFeature[]
}

export interface GeoJSONParams {
  category?: PlantCategory | ''
  location?: string
  search?: string
}

export interface StatsSummary {
  total_plants: number
  by_category: Partial<Record<PlantCategory, number>>
  by_location: Record<string, number>
}

export interface AuthToken {
  access_token: string
  token_type: string
}

export interface AdminUser {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface PlantFormValues {
  name: string
  scientific_name: string
  category: PlantCategory
  location: string
  scale: number
  quantity: number
  lat: number
  lng: number
  photo?: FileList
}

export interface AuthState {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AdminUser) => void
  logout: () => void
}
