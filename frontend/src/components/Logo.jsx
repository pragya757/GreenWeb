export default function Logo({ size = 'md', variant = 'light', showText = true }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className="flex items-center gap-2.5 group select-none">
      <div className={`relative ${iconSizes[size] || iconSizes.md} rounded-xl shadow-md group-hover:scale-105 group-hover:shadow-emerald-500/25 transition-all duration-300 flex-shrink-0 overflow-hidden ring-1 ring-emerald-500/20`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="logoLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="60%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="logoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="100" height="100" rx="26" fill="url(#logoBgGrad)" />

          {/* Orbital network ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="38"
            ry="18"
            stroke="url(#logoRingGrad)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            transform="rotate(-28 50 50)"
          />
          <circle cx="18" cy="38" r="3" fill="#6ee7b7" />
          <circle cx="82" cy="62" r="3.5" fill="#34d399" />

          {/* Globe meridians */}
          <path d="M 50 16 A 34 34 0 0 0 50 84" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
          <path d="M 50 16 A 34 34 0 0 1 50 84" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
          <line x1="16" y1="50" x2="84" y2="50" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" />

          {/* Sustainable digital leaf */}
          <path d="M 50 22 C 34 35 32 60 48 74 C 66 72 74 46 50 22 Z" fill="url(#logoLeafGrad)" />
          
          {/* Leaf vein / digital circuit traces */}
          <path d="M 48 73 Q 49 52 50 28" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 49 58 Q 43 53 39 52" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
          <path d="M 49.5 46 Q 57 42 62 43" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-black tracking-tight ${textSizes[size] || textSizes.md} ${
            variant === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Green<span className="text-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Web</span>
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-600">
              Sustainable Computing
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
