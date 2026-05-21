import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlants, deletePlant, bulkDeletePlants } from '@/api/plantApi'
import CategoryBadge from '@/components/ui/CategoryBadge'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, PlusIcon, SproutIcon } from '@/components/ui/AdminIcons'
import { CAMPUS_LOCATIONS, PLANT_CATEGORIES, CATEGORY_CONFIG } from '@/utils/categoryConfig'
import { Link, useNavigate } from 'react-router-dom'
import type { PlantCategory } from '@/types'
import toast from 'react-hot-toast'

export const ManagePlantsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PlantCategory | ''>('')
  const [location, setLocation] = useState('')
  const [limit] = useState(10)
  const [skip, setSkip] = useState(0)

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['plants-list', { search, category, location, skip, limit }],
    queryFn: () => getPlants({ search, category, location, skip, limit }),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlant,
    onSuccess: () => {
      toast.success('Spesimen berhasil dihapus')
      queryClient.invalidateQueries({ queryKey: ['plants-list'] })
      setDeletingId(null)
    }
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeletePlants,
    onSuccess: () => {
      toast.success(`${selectedIds.length} spesimen berhasil dihapus secara massal`)
      queryClient.invalidateQueries({ queryKey: ['plants-list'] })
      setSelectedIds([])
      setIsBulkDeleteOpen(false)
    }
  })

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.data) {
      setSelectedIds(data.data.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#004d26]">Kelola Tanaman</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manajemen database keanekaragaman hayati IPB University</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              Hapus {selectedIds.length} Item
            </button>
          )}
          <Link
            to="/admin/plants/add"
            className="w-full sm:w-auto px-4 py-2 bg-[#004d26] hover:bg-[#003318] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-4 w-4" /> Tambah Tanaman
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-100 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setSkip(0) }}
          placeholder="Cari nama spesies, lokasi..."
          className="w-full px-3 sm:px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26] transition-all"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value as PlantCategory | ''); setSkip(0) }}
          className="w-full px-3 sm:px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26] transition-all cursor-pointer"
        >
          <option value="">Semua Spesies / Kategori</option>
          {PLANT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => { setLocation(e.target.value); setSkip(0) }}
          className="w-full px-3 sm:px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26] transition-all cursor-pointer"
        >
          <option value="">Seluruh Wilayah Kampus</option>
          {CAMPUS_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                <th className="p-3 sm:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={!!data?.data?.length && data.data.every(plant => selectedIds.includes(plant.id))}
                    className="rounded border-slate-300 text-[#004d26] focus:ring-[#004d26] cursor-pointer"
                  />
                </th>
                <th className="p-3 sm:p-4 w-16">Foto</th>
                <th className="p-3 sm:p-4">Nama Spesies</th>
                <th className="p-3 sm:p-4">Kategori</th>
                <th className="p-3 sm:p-4">Lokasi</th>
                <th className="p-3 sm:p-4">Tanggal Dibuat</th>
                <th className="p-3 sm:p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={7} className="p-6 text-center text-slate-400">Memuat data baris...</td>
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    Tidak ditemukan kecocokan data tanaman.
                  </td>
                </tr>
              ) : (
                data?.data.map((plant) => (
                  <tr key={plant.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 sm:p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(plant.id)}
                        onChange={(e) => handleSelectOne(plant.id, e.target.checked)}
                        className="rounded border-slate-300 text-[#004d26] focus:ring-[#004d26] cursor-pointer"
                      />
                    </td>
                    <td className="p-3 sm:p-4">
                      {plant.image_url ? (
                        <img
                          src={plant.image_url}
                          alt={plant.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                          <SproutIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 min-w-[180px]">
                      <p className="font-bold text-slate-800 line-clamp-1">{plant.name}</p>
                      <p className="text-xs italic text-slate-400 mt-0.5 line-clamp-1">{plant.scientific_name}</p>
                    </td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <CategoryBadge category={plant.category} />
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="h-4 w-4 text-emerald-700 shrink-0" />
                        <span className="truncate">{plant.location}</span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(plant.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3 sm:p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/plants/edit/${plant.id}`)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(plant.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-all cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-slate-500 font-medium gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              Menampilkan {skip + 1}–{Math.min(skip + limit, data.total)} dari {data.total} data
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Halaman sebelumnya"
                disabled={skip === 0}
                onClick={() => setSkip((p) => Math.max(0, p - limit))}
                className="p-1.5 sm:px-2 sm:py-1.5 rounded bg-white border border-slate-200 disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                aria-label="Halaman berikutnya"
                disabled={skip + limit >= data.total}
                onClick={() => setSkip((p) => p + limit)}
                className="p-1.5 sm:px-2 sm:py-1.5 rounded bg-white border border-slate-200 disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deletingId !== null}
        title="Hapus Spesimen Tanaman"
        message="Apakah Anda yakin ingin menolak dan menghapus data spesimen biodiversitas ini secara permanen?"
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onCancel={() => setDeletingId(null)}
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        title="Hapus Massal Koleksi"
        message={`Apakah Anda yakin ingin menghapus sebanyak ${selectedIds.length} spesimen tanaman terpilih sekaligus dari database?`}
        onConfirm={() => bulkDeleteMutation.mutate(selectedIds)}
        onCancel={() => setIsBulkDeleteOpen(false)}
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  )
}