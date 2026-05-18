import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-h1 text-2xl text-primary font-bold tracking-tight">BioGIS IPB</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`font-label-sm text-sm font-semibold tracking-wider transition-all duration-300 px-2 py-1 rounded ${
              isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low/50'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/map" 
            className={`font-label-sm text-sm font-semibold tracking-wider transition-all duration-300 px-2 py-1 rounded ${
              isActive('/map') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low/50'
            }`}
          >
            Map Explorer
          </Link>
          <Link 
            to="/table" 
            className={`font-label-sm text-sm font-semibold tracking-wider transition-all duration-300 px-2 py-1 rounded ${
              isActive('/table') ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low/50'
            }`}
          >
            Data Portal
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/admin/login"
            className="scale-95 active:scale-100 transition-transform px-6 py-2 bg-primary text-on-primary rounded-full font-label-sm shadow-md hover:bg-primary-container"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}