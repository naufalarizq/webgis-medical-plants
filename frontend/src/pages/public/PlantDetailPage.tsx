import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { getPlant } from '@/api/plantApi'
import { CATEGORY_CONFIG } from '@/utils/categoryConfig'
import CategoryBadge from '@/components/ui/CategoryBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

export default function PlantDetailPage() {
  const { id } = useParams()
  const plantId = Number(id)

  const { data: plant, isLoading, isError } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: () => getPlant(plantId),
    enabled: !isNaN(plantId),
  })

  if (isNaN(plantId)) {
    return (
      <div className="pt-12 px-6 max-w-[1440px] mx-auto min-h-[calc(100vh-80px)]">
        <EmptyState title="ID Tidak Valid" message="Parameter ID tanaman tidak sesuai format." />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="pt-12 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <LoadingSpinner fullScreen={false} />
      </div>
    )
  }

  if (isError || !plant) {
    return (
      <div className="pt-12 px-6 max-w-[1440px] mx-auto min-h-[calc(100vh-80px)]">
        <EmptyState 
          title="Data Tidak Ditemukan" 
          message="Tanaman yang Anda cari mungkin telah dihapus atau tidak ada dalam sistem."
          action={<Link to="/table" className="text-primary font-bold hover:underline">Kembali ke Portal Data</Link>}
        />
      </div>
    )
  }

  const formattedDate = new Date(plant.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const markerColor = CATEGORY_CONFIG[plant.category]?.markerColor || '#000'

  return (
    <div className="pb-20 pt-12 px-6 md:px-12 max-w-[1440px] mx-auto min-h-[calc(100vh-80px)]">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <nav className="flex items-center gap-2 text-on-surface-variant text-xs">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/table" className="hover:text-primary transition-colors">Data Portal</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold truncate max-w-[150px] md:max-w-none">
            {plant.name}
          </span>
        </nav>
        
        <Link to="/table" className="flex items-center gap-2 text-primary text-sm font-bold hover:underline transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali ke Data
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="relative group overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low shadow-sm aspect-[4/3]">
            {plant.image_url ? (
              <img 
                src={plant.image_url} 
                alt={plant.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[80px] opacity-50">local_florist</span>
                <span className="mt-4 text-sm font-semibold opacity-70">Foto belum tersedia</span>
              </div>
            )}
            
            {plant.image_url && (
              <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md p-2 rounded-lg shadow-lg border border-outline-variant/20 pointer-events-none">
                <div className="flex items-center justify-center p-2 rounded-md">
                  <span className="material-symbols-outlined text-primary">zoom_in</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-lg shadow-primary/5">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <CategoryBadge category={plant.category} className="mb-3" />
                <h1 className="font-h2 text-3xl md:text-4xl text-on-surface leading-tight font-bold">
                  {plant.name}
                </h1>
                <p className="font-body-lg text-lg text-primary italic mt-1">
                  {plant.scientific_name}
                </p>
              </div>
            </div>
            
            <hr className="border-outline-variant/30 mb-6" />
            
            {/* Grid Informasi Data */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Skala Pertumbuhan</p>
                <p className="text-xs text-on-surface-variant tracking-wider font-regular mb-1">Ukuran tanaman ketika ditemukan</p>
                <p className="text-base text-on-surface font-medium">{plant.scale}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Jumlah Terpantau</p>
                <p className="text-base text-on-surface font-medium">{plant.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Kategori Sistem</p>
                <p className="text-base text-on-surface font-medium capitalize">{plant.category}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Tanggal Terdata</p>
                <p className="text-base text-on-surface font-medium">{formattedDate}</p>
              </div>
            </div>

            {/* Lokasi & Map Container */}
            <div className="mt-8 p-4 bg-surface-container-low rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <span className="material-symbols-outlined">location_on</span>
                <span className="font-semibold text-sm">Data Spasial Wilayah</span>
              </div>
              
              <div className="space-y-3">
                <p className="text-base text-on-surface">{plant.location}</p>
                <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant bg-surface p-2 rounded border border-outline-variant/30">
                  <span className="font-mono">Lat: {plant.lat.toFixed(6)}</span>
                  <span className="font-mono">Long: {plant.lng.toFixed(6)}</span>
                </div>
              </div>

              <div className="mt-4 h-[200px] w-full rounded-lg overflow-hidden border border-outline-variant/30 relative z-0">
                <MapContainer 
                  center={[plant.lat, plant.lng]} 
                  zoom={16} 
                  zoomControl={false} 
                  className="w-full h-full"
                  dragging={false} 
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OSM'
                  />
                  <CircleMarker
                    center={[plant.lat, plant.lng]}
                    pathOptions={{ 
                      fillColor: markerColor, 
                      color: '#ffffff', 
                      weight: 2, 
                      fillOpacity: 0.9 
                    }}
                    radius={8}
                  />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}