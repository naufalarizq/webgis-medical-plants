import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { getLocations, getPlantsGeoJSON } from '@/api/plantApi'
import { CATEGORY_CONFIG, PLANT_CATEGORIES, buildLocationOptions } from '@/utils/categoryConfig'
import type { PlantCategory, PlantFeature } from '@/types'
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

const MARKER_OVERLAP_THRESHOLD_PX = 1.5

type PlantMarkerFeature = PlantFeature

const getFeatureCenter = (feature: PlantMarkerFeature): [number, number] => {
  const [lng, lat] = feature.geometry.coordinates
  return [lat, lng]
}

const buildMarkerClusters = (features: PlantMarkerFeature[], map: ReturnType<typeof useMap>) => {
  if (features.length === 0) return []

  const points = features
    .map((feature) => {
      const [lat, lng] = getFeatureCenter(feature)
      return {
        feature,
        lat,
        lng,
        point: map.latLngToLayerPoint([lat, lng]),
      }
    })
    .sort((left, right) => left.feature.properties.id - right.feature.properties.id)

  const groupedPoints: Array<{ anchor: (typeof points)[number], items: typeof points }> = []

  points.forEach((point) => {
    const matchingGroup = groupedPoints.find(
      (group) => group.anchor.point.distanceTo(point.point) <= MARKER_OVERLAP_THRESHOLD_PX
    )

    if (matchingGroup) {
      matchingGroup.items.push(point)
      return
    }

    groupedPoints.push({ anchor: point, items: [point] })
  })

  return groupedPoints
    .map((items) => {
      const sortedItems = [...items.items].sort(
        (left, right) => left.feature.properties.id - right.feature.properties.id
      )
      const centerLat = sortedItems.reduce((sum, item) => sum + item.lat, 0) / sortedItems.length
      const centerLng = sortedItems.reduce((sum, item) => sum + item.lng, 0) / sortedItems.length

      return {
        id: sortedItems.map((item) => item.feature.properties.id).join('-'),
        items: sortedItems.map((item) => item.feature),
        center: [centerLat, centerLng] as [number, number],
      }
    })
    .sort((left, right) => left.items[0].properties.id - right.items[0].properties.id)
}

const ClusterIcon = ({ count }: { count: number }) =>
  new DivIcon({
    className: 'combined-plant-marker',
    html: `<div class="combined-plant-marker__bubble">${count}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  })

const PlantPopupCard = ({ feature }: { feature: PlantMarkerFeature }) => {
  const props = feature.properties

  return (
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
  )
}

const ClusterPopup = ({ items }: { items: PlantMarkerFeature[] }) => {
  return (
    <div className="flex flex-col gap-3 p-1 w-[280px] sm:w-[320px]">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
        <div>
          <p className="text-xs font-semibold text-on-surface-variant">Titik gabungan</p>
          <p className="text-sm font-bold text-on-surface">{items.length} tanaman</p>
        </div>
        <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
          Overlap
        </div>
      </div>

      <div className="max-h-[320px] overflow-y-auto pr-1 space-y-2">
        {items.map((feature) => {
          const props = feature.properties
          return (
            <div key={props.id} className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-on-surface truncate">{props.name}</h4>
                  <p className="text-[11px] italic text-on-surface-variant truncate">{props.scientific_name || '-'}</p>
                </div>
                <CategoryBadge category={props.category} />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-on-surface-variant">
                <span className="truncate">{props.location}</span>
                <Link to={`/plants/${props.id}`} className="text-primary font-semibold hover:underline shrink-0">
                  Detail
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PlantMarkers = ({ features }: { features: PlantMarkerFeature[] }) => {
  const map = useMap()
  const [, setViewVersion] = useState(0)

  useMapEvents({
    zoomend: () => setViewVersion((value) => value + 1),
    moveend: () => setViewVersion((value) => value + 1),
  })

  const clusters = useMemo(
    () => buildMarkerClusters(features, map),
    [features, map]
  )

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.items.length === 1) {
          const feature = cluster.items[0]
          const [lat, lng] = getFeatureCenter(feature)
          const config = CATEGORY_CONFIG[feature.properties.category]

          return (
            <CircleMarker
              key={feature.properties.id}
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
                <PlantPopupCard feature={feature} />
              </Popup>
            </CircleMarker>
          )
        }

        return (
          <Marker
            key={cluster.id}
            position={cluster.center as LatLngExpression}
            icon={ClusterIcon({ count: cluster.items.length })}
          >
            <Popup className="custom-leaflet-popup combined-popup" minWidth={300} maxWidth={360}>
              <ClusterPopup items={cluster.items} />
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

export default function MapPage() {
  const [category, setCategory] = useState<PlantCategory | ''>('')
  const [location, setLocation] = useState<string>('')
  const [activeLayer, setActiveLayer] = useState<MapLayer>('osm')
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768)

  const { data: geoJsonData, isFetching } = useQuery({
    queryKey: ['plants-geojson', { category, location }],
    queryFn: () => getPlantsGeoJSON({ category, location }),
  })

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  })

  const locationOptions = buildLocationOptions(locations)
  const mapCenter: LatLngExpression = [-6.5603, 106.7261]

  return (
    <div className="flex h-[calc(100vh-80px)] w-full relative overflow-hidden bg-surface-container">
      
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 z-[1001] transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside 
        className={`absolute left-0 top-0 z-[1002] h-full w-[280px] sm:w-72 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant/20 shadow-xl flex flex-col p-4 gap-2 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-primary font-h3 font-bold text-xl leading-tight">WebGIS Control</h2>
            <p className="font-caption text-sm text-on-surface-variant">Biodiversity Monitoring</p>
          </div>
          <button 
            className="p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-error rounded-lg transition-colors"
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
                {locationOptions.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
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
            className="absolute top-4 left-4 z-[999] bg-surface text-primary p-2.5 rounded-xl shadow-lg border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high active:scale-95 transition-all"
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

          <PlantMarkers features={geoJsonData?.features ?? []} />
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
        .combined-plant-marker {
          background: transparent;
          border: none;
        }
        .combined-plant-marker__bubble {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #004d26;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0, 77, 38, 0.22);
        }
        .combined-popup .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  )
}
