import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { logoutApi } from '@/api/authApi'
import { LayoutDashboardIcon, LogOutIcon, PlusCircleIcon, SproutIcon } from '@/components/ui/AdminIcons'
import toast from 'react-hot-toast'

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

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
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#004d26] leading-tight">Biodiversity</h1>
        <h2 className="text-xl font-bold text-[#004d26] leading-tight">Admin</h2>
        <p className="text-xs text-slate-400 mt-1">IPB University System</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
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

      <div className="p-4 border-t border-slate-100 bg-[#f8faf7] flex items-center justify-between">
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
          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOutIcon className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}
