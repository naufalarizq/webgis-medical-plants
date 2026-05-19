import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStats } from '@/api/plantApi'
import { CalendarPlusIcon, FolderIcon, MapPinIcon, SproutIcon } from '@/components/ui/AdminIcons'
import { CATEGORY_CONFIG } from '@/utils/categoryConfig'
import type { PlantCategory } from '@/types'

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: getStats
  })

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#004d26] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const categoryEntries = Object.entries(stats?.by_category || {}) as [PlantCategory, number][]
  const locationEntries = Object.entries(stats?.by_location || {})

  // Menghitung persentase untuk Donut Chart tiruan lokal
  const totalLocationCount = Object.values(stats?.by_location || {}).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time biodiversity monitoring and academic research metrics.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <SproutIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Total Tanaman</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.total_plants.toLocaleString('id-ID') || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="h-10 w-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <FolderIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Total Kategori</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{categoryEntries.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="h-10 w-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <MapPinIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Total Lokasi</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{locationEntries.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarPlusIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Tanaman Ditambah</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.total_plants.toLocaleString('id-ID') || 0}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Replacement */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-6">Tanaman per Kategori</h3>
          <div className="space-y-4 h-64 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-4 h-48 px-2">
              {categoryEntries.map(([cat, count]) => {
                const max = Math.max(...categoryEntries.map(([, v]) => v)) || 1
                const heightPct = `${(count / max) * 100}%`
                return (
                  <div key={cat} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{count}</span>
                    <div 
                      style={{ height: heightPct, backgroundColor: CATEGORY_CONFIG[cat]?.markerColor || '#cbd5e1' }}
                      className="w-full rounded-t-md transition-all duration-500 hover:brightness-95"
                    />
                    <span className="text-[10px] font-medium text-slate-500 mt-2 text-center truncate w-full">
                      {CATEGORY_CONFIG[cat]?.label || cat}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Donut Chart Replacement */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col">
          <h3 className="text-base font-bold text-slate-800 mb-4">Distribusi Lokasi</h3>
          <div className="flex-1 flex flex-col justify-center">
            {/* Legend list with breakdown percentages */}
            <div className="space-y-3">
              {locationEntries.map(([loc, count]) => {
                const pct = Math.round((count / totalLocationCount) * 100)
                return (
                  <div key={loc} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#004d26]" />
                      <span className="text-xs font-semibold text-slate-600">{loc}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
