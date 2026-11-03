import { Link } from 'react-router-dom'
import { Github, Heart } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size="md" variant="dark" />
            </div>
            <p className="text-sm leading-relaxed">
              An educational tool to understand and reduce the environmental impact of websites.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/analyze', 'Analyzer'], ['/dashboard', 'Dashboard'],
                ['/history', 'History'], ['/about', 'About']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-emerald-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Methodology</h4>
            <ul className="space-y-2 text-sm">
              <li>Energy Intensity: 0.05 kWh/GB</li>
              <li>Carbon Intensity: 400 gCO₂e/kWh</li>
              <li>Model: Heuristic estimation</li>
              <li className="text-yellow-500">⚠ Illustrative values only</li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Technology</h4>
            <ul className="space-y-2 text-sm">
              <li>React + Vite</li>
              <li>Tailwind CSS</li>
              <li>Python Flask</li>
              <li>SQLite + SQLAlchemy</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GreenWeb – Academic Project · Sustainable Computing
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> for a greener web
          </p>
        </div>
      </div>
    </footer>
  )
}
