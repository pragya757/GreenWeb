import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Download, RefreshCw, Globe, Zap, Leaf,
  Image, FileCode, Palette, ExternalLink, Info, AlertTriangle,
  CheckCircle, Clock, BarChart2
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { getAnalysis } from '../services/api'
import { useToast } from '../hooks/useToast'
import RecommendationCard from '../components/RecommendationCard'

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) => (n == null ? 'N/A' : Number(n).toFixed(d))
const fmtKB = (bytes) => bytes == null ? 'N/A' : `${(bytes / 1024).toFixed(1)} KB`

const CATEGORY_STYLES = {
  Excellent:          { badge: 'badge-excellent', ring: 'border-green-500',  text: 'text-green-700',  bg: 'bg-green-50' },
  Good:               { badge: 'badge-good',      ring: 'border-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50' },
  'Needs Improvement':{ badge: 'badge-needs-imp', ring: 'border-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' },
  Poor:               { badge: 'badge-poor',      ring: 'border-red-500',    text: 'text-red-700',    bg: 'bg-red-50' },
}

const SCALE_DATA = (carbon) => [
  { name: '1 view',    gco2: Number(carbon.toFixed(4)) },
  { name: '1k views',  gco2: Number((carbon * 1000).toFixed(2)) },
  { name: '10k views', gco2: Number((carbon * 10000).toFixed(2)) },
]

const PIE_COLORS = ['#059669', '#34d399', '#6ee7b7', '#a7f3d0']

// ── Score ring component ──────────────────────────────────────────────────────
function ScoreRing({ score, category }) {
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES['Needs Improvement']
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={category === 'Excellent' ? '#059669' : category === 'Good' ? '#3b82f6' : category === 'Needs Improvement' ? '#eab308' : '#ef4444'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-gray-900">{Math.round(score)}</span>
          <span className="text-xs text-gray-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`${styles.badge} text-sm px-4 py-1`}>{category}</span>
      <p className="text-xs text-gray-400 text-center max-w-xs">
        Project-defined heuristic score — NOT an official industry certification
      </p>
    </div>
  )
}

// ── Main Results Page ─────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [result, setResult] = useState(location.state?.result || null)
  const [loading, setLoading] = useState(!result)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!result) {
      getAnalysis(id)
        .then(r => setResult(r.data))
        .catch(() => { setError('Could not load analysis.'); addToast('Failed to load analysis.', 'error') })
        .finally(() => setLoading(false))
    }
  }, [id])

  const handlePDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(5, 150, 105)
      doc.text('GreenWeb Carbon Analysis Report', 14, 22)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Website: ${result.website_url}`, 14, 32)
      doc.text(`Analysed: ${new Date(result.analyzed_at).toLocaleString()}`, 14, 38)
      doc.text('Note: These are ESTIMATES, not certified measurements.', 14, 44)

      autoTable(doc, {
        startY: 52,
        head: [['Metric', 'Value', 'Type']],
        body: [
          ['HTML Size', fmtKB(result.html_size), 'Directly Measured'],
          ['Response Time', `${fmt(result.response_time, 3)}s`, 'Directly Measured'],
          ['Images', result.image_count, 'Counted from HTML'],
          ['Scripts', result.script_count, 'Counted from HTML'],
          ['Stylesheets', result.stylesheet_count, 'Counted from HTML'],
          ['Est. Transfer Size', fmtKB(result.estimated_transfer_size), 'Estimated'],
          ['Energy (per view)', `${(result.energy_consumption * 1000000).toFixed(4)} μWh`, 'Estimated'],
          ['Carbon (per view)', `${fmt(result.carbon_emissions, 4)} gCO₂e`, 'Estimated'],
          ['Environmental Score', `${result.environmental_score}/100`, 'Heuristic'],
          ['Category', result.performance_category, 'Heuristic'],
        ],
        headStyles: { fillColor: [5, 150, 105] },
      })

      if (result.recommendations?.length) {
        const recY = doc.lastAutoTable.finalY + 10
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.setTextColor(20)
        doc.text('Optimisation Recommendations', 14, recY)

        autoTable(doc, {
          startY: recY + 5,
          head: [['Priority', 'Title', 'Explanation']],
          body: result.recommendations.map(r => [r.priority, r.title, r.explanation.substring(0, 120) + '…']),
          headStyles: { fillColor: [5, 150, 105] },
          columnStyles: { 2: { cellWidth: 100 } },
        })
      }

      doc.save(`greenweb-report-${id}.pdf`)
      addToast('PDF report downloaded!', 'success')
    } catch (e) {
      addToast('PDF generation failed. Please try again.', 'error')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64 py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-12 h-12" />
        <p className="text-gray-500">Loading analysis…</p>
      </div>
    </div>
  )

  if (error || !result) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
      <p className="text-gray-500 mb-6">{error || 'This analysis could not be found.'}</p>
      <Link to="/analyze" className="btn-primary">Run New Analysis</Link>
    </div>
  )

  const styles    = CATEGORY_STYLES[result.performance_category] || CATEGORY_STYLES['Needs Improvement']
  const scaleData = SCALE_DATA(result.carbon_emissions || 0)
  const pieData   = [
    { name: 'HTML',         value: result.html_size || 0 },
    { name: 'Est. Images',  value: (result.image_count || 0) * 80 * 1024 },
    { name: 'Est. Scripts', value: (result.script_count || 0) * 40 * 1024 },
    { name: 'Est. CSS',     value: (result.stylesheet_count || 0) * 15 * 1024 },
  ].filter(d => d.value > 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Carbon Analysis Report</h1>
          <a
            href={result.website_url}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-600 text-sm mt-1 hover:underline"
          >
            <Globe className="w-4 h-4" />
            {result.website_url}
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-xs text-gray-400 mt-1">
            Analysed: {new Date(result.analyzed_at).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/analyze')} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" /> Analyse Another
          </button>
          <button onClick={handlePDF} className="btn-primary text-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* ── Top cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Score */}
        <div className={`card ${styles.bg} border-2 ${styles.ring} flex items-center justify-center py-8`}>
          <ScoreRing score={result.environmental_score} category={result.performance_category} />
        </div>

        {/* Carbon summary */}
        <div className="card lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" /> Carbon Footprint Estimates
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {scaleData.map(d => (
              <div key={d.name} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-emerald-700">
                  {d.gco2 < 1 ? `${(d.gco2 * 1000).toFixed(2)}mg` : `${d.gco2.toFixed(2)}g`}
                </div>
                <div className="text-xs text-gray-500 mt-1">CO₂e · {d.name}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Energy: </span>
              <span className="font-semibold">{(result.energy_consumption * 1000000).toFixed(4)} μWh/view</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">Response time: </span>
              <span className="font-semibold">{fmt(result.response_time, 3)}s</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              These are <strong>estimates</strong> based on our heuristic model (0.05 kWh/GB, 400 gCO₂e/kWh).
              They are <strong>not</strong> direct measurements of actual carbon emitted.
            </p>
          </div>
        </div>
      </div>

      {/* ── Metrics grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { icon: FileCode,  label: 'HTML Size',    value: fmtKB(result.html_size),               tag: 'Measured' },
          { icon: BarChart2, label: 'Est. Transfer', value: fmtKB(result.estimated_transfer_size), tag: 'Estimated' },
          { icon: Image,     label: 'Images',        value: result.image_count,                    tag: 'From HTML' },
          { icon: FileCode,  label: 'Scripts',       value: result.script_count,                   tag: 'From HTML' },
          { icon: Palette,   label: 'Stylesheets',   value: result.stylesheet_count,               tag: 'From HTML' },
          { icon: ExternalLink, label: 'External Res.', value: result.external_resource_count,     tag: 'From HTML' },
        ].map(m => (
          <div key={m.label} className="card text-center !p-4 group">
            <m.icon className="w-6 h-6 mx-auto text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xl font-extrabold text-gray-900">{m.value ?? 'N/A'}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{m.label}</div>
            <div className="text-xs text-gray-400 mt-1">{m.tag}</div>
          </div>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Scale bar chart */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            CO₂e at Scale (Estimated grams)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scaleData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v} gCO₂e`, 'Estimated CO₂e']} />
              <Bar dataKey="gco2" fill="#059669" radius={[6, 6, 0, 0]} name="CO₂e (g)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2 text-center">Illustrative estimates only</p>
        </div>

        {/* Page composition pie */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            Estimated Page Composition
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${(v / 1024).toFixed(1)} KB`, 'Estimated size']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No resource data available</div>
          )}
          <p className="text-xs text-gray-400 mt-2 text-center">Based on heuristic average file sizes</p>
        </div>
      </div>

      {/* ── Recommendations ───────────────────────────────────────────────── */}
      {result.recommendations?.length > 0 && (
        <div className="mb-8">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            Green Optimisation Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} />
            ))}
          </div>
        </div>
      )}

      {/* ── Model assumptions ──────────────────────────────────────────────── */}
      <div className="card bg-gray-50 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Model Assumptions & Methodology
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-800 mb-1">Carbon Model Parameters</p>
            <ul className="space-y-1 text-gray-500">
              <li>Energy intensity: <strong>0.05 kWh/GB</strong> (illustrative)</li>
              <li>Grid carbon intensity: <strong>400 gCO₂e/kWh</strong> (illustrative)</li>
              <li>These are configurable in <code>config.py</code></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Measurement Labels</p>
            <ul className="space-y-1 text-gray-500">
              <li>🔵 <strong>Measured</strong>: directly observed via HTTP</li>
              <li>🟢 <strong>From HTML</strong>: counted from parsed document</li>
              <li>🟡 <strong>Estimated</strong>: heuristic calculation</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 border-t border-gray-200 pt-3">
          GreenWeb is an educational estimation tool and not a certified carbon accounting platform.
          Results should not be used for regulatory reporting or marketing claims.
        </p>
      </div>
    </div>
  )
}
