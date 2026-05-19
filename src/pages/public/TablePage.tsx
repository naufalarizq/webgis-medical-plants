import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPlants } from '@/api/plantApi'
import type { PlantCategory } from '@/types'
import { PLANT_CATEGORIES, CAMPUS_LOCATIONS } from '@/utils/categoryConfig'
import CategoryBadge from '@/components/ui/CategoryBadge'
import EmptyState from '@/components/ui/EmptyState'

export default function TablePage() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState<PlantCategory | ''>('')
  const [location, setLocation] = useState<string>('')
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setSkip(0) 
    }, 300)
    return () => clearTimeout(handler)
  }, [searchInput])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as PlantCategory | '')
    setSkip(0)
  }
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value)
    setSkip(0)
  }
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value))
    setSkip(0)
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['plants', { search: debouncedSearch, category, location, skip, limit }],
    queryFn: () => getPlants({ search: debouncedSearch, category, location, skip, limit }),
  })

  const plants = Array.isArray(data) ? data : (data?.data ?? [])

  const total = Array.isArray(data) ? (data?.length ?? 0) : (data?.total ?? 0)
  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)
  const startItem = total === 0 ? 0 : skip + 1
  const endItem = Math.min(skip + limit, total)

  const goToPage = (pageNumber: number) => {
    setSkip((pageNumber - 1) * limit)
  }

  return (
    <div className="w-full flex-grow p-6 md:p-12 bg-surface-bright min-h-[calc(100vh-80px)]">
      <div className="max-w-[1440px] mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-h1 text-4xl text-primary font-bold">Data Portal</h1>
            <p className="text-on-surface-variant mt-2 flex items-center gap-2">
              Jelajahi catatan biodiversitas IPB secara komprehensif.
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                {isLoading ? '...' : total.toLocaleString('id-ID')} Total Data
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              to="/map"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">map</span>
              Buka Peta
            </Link>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col lg:flex-row gap-4 items-center mb-6">
          <div className="relative w-full lg:flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-outline-variant bg-white focus:ring-2 focus:ring-primary outline-none text-base" 
              placeholder="Cari spesies, nama latin, atau lokasi..." 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <select 
              value={category}
              onChange={handleCategoryChange}
              className="px-4 py-3 rounded-lg border border-outline-variant bg-white text-sm font-semibold min-w-[160px] focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {PLANT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>

            <select 
              value={location}
              onChange={handleLocationChange}
              className="px-4 py-3 rounded-lg border border-outline-variant bg-white text-sm font-semibold min-w-[160px] focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="">Semua Lokasi</option>
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select 
              value={limit}
              onChange={handleLimitChange}
              className="px-4 py-3 rounded-lg border border-outline-variant bg-white text-sm font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline-variant">
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Nama Latin</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Skala</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-4 text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {isLoading && (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="opacity-40">
                      <td className="px-6 py-4"><div className="h-4 w-6 bg-surface-variant rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="w-10 h-10 bg-surface-variant rounded-lg animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-surface-variant rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-40 bg-surface-variant rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-variant rounded-full animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-variant rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-12 bg-surface-variant rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-8 bg-surface-variant rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-8 w-8 bg-surface-variant rounded-full animate-pulse"></div></td>
                    </tr>
                  ))
                )}

                {!isLoading && plants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12">
                      <EmptyState 
                        title="Data Tidak Ditemukan" 
                        message={isError ? "Terjadi kesalahan saat memuat data." : "Tidak ada tanaman yang sesuai dengan filter pencarian Anda."} 
                      />
                    </td>
                  </tr>
                )}

                {!isLoading && plants.map((plant, index) => (
                  <tr key={plant.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 text-sm text-outline">
                      {skip + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/30">
                        {plant.image_url ? (
                          <img src={plant.image_url} alt={plant.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-outline">local_florist</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{plant.name}</td>
                    <td className="px-6 py-4 italic text-on-surface-variant">{plant.scientific_name}</td>
                    <td className="px-6 py-4">
                      <CategoryBadge category={plant.category} />
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{plant.location}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{plant.scale}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{plant.quantity}</td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/plants/${plant.id}`}
                        className="inline-flex p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors"
                        title="Lihat Detail"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-surface-container-low/50 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant">
            <p className="text-sm text-on-surface-variant">
              Menampilkan {startItem} sampai {endItem} dari {total} data
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <span className="text-sm font-semibold text-on-surface px-4">
                Halaman {currentPage} dari {totalPages || 1}
              </span>

              <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}