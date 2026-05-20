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
// @ts-ignore
delete L.Marker.prototype.options.icon
L.Marker.prototype.options.icon = DefaultIcon

const plantFormSchema = z.object({
  name: z.string().min(1, 'Nama umum tanaman wajib diisi').max(255),
  scientific_name: z.string().min(1, 'Nama latin ilmiah wajib diisi').max(255),
  category: z.enum(['ornamental', 'food', 'herbal', 'aromatic', 'shade'], 'Kategori tanaman wajib diisi'),
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
      if (existingPlant.image_url) setImagePreview(existingPlant.image_url)
    }
  }, [existingPlant, mode, reset])

  useEffect(() => {
    if (photoFile && photoFile[0] instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(photoFile[0])
    }
  }, [photoFile])

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
    toast.loading('Memperoleh koordinat GPS...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss()
        setValue('lat', Number(pos.coords.latitude.toFixed(6)), { shouldValidate: true })
        setValue('lng', Number(pos.coords.longitude.toFixed(6)), { shouldValidate: true })
        toast.success('Lokasi GPS berhasil disinkronkan!')
      },
      () => { toast.dismiss(); toast.error('Gagal mendeteksi lokasi.') }
    )
  }

  const formMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return mode === 'add' ? createPlant(formData) : updatePlant(plantId!, formData)
    },
    onSuccess: () => {
      toast.success(mode === 'add' ? 'Koleksi baru berhasil ditambahkan' : 'Data berhasil diperbarui')
      navigate('/admin/plants')
    },
    onError: () => toast.error('Terjadi kesalahan data.')
  })

  const onSubmitForm = (values: PlantFormInputs) => {
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('scientific_name', values.scientific_name)
    fd.append('category', values.category)
    fd.append('location', values.location)
    fd.append('scale', String(values.scale))
    fd.append('quantity', String(values.quantity))
    fd.append('lat', String(values.lat))
    fd.append('lng', String(values.lng))
    if (values.photo?.[0]) fd.append('photo', values.photo[0])
    formMutation.mutate(fd)
  }

  if (isFetchingPlant) return <div className="p-8 text-center text-slate-400">Memuat data...</div>

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <Link to="/admin/plants" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
        <ChevronLeftIcon className="h-4 w-4" /> KEMBALI KE DAFTAR
      </Link>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#004d26]">
          {mode === 'add' ? 'Tambah Koleksi Baru' : 'Edit Spesimen'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Lengkapi data biodiversitas untuk inventarisasi kampus.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
              <FileTextIcon className="h-4 w-4 text-emerald-700" /> Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Umum</label>
                <input {...register('name')} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#004d26]/10" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Latin</label>
                <input {...register('scientific_name')} className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm italic focus:ring-2 focus:ring-[#004d26]/10" />
              </div>
              <select {...register('category')} className="px-3 py-2 bg-slate-50 border rounded-lg text-sm">
                {PLANT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>)}
              </select>
              <input {...register('location')} placeholder="Lokasi..." className="px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              <input type="number" {...register('scale')} placeholder="Skala (m)" className="px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
              <input type="number" {...register('quantity')} placeholder="Jumlah" className="px-3 py-2 bg-slate-50 border rounded-lg text-sm" />
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <ImageIcon className="h-4 w-4 text-emerald-700" /> Dokumentasi Foto
            </h3>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
              <input type="file" accept="image/*" {...register('photo')} className="absolute inset-0 opacity-0 cursor-pointer" />
              <CloudUploadIcon className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold mt-2">Unggah Foto Spesimen</p>
            </div>
            {imagePreview && <img src={imagePreview} className="mt-4 mx-auto max-h-40 rounded-lg" alt="Preview" />}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <MapPinIcon className="h-4 w-4 text-emerald-700" /> Geolokasi
            </h3>
            <div className="h-64 rounded-xl overflow-hidden mb-4 border border-slate-100">
              <MapContainer center={mapCenter} zoom={14} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                {currentLat && currentLng && <Marker position={[currentLat, currentLng]} />}
              </MapContainer>
            </div>
            <button type="button" onClick={handleGetCurrentLocation} className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 mb-4">
              <LocateFixedIcon className="h-4 w-4" /> Gunakan GPS Saya
            </button>
            <div className="grid grid-cols-2 gap-2 mb-6">
              <input type="number" {...register('lat')} className="px-2 py-1.5 bg-slate-50 border rounded text-xs font-mono" />
              <input type="number" {...register('lng')} className="px-2 py-1.5 bg-slate-50 border rounded text-xs font-mono" />
            </div>
            <button type="submit" disabled={formMutation.isPending} className="w-full py-3 bg-[#004d26] text-white font-bold rounded-xl text-sm hover:bg-[#003318] transition-colors">
              {formMutation.isPending ? 'Menyimpan...' : 'Simpan Data Spesimen'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}