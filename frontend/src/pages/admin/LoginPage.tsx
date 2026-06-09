import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { BookOpenIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/ui/AdminIcons'
import toast from 'react-hot-toast'
import axios from 'axios'
import type { AuthToken } from '@/types'

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      params.append('username', data.username)
      params.append('password', data.password)

      const response = await axios.post<AuthToken>('/api/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token)

        if (setAuth) {
          setAuth(response.data.access_token, { username: data.username })
        }

        toast.success('Selamat datang kembali, Admin!')
        navigate('/admin/dashboard')
      }
    } catch (err: any) {
      console.error(err)
      const errorMessage =
        err.response?.data?.detail ||
        'Gagal masuk. Periksa kembali username dan kata sandi Anda.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen min-h-dvh
        bg-gradient-to-br from-[#eef4ed] via-[#f7f9f6] to-[#eef4ed]
        flex items-center justify-center
        px-4 py-8 sm:px-6 lg:px-8
      "
    >
      {/* Card */}
      <div
        className="
          w-full max-w-sm sm:max-w-md
          bg-white rounded-2xl
          shadow-xl border border-slate-100
          p-6 sm:p-8
        "
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-7 sm:mb-8">
          <div
            className="
              w-14 h-14 sm:w-16 sm:h-16
              bg-[#004d26] rounded-xl
              flex items-center justify-center
              mb-4 shadow-md
              flex-shrink-0
            "
          >
            <BookOpenIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#004d26] text-center leading-tight">
            Biodiversity Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">
            Access the IPB Research Management System
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 sm:space-y-5"
        >
          {/* Username field */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Academic Email / Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <MailIcon className="h-4 w-4" />
              </span>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                {...register('username')}
                placeholder="admin@ipb.ac.id"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
                className={`
                  w-full pl-10 pr-4 py-3
                  bg-slate-50 border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26]
                  transition-all text-sm
                  ${errors.username
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                    : 'border-slate-200'
                  }
                `}
              />
            </div>
            {errors.username && (
              <p
                id="username-error"
                role="alert"
                className="text-xs text-red-500 mt-1"
              >
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Security Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <LockIcon className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`
                  w-full pl-10 pr-11 py-3
                  bg-slate-50 border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-[#004d26]/20 focus:border-[#004d26]
                  transition-all text-sm
                  ${errors.password
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                    : 'border-slate-200'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                aria-pressed={showPassword}
                className="
                  absolute inset-y-0 right-0
                  flex items-center pr-3
                  text-slate-400 hover:text-slate-600
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004d26]/40
                  rounded-r-xl
                  transition-colors
                "
              >
                {showPassword
                  ? <EyeOffIcon className="h-4 w-4" />
                  : <EyeIcon className="h-4 w-4" />
                }
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-xs text-red-500 mt-1"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-3 sm:py-3.5 mt-2
              bg-[#004d26] hover:bg-[#003318] active:bg-[#002910]
              text-white text-sm sm:text-base font-semibold
              rounded-xl
              shadow-lg shadow-[#004d26]/20
              transition-all duration-200
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004d26] focus-visible:ring-offset-2
              cursor-pointer
              select-none
            "
          >
            {isLoading ? (
              <>
                {/* Spinner */}
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Memuat...</span>
              </>
            ) : (
              'Secure Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            Authorized Personnel Only. System activity is logged under{' '}
            <br className="hidden sm:block" />
            <strong>IPB University Digital Governance Policy.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
