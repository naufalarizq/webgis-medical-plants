import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import { getPlantsGeoJSON } from '@/api/plantApi'
import { CATEGORY_CONFIG, PLANT_CATEGORIES, CAMPUS_LOCATIONS } from '@/utils/categoryConfig'
import type { PlantCategory } from '@/types'
import CategoryBadge from '@/components/ui/CategoryBadge'

type MapLayer = 'osm' | 'satellite' | 'terrain'

const TILE_LAYERS: Record<MapLayer, { url: string; attribution: string; subdomains?: string[] }> = {
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

  const { data: geoJsonData, isFetching } = useQuery({
    queryKey: ['plants-geojson', { category, location }],
    queryFn: () => getPlantsGeoJSON({ category, location }),
  })

  const mapCenter: [number, number] = [-6.5603, 106.7261]

  return (
    <div className="flex h-[calc(100vh-80px)] w-full relative overflow-hidden bg-surface-container">
      
      <aside className="h-full w-72 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant/20 shadow-lg shadow-primary/5 flex flex-col p-4 gap-2 z-[1000] transition-all overflow-y-auto">
        <div className="mb-2">
          <h2 className="text-primary font-h3 font-bold text-xl leading-tight">WebGIS Control</h2>
          <p className="font-caption text-sm text-on-surface-variant">Biodiversity Monitoring</p>
        </div>

        <div className="mt-4">
          <p className="font-label-sm text-outline uppercase tracking-widest text-[10px] mb-2 px-2">Layer Switcher</p>
          <div className="flex flex-col gap-1">
            {(Object.keys(TILE_LAYERS) as MapLayer[]).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-transform hover:translate-x-1 ${
                  activeLayer === layer 
                    ? 'bg-secondary-container text-on-secondary-container font-bold' 
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

        <div className="mt-6">
          <p className="font-label-sm text-outline uppercase tracking-widest text-[10px] mb-2 px-2">Filter Panel</p>
          <div className="space-y-4 px-2">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-on-surface-variant">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as PlantCategory | '')}
                className="w-full bg-surface border border-outline-variant/50 rounded-lg text-sm p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer"
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
                className="w-full bg-surface border border-outline-variant/50 rounded-lg text-sm p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer"
              >
                <option value="">Semua Lokasi</option>
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => { setCategory(''); setLocation(''); }}
              className="w-full mt-2 text-xs font-bold text-primary border border-primary/30 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-outline-variant/20">
          <p className="font-label-sm text-outline uppercase tracking-widest text-[10px] mb-2 px-2">Map Legend</p>
          <div className="flex flex-col gap-2 px-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: config.markerColor, boxShadow: `0 0 8px ${config.markerColor}80` }}
                ></div>
                <span className="text-caption text-sm text-on-surface-variant">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-grow relative z-0">
        {isFetching && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
            <div className="bg-surface/90 backdrop-blur-md px-6 py-2 rounded-full border border-outline-variant/50 shadow-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
              <span className="text-caption text-sm font-semibold text-primary">Memuat Data Spasial...</span>
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
            subdomains={TILE_LAYERS[activeLayer].subdomains || 'abc'}
          />
          
          <ZoomControl position="topright" />

          {geoJsonData?.features.map((feature) => {
            const [lng, lat] = feature.geometry.coordinates 
            const props = feature.properties
            const config = CATEGORY_CONFIG[props.category]
            
            return (
              <CircleMarker
                key={props.id}
                center={[lat, lng]} 
                pathOptions={{ 
                  fillColor: config?.markerColor || '#000', 
                  color: '#ffffff', 
                  weight: 2, 
                  fillOpacity: 0.9 
                }}
                radius={8}
              >
                <Popup className="custom-leaflet-popup" minWidth={260} maxWidth={300}>
                  <div className="flex flex-col overflow-hidden m-0 p-0">
                    <div className="h-32 w-full bg-surface-container-high relative rounded-t-xl overflow-hidden">
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
                    
                    <div className="p-4 bg-surface rounded-b-xl">
                      <h3 className="font-h3 text-lg font-bold leading-tight text-on-surface mb-0">{props.name}</h3>
                      <p className="font-caption text-sm italic text-on-surface-variant m-0 mb-3">{props.scientific_name}</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/30">
                        <span className="text-xs font-semibold text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {props.location}
                        </span>
                        
                        <Link 
                          to={`/plants/${props.id}`}
                          className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          Detail <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .custom-leaflet-popup .leaflet-popup-close-button {
          color: white !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          z-index: 10;
        }
      `}</style>
    </div>
  )
}