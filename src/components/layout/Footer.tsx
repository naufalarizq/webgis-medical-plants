import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest w-full py-8 mt-auto border-t border-outline-variant/50">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-[1440px] mx-auto gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-h2 text-xl text-primary font-bold">BioGIS IPB</span>
          <p className="font-caption text-xs text-on-surface text-center md:text-left">
            © {new Date().getFullYear()} IPB University - Biodiversity Informatics Lab. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="#" className="font-caption text-xs text-on-surface-variant hover:text-primary hover:underline transition-all">Privacy Policy</Link>
          <Link to="#" className="font-caption text-xs text-on-surface-variant hover:text-primary hover:underline transition-all">Terms of Service</Link>
          <Link to="#" className="font-caption text-xs text-on-surface-variant hover:text-primary hover:underline transition-all">Contact GIS Team</Link>
        </div>
      </div>
    </footer>
  )
}