import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  // State untuk mengontrol buka/tutup menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => location.pathname === path

  // Fungsi pembantu agar menu otomatis tertutup saat link diklik di HP
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-4 sm:px-8 max-w-[1440px] mx-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="font-h1 text-2xl text-primary font-bold tracking-tight">BioGIS IPB</span>
        </Link>
        
        {/* Desktop Menu (Sembunyi di HP) */}
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

        {/* Action Buttons & Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/admin/login"
            className="scale-95 active:scale-100 transition-transform px-5 py-2 bg-primary text-on-primary rounded-full font-label-sm shadow-md hover:bg-primary-container text-sm"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          
          {/* Tombol Hamburger (Hanya muncul di HP) */}
          <button 
            className="md:hidden p-2 text-on-surface hover:text-primary transition-colors flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Animasi meluncur) */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant/30 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-4 py-4 space-y-2">
          <Link 
            to="/" 
            onClick={closeMenu}
            className={`font-label-sm text-base font-semibold tracking-wider p-3 rounded-lg transition-all ${
              isActive('/') ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/map" 
            onClick={closeMenu}
            className={`font-label-sm text-base font-semibold tracking-wider p-3 rounded-lg transition-all ${
              isActive('/map') ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            Map Explorer
          </Link>
          <Link 
            to="/table" 
            onClick={closeMenu}
            className={`font-label-sm text-base font-semibold tracking-wider p-3 rounded-lg transition-all ${
              isActive('/table') ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            Data Portal
          </Link>
        </div>
      </div>
    </nav>
  )
}