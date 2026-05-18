import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '@/pages/public/HomePage'
import MapPage from '@/pages/public/MapPage'
import TablePage from '@/pages/public/TablePage'
import PlantDetailPage from '@/pages/public/PlantDetailPage'

const router = createBrowserRouter([
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
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}