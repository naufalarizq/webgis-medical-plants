import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { logoutApi } from '@/api/authApi'
import { LayoutDashboardIcon, LogOutIcon, PlusCircleIcon, SproutIcon } from '@/components/ui/AdminIcons'
import toast from 'react-hot-toast'

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  // State untuk mengontrol sidebar di tampilan Mobile
  const [isOpen, setIsOpen] = useState(false)

  // Otomatis menutup sidebar di HP setiap kali pindah halaman
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await logoutApi()
      logout()
      toast.success('Berhasil keluar dari sistem.')
      navigate('/admin/login')
    } catch {
      logout()
      navigate('/admin/login')
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
      isActive
        ? 'bg-[#22c55e]/20 text-[#004d26] font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <>
      {/* Tombol Hamburger Floating (Hanya muncul di Mobile/Tablet) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[40] p-2 bg-white rounded-lg shadow-md text-[#004d26] border border-slate-100 hover:bg-slate-50 transition-colors"
        aria-label="Buka Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Backdrop Gelap (Hanya muncul di Mobile/Tablet saat menu terbuka) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[45] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Utama */}
      <aside 
        className={`
          w-64 bg-white border-r border-slate-100 flex flex-col h-screen shadow-xl lg:shadow-none
          fixed lg:sticky top-0 z-[50] 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
        `}
      >
        <div className="p-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#004d26] leading-tight">Biodiversity</h1>
            <h2 className="text-xl font-bold text-[#004d26] leading-tight">Admin</h2>
            <p className="text-xs text-slate-400 mt-1">IPB University System</p>
          </div>
          
          {/* Tombol Tutup (Hanya di Mobile) */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Navigasi - Ditambahkan overflow-y-auto agar aman jika menu bertambah banyak */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboardIcon className="h-5 w-5 shrink-0" /> Dashboard
          </NavLink>
          <NavLink to="/admin/plants" end className={linkClass}>
            <SproutIcon className="h-5 w-5 shrink-0" /> Kelola Tanaman
          </NavLink>
          <NavLink to="/admin/plants/add" className={linkClass}>
            <PlusCircleIcon className="h-5 w-5 shrink-0" /> Tambah Tanaman
          </NavLink>
        </nav>

        {/* Profil Admin & Logout */}
        <div className="p-4 border-t border-slate-100 bg-[#f8faf7] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#004d26] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.username || 'Admin Research'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'biodiversity@ipb.ac.id'}</p>
            </div>
          </div>
          <button
            aria-label="Keluar"
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOutIcon className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  )
}