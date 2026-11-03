import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Leaf, ArrowRight, Zap, BarChart3, Shield, Globe,
  TrendingDown, CheckCircle, ChevronRight
} from 'lucide-react'

const STATS = [
  { value: '4%',   label: 'of global CO₂ from internet', note: 'Illustrative figure' },
  { value: '1.76g', label: 'avg CO₂ per page view',        note: 'Illustrative average' },
  { value: '10k',  label: 'page views = tree needed',       note: 'Rough illustration' },
]

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Carbon Analysis',
    desc: 'Estimate the carbon footprint of any public website with transparent, heuristic-based calculations.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Zap,
    title: 'Energy Estimation',
    desc: 'Understand the energy consumption of your website per page view using configurable model parameters.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: TrendingDown,
    title: 'Optimisation Tips',
    desc: 'Receive data-driven, priority-ranked recommendations tailored to your specific analysis results.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Transparent Methodology',
    desc: 'Every estimate is clearly labelled — measured, counted from HTML, or heuristically estimated.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Globe,
    title: 'Historical Tracking',
    desc: 'Track multiple websites over time and compare their environmental performance scores.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: CheckCircle,
    title: 'PDF Reports',
    desc: 'Download comprehensive analysis reports to share with your team or include in academic work.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
]

const STEPS = [
  { step: '01', title: 'Enter a URL', desc: 'Paste any public website URL into the analyzer.' },
  { step: '02', title: 'We fetch & analyse', desc: 'Our Flask backend safely fetches the page and extracts key metrics from the HTML response.' },
  { step: '03', title: 'Carbon is estimated', desc: 'We apply our transparent heuristic model to estimate energy and CO₂ emissions.' },
  { step: '04', title: 'Get recommendations', desc: 'Receive priority-ranked, data-driven tips to reduce the site\'s environmental footprint.' },
]

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = (e) => {
    e.preventDefault()
    if (!url.trim()) return
    navigate('/analyze', { state: { url } })
  }

  return (
    <div className="flex flex-col">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-green-400/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Academic Project · Sustainable Computing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Make the Web{' '}
              <span className="text-emerald-400">Greener</span>,{' '}
              One Website at a Time.
            </h1>

            <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every webpage has a carbon footprint. GreenWeb helps you understand,
              estimate, and reduce the environmental impact of websites through
              transparent analysis and actionable recommendations.
            </p>

            {/* URL Input */}
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="hero-url-input"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-4 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 active:scale-95 text-sm whitespace-nowrap"
              >
                Analyze Website
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-white/50 text-xs">
              Free · No sign-up required · Estimates only, not certified measurements
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-xs text-gray-400 mb-8 uppercase tracking-widest font-semibold">
            Illustrative sustainability context · Sample figures for educational purposes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold text-emerald-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-600 font-medium mb-1">{s.label}</div>
                <div className="text-xs text-gray-400 italic">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything You Need to Go Greener</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              GreenWeb provides a complete suite of tools to analyse, understand, and improve website sustainability.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card group cursor-default">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">How GreenWeb Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A simple 4-step process to estimate and improve your website's carbon footprint.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white font-extrabold text-lg shadow-lg mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-7 -right-4 w-6 h-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="hero-gradient py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Leaf className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Measure Your Website's Impact?
          </h2>
          <p className="text-white/70 mb-8">
            Start your first analysis in seconds — no sign-up, no cost.
          </p>
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 active:scale-95"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  )
}
