import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { BookOpenIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/ui/AdminIcons'
import toast from 'react-hot-toast'
import axios from 'axios' // 1. PERBAIKAN: Import axios yang sebelumnya hilang

const loginSchema = z.object({
  username: z.string().min(1, 'Email akademik/username wajib diisi'),
  password: z.string().min(1, 'Password keamanan wajib diisi'),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    try {
      // PERBAIKAN UTAMA: Menggunakan URLSearchParams agar format x-www-form-urlencoded benar murni
      const params = new URLSearchParams();
      params.append('username', data.username);
      params.append('password', data.password);

      // Tembak API Backend (Pastikan port/URL sudah sesuai dengan backend FastAPI-mu, misal http://localhost:8000)
      const response = await axios.post('/api/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Eksekusi jika login sukses
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        if (setAuth) {
          setAuth(response.data.access_token, { username: data.username });
        }
        
        toast.success('Selamat datang kembali, Admin!');
        
        // Mengarahkan admin masuk ke halaman dashboard utama BioGIS IPB
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || 'Gagal masuk. Periksa kembali username dan kata sandi Anda.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ed] via-[#f7f9f6] to-[#eef4ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#004d26] rounded-xl flex items-center justify-center mb-4 shadow-md">
            <BookOpenIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#004d26]">Biodiversity Admin</h2>
          <p className="text-sm text-slate-500 mt-1">Access the IPB Research Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Academic Email / Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <MailIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                {...register('username')}
                placeholder="admin@ipb.ac.id"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26] transition-all text-sm"
              />
            </div>
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Security Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <LockIcon className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26] transition-all text-sm"
              />
              <button
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#004d26] hover:bg-[#003318] text-white font-semibold rounded-xl shadow-lg shadow-[#004d26]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {isLoading ? 'Memuat...' : 'Secure Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            Authorized Personnel Only. System activity is logged under <br />
            <strong>IPB University Digital Governance Policy.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
