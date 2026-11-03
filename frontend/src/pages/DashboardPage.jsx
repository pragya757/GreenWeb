import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart2, Globe, Leaf, TrendingUp, Activity,
  AlertCircle, Gauge
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { getDashboard } from '../services/api'
import { useToast } from '../hooks/useToast'

const PIE_COLORS = ['#059669', '#3b82f6', '#eab308', '#ef4444']

function StatCard({ icon: Icon, label, value, sub, color = 'text-emerald-600', bg = 'bg-emerald-50' }) {
  return (
    <div className="card flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

const BADGE = {
  Excellent:          'badge-excellent',
  Good:               'badge-good',
  'Needs Improvement':'badge-needs-imp',
  Poor:               'badge-poor',
}

export default function DashboardPage() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(() => addToast('Failed to load dashboard data.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-12 h-12" />
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    </div>
  )

  const isEmpty = !data || data.total_analyses === 0

  // Prepare chart data from recent analyses
  const barData = (data?.recent_analyses || [])
    .slice(0, 8)
    .map(a => ({
      name: new URL(a.website_url).hostname.replace('www.', '').substring(0, 18),
      carbon: Number((a.carbon_emissions || 0).toFixed(4)),
      score:  Math.round(a.environmental_score || 0),
    }))
    .reverse()

  const dist = data?.score_distribution || {}
  const pieData = [
    { name: 'Excellent',  value: dist.excellent || 0 },
    { name: 'Good',       value: dist.good || 0 },
    { name: 'Needs Imp.', value: dist.needs_improvement || 0 },
    { name: 'Poor',       value: dist.poor || 0 },
  ].filter(d => d.value > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of all website carbon analyses</p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary text-sm">
          <Leaf className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="card text-center py-16 mb-8">
          <Gauge className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Analyses Yet</h3>
          <p className="text-gray-400 mb-6">Run your first website analysis to populate the dashboard.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary mx-auto">
            Analyse a Website
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BarChart2}
          label="Total Analyses"
          value={data?.total_analyses ?? 0}
          sub={isEmpty ? 'No data yet' : 'All time'}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={Leaf}
          label="Avg. Carbon Emissions"
          value={`${(data?.avg_carbon_emissions || 0).toFixed(3)}g`}
          sub="gCO₂e per view (estimated)"
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          icon={Globe}
          label="Avg. HTML Size"
          value={`${((data?.avg_html_size || 0) / 1024).toFixed(0)} KB`}
          sub="Directly measured"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Eco Score"
          value={`${Math.round(data?.avg_environmental_score || 0)}/100`}
          sub="Project-defined heuristic"
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* Charts */}
      {!isEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar chart */}
          <div className="card lg:col-span-2">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              Recent Carbon Emissions (gCO₂e/view · Estimated)
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} gCO₂e`, 'Estimated CO₂e']} />
                <Bar dataKey="carbon" fill="#059669" radius={[4, 4, 0, 0]} name="CO₂e (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Score Distribution
            </h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Not enough data</div>
            )}
          </div>
        </div>
      )}

      {/* Recent Analyses Table */}
      {!isEmpty && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Recent Analyses
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 pr-6">Website</th>
                  <th className="pb-3 pr-6">Carbon (Est.)</th>
                  <th className="pb-3 pr-6">Score</th>
                  <th className="pb-3 pr-6">Category</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent_analyses || []).map(a => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/results/${a.id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pr-6 font-medium text-gray-800 max-w-[200px] truncate">
                      {a.website_url.replace(/^https?:\/\//, '')}
                    </td>
                    <td className="py-3 pr-6 text-gray-600">{(a.carbon_emissions || 0).toFixed(4)}g</td>
                    <td className="py-3 pr-6 font-bold text-emerald-600">{Math.round(a.environmental_score)}</td>
                    <td className="py-3 pr-6">
                      <span className={BADGE[a.performance_category] || 'badge-needs-imp'}>
                        {a.performance_category}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(a.analyzed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
