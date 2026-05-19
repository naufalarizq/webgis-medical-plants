import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { getPlantsGeoJSON } from '@/api/plantApi'
import { CATEGORY_CONFIG, PLANT_CATEGORIES, CAMPUS_LOCATIONS } from '@/utils/categoryConfig'
import type { PlantCategory } from '@/types'
import CategoryBadge from '@/components/ui/CategoryBadge'

type MapLayer = 'osm' | 'satellite' | 'terrain'

const TILE_LAYERS: Record<MapLayer, { url: string; attribution: string; subdomains?: string | string[] }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
  },
}

export default function MapPage() {
  const [category, setCategory] = useState<PlantCategory | ''>('')
  const [location, setLocation] = useState<string>('')
  const [activeLayer, setActiveLayer] = useState<MapLayer>('osm')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data: geoJsonData, isFetching } = useQuery({
    queryKey: ['plants-geojson', { category, location }],
    queryFn: () => getPlantsGeoJSON({ category, location }),
  })

  const mapCenter: LatLngExpression = [-6.5603, 106.7261]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-[calc(100vh-80px)] w-full relative overflow-hidden bg-surface-container">
      
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 z-[1001] transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside 
        className={`absolute md:relative z-[1002] md:z-[1000] h-full w-[280px] sm:w-72 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant/20 shadow-xl md:shadow-lg shadow-primary/5 flex flex-col p-4 gap-2 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-primary font-h3 font-bold text-xl leading-tight">WebGIS Control</h2>
            <p className="font-caption text-sm text-on-surface-variant">Biodiversity Monitoring</p>
          </div>
          <button 
            className="md:hidden p-1 text-on-surface-variant hover:bg-surface-container-high rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="mt-2 md:mt-4">
          <p className="font-label-sm text-outline uppercase tracking-widest text-[10px] mb-2 px-2">Layer Switcher</p>
          <div className="flex flex-col gap-1">
            {(Object.keys(TILE_LAYERS) as MapLayer[]).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:translate-x-1 ${
                  activeLayer === layer 
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined">
                  {layer === 'osm' ? 'map' : layer === 'satellite' ? 'layers' : 'terrain'}
                </span>
                <span className="font-caption text-sm capitalize">
                  {layer === 'osm' ? 'Default View' : layer}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <p className="font-label-sm text-outline uppercase tracking-widest text-[10px] mb-2 px-2">Filter Panel</p>
          <div className="space-y-4 px-2">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-on-surface-variant">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as PlantCategory | '')}
                className="w-full bg-surface border border-outline-variant/50 rounded-lg text-sm p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer appearance-none"
              >
                <option value="">Semua Kategori</option>
                {PLANT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-on-surface-variant">Lokasi Area</label>
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-surface border border-outline-variant/50 rounded-lg text-sm p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer appearance-none"
              >
                <option value="">Semua Lokasi</option>
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => { setCategory(''); setLocation(''); }}
              className="w-full mt-2 text-xs font-bold text-primary border border-primary/30 py-2 rounded-lg hover:bg-primary/5 active:scale-95 transition-all"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-outline-variant/20">
          <p className="font-label-sm text-outline uppercase tracking-widest text-[10px] mb-2 px-2">Map Legend</p>
          <div className="flex flex-col gap-2 px-2 pb-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm shrink-0" 
                  style={{ backgroundColor: config.markerColor, boxShadow: `0 0 8px ${config.markerColor}80` }}
                ></div>
                <span className="text-caption text-sm text-on-surface-variant truncate">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-grow relative z-0 h-full w-full">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-[999] bg-surface text-primary p-2.5 rounded-xl shadow-lg border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">menu_open</span>
          </button>
        )}

        {isFetching && (
          <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none w-[90%] md:w-auto flex justify-center">
            <div className="bg-surface/90 backdrop-blur-md px-4 md:px-6 py-2 rounded-full border border-outline-variant/50 shadow-lg flex items-center gap-2 md:gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0"></div>
              <span className="text-caption text-xs md:text-sm font-semibold text-primary whitespace-nowrap">Memuat Data Spasial...</span>
            </div>
          </div>
        )}

        <MapContainer 
          center={mapCenter} 
          zoom={15} 
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            key={activeLayer}
            url={TILE_LAYERS[activeLayer].url}
            attribution={TILE_LAYERS[activeLayer].attribution}
            subdomains={TILE_LAYERS[activeLayer].subdomains ?? 'abc'}
          />
          
          <ZoomControl position="topright" />

          {geoJsonData?.features.map((feature) => {
            const [lng, lat] = feature.geometry.coordinates 
            const props = feature.properties
            const config = CATEGORY_CONFIG[props.category]
            
            return (
              <CircleMarker
                key={props.id}
                center={[lat, lng] as LatLngExpression}
                pathOptions={{ 
                  fillColor: config?.markerColor || '#000', 
                  color: '#ffffff', 
                  weight: 2, 
                  fillOpacity: 0.9 
                }}
                radius={8}
              >
                <Popup className="custom-leaflet-popup" minWidth={240} maxWidth={280}>
                  <div className="flex flex-col overflow-hidden m-0 p-0">
                    <div className="h-28 sm:h-32 w-full bg-surface-container-high relative rounded-t-xl overflow-hidden">
                      {props.image_url ? (
                        <img src={props.image_url} alt={props.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline bg-surface-variant">
                          <span className="material-symbols-outlined text-4xl">local_florist</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                         <CategoryBadge category={props.category} />
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-surface rounded-b-xl">
                      <h3 className="font-h3 text-base sm:text-lg font-bold leading-tight text-on-surface mb-0 line-clamp-1">{props.name}</h3>
                      <p className="font-caption text-xs sm:text-sm italic text-on-surface-variant m-0 mb-2 sm:mb-3 line-clamp-1">{props.scientific_name}</p>
                      
                      <div className="flex justify-between items-center mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-outline-variant/30">
                        <span className="text-[10px] sm:text-xs font-semibold text-outline flex items-center gap-1 truncate max-w-[60%]">
                          <span className="material-symbols-outlined text-[12px] sm:text-[14px] shrink-0">location_on</span>
                          <span className="truncate">{props.location}</span>
                        </span>
                        
                        <Link 
                          to={`/plants/${props.id}`}
                          className="text-primary text-[10px] sm:text-xs font-bold hover:underline flex items-center gap-1 shrink-0"
                        >
                          Detail <span className="material-symbols-outlined text-[12px] sm:text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 0.75rem;
          border: 1px solid rgba(192, 201, 187, 0.3);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .custom-leaflet-popup .leaflet-popup-close-button {
          color: white !important;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
          z-index: 10;
          padding: 4px;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .leaflet-control-zoom a {
          color: #00450d !important;
          background-color: #f7fbf1 !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #ecefe6 !important;
        }
      `}</style>
    </div>
  )
}