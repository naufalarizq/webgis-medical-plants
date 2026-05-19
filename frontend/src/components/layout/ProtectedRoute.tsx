import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore' // Pastikan store auth kamu di sini, atau sesuaikan path-nya

export default function ProtectedRoute() {
  // Ambil state autentikasi dari zustand / localStorage / context kamu
  // Di sini kita contohkan menggunakan useAuthStore atau alternatifnya:
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  // Jika token tidak ada, tendang user kembali ke halaman login admin
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  // Jika terautentikasi, render komponen anak (halaman admin)
  return <Outlet />
}