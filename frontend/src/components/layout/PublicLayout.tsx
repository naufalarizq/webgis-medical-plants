import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const NO_FOOTER_ROUTES = ['/map']

export default function PublicLayout() {
  const { pathname } = useLocation()
  const showFooter = !NO_FOOTER_ROUTES.includes(pathname)

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body-md overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  )
}