import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStats } from '@/api/plantApi'

export default function HomePage() {
  const { data: stats } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: getStats,
  })

  const totalPlants = stats?.total_plants || 0
  const totalLocations = stats ? Object.keys(stats.by_location).length : 0
  const totalCategories = stats ? Object.keys(stats.by_category).length : 0

  return (
    <div className="w-full">
\      <header className="relative min-h-[calc(100vh-80px)] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Aerial view of IPB University campus" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full pb-32">
          <div className="max-w-2xl text-on-primary">
            <h1 className="font-h1 text-5xl md:text-6xl mb-4 leading-tight font-bold">
              Sistem Informasi Biodiversitas IPB University
            </h1>
            <p className="font-body-lg text-lg mb-8 opacity-90">
              Mengintegrasikan data spasial dan informasi hayati untuk pemantauan ekosistem yang presisi. Menghubungkan riset akademik dengan pelestarian alam digital.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/map"
                className="px-8 py-4 bg-secondary-container text-on-secondary-container font-bold rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">map</span>
                Jelajahi Peta
              </Link>
              <Link 
                to="/table"
                className="px-8 py-4 border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">database</span>
                Lihat Data
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-white/20 py-8">
          <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 text-on-primary">
              <div className="p-4 bg-secondary-container/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
              <div>
                <div className="text-3xl font-h3 font-bold">{totalPlants.toLocaleString('id-ID')}</div>
                <div className="text-xs font-caption opacity-80 uppercase tracking-widest">Total Spesimen</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-on-primary border-white/10 md:border-l md:pl-8">
              <div className="p-4 bg-secondary-container/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div>
                <div className="text-3xl font-h3 font-bold">{totalLocations}</div>
                <div className="text-xs font-caption opacity-80 uppercase tracking-widest">Lokasi Pemantauan</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-on-primary border-white/10 md:border-l md:pl-8">
              <div className="p-4 bg-secondary-container/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
              </div>
              <div>
                <div className="text-3xl font-h3 font-bold">{totalCategories}</div>
                <div className="text-xs font-caption opacity-80 uppercase tracking-widest">Kategori Hayati</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-surface">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Eksplorasi Katalog</span>
              <h2 className="font-h2 text-3xl text-on-surface font-bold mt-1">Koleksi Spesies Terpilih</h2>
            </div>
            <Link to="/map" className="text-primary font-bold flex items-center gap-1 group">
              Lihat Semua Katalog 
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Link to="/map?category=ornamental" className="md:col-span-8 group relative overflow-hidden rounded-xl shadow-sm border border-outline-variant/30 h-[400px] block">
              <img 
                alt="Tanaman Hias" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">Terpopuler</span>
                <h3 className="text-2xl font-h3 text-white font-bold">Tanaman Hias & Eksotis</h3>
                <p className="text-white/80 max-w-lg mt-2">Katalog lengkap tanaman hias dari berbagai wilayah biogeografi di Indonesia.</p>
              </div>
            </Link>

            <Link to="/map?category=food" className="md:col-span-4 group relative overflow-hidden rounded-xl shadow-sm border border-outline-variant/30 h-[400px] block">
              <img 
                alt="Sumber Pangan" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-h3 font-bold">Sumber Pangan</h3>
                <p className="text-white/80 mt-2">Dokumentasi varietas lokal dan tanaman pangan berkelanjutan.</p>
              </div>
            </Link>

            <Link to="/map?category=herbal" className="md:col-span-6 group relative overflow-hidden rounded-xl shadow-sm border border-outline-variant/30 h-[300px] block">
              <img 
                alt="Tanaman Obat" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-h3 font-bold">Tanaman Obat & Herbal</h3>
                <p className="text-white/80 mt-2">Database etnobotani dan khasiat tanaman herbal nusantara.</p>
              </div>
            </Link>

            <Link to="/map" className="md:col-span-6 group relative overflow-hidden rounded-xl shadow-sm border border-outline-variant/30 h-[300px] bg-primary block">
              <div className="absolute inset-0 opacity-20">
                <img 
                  alt="GIS Maps" 
                  className="w-full h-full object-cover mix-blend-overlay" 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 text-on-primary">
                <span className="material-symbols-outlined text-[64px] mb-2">layers</span>
                <h3 className="text-2xl font-h3 font-bold">Lapisan Data Geospasial</h3>
                <p className="text-on-primary/80 mb-4 mt-2">Akses ribuan dataset spasial untuk analisis lingkungan tingkat lanjut.</p>
                <span className="bg-white text-primary px-6 py-2 rounded-lg font-bold hover:bg-secondary-container transition-colors inline-block">
                  Buka Map Explorer
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-12">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-[40px] mb-2">verified</span>
              <span className="text-sm font-label-sm font-bold">Terverifikasi Ahli</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-[40px] mb-2">update</span>
              <span className="text-sm font-label-sm font-bold">Update Real-time</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-[40px] mb-2">cloud_download</span>
              <span className="text-sm font-label-sm font-bold">Open Access Data</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-[40px] mb-2">school</span>
              <span className="text-sm font-label-sm font-bold">Standar Akademik</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}