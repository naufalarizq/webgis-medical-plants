import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createPlant, updatePlant, getPlant } from '@/api/plantApi'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import {
  ChevronLeftIcon,
  CloudUploadIcon,
  FileTextIcon,
  ImageIcon,
  InfoIcon,
  LocateFixedIcon,
  MapPinIcon,
  SaveIcon
} from '@/components/ui/AdminIcons'
import { PLANT_CATEGORIES, CATEGORY_CONFIG } from '@/utils/categoryConfig'
import * as L from 'leaflet'
import toast from 'react-hot-toast'

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
// @ts-ignore (Abaikan pengecekan tipe objek prototipe internal leaflet)
delete L.Marker.prototype.options.icon
L.Marker.prototype.options.icon = DefaultIcon

const plantFormSchema = z.object({
  name: z.string().min(1, 'Nama umum tanaman wajib diisi').max(255),
  scientific_name: z.string().min(1, 'Nama latin ilmiah wajib diisi').max(255),
  category: z.enum(['ornamental', 'food', 'herbal', 'aromatic', 'shade']),
  location: z.string().min(1, 'Lokasi kampus penempatan wajib diisi'),
  scale: z.coerce.number().int().positive('Skala pertumbuhan harus berupa angka positif'),
  quantity: z.coerce.number().int().positive('Jumlah spesimen harus bernilai minimal 1'),
  lat: z.coerce.number().min(-90).max(90, 'Latitude tidak valid'),
  lng: z.coerce.number().min(-180).max(180, 'Longitude tidak valid'),
  photo: z.any().optional()
})

type PlantFormInputs = z.infer<typeof plantFormSchema>

interface Props {
  mode: 'add' | 'edit'
}

export const PlantFormPage: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const plantId = id ? Number(id) : null
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PlantFormInputs>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: { scale: 3, quantity: 1, lat: -6.5592, lng: 106.7061 }
  })

  const currentLat = watch('lat')
  const currentLng = watch('lng')
  const photoFile = watch('photo')

  // Ambil data jika dalam mode edit
  const { data: existingPlant, isLoading: isFetchingPlant } = useQuery({
    queryKey: ['plant-detail', plantId],
    queryFn: () => getPlant(plantId!),
    enabled: mode === 'edit' && plantId !== null,
  })

  useEffect(() => {
    if (mode === 'edit' && existingPlant) {
      reset({
        name: existingPlant.name,
        scientific_name: existingPlant.scientific_name,
        category: existingPlant.category,
        location: existingPlant.location,
        scale: existingPlant.scale,
        quantity: existingPlant.quantity,
        lat: existingPlant.lat,
        lng: existingPlant.lng
      })
      if (existingPlant.image_url) {
        setImagePreview(existingPlant.image_url)
      }
    }
  }, [existingPlant, mode, reset])

  // Generator Pratinjau Gambar Efek Samping lokal
  useEffect(() => {
    if (photoFile && photoFile[0] instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(photoFile[0])
    }
  }, [photoFile])

  // Map Click Event Listener
    const MapClickHandler = () => {
    useMapEvents({
        click(e: L.LeafletMouseEvent) { 
        setValue('lat', Number(e.latlng.lat.toFixed(6)), { shouldValidate: true })
        setValue('lng', Number(e.latlng.lng.toFixed(6)), { shouldValidate: true })
        }
    })
    return null
    }

    const mapCenter: [number, number] = [currentLat || -6.5592, currentLng || 106.7061]

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error('Browser Anda tidak mendukung Geolocation')
    
    toast.loading('Memperoleh koordinat GPS perangkat...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss()
        setValue('lat', Number(pos.coords.latitude.toFixed(6)), { shouldValidate: true })
        setValue('lng', Number(pos.coords.longitude.toFixed(6)), { shouldValidate: true })
        toast.success('Lokasi GPS berhasil disinkronkan!')
      },
      () => {
        toast.dismiss()
        toast.error('Gagal mendeteksi lokasi otomatis.')
      }
    )
  }

  // Mutasi Pengiriman Form
  const formMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return mode === 'add' ? createPlant(formData) : updatePlant(plantId!, formData)
    },
    onSuccess: () => {
      toast.success(mode === 'add' ? 'Koleksi baru berhasil ditambahkan' : 'Data spesimen berhasil diperbarui')
      navigate('/admin/plants')
    },
    onError: () => {
      toast.error('Terjadi kesalahan data atau kegagalan API berkas multipart.')
    }
  })

  const onSubmitForm = (values: PlantFormInputs) => {
    // ATURAN KRITIS BERKAS: Harus menggunakan FormData
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('scientific_name', values.scientific_name)
    fd.append('category', values.category)
    fd.append('location', values.location)
    fd.append('scale', String(values.scale))
    fd.append('quantity', String(values.quantity))
    fd.append('lat', String(values.lat))
    fd.append('lng', String(values.lng))
    
    if (values.photo?.[0]) {
      fd.append('photo', values.photo[0])
    }
    
    formMutation.mutate(fd)
  }

  if (isFetchingPlant) {
    return <div className="p-8 text-center text-slate-400">Memuat data spesimen...</div>
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/plants" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600">
          <ChevronLeftIcon className="h-4 w-4" /> KEMBALI
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#004d26]">
          {mode === 'add' ? 'Tambah Koleksi Baru' : 'Verifikasi & Edit Spesimen'}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Lengkapi data keanekaragaman hayati berikut untuk didaftarkan ke dalam sistem inventarisasi IeB University.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Columns - Form Inputs */}
        <div className="md:col-span-2 space-y-6">
          {/* Card Basis Informasi Dasar */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
              <FileTextIcon className="h-4 w-4 text-emerald-700" /> Informasi Dasar
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Umum Tanaman</label>
              <input
                type="text"
                {...register('name')}
                placeholder="Contoh: Pohon Mahoni"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#004d26]/10 focus:border-[#004d26]"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Latin (Scientific Name)</label>
              <input
                type="text"
                {...register('scientific_name')}
                placeholder="Contoh: Swietenia mahagoni"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm italic focus:ring-2 focus:ring-[#004d26]/10 focus:border-[#004d26]"
              />
              {errors.scientific_name && <p className="text-xs text-red-500 mt-1">{errors.scientific_name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Kategori</label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#004d26]/10"
                >
                  {PLANT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Lokasi Kampus</label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="Dramaga, Bogor, dsb."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#004d26]/10"
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Skala Pertumbuhan (Meter)</label>
                <input type="number" {...register('scale')} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Jumlah Spesimen</label>
                <input type="number" {...register('quantity')} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          {/* Dokumentasi Foto Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
              <ImageIcon className="h-4 w-4 text-emerald-700" /> Dokumentasi Foto
            </h3>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors relative group">
              <input
                type="file"
                accept="image/*"
                {...register('photo')}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <CloudUploadIcon className="h-8 w-8 text-slate-400" />
              <p className="text-xs font-bold text-slate-700 mt-2">Klik untuk unggah atau seret foto ke sini</p>
              <p className="text-[10px] text-slate-400 mt-1">Mendukung Format: JPG, PNG (Maks. 5MB)</p>
            </div>

            {imagePreview && (
              <div className="mt-2 text-center">
                <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 object-cover rounded-lg shadow-xs border border-slate-100" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Geolocation Matrix */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 space-y-4 shadow-xs flex flex-col h-full justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2 mb-4">
                <MapPinIcon className="h-4 w-4 text-emerald-700" /> Geolokasi Spesimen
              </h3>

              {/* Mini Interactive Map container box wrapper rule */}
              <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-100 shadow-inner relative mb-4 z-10">
                <MapContainer center={mapCenter} zoom={14} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler />
                  {currentLat && currentLng && <Marker position={[currentLat, currentLng]} />}
                </MapContainer>
              </div>

              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer mb-4"
              >
                <LocateFixedIcon className="h-4 w-4" /> Gunakan Lokasi Saya
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register('lat')}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    {...register('lng')}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 mt-4 space-y-3">
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-[11px] text-slate-500 leading-relaxed flex gap-2">
                <InfoIcon className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Dengan menekan <strong>"Simpan Data Spesimen"</strong>, Anda mengonfirmasi bahwa data lapangan telah melalui verifikasi internal.
                </span>
              </div>
              <button
                type="submit"
                disabled={formMutation.isPending}
                className="w-full py-3 bg-[#004d26] hover:bg-[#003318] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-[#004d26]/10 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <SaveIcon className="h-4 w-4" />
                {formMutation.isPending ? 'Menyimpan...' : 'Simpan Data Spesimen'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
