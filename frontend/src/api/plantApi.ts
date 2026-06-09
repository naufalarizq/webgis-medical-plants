import api from './axios'
import type {
  Plant, PaginatedPlants, PlantListParams,
  PlantFeatureCollection, GeoJSONParams, StatsSummary, LocationOption,
} from '@/types'

const clean = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(
      ([, v]) => v !== '' && v !== undefined
    )
  )

export const getPlants = async (params: PlantListParams): Promise<PaginatedPlants> => {
  const { data } = await api.get<PaginatedPlants>('/api/plants', { params: clean(params) })
  return data
}

export const getPlantsGeoJSON = async (params: GeoJSONParams): Promise<PlantFeatureCollection> => {
  const { data } = await api.get<PlantFeatureCollection>('/api/plants/geojson', { params: clean(params) })
  return data
}

export const getLocations = async (): Promise<LocationOption[]> => {
  const { data } = await api.get<LocationOption[]>('/api/locations')
  return data
}

export const getPlant = async (id: number): Promise<Plant> => {
  const { data } = await api.get<Plant>(`/api/plants/${id}`)
  return data
}

export const getStats = async (): Promise<StatsSummary> => {
  const { data } = await api.get<StatsSummary>('/api/stats/summary')
  return data
}

export const createPlant = async (formData: FormData): Promise<Plant> => {
  const { data } = await api.post<Plant>('/api/admin/plants', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updatePlant = async (id: number, formData: FormData): Promise<Plant> => {
  const { data } = await api.put<Plant>(`/api/admin/plants/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deletePlant = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/plants/${id}`)
}

export const bulkDeletePlants = async (ids: number[]): Promise<void> => {
  await api.post('/api/admin/plants/bulk-delete', { ids })
}
