import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '@/pages/public/HomePage'
import MapPage from '@/pages/public/MapPage'
import TablePage from '@/pages/public/TablePage'
import PlantDetailPage from '@/pages/public/PlantDetailPage'

// Proteksi & Komponen Layout Admin
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { AdminSidebar } from '@/components/layout/AdminSidebar'

// Lazy Loading untuk Halaman Admin (Meningkatkan Performa)
const LoginPage = lazy(() => import('@/pages/admin/LoginPage').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ManagePlantsPage = lazy(() => import('@/pages/admin/ManagePlantsPage').then(m => ({ default: m.ManagePlantsPage })))
const PlantFormPage = lazy(() => import('@/pages/admin/PlantFormPage').then(m => ({ default: m.PlantFormPage })))

// Wrapper Layout Khusus Panel Admin
function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f9f6]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  )
}

// Fallback loader saat perpindahan halaman admin
function AdminPageLoader() {
  return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-[#004d26] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

const router = createBrowserRouter([
  // ── RUTE PUBLIK (Sudah Ada di Projectmu) ──────────────────
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'table', element: <TablePage /> },
      { path: 'plants/:id', element: <PlantDetailPage /> },
    ],
  },
  
  // ── RUTE AUTENTIKASI ADMIN (Tanpa Sidebar/Navbar) ────────
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<AdminPageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },

  // ── RUTE PANEL ADMIN (Terproteksi Middleware JWT) ─────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin/dashboard',
            element: (
              <Suspense fallback={<AdminPageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/admin/plants',
            element: (
              <Suspense fallback={<AdminPageLoader />}>
                <ManagePlantsPage />
              </Suspense>
            ),
          },
          {
            path: '/admin/plants/add',
            element: (
              <Suspense fallback={<AdminPageLoader />}>
                <PlantFormPage mode="add" />
              </Suspense>
            ),
          },
          {
            path: '/admin/plants/edit/:id',
            element: (
              <Suspense fallback={<AdminPageLoader />}>
                <PlantFormPage mode="edit" />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // Fallback jika user mengetik alamat asal yang tidak terdaftar
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}