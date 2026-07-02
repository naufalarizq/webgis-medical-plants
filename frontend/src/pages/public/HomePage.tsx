import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStats } from '@/api/plantApi'

export default function HomePage() {
  const { data: stats } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: getStats,
  })

  const totalPlants = stats?.total_plants || 0
  const totalLocations = stats?.by_location ? Object.keys(stats.by_location).length : 0
  const totalCategories = stats?.by_category ? Object.keys(stats.by_category).length : 0

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col">
      <header className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Aerial view of IPB University campus" 
            className="w-full h-full object-cover object-center" 
            src="/images/hero.png" 
          />
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-primary/95 via-primary/80 to-black/60 lg:to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center py-20 lg:py-0">
          <div className="w-full max-w-3xl text-on-primary">
            <h1 className="font-h1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-bold tracking-tight text-balance">
              Sistem Informasi Biodiversitas IPB University
            </h1>
            <p className="font-body-lg text-base sm:text-lg md:text-xl mb-10 opacity-90 leading-relaxed max-w-2xl text-pretty">
              Mengintegrasikan data spasial dan informasi hayati untuk pemantauan ekosistem yang presisi. Menghubungkan riset akademik dengan pelestarian alam digital.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16">
              <Link 
                to="/map"
                className="w-full sm:w-auto px-8 py-4 bg-secondary-container text-on-secondary-container font-bold rounded-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-base"
              >
                <span className="material-symbols-outlined text-2xl">map</span>
                Jelajahi Peta
              </Link>
              <Link 
                to="/table"
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/40 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg hover:bg-white hover:text-primary active:scale-95 transition-all flex items-center justify-center gap-3 text-base"
              >
                <span className="material-symbols-outlined text-2xl">database</span>
                Lihat Data
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full bg-primary/60 lg:bg-white/10 backdrop-blur-xl border-t border-white/20 py-8 mt-auto">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-center gap-4 text-on-primary">
              <div className="p-4 bg-secondary-container/20 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
              <div className="min-w-0">
                <div className="text-3xl lg:text-4xl font-h3 font-bold tracking-tight truncate">{totalPlants.toLocaleString('id-ID')}</div>
                <div className="text-xs lg:text-sm font-caption opacity-80 uppercase tracking-widest truncate mt-1">Total Spesimen</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-on-primary pt-6 border-t border-white/20 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6 md:pl-8">
              <div className="p-4 bg-secondary-container/20 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div className="min-w-0">
                <div className="text-3xl lg:text-4xl font-h3 font-bold tracking-tight truncate">{totalLocations}</div>
                <div className="text-xs lg:text-sm font-caption opacity-80 uppercase tracking-widest truncate mt-1">Lokasi Pemantauan</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-on-primary pt-6 border-t border-white/20 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6 md:pl-8">
              <div className="p-4 bg-secondary-container/20 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
              </div>
              <div className="min-w-0">
                <div className="text-3xl lg:text-4xl font-h3 font-bold tracking-tight truncate">{totalCategories}</div>
                <div className="text-xs lg:text-sm font-caption opacity-80 uppercase tracking-widest truncate mt-1">Kategori Hayati</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            <Link to="/map?category=ornamental" className="md:col-span-8 group relative overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30 h-[300px] sm:h-[400px] lg:h-[480px] block w-full">
              <img 
                alt="A group of vegetables in a basket" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1697373758830-7d0375b983ee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold w-fit mb-3 tracking-wide">Terpopuler</span>
                <h3 className="text-2xl sm:text-3xl font-h3 text-white font-bold tracking-tight mb-2">Tanaman Ornamental</h3>
                <p className="text-white/80 max-w-lg text-sm sm:text-base line-clamp-2 md:line-clamp-none">Katalog lengkap tanaman hias dari berbagai wilayah biogeografi di Indonesia.</p>
              </div>
            </Link>

            <Link to="/map?category=food" className="md:col-span-4 group relative overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30 h-[300px] sm:h-[400px] lg:h-[480px] block w-full">
              <img 
                alt="Sumber Pangan" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-h3 font-bold tracking-tight mb-2">Tanaman Food</h3>
                <p className="text-white/80 text-sm sm:text-base line-clamp-3">Dokumentasi varietas lokal dan tanaman pangan berkelanjutan.</p>
              </div>
            </Link>

            <Link to="/map?category=herbal" className="md:col-span-4 group relative overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30 h-[300px] sm:h-[350px] lg:h-[400px] block w-full">
              <img 
                alt="A person holding a bunch of plants in their hands" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://plus.unsplash.com/premium_photo-1678382341904-44e5e271282b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-h3 font-bold tracking-tight mb-2">Tanaman Herbal</h3>
                <p className="text-white/80 text-sm sm:text-base line-clamp-3">Database etnobotani dan khasiat medis flora nusantara.</p>
              </div>
            </Link>

            <Link to="/map?category=aromatic" className="md:col-span-4 group relative overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30 h-[300px] sm:h-[350px] lg:h-[400px] block w-full">
              <img 
                alt="Clear tea cup on brown surface" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1656501020056-1c631268e3d0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-h3 font-bold tracking-tight mb-2">Tanaman Aromatic</h3>
                <p className="text-white/80 text-sm sm:text-base line-clamp-3">Spesies flora penghasil minyak atsiri dan pewangi alami.</p>
              </div>
            </Link>

            <Link to="/map?category=shade" className="md:col-span-4 group relative overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30 h-[300px] sm:h-[350px] lg:h-[400px] block w-full">
              <img 
                alt="Tanaman Pelindung" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-h3 font-bold tracking-tight mb-2">Tanaman Shade</h3>
                <p className="text-white/80 text-sm sm:text-base line-clamp-3">Pohon peneduh penjaga iklim mikro dan ekosistem kampus.</p>
              </div>
            </Link>

            <Link to="/map" className="md:col-span-12 group relative overflow-hidden rounded-2xl shadow-sm border border-outline-variant/30 h-[250px] sm:h-[300px] lg:h-[350px] bg-primary block w-full">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                <img 
                  alt="GIS Maps" 
                  className="w-full h-full object-cover mix-blend-overlay" 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6 sm:p-8 text-on-primary">
                <span className="material-symbols-outlined text-5xl sm:text-6xl lg:text-[72px] mb-4 drop-shadow-md group-hover:scale-110 transition-transform duration-500">layers</span>
                <h3 className="text-2xl sm:text-3xl font-h3 font-bold tracking-tight mb-3">Lapisan Data Geospasial</h3>
                <p className="text-on-primary/90 mb-6 text-sm sm:text-base max-w-xl text-balance">Akses ribuan dataset spasial untuk analisis lingkungan tingkat lanjut dengan alat pemetaan interaktif.</p>
                <span className="bg-white text-primary px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-secondary-container hover:shadow-lg transition-all duration-300 inline-block">
                  Buka Map Explorer
                </span>
              </div>
            </Link>
          </div>

      <section className="w-full bg-surface-container-low py-12 sm:py-16 lg:py-20 border-t border-outline-variant/30 mt-auto">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 mb-4 rounded-full bg-surface shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors">verified</span>
              </div>
              <span className="text-sm sm:text-base font-label-sm font-bold text-on-surface">Terverifikasi Ahli</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 mb-4 rounded-full bg-surface shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors">update</span>
              </div>
              <span className="text-sm sm:text-base font-label-sm font-bold text-on-surface">Update Real-time</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 mb-4 rounded-full bg-surface shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors">cloud_download</span>
              </div>
              <span className="text-sm sm:text-base font-label-sm font-bold text-on-surface">Open Access Data</span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 mb-4 rounded-full bg-surface shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors">school</span>
              </div>
              <span className="text-sm sm:text-base font-label-sm font-bold text-on-surface">Standar Akademik</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}