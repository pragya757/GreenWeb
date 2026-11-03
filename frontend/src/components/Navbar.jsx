import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X, BarChart3, History, Info, Gauge } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/dashboard', label: 'Dashboard',  icon: Gauge },
  { to: '/analyze',   label: 'Analyzer',   icon: BarChart3 },
  { to: '/history',   label: 'History',    icon: History },
  { to: '/about',     label: 'About',      icon: Info },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" variant="light" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ` +
                  (isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50')
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex">
            <button
              onClick={() => navigate('/analyze')}
              className="btn-primary text-xs px-4 py-2"
            >
              <Leaf className="w-4 h-4" />
              Analyze Website
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 pt-2 border-t border-gray-100 bg-white animate-fade-in">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ` +
                (isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50')
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { navigate('/analyze'); setOpen(false) }}
            className="btn-primary w-full mt-2 justify-center"
          >
            <Leaf className="w-4 h-4" />
            Analyze Website
          </button>
        </div>
      )}
    </nav>
  )
}
